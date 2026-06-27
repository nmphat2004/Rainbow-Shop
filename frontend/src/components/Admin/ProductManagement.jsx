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
		<div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
					Product Management
				</h2>
				<Link
					to={`/admin/products/create`}
					className='bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer'>
					Create Product
				</Link>
			</div>

			<div className='border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm'>
				<table className='min-w-full text-left text-zinc-500 dark:text-zinc-400'>
					<thead className='bg-zinc-50 dark:bg-zinc-900/50 text-[11px] font-mono-brand uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800'>
						<tr>
							<th className='px-6 py-4'>Product Details</th>
							<th className='px-6 py-4'>Price</th>
							<th className='px-6 py-4'>SKU</th>
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
										<Skeletion className='h-4 w-16' />
									</td>
									<td className='px-6 py-4'>
										<Skeletion className='h-4 w-24' />
									</td>
									<td className='px-6 py-4 text-right'>
										<Skeletion className='h-4 w-24 ml-auto' />
									</td>
								</tr>
							))
						: products.length > 0 ?
							products.map((p) => (
								<tr
									key={p.id || p._id}
									className='hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-200'>
									<td className='px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200 whitespace-nowrap text-sm'>
										{p.name}
									</td>
									<td className='px-6 py-4 dark:text-zinc-300 text-sm font-mono-brand'>${p.price}</td>
									<td className='px-6 py-4 dark:text-zinc-300 text-sm font-mono-brand'>{p.sku || 'N/A'}</td>
									<td className='px-6 py-4 text-right whitespace-nowrap text-sm'>
										<Link
											to={`/admin/products/${p._id}/edit`}
											className='text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mr-4 hover:underline'>
											Edit
										</Link>
										<button
											onClick={() => handleDeleteProduct(p._id)}
											className='text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-rainbow-red transition-colors cursor-pointer hover:underline'>
											Delete
										</button>
									</td>
								</tr>
							))
						:	<tr>
								<td
									colSpan={4}
									className='px-6 py-8 text-center text-zinc-400 dark:text-zinc-500 text-sm'>
									No products found.
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
