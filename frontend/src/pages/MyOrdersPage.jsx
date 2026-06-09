import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrder } from '../redux/slices/orderSlice';

const MyOrdersPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { orders, loading, error } = useSelector((state) => state.order);

	useEffect(() => {
		dispatch(fetchUserOrder());
	}, [dispatch]);

	if (loading) return <p className='dark:text-gray-400'>Loading...</p>;
	if (error) return <p className='dark:text-red-400'>Error: {error}</p>;

	return (
		<div className='max-w-7xl mx-auto p-4 sm:p-6'>
			<h2 className='text-xl sm:text-2xl font-bold mb-6 dark:text-white'>My Orders</h2>
			<div className='relative shadow-md sm:rounded-lg overflow-scroll bg-white dark:bg-gray-800 transition-colors duration-300'>
				<table className='min-w-full text-left text-gray-500 dark:text-gray-400'>
					<thead className='bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300'>
						<tr>
							<th className='py-2 px-4 sm:py-3'>Image</th>
							<th className='py-2 px-4 sm:py-3'>Order ID</th>
							<th className='py-2 px-4 sm:py-3'>Created</th>
							<th className='py-2 px-4 sm:py-3'>Shipping Address</th>
							<th className='py-2 px-4 sm:py-3'>Items</th>
							<th className='py-2 px-4 sm:py-3'>Price</th>
							<th className='py-2 px-4 sm:py-3'>Status</th>
						</tr>
					</thead>
					<tbody>
						{orders.length > 0 ? (
							orders.map((order) => (
								<tr
									onClick={() => navigate(`/order/${order._id}`)}
									key={order._id}
									className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200'>
									<td className='py-2 px-2 sm:py-4 sm:px-4'>
										<img
											src={order.orderItems[0].image}
											alt={order.orderItems[0].name}
											className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg'
										/>
									</td>
									<td className='py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap'>
										#{order._id}
									</td>
									<td className='py-2 px-2 sm:py-4 sm:px-4'>
										{new Date(order.createdAt).toLocaleDateString()}{' '}
										{new Date(order.createdAt).toLocaleTimeString()}
									</td>
									<td className='py-2 px-2 sm:py-4 sm:px-4'>
										{order.shippingAddress
											? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
											: 'N/A'}
									</td>
									<td className='py-2 px-2 sm:py-4 sm:px-4'>
										{order.orderItems.length}
									</td>
									<td className='py-2 px-2 sm:py-4 sm:px-4'>
										${order.totalPrice}
									</td>
									<td className='py-2 px-2 sm:py-4 sm:px-4'>
										<span
											className={`${order.isPaid
													? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
													: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
												} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
											{order.isPaid ? 'Paid' : 'Pending'}
										</span>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td className='py-4 px-4 text-center text-gray-500 dark:text-gray-400' colSpan={7}>
									You have no orders
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default MyOrdersPage;
