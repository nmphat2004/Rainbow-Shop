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
		<div className="mt-3 w-full overflow-x-auto no-scrollbar flex gap-2.5 pb-2">
			{products.map((prod) => {
				const prodId = prod.id || prod._id;
				const name = prod.name;
				const price = prod.price;
				const discountPrice = prod.discountPrice;
				const image = prod.image || (prod.images && prod.images[0]?.url) || 'https://picsum.photos/seed/product-placeholder/150/150';
				
				return (
					<div 
						key={prodId} 
						className="shrink-0 w-32 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
					>
						<div className="overflow-hidden h-24 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
							<img 
								src={image} 
								alt={name} 
								className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
							/>
						</div>
						<div className="p-2 flex-1 flex flex-col justify-between">
							<div>
								<h4 className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 truncate mb-1" title={name}>
									{name}
								</h4>
								<div className="flex flex-wrap items-center gap-1">
									{discountPrice ? (
										<>
											<span className="font-mono-brand text-[11px] font-bold text-rainbow-red">${discountPrice}</span>
											<span className="font-mono-brand text-[10px] text-zinc-400 dark:text-zinc-500 line-through">${price}</span>
										</>
									) : (
										<span className="font-mono-brand text-[11px] font-bold text-zinc-700 dark:text-zinc-300">${price}</span>
									)}
								</div>
							</div>
							<Link 
								to={`/product/${prodId}`}
								onClick={onSelectProduct}
								className="mt-2 block text-center text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-700 hover:bg-rainbow-red hover:text-white text-zinc-600 dark:text-zinc-300 py-1.5 rounded-lg transition-colors cursor-pointer"
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
		'Processing': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40',
		'Shipped': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40',
		'Delivered': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40',
		'Cancelled': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800/40',
	};
	const badgeClass = statusColors[order.status] || 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
	
	return (
		<div className="mt-3 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 flex flex-col gap-2">
			<div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
				<div>
					<span className="font-mono-brand text-[10px] text-zinc-400 dark:text-zinc-500">#{order._id.toString().slice(-6).toUpperCase()}</span>
					<h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{dateStr}</h4>
				</div>
				<span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${badgeClass}`}>
					{order.status}
				</span>
			</div>
			<div className="space-y-1 my-1">
				{order.orderItems && order.orderItems.slice(0, 2).map((item, index) => (
					<div key={index} className="flex justify-between items-center text-xs">
						<span className="text-zinc-600 dark:text-zinc-300 truncate max-w-[70%]">
							{item.name} <span className="text-zinc-400 font-mono-brand">x{item.quantity}</span>
						</span>
						<span className="font-mono-brand font-semibold text-zinc-700 dark:text-zinc-200">${item.price * item.quantity}</span>
					</div>
				))}
				{order.orderItems && order.orderItems.length > 2 && (
					<p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">+ {order.orderItems.length - 2} more item(s)</p>
				)}
			</div>
			<div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-700">
				<div>
					<p className="text-[10px] text-zinc-400 dark:text-zinc-500">Total</p>
					<p className="font-mono-brand text-sm font-bold text-zinc-800 dark:text-white">${order.totalPrice}</p>
				</div>
				<Link 
					to={`/order/${order._id}`}
					onClick={onSelectOrder}
					className="text-xs bg-rainbow-red hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
		<div className="mt-3 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 space-y-2">
			<h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-700 pb-1.5">
				Your Recent Orders
			</h4>
			<div className="divide-y divide-zinc-100 dark:divide-zinc-700">
				{orders.map((order) => {
					const dateStr = new Date(order.createdAt).toLocaleDateString();
					return (
						<div key={order._id || order.orderId} className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
							<div>
								<span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 font-mono-brand">
									#{ (order._id || order.orderId).slice(-6).toUpperCase() }
								</span>
								<p className="text-[10px] text-zinc-400 dark:text-zinc-500">{dateStr}</p>
							</div>
							<div className="text-right flex items-center gap-3">
								<div>
									<p className="font-mono-brand text-xs font-bold text-zinc-800 dark:text-white">${order.totalPrice}</p>
									<span className="text-[9px] font-semibold text-rainbow-red">{order.status}</span>
								</div>
								<Link 
									to={`/order/${order._id || order.orderId}`}
									onClick={onSelectOrder}
									className="text-[10px] bg-zinc-100 dark:bg-zinc-700 hover:bg-rainbow-red hover:text-white text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
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
			text: 'Welcome to Rainbow Shop. How can I help you today?',
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
				text: 'Sorry, I am having trouble connecting right now. Please try again later.',
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
				className='fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ring-2 ring-rainbow-red/30'
				aria-label='Toggle Chat Support'
			>
				{isOpen ? <FiX className='w-5 h-5' /> : <FiMessageCircle className='w-5 h-5' />}
			</button>

			{/* Chatbox Window */}
			{isOpen && (
				<div className='fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-2xl shadow-zinc-900/10 dark:shadow-black/30 flex flex-col overflow-hidden'>
					{/* Header */}
					<div className='p-4 bg-zinc-900 dark:bg-zinc-950 text-white flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='w-9 h-9 rounded-xl bg-rainbow-red/20 flex items-center justify-center'>
								<span className='font-mono-brand text-xs font-bold text-rainbow-red'>R</span>
							</div>
							<div>
								<h3 className='font-semibold text-sm leading-tight'>Rainbow Assistant</h3>
								<p className='text-[11px] text-zinc-400'>
									Powered by Gemini
								</p>
							</div>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className='p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white'
						>
							<FiX className='w-4 h-4' />
						</button>
					</div>

					{/* Message Log */}
					<div className='flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50 dark:bg-zinc-950/50'>
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
							>
								<div
									className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
										msg.sender === 'user'
											? 'bg-rainbow-red text-white rounded-br-md'
											: msg.isError
												? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/30'
												: 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-bl-md border border-zinc-200/60 dark:border-zinc-700/60'
									}`}
								>
									{msg.imageUrl && (
										<div className="mb-2 max-w-full overflow-hidden rounded-lg">
											<img 
												src={msg.imageUrl} 
												alt="Uploaded query" 
												className="max-h-36 object-cover w-full rounded-lg" 
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
								<div className='bg-white dark:bg-zinc-800 text-zinc-400 rounded-2xl rounded-bl-md px-4 py-3 text-sm flex items-center gap-1.5 border border-zinc-200/60 dark:border-zinc-700/60'>
									<span className='w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce'></span>
									<span
										className='w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce'
										style={{ animationDelay: '0.15s' }}
									></span>
									<span
										className='w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce'
										style={{ animationDelay: '0.3s' }}
									></span>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Suggestions Chips */}
					{messages.length === 1 && !loading && (
						<div className='px-3 pb-2 pt-1.5 flex flex-wrap gap-1.5 bg-white/80 dark:bg-zinc-900/80 border-t border-zinc-200/60 dark:border-zinc-800/60'>
							{SUGGESTIONS.map((sug, i) => (
								<button
									key={i}
									onClick={() => handleSend(sug)}
									className='text-[11px] bg-zinc-100 dark:bg-zinc-800 hover:bg-rainbow-red/10 dark:hover:bg-rainbow-red/10 text-zinc-600 dark:text-zinc-400 hover:text-rainbow-red dark:hover:text-rainbow-red border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer'
								>
									{sug}
								</button>
							))}
						</div>
					)}

					{/* Image Preview Container */}
					{(selectedImageUrl || uploadingImage) && (
						<div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
							{uploadingImage ? (
								<div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
									<div className="w-4 h-4 border-2 border-rainbow-red border-t-transparent rounded-full animate-spin"></div>
									<span>Uploading image...</span>
								</div>
							) : (
								<div className="relative">
									<img 
										src={selectedImageUrl} 
										alt="Upload preview" 
										className="w-12 h-12 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700" 
									/>
									<button 
										onClick={() => setSelectedImageUrl('')}
										className="absolute -top-1.5 -right-1.5 bg-zinc-800 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors cursor-pointer"
										title="Remove image"
									>
										<FiX className="w-3 h-3" />
									</button>
								</div>
							)}
						</div>
					)}

					{/* Input Footer */}
					<div className='p-3 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 flex gap-2 items-center'>
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
							className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 cursor-pointer active:scale-95 transition-all"
							title="Upload product image"
						>
							<FiImage className='w-4 h-4' />
						</button>
						<input
							type='text'
							placeholder={uploadingImage ? 'Uploading image...' : 'Ask a question...'}
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyDown={handleKeyPress}
							className='flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors'
							disabled={loading || uploadingImage}
						/>
						<button
							onClick={() => handleSend()}
							disabled={loading || uploadingImage || (!inputText.trim() && !selectedImageUrl)}
							className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
								loading || uploadingImage || (!inputText.trim() && !selectedImageUrl)
									? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
									: 'bg-rainbow-red hover:bg-red-600 text-white shadow-sm cursor-pointer active:scale-95'
							}`}
						>
							<FiSend className='w-4 h-4' />
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Chatbox;
