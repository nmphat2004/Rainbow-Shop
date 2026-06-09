import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';

const OrderConfirmationPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { checkout } = useSelector((state) => state.checkout);

	useEffect(() => {
		if (checkout && checkout._id) {
			dispatch(clearCart());
			localStorage.removeItem('cart');
		} else {
			navigate('/my-orders');
		}
	}, [checkout, navigate, dispatch]);

	const calculateEstimateDelivery = (createdAt) => {
		const orderDate = new Date(createdAt);
		orderDate.setDate(orderDate.getDate() + 10); //add 10 days to the order date
		return orderDate.toLocaleDateString();
	};

	return (
		<div className='max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 dark:text-gray-200'>
			<h1 className='text-4xl font-bold text-center text-emerald-700 dark:text-emerald-400 mb-8'>
				Thank You for Your Order!
			</h1>

			{checkout && (
				<div className='p-6 rounded-lg border dark:border-gray-700'>
					<div className='flex justify-between mb-20'>
						{/* Order Id and Date */}
						<div>
							<h2 className='text-xl font-semibold dark:text-white'>
								Order ID: {checkout._id}
							</h2>
							<p className='text-gray-500 dark:text-gray-400'>
								Order date: {new Date(checkout.createdAt).toLocaleDateString()}
							</p>
						</div>
						{/* Estimated Delivery */}
						<div>
							<p className='text-emerald-700 dark:text-emerald-400 text-sm'>
								Estimated Delivery:{' '}
								{calculateEstimateDelivery(checkout.createdAt)}
							</p>
						</div>
					</div>
					{/* Ordered Items */}
					<div className='mb-20'>
						{checkout.checkoutItems.map((item) => (
							<div key={item.productId} className='flex items-center mb-4'>
								<img
									src={item.image}
									alt={item.name}
									className='w-16 h-16 object-cover rounded-md mr-4'
								/>
								<div>
									<h4 className='text-md font-semibold dark:text-white'>{item.name}</h4>
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										{item.color} | {item.size}
									</p>
								</div>
								<div className='ml-auto text-right'>
									<p className='text-md dark:text-gray-200'>${item.price}</p>
									<p className='text-sm dark:text-gray-400'>Qty: {item.quantity}</p>
								</div>
							</div>
						))}
					</div>
					{/* Payment and Delivery Info */}
					<div className='grid grid-cols-2 gap-8'>
						<div>
							<h4 className='text-lg font-semibold mb-2 dark:text-white'>Payment</h4>
							<p className='text-gray-600 dark:text-gray-400'>Paypal</p>
						</div>

						<div>
							<h4 className='text-lg font-semibold mb-2 dark:text-white'>Delivery</h4>
							<p className='text-gray-600 dark:text-gray-400'>
								{checkout.shippingAddress.address}
							</p>
							<p className='text-gray-600 dark:text-gray-400'>
								{checkout.shippingAddress.country}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default OrderConfirmationPage;
