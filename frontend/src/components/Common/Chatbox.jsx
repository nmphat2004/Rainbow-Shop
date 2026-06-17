import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiImage } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SUGGESTIONS = [
	'Do you offer free shipping?',
	'What is your return policy?',
	'How can I track my order?',
	'Do you have clothing size charts?',
];

// Sub-component: Product Card Carousel
const ProductCarousel = ({ products, onSelectProduct }) => {
	return (
		<div className="mt-2.5 w-full overflow-x-auto flex gap-3 pb-2.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
			{products.map((prod) => {
				const prodId = prod.id || prod._id;
				const name = prod.name;
				const price = prod.price;
				const discountPrice = prod.discountPrice;
				const image = prod.image || (prod.images && prod.images[0]?.url) || 'https://via.placeholder.com/150';
				
				return (
					<div 
						key={prodId} 
						className="shrink-0 w-36 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
					>
						<div className="relative group overflow-hidden h-28 bg-gray-55 dark:bg-gray-900 flex items-center justify-center">
							<img 
								src={image} 
								alt={name} 
								className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
							/>
						</div>
						<div className="p-2 flex-1 flex flex-col justify-between">
							<div>
								<h4 className="text-xs font-bold text-gray-800 dark:text-gray-250 truncate mb-1" title={name}>
									{name}
								</h4>
								<div className="flex flex-wrap items-center gap-1">
									{discountPrice ? (
										<>
											<span className="text-xs font-extrabold text-red-500">${discountPrice}</span>
											<span className="text-[10px] text-gray-405 dark:text-gray-500 line-through">${price}</span>
										</>
									) : (
										<span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">${price}</span>
									)}
								</div>
							</div>
							<Link 
								to={`/product/${prodId}`}
								onClick={onSelectProduct}
								className="mt-2 block text-center text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-650 dark:text-gray-300 py-1.5 rounded-lg transition-colors cursor-pointer"
							>
								View Details
							</Link>
						</div>
					</div>
				);
			})}
		</div>
	);
};

// Sub-component: Order Status Card
const OrderCard = ({ order, onSelectOrder }) => {
	const dateStr = new Date(order.createdAt).toLocaleDateString();
	const statusColors = {
		'Processing': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-205 dark:border-amber-900/40',
		'Shipped': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40',
		'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-900/40',
		'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-900/30',
	};
	const badgeClass = statusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
	
	return (
		<div className="mt-3 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
			<div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
				<div>
					<span className="text-[10px] text-gray-400 dark:text-gray-550 font-mono">#{order._id.toString().slice(-6).toUpperCase()}</span>
					<h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400">{dateStr}</h4>
				</div>
				<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
					{order.status}
				</span>
			</div>
			<div className="space-y-1 my-1">
				{order.orderItems && order.orderItems.slice(0, 2).map((item, index) => (
					<div key={index} className="flex justify-between items-center text-xs">
						<span className="text-gray-600 dark:text-gray-300 truncate max-w-[70%]">
							{item.name} <span className="text-gray-450 font-normal">x{item.quantity}</span>
						</span>
						<span className="font-semibold text-gray-700 dark:text-gray-200">${item.price * item.quantity}</span>
					</div>
				))}
				{order.orderItems && order.orderItems.length > 2 && (
					<p className="text-[10px] text-gray-400 dark:text-gray-500 italic">+ {order.orderItems.length - 2} more item(s)</p>
				)}
			</div>
			<div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
				<div>
					<p className="text-[10px] text-gray-400 dark:text-gray-200">Total Amount</p>
					<p className="text-sm font-extrabold text-gray-800 dark:text-white">${order.totalPrice}</p>
				</div>
				<Link 
					to={`/order/${order._id}`}
					onClick={onSelectOrder}
					className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
				>
					Track Order
				</Link>
			</div>
		</div>
	);
};

