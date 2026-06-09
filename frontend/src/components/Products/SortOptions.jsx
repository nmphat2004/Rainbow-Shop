import { useSearchParams } from 'react-router-dom';

const SortOptions = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const handleSortChange = (e) => {
		const sortBy = e.target.value;
		searchParams.set('sortBy', sortBy);
		setSearchParams(searchParams);
	};

	return (
		<div className='mb-4 flex items-center justify-end'>
			<select
				id='sort'
				onChange={handleSortChange}
				value={searchParams.get('sortBy') || ''}
				className='border dark:border-gray-600 p-2 rounded-md focus:outline-none dark:bg-gray-800 dark:text-gray-200'>
				<option value=''>Default</option>
				<option value='priceAsc'>Price: Low to High</option>
				<option value='priceDesc'>Price: High to Low</option>
				<option value='popularity'>Popularity</option>
			</select>
		</div>
	);
};
export default SortOptions;
