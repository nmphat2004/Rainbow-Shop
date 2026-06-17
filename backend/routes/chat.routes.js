const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Simple in-memory cache to prevent redundant Gemini API calls
const cache = new Map();
const MAX_CACHE_SIZE = 1000;

// Gemini tools definition
const tools = [
	{
		functionDeclarations: [
			{
				name: 'search_products',
				description: 'Search for clothes, apparel, styles, and products in the shop\'s database.',
				parameters: {
					type: 'OBJECT',
					properties: {
						search: {
							type: 'STRING',
							description: 'General text query matching product name or description'
						},
						category: {
							type: 'STRING',
							description: 'Product category (e.g. Top Wear, Bottom Wear)'
						},
						color: {
							type: 'STRING',
							description: 'Color name (e.g. Red, Blue, Black, White, etc.)'
						},
						gender: {
							type: 'STRING',
							description: 'Gender category: \'Men\', \'Women\', or \'Unisex\''
						},
						minPrice: {
							type: 'NUMBER',
							description: 'Minimum price'
						},
						maxPrice: {
							type: 'NUMBER',
							description: 'Maximum price'
						}
					}
				}
			},
			{
				name: 'check_order_status',
				description: 'Check the status of a specific order by its 24-character hex ID.',
				parameters: {
					type: 'OBJECT',
					properties: {
						orderId: {
							type: 'STRING',
							description: 'The unique MongoDB ObjectID of the order (24 hex characters).'
						}
					},
					required: ['orderId']
				}
			},
			{
				name: 'get_new_arrivals',
				description: 'Get the latest 8 newly arrived fashion items in the shop.'
			},
			{
				name: 'get_best_sellers',
				description: 'Get the best selling or highest rated fashion items in the shop.'
			},
			{
				name: 'get_my_orders',
				description: 'Get the list of orders belonging to the logged-in customer.'
			}
		]
	}
];

