import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createProduct } from '../../redux/slices/adminProductSlice';
import { toast } from 'sonner';
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS = [
	'Red',
	'Blue',
	'Black',
	'Green',
	'Yellow',
	'Gray',
	'White',
	'Pink',
	'Beige',
	'Navy',
];

const CreateProductPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.adminProducts);

	const [uploading, setUploading] = useState(false);
	const [customSize, setCustomSize] = useState('');
	const [customColor, setCustomColor] = useState('');

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

	const handleSizeToggle = (size) => {
		setProductData((prev) => {
			const sizes = prev.sizes.includes(size)
				? prev.sizes.filter((s) => s !== size)
				: [...prev.sizes, size];
			return { ...prev, sizes };
		});
	};

	const handleAddCustomSize = (e) => {
		e.preventDefault();
		if (customSize.trim() !== '') {
			const sizeToAdd = customSize.trim();
			if (!productData.sizes.includes(sizeToAdd)) {
				setProductData((prev) => ({
					...prev,
					sizes: [...prev.sizes, sizeToAdd],
				}));
			}
			setCustomSize('');
		}
	};

	const handleColorToggle = (color) => {
		setProductData((prev) => {
			const colors = prev.colors.includes(color)
				? prev.colors.filter((c) => c !== color)
				: [...prev.colors, color];
			return { ...prev, colors };
		});
	};

	const handleAddCustomColor = (e) => {
		e.preventDefault();
		if (customColor.trim() !== '') {
			const colorToAdd = customColor.trim();
			if (!productData.colors.includes(colorToAdd)) {
				setProductData((prev) => ({
					...prev,
					colors: [...prev.colors, colorToAdd],
				}));
			}
			setCustomColor('');
		}
	};

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
		<div className='max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-md transition-colors duration-300'>
			<h2 className='text-3xl font-bold mb-6 dark:text-white'>Add Product</h2>
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

				{/* Discount Price */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Discount Price</label>
					<input
						type='number'
						name='discountPrice'
						value={productData.discountPrice}
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
					<label className='block font-semibold mb-2 dark:text-gray-300'>Sizes</label>
					<div className='flex flex-wrap gap-2 mb-3'>
						{AVAILABLE_SIZES.map((size) => {
							const isSelected = productData.sizes.includes(size);
							return (
								<button
									key={size}
									type='button'
									onClick={() => handleSizeToggle(size)}
									className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-all ${
										isSelected
											? 'bg-blue-600 text-white border-blue-600 shadow-sm'
											: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
									}`}
								>
									{size}
								</button>
							);
						})}
					</div>

					<div className='flex gap-2 mb-3 max-w-sm'>
						<input
							type='text'
							placeholder='Add custom size (e.g. 38, 39, XL)'
							value={customSize}
							onChange={(e) => setCustomSize(e.target.value)}
							className='flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2 text-sm'
						/>
						<button
							type='button'
							onClick={handleAddCustomSize}
							className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition'
						>
							Add
						</button>
					</div>

					{productData.sizes.length > 0 && (
						<div className='flex flex-wrap gap-2 mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md'>
							<span className='text-xs text-gray-500 dark:text-gray-400 w-full mb-1'>Selected:</span>
							{productData.sizes.map((size) => (
								<span
									key={size}
									className='inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full'
								>
									{size}
									<button
										type='button'
										onClick={() => handleSizeToggle(size)}
										className='text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-bold focus:outline-none'
									>
										&times;
									</button>
								</span>
							))}
						</div>
					)}
				</div>

				{/* Colors */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Colors</label>
					<div className='flex flex-wrap gap-3 mb-3'>
						{AVAILABLE_COLORS.map((color) => {
							const isSelected = productData.colors.includes(color);
							return (
								<button
									key={color}
									type='button'
									onClick={() => handleColorToggle(color)}
									title={color}
									className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${
										isSelected
											? 'border-blue-600 ring-2 ring-blue-600/30 scale-110 shadow-md'
											: 'border-gray-300 dark:border-gray-600 hover:scale-105'
									}`}
									style={{ backgroundColor: color.toLowerCase() }}
								>
									{isSelected && (
										<svg
											className={`w-4 h-4 ${
												['White', 'Yellow'].includes(color) ? 'text-black' : 'text-white'
											}`}
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='3'
												d='M5 13l4 4L19 7'
											/>
										</svg>
									)}
								</button>
							);
						})}
					</div>

					<div className='flex gap-2 mb-3 max-w-sm'>
						<input
							type='text'
							placeholder='Add custom color (e.g. Teal, Olive)'
							value={customColor}
							onChange={(e) => setCustomColor(e.target.value)}
							className='flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2 text-sm'
						/>
						<button
							type='button'
							onClick={handleAddCustomColor}
							className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition'
						>
							Add
						</button>
					</div>

					{productData.colors.length > 0 && (
						<div className='flex flex-wrap gap-2 mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md'>
							<span className='text-xs text-gray-500 dark:text-gray-400 w-full mb-1'>Selected:</span>
							{productData.colors.map((color) => (
								<span
									key={color}
									className='inline-flex items-center gap-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-300 dark:border-gray-600'
								>
									<span
										className='w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600'
										style={{ backgroundColor: color.toLowerCase() }}
									/>
									{color}
									<button
										type='button'
										onClick={() => handleColorToggle(color)}
										className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-bold focus:outline-none'
									>
										&times;
									</button>
								</span>
							))}
						</div>
					)}
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
					<select
						name='gender'
						value={productData.gender}
						onChange={handleChange}
						className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md p-2'
						required
					>
						<option value=''>Select Gender</option>
						<option value='Men'>Men</option>
						<option value='Women'>Women</option>
						<option value='Unisex'>Unisex</option>
					</select>
				</div>

				{/* isFeatured */}
				<div className='mb-6'>
					<label className='block font-semibold mb-2 dark:text-gray-300'>Feature</label>
					<div className='flex gap-4'>
						<label className='flex items-center gap-2 dark:text-gray-300'>
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
					<label className='block font-semibold mb-2 dark:text-gray-300'>Publish</label>
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
					{loading ? 'Creating' : 'Create Product'}
				</button>
			</form>
		</div>
	);
};
export default CreateProductPage;
