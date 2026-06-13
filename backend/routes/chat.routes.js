const express = require('express');
const router = express.Router();

// Simple in-memory cache to prevent redundant Gemini API calls
const cache = new Map();
const MAX_CACHE_SIZE = 1000;

router.post('/', async (req, res) => {
	const { message } = req.body;
	if (!message || typeof message !== 'string' || message.trim() === '') {
		return res.status(400).json({ error: 'Message is required' });
	}

	const normalizedMessage = message.trim().toLowerCase();

	// 1. Check cache
	if (cache.has(normalizedMessage)) {
		console.log(`[Cache Hit] Serving response for: "${normalizedMessage}"`);
		return res.json({ reply: cache.get(normalizedMessage) });
	}

	// 2. Load and split API Keys from process.env.GEMINI_API_KEY
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

	// 3. Call Gemini API with backup/fallback rotation
	let replyText = '';
	let success = false;
	let errors = [];

	for (let i = 0; i < apiKeys.length; i++) {
		const apiKey = apiKeys[i];
		// Skip dummy placeholder keys in testing unless it's the only one
		if (apiKey.includes('your_key_') && apiKeys.length > 1) {
			console.log(`[Chat API] Skipping placeholder key index ${i + 1}`);
			continue;
		}

		console.log(`[Chat API] Trying Gemini API Key Index ${i + 1}/${apiKeys.length}...`);

		try {
			const response = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						contents: [
							{
								role: 'user',
								parts: [{ text: message.trim() }],
							},
						],
						systemInstruction: {
							parts: [
								{
									text: 'You are a helpful customer support chatbot for Rainbow Shop, an online fashion and clothing store. Answer questions about clothes, styles, ordering, shipping, and return policies. Keep answers friendly, professional, helpful, and concise. Respond in the same language the user uses (Vietnamese if they ask in Vietnamese, English if they ask in English, etc.).',
								},
							],
						},
					}),
				}
			);

			if (!response.ok) {
				const errText = await response.text();
				throw new Error(`HTTP ${response.status}: ${errText}`);
			}

			const data = await response.json();
			if (
				data.candidates &&
				data.candidates[0] &&
				data.candidates[0].content &&
				data.candidates[0].content.parts &&
				data.candidates[0].content.parts[0]
			) {
				replyText = data.candidates[0].content.parts[0].text;
				success = true;
				console.log(`[Chat API] Gemini API Key Index ${i + 1} succeeded.`);
				break; // Stop rotation since we got a reply
			} else {
				throw new Error('Invalid response structure from Gemini API');
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

	// 4. Save to cache
	if (cache.size >= MAX_CACHE_SIZE) {
		const oldestKey = cache.keys().next().value;
		cache.delete(oldestKey);
	}
	cache.set(normalizedMessage, replyText);

	return res.json({ reply: replyText });
});

module.exports = router;