// Helper function to download an image from Cloudinary/Web and convert it to Base64
const downloadAndBase64 = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download image from ${url}`);
	}
	const mimeType = response.headers.get('content-type') || 'image/jpeg';
	const arrayBuffer = await response.arrayBuffer();
	const base64Data = Buffer.from(arrayBuffer).toString('base64');
	return { mimeType, data: base64Data };
};

router.post('/', async (req, res) => {
	const { message, history, imageUrl } = req.body;
	if (!message || typeof message !== 'string' || message.trim() === '') {
		return res.status(400).json({ error: 'Message is required' });
	}

	const normalizedMessage = message.trim().toLowerCase();

	// 1. Check optional auth token to fetch user profile
	let user = null;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			user = await User.findById(decoded.user.id).select('-password');
		} catch (error) {
			console.error('[Chat Auth] Optional token verification failed:', error);
		}
	}

	// 2. Check cache (only for simple text Q&A with no history and no image)
	if (!imageUrl && (!history || history.length <= 1) && cache.has(normalizedMessage)) {
		console.log(`[Cache Hit] Serving response for: "${normalizedMessage}"`);
		return res.json({ reply: cache.get(normalizedMessage) });
	}

	// 3. Load and split API Keys
	const apiKeys = (process.env.GEMINI_API_KEY || '')
		.split(',')
		.map((key) => key.trim())
		.filter(Boolean);

	if (apiKeys.length === 0) {
		console.error('[Chat API] No Gemini API keys found in environment variables.');
		return res.status(500).json({
			error: 'Gemini API keys are not configured. Please define GEMINI_API_KEY in the backend .env',
		});
	}

	// 4. Set System Instruction
	const systemInstructionText = 
		'You are a helpful customer support chatbot for Rainbow Shop, an online fashion and clothing store. ' +
		'Answer questions about clothes, styles, ordering, shipping, and return policies. Keep answers friendly, professional, helpful, and concise. ' +
		'Respond in the same language the user uses (Vietnamese if they ask in Vietnamese, English if they ask in English, etc.).\n\n' +
		'You have access to tools to search products, check order status, list new arrivals, and find best sellers. ' +
		'When a user asks about products, styles, order status, or provides an image of clothing, ALWAYS use the appropriate tool to fetch real-time data from the store database before answering. ' +
		'If checking order status, explain the status clearly. ' +
		'If the user is logged in, you can look up their orders. ' +
		'When searching products, if the user specifies category, color, gender, price range, or styles, pass those parameters to the tool.';

	// 5. Construct conversation history
	const contents = [];
	if (history && Array.isArray(history)) {
		history.forEach((h) => {
			if (h.id === 'welcome') return;
			contents.push({
				role: h.sender === 'user' ? 'user' : 'model',
				parts: [{ text: h.text }]
			});
		});
	}

	// Prepare current turn parts
	const currentParts = [{ text: message.trim() }];
	if (imageUrl) {
		try {
			console.log(`[Chat API] Processing image url: ${imageUrl}`);
			const imgData = await downloadAndBase64(imageUrl);
			currentParts.push({
				inlineData: {
					mimeType: imgData.mimeType,
					data: imgData.data
				}
			});
		} catch (err) {
			console.error(`[Chat API] Image processing failed: ${err.message}`);
		}
	}

	// Add current turn to history contents
	contents.push({
		role: 'user',
		parts: currentParts
	});

	// 6. Call Gemini API with backup/fallback rotation
	let replyText = '';
	let success = false;
	let errors = [];
	let responseProducts = null;
	let responseOrder = null;
	let responseOrders = null;

	for (let i = 0; i < apiKeys.length; i++) {
		const apiKey = apiKeys[i];
		// Skip dummy placeholders
		if (apiKey.includes('your_key_') && apiKeys.length > 1) {
			console.log(`[Chat API] Skipping placeholder key index ${i + 1}`);
			continue;
		}

		console.log(`[Chat API] Trying Gemini API Key Index ${i + 1}/${apiKeys.length}...`);

		try {
			// First Call: Send request to Gemini
			const response = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						contents,
						systemInstruction: {
							parts: [{ text: systemInstructionText }],
						},
						tools,
					}),
				}
			);

			if (!response.ok) {
				const errText = await response.text();
				throw new Error(`HTTP ${response.status}: ${errText}`);
			}

			const data = await response.json();
			const candidate = data.candidates && data.candidates[0];
			const part = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0];

			if (!part) {
				throw new Error('Invalid response structure from Gemini API');
			}

			// Handle Function Call request
			if (part.functionCall) {
				const { name, args, id } = part.functionCall;
				console.log(`[Chat API] Executing function call "${name}" with args:`, args);

				let functionResult;
				try {
					if (name === 'search_products') {
						const query = {};
						if (args.search) {
							query.$or = [
								{ name: { $regex: args.search, $options: 'i' } },
								{ description: { $regex: args.search, $options: 'i' } }
							];
						}
						if (args.category) {
							query.category = { $regex: new RegExp(`^${args.category}$`, 'i') };
						}
						if (args.color) {
							query.colors = { $regex: new RegExp(`^${args.color}$`, 'i') };
						}
						if (args.gender) {
							query.gender = { $regex: new RegExp(`^${args.gender}$`, 'i') };
						}
						if (args.minPrice || args.maxPrice) {
							query.price = {};
							if (args.minPrice) query.price.$gte = Number(args.minPrice);
							if (args.maxPrice) query.price.$lte = Number(args.maxPrice);
						}
						const products = await Product.find(query).limit(8);
						functionResult = {
							products: products.map((p) => ({
								id: p._id.toString(),
								name: p.name,
								price: p.price,
								discountPrice: p.discountPrice,
								sku: p.sku,
								category: p.category,
								brand: p.brand
							}))
						};
						responseProducts = products;

					} else if (name === 'check_order_status') {
						const order = await Order.findById(args.orderId).populate('orderItems.productId');
						if (order) {
							functionResult = {
								orderId: order._id.toString(),
								status: order.status,
								totalPrice: order.totalPrice,
								isPaid: order.isPaid,
								isDelivered: order.isDelivered,
								paymentStatus: order.paymentStatus,
								paymentMethod: order.paymentMethod,
								createdAt: order.createdAt
							};
							responseOrder = order;
						} else {
							functionResult = { error: `Order ID ${args.orderId} not found.` };
						}

					} else if (name === 'get_new_arrivals') {
						const products = await Product.find().sort({ createdAt: -1 }).limit(8);
						functionResult = {
							products: products.map((p) => ({
								id: p._id.toString(),
								name: p.name,
								price: p.price,
								discountPrice: p.discountPrice
							}))
						};
						responseProducts = products;

					} else if (name === 'get_best_sellers') {
						const products = await Product.find().sort({ rating: -1 }).limit(8);
						functionResult = {
							products: products.map((p) => ({
								id: p._id.toString(),
								name: p.name,
								price: p.price,
								discountPrice: p.discountPrice
							}))
						};
						responseProducts = products;

					} else if (name === 'get_my_orders') {
						if (user) {
							const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
							functionResult = {
								orders: orders.map((o) => ({
									orderId: o._id.toString(),
									status: o.status,
									totalPrice: o.totalPrice,
									createdAt: o.createdAt
								}))
							};
							responseOrders = orders;
						} else {
							functionResult = { error: 'Customer is not logged in. Cannot fetch orders.' };
						}
					} else {
						functionResult = { error: `Function "${name}" is not implemented.` };
					}
				} catch (dbErr) {
					console.error(`[Chat API] Database error during execution:`, dbErr);
					functionResult = { error: `Database error: ${dbErr.message}` };
				}

				// Second Call: Provide function output back to Gemini
				console.log(`[Chat API] Sending function response back to Gemini...`);
				const secondResponse = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							contents: [
								...contents,
								{
									role: 'model',
									parts: [
										{
											functionCall: {
												name,
												args,
												id
											}
										}
									]
								},
								{
									role: 'function',
									parts: [
										{
											functionResponse: {
												name,
												id,
												response: functionResult
											}
										}
									]
								}
							],
							systemInstruction: {
								parts: [{ text: systemInstructionText }],
							},
							tools,
						}),
					}
				);

				if (!secondResponse.ok) {
					const secondErrText = await secondResponse.text();
					throw new Error(`Second Call HTTP ${secondResponse.status}: ${secondErrText}`);
				}

				const secondData = await secondResponse.json();
				const secondCandidate = secondData.candidates && secondData.candidates[0];
				const secondPart = secondCandidate && secondCandidate.content && secondCandidate.content.parts && secondCandidate.content.parts[0];

				if (secondPart && secondPart.text) {
					replyText = secondPart.text;
					success = true;
					console.log(`[Chat API] Gemini API succeeded after tool execution.`);
					break;
				} else {
					throw new Error('Invalid response from Gemini model after tool execution');
				}
			} else if (part.text) {
				// Direct text response
				replyText = part.text;
				success = true;
				console.log(`[Chat API] Gemini API Key Index ${i + 1} succeeded.`);
				break;
			} else {
				throw new Error('Invalid response part from Gemini API');
			}
		} catch (error) {
			console.error(`[Chat API] Key Index ${i + 1} failed: ${error.message}`);
			errors.push(`Key Index ${i + 1}: ${error.message}`);
		}
	}

	if (!success) {
		return res.status(502).json({
			error: 'All configured Gemini API keys failed to generate content.',
			details: errors,
		});
	}

	// 7. Save cache (only for simple text Q&A with no history and no image)
	if (!imageUrl && (!history || history.length <= 1)) {
		if (cache.size >= MAX_CACHE_SIZE) {
			const oldestKey = cache.keys().next().value;
			cache.delete(oldestKey);
		}
		cache.set(normalizedMessage, replyText);
	}

	return res.json({
		reply: replyText,
		products: responseProducts,
		order: responseOrder,
		orders: responseOrders
	});
});

module.exports = router;

