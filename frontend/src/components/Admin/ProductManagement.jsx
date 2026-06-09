import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	deleteProduct,
	fetchAdminProducts,
} from '../../redux/slices/adminProductSlice';
import Skeletion from '../Common/Skeletion';

const ProductManagement = () => {
	const dispatch = useDispatch();
	const { products, loading, error } = useSelector(
		(state) => state.adminProducts,
	);

	useEffect(() => {
		dispatch(fetchAdminProducts());
	}, [dispatch]);

	const handleDeleteProduct = (id) => {
		if (window.confirm('Are you sure you want to delete the Product?')) {
			dispatch(deleteProduct(id));
		}
	};

	if (error) return <p className='dark:text-red-400'>Error: {error}</p>;

	return (
		<div className='max-w-7xl mx-auto p-6'>
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold mb-6 dark:text-white'>
					Product Management
				</h2>
				<Link
					to={`/admin/products/create`}
					className='bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600'>
					+ Create
				</Link>
			</div>
			<div className='overflow-x-auto bg-white dark:bg-gray-800 shadow-md sm:rounded-lg transition-colors duration-300'>
				<table className='min-w-full text-left text-gray-500 dark:text-gray-400'>
					<thead className='bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300'>
						<tr>
							<th className='px-3 py-4'>Name</th>
							<th className='px-3 py-4'>Price</th>
							<th className='px-3 py-4'>SKU</th>
							<th className='px-3 py-4'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ?
							Array.from({ length: 5 }).map((_, i) => (
								<tr
									key={i}
									className='border-b border-gray-200 dark:border-gray-700'>
									<td className='p-4'>
										<Skeletion className='h-4 w-60' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-3/4' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-3/4' />
									</td>
									<td className='p-4 flex space-x-2'>
										<Skeletion className='h-4 w-12' />
										<Skeletion className='h-4 w-16' />
									</td>
								</tr>
							))
						: products.length > 0 ?
							products.map((product) => (
								<tr
									key={product.id}
									className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200'>
									<td className='p-4 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap'>
										{product.name}
									</td>
									<td className='p-4 dark:text-gray-300'>${product.price}</td>
									<td className='p-4 dark:text-gray-300'>{product.sku}</td>
									<td className='p-4'>
										<Link
											to={`/admin/products/${product._id}/edit`}
											className='bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600'>
											Edit
										</Link>
										<button
											onClick={() => handleDeleteProduct(product._id)}
											className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'>
											Delete
										</button>
									</td>
								</tr>
							))
						:	<tr>
								<td
									colSpan={4}
									className='p-4 text-center text-gray-500 dark:text-gray-400'>
									No Products Found
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default ProductManagement;
