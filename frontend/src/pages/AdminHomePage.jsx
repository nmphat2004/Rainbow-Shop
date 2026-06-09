import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../redux/slices/adminOrderSlice';

const AdminHomePage = () => {
	const dispatch = useDispatch();
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

	return (
		<div className='max-w-7xl mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6 dark:text-white'>Admin Dashboard</h1>
			{productsLoading || ordersLoading ? (
				<p className='dark:text-gray-400'>Loading...</p>
			) : productsError ? (
				<p className='text-red-500'>Error fetching products: {productsError}</p>
			) : ordersError ? (
				<p className='text-red-500'>Error fetching orders: {ordersError}</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					<div className='p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-300'>
						<h2 className='text-xl font-semibold dark:text-white'>Revenue</h2>
						<p className='text-2xl dark:text-gray-200'>$ {totalSales.toFixed(2)}</p>
					</div>
					<div className='p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-300'>
						<h2 className='text-xl font-semibold dark:text-white'>Total Orders</h2>
						<p className='text-2xl dark:text-gray-200'>{totalOrders}</p>
						<Link to='/admin/orders' className='text-blue-500 hover:underline dark:text-blue-400'>
							Manage Orders
						</Link>
					</div>
					<div className='p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-300'>
						<h2 className='text-xl font-semibold dark:text-white'>Total Products</h2>
						<p className='text-2xl dark:text-gray-200'>{products.length}</p>
						<Link
							to='/admin/products'
							className='text-blue-500 hover:underline dark:text-blue-400'>
							Manage Products
						</Link>
					</div>
				</div>
			)}
			<div className='mt-6'>
				<h2 className='text-2xl font-bold mb-4 dark:text-white'>Recent Orders</h2>
				<div className='overflow-x-auto bg-white dark:bg-gray-800 shadow-md sm:rounded-lg transition-colors duration-300'>
					<table className='min-w-full text-left text-gray-500 dark:text-gray-400'>
						<thead className='bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300'>
							<tr>
								<th className='py-3 px-4'>Orders</th>
								<th className='py-3 px-4'>User</th>
								<th className='py-3 px-4'>Total Price</th>
								<th className='py-3 px-4'>Status</th>
							</tr>
						</thead>

						<tbody>
							{orders.length > 0 ? (
								orders.map((order) => (
									<tr
										key={order._id}
										className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200'>
										<td className='p-4 dark:text-gray-300'>{order._id}</td>
										<td className='p-4 dark:text-gray-300'>{order.user?.name}</td>
										<td className='p-4 dark:text-gray-300'>{order.totalPrice.toFixed(2)}</td>
										<td className='p-4 dark:text-gray-300'>{order.status}</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className='p-4 text-center text-gray-500 dark:text-gray-400'>
										No recent orders found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default AdminHomePage;
