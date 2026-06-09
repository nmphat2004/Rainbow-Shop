import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
	fetchProductDetails,
	updateProduct,
} from '../../redux/slices/productsSlice';
import axios from 'axios';
import { toast } from 'sonner';

const EditProductPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { selectedProduct, loading, error } = useSelector(
		(state) => state.products
	);

	const [uploading, setUploading] = useState(false);

	const [productData, setProductData] = useState({
		name: '',
		description: '',
		price: 0,
		countInStock: 0,
		sku: '',
		category: '',
		brand: '',
		sizes: [],
		colors: [],
		collections: '',
		material: '',
		gender: '',
		images: [],
	});

	useEffect(() => {
		if (id) {
			dispatch(fetchProductDetails(id));
		}
	}, [dispatch, id]);

	useEffect(() => {
		if (selectedProduct) setProductData(selectedProduct);
	}, [selectedProduct]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setProductData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleImageUpload = async (e) => {
		const files = Array.from(e.target.files);

		try {
			setUploading(true);
			const uploadPromises = files.map(async (file) => {
				const formData = new FormData();
				formData.append('image', file);

				const { data } = await axios.post(
					`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
					formData,
					{
						headers: { 'Content-Type': 'multipart/form-data' },
					}
				);
				return { url: data.imageUrl, altText: '' };
			});

			const uploadedImages = await Promise.all(uploadPromises);
			setProductData((prev) => ({
				...prev,
				images: [...prev.images, ...uploadedImages],
			}));
			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			dispatch(updateProduct({ id, productData }));
			toast.success('Update product successfully!');
			navigate('/admin/products');
		} catch (error) {
			console.error(error);
			toast.error('Update failed!');
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className='max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-md transition-colors duration-300'>
			<h2 className='text-3xl font-bold mb-6 dark:text-white'>Edit Product</h2>
			<form onSubmit={handleSubmit}>
				{/* Name */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Product Name</label>
					<input
						type='text'
						name='name'
						value={productData.name}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
						required
					/>
				</div>

				{/* Description */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Description</label>
					<textarea
						name='description'
						value={productData.description}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
						rows={4}
						required
					/>
				</div>

				{/* Price */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Price</label>
					<input
						type='number'
						name='price'
						value={productData.price}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Count In Stock */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Count In Stock</label>
					<input
						type='number'
						name='countInStock'
						value={productData.countInStock}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* SKU */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>SKU</label>
					<input
						type='text'
						name='sku'
						value={productData.sku}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Category */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Category</label>
					<input
						type='text'
						name='category'
						value={productData.category}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Brand */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Brand</label>
					<input
						type='text'
						name='brand'
						value={productData.brand}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Sizes */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>
						Size (comma-separated)
					</label>
					<input
						type='text'
						name='sizes'
						value={productData.sizes?.join(',')}
						onChange={(e) =>
							setProductData({
								...productData,
								sizes: e.target.value.split(',').map((size) => size.trim()),
							})
						}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Colors */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>
						Colors (comma-separated)
					</label>
					<input
						type='text'
						name='colors'
						value={productData.colors?.join(',')}
						onChange={(e) =>
							setProductData({
								...productData,
								colors: e.target.value.split(',').map((color) => color.trim()),
							})
						}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Collections */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Collections</label>
					<input
						type='text'
						name='collections'
						value={productData.collections}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Material */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Material</label>
					<input
						type='text'
						name='material'
						value={productData.material}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Gender */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Gender</label>
					<input
						type='text'
						name='gender'
						value={productData.gender}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
					/>
				</div>

				{/* Image Upload */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Upload Images</label>
					<input
						type='file'
						onChange={handleImageUpload}
						multiple
						className='mb-4'
						accept='image/*'
					/>
					{uploading && <p className='text-blue-500'>Uploading images...</p>}
					<div className='flex flex-wrap gap-4 mt-4'>
						{productData.images.map((image, index) => (
							<div key={index} className='relative group'>
								<img
									src={image.url}
									alt={image.altText || 'Product Image'}
									className='w-20 h-20 object-cover rounded-md shadow-md'
								/>
								<button
									type='button'
									onClick={() => {
										setProductData((prev) => ({
											...prev,
											images: prev.images.filter((_, i) => i !== index),
										}));
									}}
									className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4'
										viewBox='0 0 20 20'
										fill='currentColor'>
										<path
											fillRule='evenodd'
											d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>
				<button
					type='submit'
					className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'>
					Update Product
				</button>
			</form>
		</div>
	);
};
export default EditProductPage;
