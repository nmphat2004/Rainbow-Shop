import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';

const OrderDetailsPage = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { orderDetails, loading, error } = useSelector((state) => state.order);

	useEffect(() => {
		dispatch(fetchOrderDetails(id));
	}, [id, dispatch]);

	if (loading) return <p className='dark:text-gray-400'>Loading...</p>;
	if (error) return <p className='dark:text-red-400'>Error: {error}</p>;

	return (
		<div className='max-w-7xl mx-auto p-4 sm:p-6'>
			<h2 className='text-2xl md:text-3xl font-bold mb-6 dark:text-white'>Order Details</h2>
			{!orderDetails ? (
				<p className='dark:text-gray-400'>No Order details found</p>
			) : (
				<div className='p-4 sm:p-6 rounded-lg border dark:border-gray-700'>
					{/* Order Info */}
					<div className='flex flex-col sm:flex-row justify-between mb-8'>
						<div>
							<h3 className='text-lg md:text-xl font-semibold dark:text-white'>
								Order ID: #{orderDetails._id}
							</h3>
							<p className='text-gray-600 dark:text-gray-400'>
								{new Date(orderDetails.createdAt).toLocaleDateString()}
							</p>
						</div>
						<div className='flex flex-col items-start sm:items-end mt-4 sm:mt-0'>
							<span
								className={`${orderDetails.isPaid
										? 'bg-gray-100 text-green-700 dark:bg-green-900 dark:text-green-300'
										: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
									} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
								{orderDetails.isPaid ? 'Approved' : 'Pending'}
							</span>
							<span
								className={`${orderDetails.isDelivery
										? 'bg-gray-100 text-green-700 dark:bg-green-900 dark:text-green-300'
										: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
									} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
								{orderDetails.isDelivery ? 'Delivered' : 'Pending Delivery'}
							</span>
						</div>
					</div>
					{/* Customer, Payment, Shipping Info */}
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8'>
						<div>
							<h4 className='text-lg font-semibold mb-2 dark:text-white'>Payment Info</h4>
							<p className='dark:text-gray-300'>Payment Method: {orderDetails.paymentMethod}</p>
							<p className='dark:text-gray-300'>Status: {orderDetails.isPaid ? 'Paid' : 'Unpaid'}</p>
						</div>

						<div>
							<h4 className='text-lg font-semibold mb-2 dark:text-white'>Shipping Info</h4>
							<p className='dark:text-gray-300'>Shipping Method: {orderDetails.shippingMethod}</p>
							<p className='dark:text-gray-300'>
								Address:{' '}
								{`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
							</p>
						</div>
					</div>
					{/* Product List */}
					<div className='overflow-x-auto'>
						<h4 className='text-lg font-semibold mb-4 dark:text-white'>Products</h4>
						<table className='min-w-full text-gray-600 dark:text-gray-400 mb-4'>
							<thead className='bg-gray-100 dark:bg-gray-700 dark:text-gray-300'>
								<tr>
									<th className='py-2 px-4'>Name</th>
									<th className='py-2 px-4'>Unit Price</th>
									<th className='py-2 px-4'>Quantity</th>
									<th className='py-2 px-4'>Total</th>
								</tr>
							</thead>
							<tbody>
								{orderDetails.orderItems.map((item) => (
									<tr
										key={item.productId}
										className='border-b border-gray-200 dark:border-gray-700 text-center'>
										<td className='py-2 px-4 flex items-center justify-center'>
											<img
												src={item.image}
												alt={item.name}
												className='w-12 h-12 object-cover rounded-lg mr-4'
											/>
											<Link
												to={`product/${item.productId}`}
												className='text-blue-500 hover:underline dark:text-blue-400'>
												{item.name}
											</Link>
										</td>
										<td className='py-2 px-4'>${item.price}</td>
										<td className='py-2 px-4'>{item.quantity}</td>
										<td className='py-2 px-4'>${item.price * item.quantity}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Back to Orders Link */}
					<Link to='/my-orders' className='text-blue-500 hover:underline dark:text-blue-400'>
						Back to My Orders
					</Link>
				</div>
			)}
		</div>
	);
};
export default OrderDetailsPage;
