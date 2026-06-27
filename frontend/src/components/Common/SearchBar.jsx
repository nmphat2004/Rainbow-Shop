import { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	fetchProductsByFilters,
	setFilters,
} from '../../redux/slices/productsSlice';

const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		dispatch(setFilters({ search: searchTerm }));
		dispatch(fetchProductsByFilters({ search: searchTerm }));
		navigate(`/collections/all?search=${searchTerm}`);
		setIsOpen(!isOpen);
		setSearchTerm('');
	};

	return (
		<div
			className={`flex items-center justify-center w-full transition-all duration-300 ease-out ${isOpen ? 'absolute top-0 left-0 w-full bg-white dark:bg-zinc-950 h-24 z-50' : 'w-auto'
				}`}>
			{isOpen ? (
				<form
					onSubmit={handleSearch}
					className='relative flex items-center justify-center w-full'>
					<div className='relative w-1/2'>
						<input
							type='text'
							placeholder='Search products'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 px-4 py-2.5 pl-4 pr-12 rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 w-full text-sm placeholder:text-zinc-500 transition-colors duration-200'
							autoFocus
						/>
						{/* search icon */}
						<button
							type='submit'
							className='absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors'>
							<HiMagnifyingGlass className='h-5 w-5' />
						</button>
					</div>
					{/* close icon */}
					<button
						type='button'
						onClick={() => setIsOpen(!isOpen)}
						className='absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors'>
						<HiMiniXMark className='h-6 w-6' />
					</button>
				</form>
			) : (
				<button type='button' onClick={() => setIsOpen(!isOpen)} className='text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200'>
					<HiMagnifyingGlass className='w-5 h-5' />
				</button>
			)}
		</div>
	);
};

export default SearchBar;
