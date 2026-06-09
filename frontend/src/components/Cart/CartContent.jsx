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
					className='flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700'>
					<div className='flex items-start'>
						<img
							src={product.image}
							alt={product.name}
							className='w-20 h-24 mr-4 object-cover rounded'
						/>
						<div>
							<h3 className='dark:text-white'>{product.name}</h3>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								size: {product.size} | color: {product.color}
							</p>
							<div className='flex items-center mt-2'>
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
									className='border dark:border-gray-600 rounded px-2 py-1 text-xl font-medium dark:text-gray-300'>
									-
								</button>
								<span className='mx-4 dark:text-gray-200'>{product.quantity}</span>
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
									className='border dark:border-gray-600 rounded px-2 py-1 text-xl font-medium dark:text-gray-300'>
									+
								</button>
							</div>
						</div>
					</div>
					<div className='flex flex-col items-end'>
						<p className='font-medium dark:text-gray-200'>$ {product.price.toLocaleString()}</p>
						<button
							onClick={() =>
								handleRemoveFromCart(
									product.productId,
									product.size,
									product.color
								)
							}>
							<RiDeleteBin3Line className='h-6 w-6 mt-2 text-red-600' />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default CartContent;
