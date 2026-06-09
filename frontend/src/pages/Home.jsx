import { useEffect, useState } from 'react';
import Hero from '../components/Layout/Hero';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturesSection from '../components/Products/FeaturesSection';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import axios from 'axios';
import Skeletion from '../components/Common/Skeletion';

const Home = () => {
	const dispatch = useDispatch();
	const { products, loading, error } = useSelector((state) => state.products);
	const [bestSellerProduct, setBestSellerProduct] = useState(null);

	useEffect(() => {
		// Fetch products for a specific collection
		dispatch(
			fetchProductsByFilters({
				gender: 'Women',
				category: 'Top Wear',
				limit: 8,
			}),
		);

		// Fetch Best seller product
		const fetchBestSeller = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
				);
				setBestSellerProduct(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchBestSeller();
	}, [dispatch]);

	return (
		<div>
			<Hero />
			<GenderCollectionSection />
			<NewArrivals />

			{/* Best Seller */}
			<h2 className='text-3xl text-center font-bold mb-4 dark:text-white'>
				Best Seller
			</h2>
			{bestSellerProduct && (
				<ProductDetails productId={bestSellerProduct._id} />
			)}

			<div className='container mx-auto'>
				<h2 className='text-3xl text-center font-bold dark:text-white'>
					Top Wears for Women
				</h2>
				{loading ?
					<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 '>
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								className='rounded-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 p-4'
								key={i}>
								<Skeletion className='w-full h-96 mb-4' />
								<div>
									<Skeletion className='w-3/4 h-4 mb-2' />
									<Skeletion className='w-1/4 h-4 mb-2' />
								</div>
							</div>
						))}
					</div>
				:	<ProductGrid products={products} error={error} />}
			</div>

			<FeaturedCollection />
			<FeaturesSection />
		</div>
	);
};

export default Home;