// Sub-component: User Orders List Card
const OrdersListCard = ({ orders, onSelectOrder }) => {
	return (
		<div className="mt-3 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm space-y-2 animate-in fade-in slide-in-from-bottom-2">
			<h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-1.5">
				Your Recent Orders
			</h4>
			<div className="divide-y divide-gray-100 dark:divide-gray-700">
				{orders.map((order) => {
					const dateStr = new Date(order.createdAt).toLocaleDateString();
					return (
						<div key={order._id || order.orderId} className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
							<div>
								<span className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-mono">
									#{ (order._id || order.orderId).slice(-6).toUpperCase() }
								</span>
								<p className="text-[10px] text-gray-400 dark:text-gray-550">{dateStr}</p>
							</div>
							<div className="text-right flex items-center gap-3">
								<div>
									<p className="text-xs font-extrabold text-gray-800 dark:text-white">${order.totalPrice}</p>
									<span className="text-[9px] font-bold text-blue-500">{order.status}</span>
								</div>
								<Link 
									to={`/order/${order._id || order.orderId}`}
									onClick={onSelectOrder}
									className="text-[10px] bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-600 dark:text-gray-300 px-2 py-1 rounded transition-colors cursor-pointer"
								>
									View
								</Link>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const Chatbox = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			id: 'welcome',
			text: 'Hello! Welcome to Rainbow Shop. How can I help you today? 🌈',
			sender: 'bot',
		},
	]);
	const [inputText, setInputText] = useState('');
	const [selectedImageUrl, setSelectedImageUrl] = useState('');
	const [uploadingImage, setUploadingImage] = useState(false);
	const [loading, setLoading] = useState(false);
	
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (isOpen) {
			scrollToBottom();
		}
	}, [messages, isOpen]);

	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('image', file);

		setUploadingImage(true);
		try {
			const token = localStorage.getItem('userToken');
			const res = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						...(token ? { Authorization: `Bearer ${token}` } : {})
					}
				}
			);
			setSelectedImageUrl(res.data.imageUrl);
		} catch (err) {
			console.error('Failed to upload image:', err);
		} finally {
			setUploadingImage(false);
			e.target.value = '';
		}
	};

	const handleSend = async (textToSend) => {
		const messageText = textToSend || inputText;
		const currentImageUrl = selectedImageUrl;
		
		if (!messageText.trim() && !currentImageUrl) return;

		const userMessage = {
			id: Date.now().toString(),
			text: messageText.trim() || 'Look for similar products to this image',
			sender: 'user',
			imageUrl: currentImageUrl || null
		};

		setMessages((prev) => [...prev, userMessage]);
		
		// Clear inputs
		if (!textToSend) setInputText('');
		setSelectedImageUrl('');
		setLoading(true);

		try {
			const token = localStorage.getItem('userToken');
			// Convert messaging history to payload
			const history = messages.map((m) => ({
				id: m.id,
				sender: m.sender,
				text: m.text
			}));

			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/chat`,
				{
					message: userMessage.text,
					history,
					imageUrl: currentImageUrl || undefined
				},
				{
					headers: token ? { Authorization: `Bearer ${token}` } : {}
				}
			);

			const botMessage = {
				id: (Date.now() + 1).toString(),
				text: response.data.reply || 'Sorry, I did not understand that.',
				sender: 'bot',
				products: response.data.products || null,
				order: response.data.order || null,
				orders: response.data.orders || null
			};
			setMessages((prev) => [...prev, botMessage]);
		} catch (error) {
			console.error('Chat error:', error);
			const errorMessage = {
				id: (Date.now() + 1).toString(),
				text: 'Sorry, I am having trouble connecting to my service right now. Please try again later.',
				sender: 'bot',
				isError: true,
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSend();
		}
	};

	return (
		<>
			{/* Floating Chat Trigger Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer`}
				aria-label='Toggle Chat Support'
			>
				{isOpen ? <FiX className='w-6 h-6' /> : <FiMessageCircle className='w-6 h-6' />}
			</button>

			{/* Chatbox Window */}
			{isOpen && (
				<div className='fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in'>
					{/* Header */}
					<div className='p-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md'>
						<div className='flex items-center gap-3'>
							<div className='relative'>
								<div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white'>
									🌈
								</div>
								<span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full'></span>
							</div>
							<div>
								<h3 className='font-bold text-sm leading-tight'>Rainbow Assistant</h3>
								<p className='text-xs text-white/80 flex items-center gap-1'>
									Online • Powered by Gemini
								</p>
							</div>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className='p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white'
						>
							<FiX className='w-5 h-5' />
						</button>
					</div>

					{/* Message Log */}
					<div className='flex-1 p-4 overflow-y-auto space-y-4 dark:bg-gray-900/40'>
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
							>
								<div
									className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
										msg.sender === 'user'
											? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10'
											: msg.isError
												? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/30'
												: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
									}`}
								>
									{msg.imageUrl && (
										<div className="mb-2 max-w-full overflow-hidden rounded-lg">
											<img 
												src={msg.imageUrl} 
												alt="Uploaded query" 
												className="max-h-40 object-cover w-full rounded" 
											/>
										</div>
									)}
									<div className="whitespace-pre-wrap">{msg.text}</div>
								</div>

								{/* Dynamic Products Carousel */}
								{msg.products && msg.products.length > 0 && (
									<ProductCarousel 
										products={msg.products} 
										onSelectProduct={() => setIsOpen(false)} 
									/>
								)}

								{/* Dynamic Single Order Status Card */}
								{msg.order && (
									<OrderCard 
										order={msg.order} 
										onSelectOrder={() => setIsOpen(false)} 
									/>
								)}

								{/* Dynamic Orders List Card */}
								{msg.orders && msg.orders.length > 0 && (
									<OrdersListCard 
										orders={msg.orders} 
										onSelectOrder={() => setIsOpen(false)} 
									/>
								)}
							</div>
						))}

						{/* Typing/Loading Indicator */}
						{loading && (
							<div className='flex justify-start'>
								<div className='bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-1 shadow-sm'>
									<span className='w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce'></span>
									<span
										className='w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce'
										style={{ animationDelay: '0.2s' }}
									></span>
									<span
										className='w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce'
										style={{ animationDelay: '0.4s' }}
									></span>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Suggestions Chips */}
					{messages.length === 1 && !loading && (
						<div className='px-4 pb-2 pt-1 flex flex-wrap gap-1.5 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700/50'>
							{SUGGESTIONS.map((sug, i) => (
								<button
									key={i}
									onClick={() => handleSend(sug)}
									className='text-xs bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 px-2.5 py-1.5 rounded-full transition-all cursor-pointer'
								>
									{sug}
								</button>
							))}
						</div>
					)}

					{/* Image Preview Container */}
					{(selectedImageUrl || uploadingImage) && (
						<div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-700/50 flex items-center gap-3 relative animate-in fade-in slide-in-from-bottom-2">
							{uploadingImage ? (
								<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
									<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
									<span>Uploading image...</span>
								</div>
							) : (
								<div className="relative group">
									<img 
										src={selectedImageUrl} 
										alt="Upload preview" 
										className="w-14 h-14 object-cover rounded-lg border border-gray-250 dark:border-gray-600" 
									/>
									<button 
										onClick={() => setSelectedImageUrl('')}
										className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-650 transition-colors cursor-pointer"
										title="Remove image"
									>
										<FiX className="w-3 h-3" />
									</button>
								</div>
							)}
						</div>
					)}

					{/* Input Footer */}
					<div className='p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-2 items-center'>
						<input 
							type="file" 
							ref={fileInputRef} 
							onChange={handleFileChange} 
							accept="image/*" 
							className="hidden" 
						/>
						<button
							onClick={handleImageClick}
							disabled={loading || uploadingImage}
							type="button"
							className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 cursor-pointer active:scale-95 transition-all"
							title="Upload product image"
						>
							<FiImage className='w-4.5 h-4.5' />
						</button>
						<input
							type='text'
							placeholder={uploadingImage ? 'Uploading image...' : 'Ask a question...'}
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyDown={handleKeyPress}
							className='flex-1 bg-gray-55 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:text-white transition-colors'
							disabled={loading || uploadingImage}
						/>
						<button
							onClick={() => handleSend()}
							disabled={loading || uploadingImage || (!inputText.trim() && !selectedImageUrl)}
							className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
								loading || uploadingImage || (!inputText.trim() && !selectedImageUrl)
									? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-555 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 cursor-pointer active:scale-95'
							}`}
						>
							<FiSend className='w-4.5 h-4.5' />
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Chatbox;
