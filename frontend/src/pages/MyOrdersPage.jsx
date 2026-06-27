import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrder } from '../redux/slices/orderSlice';
import Skeletion from '../components/Common/Skeletion';

const MyOrdersPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { orders, loading, error } = useSelector((state) => state.order);

	useEffect(() => {
		dispatch(fetchUserOrder());
	}, [dispatch]);

	if (loading) {
		return (
			<div className='max-w-7xl mx-auto p-4 sm:p-6'>
				<h2 className='text-xl sm:text-2xl font-bold mb-6 dark:text-white'>My Orders</h2>
				<div className='space-y-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900 shadow-sm'>
							<div className='flex items-center space-x-4'>
								<Skeletion className='w-12 h-12 rounded-lg' />
								<div className='space-y-2'>
									<Skeletion className='w-24 h-4' />
									<Skeletion className='w-16 h-3' />
								</div>
							</div>
							<Skeletion className='w-20 h-4 mt-2 sm:mt-0' />
							<Skeletion className='w-28 h-4 mt-2 sm:mt-0' />
							<div className='flex items-center space-x-6 mt-3 sm:mt-0'>
								<Skeletion className='w-16 h-4' />
								<Skeletion className='w-16 h-6 rounded-lg' />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) return <p className='text-red-500 dark:text-red-400 p-6'>Error: {error}</p>;

	return (
		<div className='max-w-7xl mx-auto p-4 sm:p-6'>
			<h2 className='text-xl sm:text-2xl font-bold mb-6 dark:text-white'>My Orders</h2>
			<div className='space-y-4'>
				{orders.length > 0 ? (
					orders.map((order) => (
						<div
							onClick={() => navigate(`/order/${order._id}`)}
							key={order._id}
							className='flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:scale-[1.01] transition-all duration-300 cursor-pointer shadow-sm'>
							<div className='flex items-center space-x-4'>
								{/* Image */}
								<div className='w-12 h-12 overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-950 shrink-0 border border-zinc-200 dark:border-zinc-800'>
									<img
										src={order.orderItems[0]?.image}
										alt={order.orderItems[0]?.name}
										className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
									/>
								</div>
								{/* Order Details */}
								<div>
									<h4 className='text-sm font-semibold text-zinc-800 dark:text-zinc-200 font-mono-brand'>
										#{order._id.slice(-6).toUpperCase()}
									</h4>
									<p className='text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono-brand uppercase tracking-wider'>
										{order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
									</p>
								</div>
							</div>
							
							{/* Timestamp */}
							<div className='mt-2 sm:mt-0 text-left sm:text-center'>
								<span className='font-mono-brand text-xs text-zinc-500 dark:text-zinc-400'>
									{new Date(order.createdAt).toLocaleDateString()}
								</span>
								<span className='hidden sm:block font-mono-brand text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5'>
									{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</span>
							</div>

							{/* Shipping location */}
							<div className='mt-2 sm:mt-0 text-left text-xs text-zinc-400 dark:text-zinc-500 font-mono-brand'>
								{order.shippingAddress
									? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
									: 'N/A'}
							</div>

							{/* Price & Status */}
							<div className='flex items-center justify-between sm:justify-end space-x-6 mt-3 sm:mt-0'>
								<span className='font-mono-brand text-sm font-bold text-zinc-800 dark:text-white'>
									${order.totalPrice.toLocaleString()}
								</span>
								<span
									className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
										order.isPaid
											? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'
											: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
									}`}>
									{order.isPaid ? 'Paid' : 'Pending'}
								</span>
							</div>
						</div>
					))
				) : (
					<div className='text-center py-12 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-xl'>
						<p className='text-zinc-400 dark:text-zinc-500 text-sm'>You have no orders yet.</p>
					</div>
				)}
			</div>
		</div>
	);
};
export default MyOrdersPage;
