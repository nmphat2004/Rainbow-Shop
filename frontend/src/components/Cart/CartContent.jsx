import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import {
	removeFromCart,
	updateCartItemQuantity,
} from '../../redux/slices/cartSlice';

const CartContent = ({ cart, userId, guestId }) => {
	const dispatch = useDispatch();

	// Handle adding or subtracting to cart
	const handleAddToCart = (productId, delta, quantity, size, color) => {
		const newQuantity = quantity + delta;

		if (newQuantity >= 1) {
			dispatch(
				updateCartItemQuantity({
					productId,
					quantity: newQuantity,
					guestId,
					userId,
					size,
					color,
				})
			);
		}
	};

	const handleRemoveFromCart = (productId, size, color) => {
		dispatch(
			removeFromCart({
				productId,
				size,
				color,
				guestId,
				userId,
			})
		);
	};

	return (
		<div>
			{cart.products.map((product, index) => (
				<div
					key={index}
					className='flex items-start justify-between py-4 border-b border-zinc-100 dark:border-zinc-800'>
					<div className='flex items-start'>
						<div className='relative w-20 h-24 mr-4 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-950 shrink-0 group'>
							<img
								src={product.image}
								alt={product.name}
								className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
							/>
						</div>
						<div className='flex flex-col justify-between h-24'>
							<div>
								<h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100'>{product.name}</h3>
								<p className='font-mono-brand text-[10px] uppercase text-zinc-400 dark:text-zinc-500 tracking-wider mt-1'>
									S: {product.size} | C: {product.color}
								</p>
							</div>
							<div className='flex items-center space-x-3'>
								<button
									onClick={() =>
										handleAddToCart(
											product.productId,
											-1,
											product.quantity,
											product.size,
											product.color
										)
									}
									className='w-7 h-7 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:scale-[0.95] transition-all cursor-pointer'>
									-
								</button>
								<span className='font-mono-brand text-sm text-zinc-700 dark:text-zinc-300'>{product.quantity}</span>
								<button
									onClick={() =>
										handleAddToCart(
											product.productId,
											1,
											product.quantity,
											product.size,
											product.color
										)
									}
									className='w-7 h-7 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:scale-[0.95] transition-all cursor-pointer'>
									+
								</button>
							</div>
						</div>
					</div>
					<div className='flex flex-col items-end justify-between h-24'>
						<p className='font-mono-brand text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
							${product.price.toLocaleString()}
						</p>
						<button
							onClick={() =>
								handleRemoveFromCart(
									product.productId,
									product.size,
									product.color
								)
							}
							className='text-zinc-400 hover:text-rainbow-red dark:hover:text-rainbow-red transition-colors active:scale-[0.95] cursor-pointer'>
							<RiDeleteBin3Line className='h-4.5 w-4.5' />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default CartContent;
