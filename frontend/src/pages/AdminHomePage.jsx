import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../redux/slices/adminOrderSlice';
import Skeletion from '../components/Common/Skeletion';

const AdminHomePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		products,
		loading: productsLoading,
		error: productsError,
	} = useSelector((state) => state.adminProducts);
	const {
		orders,
		totalOrders,
		totalSales,
		loading: ordersLoading,
		error: ordersError,
	} = useSelector((state) => state.adminOrders);

	useEffect(() => {
		dispatch(fetchAdminProducts());
		dispatch(fetchAllOrders());
	}, [dispatch]);

	const getStatusStyles = (status) => {
		const colors = {
			'Processing': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border-amber-100 dark:border-amber-900/30',
			'Shipped': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-900/30',
			'Delivered': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30',
			'Cancelled': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-100 dark:border-red-900/30',
		};
		return colors[status] || 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
	};

	return (
		<div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
			<h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8'>Admin Overview</h1>
			
			{productsLoading || ordersLoading ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl'>
							<Skeletion className='w-20 h-4 mb-3' />
							<Skeletion className='w-32 h-8 mb-3' />
							<Skeletion className='w-24 h-3' />
						</div>
					))}
				</div>
			) : productsError ? (
				<p className='text-red-500 p-4 border border-red-200 rounded-xl bg-red-50/50 mb-8'>Error fetching products: {productsError}</p>
			) : ordersError ? (
				<p className='text-red-500 p-4 border border-red-200 rounded-xl bg-red-50/50 mb-8'>Error fetching orders: {ordersError}</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
					{/* Card 1 */}
					<div className='p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700'>
						<span className='font-mono-brand text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2'>Revenue</span>
						<p className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono-brand'>$ {totalSales.toFixed(2)}</p>
						<span className='text-[11px] text-emerald-600 dark:text-emerald-400 mt-2.5 block font-mono-brand'>+12.4% from last month</span>
					</div>

					{/* Card 2 */}
					<div className='p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700'>
						<span className='font-mono-brand text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2'>Total Orders</span>
						<p className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono-brand'>{totalOrders}</p>
						<div className='flex items-center justify-between mt-2.5'>
							<span className='text-[11px] text-emerald-600 dark:text-emerald-400 block font-mono-brand'>+8.2% from last week</span>
							<Link to='/admin/orders' className='text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 underline'>
								Manage
							</Link>
						</div>
					</div>

					{/* Card 3 */}
					<div className='p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700'>
						<span className='font-mono-brand text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2'>Total Products</span>
						<p className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono-brand'>{products.length}</p>
						<div className='flex items-center justify-between mt-2.5'>
							<span className='text-[11px] text-zinc-450 dark:text-zinc-500 block font-mono-brand'>Active inventory</span>
							<Link
								to='/admin/products'
								className='text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 underline'>
								Manage
							</Link>
						</div>
					</div>
				</div>
			)}

			<div className='mt-8'>
				<h2 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6'>Recent Orders</h2>
				
				{ordersLoading ? (
					<div className='space-y-3'>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className='p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between'>
								<Skeletion className='w-24 h-4' />
								<Skeletion className='w-20 h-4' />
								<Skeletion className='w-16 h-4' />
								<Skeletion className='w-16 h-6 rounded-lg' />
							</div>
						))}
					</div>
				) : (
					<div className='border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden bg-white dark:bg-zinc-900'>
						{orders.length > 0 ? (
							orders.map((order) => (
								<div
									key={order._id}
									onClick={() => navigate(`/order/${order._id}`)}
									className='flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors duration-200 cursor-pointer'>
									<div className='flex items-center space-x-3'>
										<span className='font-mono-brand text-sm font-semibold text-zinc-900 dark:text-zinc-200'>
											#{order._id.slice(-6).toUpperCase()}
										</span>
										<span className='text-xs text-zinc-400 dark:text-zinc-500'>
											{order.user?.name || 'Guest User'}
										</span>
									</div>
									<span className='text-xs text-zinc-500 dark:text-zinc-400 font-mono-brand mt-1.5 sm:mt-0'>
										{new Date(order.createdAt).toLocaleDateString()}
									</span>
									<span className='font-mono-brand text-sm font-bold text-zinc-800 dark:text-zinc-100 mt-1.5 sm:mt-0'>
										${order.totalPrice.toFixed(2)}
									</span>
									<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border mt-1.5 sm:mt-0 w-fit ${getStatusStyles(order.status)}`}>
										{order.status}
									</span>
								</div>
							))
						) : (
							<div className='p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm'>
								No recent orders found.
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminHomePage;
