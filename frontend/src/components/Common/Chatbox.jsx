import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import axios from 'axios';

const SUGGESTIONS = [
	'Do you offer free shipping?',
	'What is your return policy?',
	'How can I track my order?',
	'Do you have clothing size charts?',
];

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
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (isOpen) {
			scrollToBottom();
		}
	}, [messages, isOpen]);

	const handleSend = async (textToSend) => {
		const messageText = textToSend || inputText;
		if (!messageText.trim()) return;

		const userMessage = {
			id: Date.now().toString(),
			text: messageText.trim(),
			sender: 'user',
		};

		setMessages((prev) => [...prev, userMessage]);
		if (!textToSend) setInputText('');
		setLoading(true);

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/chat`,
				{ message: messageText }
			);

			const botMessage = {
				id: (Date.now() + 1).toString(),
				text: response.data.reply || 'Sorry, I did not understand that.',
				sender: 'bot',
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
					<div className='p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md'>
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
								className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
										msg.sender === 'user'
											? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10'
											: msg.isError
												? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/30'
												: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
									}`}
								>
									{msg.text}
								</div>
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
									className='text-xs bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 px-2.5 py-1.5 rounded-full transition-all cursor-pointer'
								>
									{sug}
								</button>
							))}
						</div>
					)}

					{/* Input Footer */}
					<div className='p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 flex gap-2 items-center'>
						<input
							type='text'
							placeholder='Ask a question...'
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyDown={handleKeyPress}
							className='flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:text-white transition-colors'
							disabled={loading}
						/>
						<button
							onClick={() => handleSend()}
							disabled={loading || !inputText.trim()}
							className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
								loading || !inputText.trim()
									? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
