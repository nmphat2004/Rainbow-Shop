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
			<section className='py-20 px-4 lg:px-6'>
				<div className='container mx-auto'>
					<h2 className='text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-center mb-2'>
						Best Seller
					</h2>
				</div>
			</section>
			{bestSellerProduct && (
				<ProductDetails productId={bestSellerProduct._id} />
			)}

			<section className='container mx-auto px-4 lg:px-6 py-20'>
				<h2 className='text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8'>
					Top Wears for Women
				</h2>
				{loading ?
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8'>
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i}>
								<Skeletion className='w-full h-96 mb-3' />
								<Skeletion className='w-3/4 h-4 mb-2' />
								<Skeletion className='w-1/4 h-4' />
							</div>
						))}
					</div>
					: <ProductGrid products={products} error={error} />}
			</section>

			<FeaturedCollection />
			<FeaturesSection />
		</div>
	);
};

export default Home;
