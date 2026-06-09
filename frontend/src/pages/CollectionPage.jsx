import { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import Skeletion from '../components/Common/Skeletion';

const CollectionPage = () => {
	const sidebarRef = useRef(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { collection } = useParams();
	const [searchParams] = useSearchParams();
	const dispatch = useDispatch();
	const { products, loading, error } = useSelector((state) => state.products);
	const queryParams = Object.fromEntries([...searchParams]);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleClickOutside = (e) => {
		// Close sidebar if click outside
		if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
			setIsSidebarOpen(false);
		}
	};

	useEffect(() => {
		// Add event listener for clicks
		document.addEventListener('mousedown', handleClickOutside);

		// Clear event listener on unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		dispatch(
			fetchProductsByFilters({
				collection,
				...queryParams,
			}),
		);
	}, [dispatch, searchParams, collection]);

	return (
		<div className='flex flex-col lg:flex-row'>
			{/* Mobile filter button */}
			<button
				onClick={toggleSidebar}
				className='lg:hidden border dark:border-gray-600 p-2 flex justify-center items-center dark:text-gray-300'>
				<FaFilter className='mr-2' /> Filters
			</button>

			{/* Filter Sidebar */}
			<div
				ref={sidebarRef}
				className={`${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} sticky inset-y-0 z-50 left-0 w-64 no-scrollbar bg-white dark:bg-gray-800 overflow-y-auto transition-transform duration-300 lg:sticky lg:top-28 lg:h-[calc(100vh-120px)] lg:translate-x-0`}>
				<FilterSidebar />
			</div>

			<div className='grow p-4'>
				<h2 className='text-2xl uppercase mb-4 dark:text-white'>
					All Collections
				</h2>

				{/* Sort Options */}
				<SortOptions />

				{/* Product Grid */}
				{loading ?
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className='rounded-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 p-4'>
								<Skeletion className='w-full h-96 mb-4' />
								<div>
									<Skeletion className='w-3/4 h-4 mb-2' />
									<Skeletion className='w-1/4 h-3 mb-2' />
								</div>
							</div>
						))}
					</div>
				:	<ProductGrid products={products} error={error} />}
			</div>
		</div>
	);
};
export default CollectionPage;
