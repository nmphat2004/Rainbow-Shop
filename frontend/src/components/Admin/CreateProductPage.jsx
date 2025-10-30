import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createProduct } from '../../redux/slices/adminProductSlice';
import { toast } from 'sonner';

const CreateProductPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.adminProducts);

	const [uploading, setUploading] = useState(false);

	const [productData, setProductData] = useState({
		name: '',
		description: '',
		price: 0,
		discountPrice: 0,
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
		isFeatured: false,
		isPublished: true,
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		setProductData((prevData) => ({
			...prevData,
			[name]:
				type === 'checkbox'
					? checked
					: value === 'true'
					? true
					: value === 'false'
					? false
					: value,
		}));
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);

		try {
			setUploading(true);
			const { data } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			);
			setProductData((prev) => ({
				...prev.images,
				images: [{ url: data.imageUrl, altText: '' }],
			}));
			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (['Men', 'Women', 'Unisex'].includes(productData.gender)) {
			dispatch(createProduct(productData));
			navigate('/admin/products');
		} else {
			toast.error('Gender invalid');
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
			<h2 className='text-3xl font-bold mb-6'>Add Product</h2>
			<form onSubmit={handleSubmit}>
				{/* Name */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Product Name</label>
					<input
						type='text'
						name='name'
						value={productData.name}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
						required
					/>
				</div>

				{/* Description */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Description</label>
					<textarea
						name='description'
						value={productData.description}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
						rows={4}
						required
					/>
				</div>

				{/* Price */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Price</label>
					<input
						type='number'
						name='price'
						value={productData.price}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Discount Price */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Discount Price</label>
					<input
						type='number'
						name='discountPrice'
						value={productData.discountPrice}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Count In Stock */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Count In Stock</label>
					<input
						type='number'
						name='countInStock'
						value={productData.countInStock}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* SKU */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>SKU</label>
					<input
						type='text'
						name='sku'
						value={productData.sku}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Category */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Category</label>
					<input
						type='text'
						name='category'
						value={productData.category}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Brand */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Brand</label>
					<input
						type='text'
						name='brand'
						value={productData.brand}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Sizes */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>
						Size (comma-separated)
					</label>
					<input
						type='text'
						name='sizes'
						value={productData.sizes.join(',')}
						onChange={(e) =>
							setProductData({
								...productData,
								sizes: e.target.value.split(',').map((size) => size.trim()),
							})
						}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Colors */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>
						Colors (comma-separated)
					</label>
					<input
						type='text'
						name='colors'
						value={productData.colors.join(',')}
						onChange={(e) =>
							setProductData({
								...productData,
								colors: e.target.value.split(',').map((color) => color.trim()),
							})
						}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Collections */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Collections</label>
					<input
						type='text'
						name='collections'
						value={productData.collections}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Material */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Material</label>
					<input
						type='text'
						name='material'
						value={productData.material}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Gender */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Gender</label>
					<input
						type='text'
						name='gender'
						value={productData.gender}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
					{productData.gender.trim() !== '' &&
						!['Men', 'Women', 'Unisex'].includes(productData.gender) && (
							<p className='text-red-500 mt-1'>
								Gender invalid — only “Men”, “Women”, or “Unisex” allowed.
							</p>
						)}
				</div>

				{/* isFeatured */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Feature</label>
					<div className='flex gap-4'>
						<label className='flex items-center gap-2'>
							<input
								type='radio'
								name='isFeatured'
								value='true'
								checked={productData.isFeatured === true}
								onChange={handleChange}
							/>
							Yes
						</label>

						<label className='flex items-center gap-2'>
							<input
								type='radio'
								name='isFeatured'
								value='false'
								checked={productData.isFeatured === false}
								onChange={handleChange}
							/>
							No
						</label>
					</div>
				</div>

				{/* isPublished */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Publish</label>
					<div className='flex gap-4'>
						<label className='flex items-center gap-2'>
							<input
								type='radio'
								name='isPublished'
								value='true'
								checked={productData.isPublished === true}
								onChange={handleChange}
							/>
							Yes
						</label>

						<label className='flex items-center gap-2'>
							<input
								type='radio'
								name='isPublished'
								value='false'
								checked={productData.isPublished === false}
								onChange={handleChange}
							/>
							No
						</label>
					</div>
				</div>

				{/* Image Upload */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2'>Upload Image</label>
					<input type='file' onChange={handleImageUpload} />
					{uploading && <p>Uploading image...</p>}
					<div className='flex gap-4 mt-4'>
						{productData.images.map((image, index) => (
							<div key={index}>
								<img
									src={image.url}
									alt={image.altText || 'Product Image'}
									className='w-20 h-20 object-cover rounded-md shadow-md'
								/>
							</div>
						))}
					</div>
				</div>
				<button
					type='submit'
					className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'>
					{loading ? 'Creating' : 'Create Product'}
				</button>
			</form>
		</div>
	);
};
export default CreateProductPage;
