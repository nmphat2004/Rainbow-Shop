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
		<div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
			<h2 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8'>
				Order Management
			</h2>

			<div className='border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm'>
				<table className='min-w-full text-left text-zinc-500 dark:text-zinc-400'>
					<thead className='bg-zinc-50 dark:bg-zinc-900/50 text-[11px] font-mono-brand uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800'>
						<tr>
							<th className='px-6 py-4'>Order ID</th>
							<th className='px-6 py-4'>Customer</th>
							<th className='px-6 py-4'>Total Price</th>
							<th className='px-6 py-4'>Status</th>
							<th className='px-6 py-4 text-right'>Actions</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-zinc-200 dark:divide-zinc-800'>
						{loading ?
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={i}>
									<td className='px-6 py-4'>
										<Skeletion className='h-4 w-1/3' />
									</td>
									<td className='px-6 py-4'>
										<Skeletion className='h-4 w-24' />
									</td>
									<td className='px-6 py-4'>
										<Skeletion className='h-4 w-16' />
									</td>
									<td className='px-6 py-4'>
										<Skeletion className='h-6 w-20 rounded-lg' />
									</td>
									<td className='px-6 py-4 text-right'>
										<Skeletion className='h-4 w-28 ml-auto' />
									</td>
								</tr>
							))
						: orders.length > 0 ?
							orders.map((order) => (
								<tr
									key={order._id}
									className='hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-200'>
									<td className='px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200 whitespace-nowrap text-sm font-mono-brand'>
										#{order._id.slice(-6).toUpperCase()}
									</td>
									<td className='px-6 py-4 dark:text-zinc-300 text-sm'>{order.user?.name || 'Guest User'}</td>
									<td className='px-6 py-4 dark:text-zinc-300 text-sm font-mono-brand'>
										${order.totalPrice.toFixed(2)}
									</td>
									<td className='px-6 py-4 text-sm'>
										<select
											value={order.status}
											className='p-1.5 text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors cursor-pointer'
											onChange={(e) =>
												handleStatusChange(order._id, e.target.value)
											}>
											<option value='Processing'>Processing</option>
											<option value='Shipped'>Shipped</option>
											<option value='Delivered'>Delivered</option>
											<option value='Cancelled'>Cancelled</option>
										</select>
									</td>
									<td className='px-6 py-4 text-right text-sm'>
										{order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
											<button
												onClick={() => handleStatusChange(order._id, 'Delivered')}
												className='border border-zinc-200 dark:border-zinc-750 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all active:scale-[0.98] cursor-pointer'>
												Mark Delivered
											</button>
										) : (
											<span className='text-xs font-mono-brand text-zinc-300 dark:text-zinc-600 uppercase tracking-wider'>Finalized</span>
										)}
									</td>
								</tr>
							))
						:	<tr>
								<td
									colSpan={5}
									className='px-6 py-8 text-center text-zinc-400 dark:text-zinc-500 text-sm'>
									No orders found.
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
