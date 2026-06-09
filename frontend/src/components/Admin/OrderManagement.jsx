import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	fetchAllOrders,
	updateOrderStatus,
} from '../../redux/slices/adminOrderSlice';
import Skeletion from '../Common/Skeletion';

const OrderManagement = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const { orders, loading, error } = useSelector((state) => state.adminOrders);

	useEffect(() => {
		if (!user || user.role !== 'admin') navigate('/');
		else dispatch(fetchAllOrders());
	}, [dispatch, user, navigate]);

	const handleStatusChange = (orderID, status) => {
		dispatch(updateOrderStatus({ id: orderID, status }));
	};

	if (error) return <p className='dark:text-red-400'>Error: {error}</p>;

	return (
		<div className='max-w-7xl mx-auto p-6'>
			<h2 className='text-2xl font-bold mb-6 dark:text-white'>
				Order Management
			</h2>

			<div className='overflow-x-auto bg-white dark:bg-gray-800 shadow-md sm:shadow-lg transition-colors duration-300'>
				<table className='min-w-full text-left dark:text-gray-400'>
					<thead className='bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300'>
						<tr>
							<th className='py-3 px-4'>Order ID</th>
							<th className='py-3 px-4'>Customer</th>
							<th className='py-3 px-4'>Total Price</th>
							<th className='py-3 px-4'>Status</th>
							<th className='py-3 px-4'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ?
							Array.from({ length: 5 }).map((_, i) => (
								<tr
									key={i}
									className='border-b border-gray-200 dark:border-gray-700'>
									<td className='p-4'>
										<Skeletion className='h-4 w-3/4' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-3/4' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-3/4' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-3/4' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-12' />
									</td>
								</tr>
							))
						: orders.length > 0 ?
							orders.map((order) => (
								<tr
									key={order._id}
									className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200'>
									<td className='py-4 px-4 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap'>
										#{order._id}
									</td>
									<td className='p-4 dark:text-gray-300'>{order.user?.name}</td>
									<td className='p-4 dark:text-gray-300'>
										{order.totalPrice.toFixed(2)}
									</td>
									<td className='p-4'>
										<select
											value={order.status}
											className='bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'
											onChange={(e) =>
												handleStatusChange(order._id, e.target.value)
											}>
											<option value='Processing'>Processing</option>
											<option value='Shipped'>Shipped</option>
											<option value='Delivered'>Delivered</option>
											<option value='Cancelled'>Cancelled</option>
										</select>
									</td>
									<td className='p-4'>
										<button
											onClick={() => handleStatusChange(order._id, 'Delivered')}
											className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
											Mark as Delivered
										</button>
									</td>
								</tr>
							))
						:	<tr>
								<td
									colSpan={5}
									className='p-4 text-center text-gray-500 dark:text-gray-400'>
									No Orders found.
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default OrderManagement;
