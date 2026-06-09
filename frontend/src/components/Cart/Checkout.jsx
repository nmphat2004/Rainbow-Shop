import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const Checkout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { cart, loading, error } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);

	const [checkoutId, setCheckoutId] = useState(null);
	const [shippingAddress, setShippingAddress] = useState({
		firstName: '',
		lastName: '',
		address: '',
		city: '',
		postalCode: '',
		country: '',
		phone: '',
	});

	// Ensure cart is loaded before proceeding
	useEffect(() => {
		if (!cart || !cart.products || cart.products.length === 0) {
			navigate('/');
		}
	}, [cart, navigate]);

	const handleCreateCheckout = async (e) => {
		e.preventDefault();
		if (cart && cart.products.length > 0) {
			const res = await dispatch(
				createCheckout({
					checkoutItems: cart.products,
					shippingAddress,
					paymentMethod: 'Paypal',
					totalPrice: cart.totalPrice,
				})
			);
			if (res.payload && res.payload._id) {
				setCheckoutId(res.payload._id);
			}
		}
	};

	const handlePaymentSuccess = async (details) => {
		try {
			await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
				{
					paymentStatus: 'paid',
					paymentDetails: details,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			await handleFinalizedCheckout(checkoutId);
		} catch (error) {
			console.error(error);
		}
	};

	const handleFinalizedCheckout = async (checkoutId) => {
		try {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL
				}/api/checkout/${checkoutId}/finalize`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			navigate('/order-confirmation');
		} catch (error) {
			console.error(error);
		}
	};
	if (loading) return <p className='dark:text-gray-400'>Loading cart...</p>;
	if (error) return <p className='dark:text-red-400'>Error: {error}</p>;
	if (!cart || !cart.products || cart.products.length === 0) {
		return <p className='dark:text-gray-400'>Your cart is empty</p>;
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
			{/* Left Section */}
			<div className='bg-white dark:bg-gray-800 rounded-lg p-6'>
				<h2 className='text-2xl uppercase mb-6 dark:text-white'></h2>
				<form onSubmit={handleCreateCheckout}>
					<h3 className='text-lg mb-4 dark:text-white'>Contact Details</h3>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>Email</label>
						<input
							type='email'
							value={user ? user.email : ''}
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
							disabled
						/>
					</div>
					<h3 className='text-lg mb-4 dark:text-white'>Delivery</h3>
					<div className='mb-4 grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-gray-700 dark:text-gray-300'>First Name</label>
							<input
								type='text'
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										firstName: e.target.value,
									})
								}
								className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
								value={shippingAddress.firstName}
								required
							/>
						</div>
						<div>
							<label className='block text-gray-700 dark:text-gray-300'>Last Name</label>
							<input
								type='text'
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										lastName: e.target.value,
									})
								}
								className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
								value={shippingAddress.lastName}
								required
							/>
						</div>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>Address</label>
						<input
							type='text'
							onChange={(e) =>
								setShippingAddress({
									...shippingAddress,
									address: e.target.value,
								})
							}
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
							value={shippingAddress.address}
							required
						/>
					</div>
					<div className='mb-4 grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-gray-700 dark:text-gray-300'>City</label>
							<input
								type='text'
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										city: e.target.value,
									})
								}
								className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
								value={shippingAddress.city}
								required
							/>
						</div>
						<div>
							<label className='block text-gray-700 dark:text-gray-300'>Postal Code</label>
							<input
								type='text'
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										postalCode: e.target.value,
									})
								}
								className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
								value={shippingAddress.postalCode}
								required
							/>
						</div>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>Country</label>
						<input
							type='text'
							onChange={(e) =>
								setShippingAddress({
									...shippingAddress,
									country: e.target.value,
								})
							}
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
							value={shippingAddress.country}
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>Phone</label>
						<input
							type='tel'
							onChange={(e) =>
								setShippingAddress({
									...shippingAddress,
									phone: e.target.value,
								})
							}
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
							value={shippingAddress.phone}
							required
						/>
					</div>
					<div className='mt-6'>
						{!checkoutId ? (
							<button
								type='submit'
								className='w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded hover:bg-gray-800 dark:hover:bg-gray-200'>
								Continue to Payment
							</button>
						) : (
							<div>
								<h3 className='text-lg mb-4 dark:text-white'>Pay with Paypal</h3>
								{/* Paypal Component */}
								<PayPalButton
									amount={cart.totalPrice}
									onSuccess={handlePaymentSuccess}
									onError={(err) => alert('Payment failed. Try again')}
								/>
							</div>
						)}
					</div>
				</form>
			</div>
			{/* Right Section */}
			<div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
				<h3 className='text-lg mb-4 dark:text-white'> Order Summary</h3>
				<div className='border-t dark:border-gray-700 py-4 mb-4'>
					{cart.products.map((product, index) => (
						<div key={index} className='flex items-start justify-between'>
							<div className='flex items-start'>
								<img
									src={product.image}
									alt={product.name}
									className='w-20 h-24 object-cover mr-4'
								/>
								<div>
									<h3 className='text-md dark:text-gray-200'>{product.name}</h3>
									<p className='text-gray-500 dark:text-gray-400'>Size: {product.size}</p>
									<p className='text-gray-500 dark:text-gray-400'>Color: {product.color}</p>
								</div>
							</div>
							<p className='text-xl dark:text-gray-200'>${product.price?.toLocaleString()}</p>
						</div>
					))}
				</div>
				<div className='flex justify-between items-center text-lg mb-4 dark:text-gray-200'>
					<p>Subtotal</p>
					<p>${cart.totalPrice?.toLocaleString()}</p>
				</div>
				<div className='flex justify-between items-center text-lg dark:text-gray-200'>
					<p>Shipping</p>
					<p>Free</p>
				</div>
				<div className='flex items-center justify-between text-lg mt-4 border-t dark:border-gray-700 pt-4 dark:text-white font-semibold'>
					<p>Total</p>
					<p>${cart.totalPrice?.toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
};
export default Checkout;
