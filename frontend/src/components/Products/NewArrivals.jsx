import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewArrivals = () => {
	const scrollRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(false);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const [loading, setLoading] = useState(true);
	const [newArrivals, setNewArrivals] = useState([]);

	useEffect(() => {
		const fetchNewArrivals = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`,
				);
				setNewArrivals(response.data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchNewArrivals();
	}, []);

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setStartX(e.pageX - scrollRef.current.offsetLeft);
		setScrollLeft(scrollRef.current.scrollLeft);
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = x - startX;
		scrollRef.current.scrollLeft = scrollLeft - walk;
	};

	const handleMouseUpOrLeave = () => {
		setIsDragging(false);
	};

	const scroll = (direction) => {
		const scrollAmount = direction === 'left' ? -300 : 300;
		scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
	};

	const updateScrollButtons = () => {
		const container = scrollRef.current;

		if (container) {
			const leftScroll = container.scrollLeft;
			const rightScrollable =
				container.scrollWidth > leftScroll + container.clientWidth;

			setCanScrollLeft(leftScroll > 0);
			setCanScrollRight(rightScrollable);
		}
	};

	useEffect(() => {
		const container = scrollRef.current;
		if (container) {
			container.addEventListener('scroll', updateScrollButtons);
			updateScrollButtons();
			return () => container.removeEventListener('scroll', updateScrollButtons);
		}
	}, [newArrivals]);

	return (
		<section className='py-20 px-4 lg:px-6'>
			<div className='container mx-auto mb-8'>
				<div className='flex items-end justify-between'>
					<div>
						<h2 className='text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
							New Arrivals
						</h2>
						<p className='text-zinc-500 dark:text-zinc-400 mt-2 text-base max-w-[50ch]'>
							The latest styles, freshly added to keep your wardrobe current.
						</p>
					</div>

					{/* Scroll Buttons */}
					<div className='hidden md:flex items-center space-x-2'>
						<button
							onClick={() => scroll('left')}
							disabled={!canScrollLeft}
							className={`p-2 rounded-lg border transition-all duration-200 ${canScrollLeft
								? 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
								: 'border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
								}`}>
							<FiChevronLeft className='text-xl' />
						</button>
						<button
							onClick={() => scroll('right')}
							disabled={!canScrollRight}
							className={`p-2 rounded-lg border transition-all duration-200 ${canScrollRight
								? 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
								: 'border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
								}`}>
							<FiChevronRight className='text-xl' />
						</button>
					</div>
				</div>
			</div>

			{/* Scrollable Content */}
			<div
				ref={scrollRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUpOrLeave}
				onMouseLeave={handleMouseUpOrLeave}
				className={`container mx-auto overflow-x-auto no-scrollbar flex space-x-5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
					}`}>
				{loading
					? Array.from({ length: 4 }).map((_, i) => (
						<div className='min-w-[280px] sm:min-w-[300px] lg:min-w-[320px]' key={i}>
							<div className='skeleton-shimmer rounded-xl w-full h-[380px] mb-3' />
							<div className='skeleton-shimmer rounded-md w-3/4 h-4 mb-2' />
							<div className='skeleton-shimmer rounded-md w-1/4 h-4' />
						</div>
					))
					: newArrivals.map((product) => (
						<div
							className='min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] group'
							key={product._id}>
							<Link to={`product/${product._id}`} className='block' draggable='false'>
								<div className='overflow-hidden rounded-xl mb-3'>
									<img
										src={product.images[0]?.url}
										alt={product.images[0]?.altText || product.name}
										className='w-full h-[380px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]'
										draggable='false'
									/>
								</div>
								<h4 className='text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate'>
									{product.name}
								</h4>
								<p className='mt-1 font-mono-brand text-sm text-zinc-500 dark:text-zinc-400'>
									${product.price.toLocaleString()}
								</p>
							</Link>
						</div>
					))
				}
			</div>
		</section>
	);
};

export default NewArrivals;
