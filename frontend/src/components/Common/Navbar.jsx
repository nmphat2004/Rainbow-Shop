import { Link } from 'react-router-dom';
import {
	HiBars3BottomRight,
	HiOutlineShoppingBag,
	HiOutlineUser,
} from 'react-icons/hi2';
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [navDrawerOpen, setNavDrawerOpen] = useState(false);
	const { cart } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);

	const cartItemCount =
		cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
		0;

	const toggleNavDrawer = () => {
		setNavDrawerOpen(!navDrawerOpen);
	};

	const toggleCartDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<>
			<nav className='container mx-auto flex items-center justify-between h-16 max-h-[80px] px-6'>
				{/* Logo */}
				<div>
					<Link to='/' className='font-mono-brand text-lg font-bold tracking-[0.15em] uppercase text-zinc-900 dark:text-zinc-100'>
						Rainbow
					</Link>
				</div>
				{/* Navigation Links */}
				<div className='hidden md:flex items-center space-x-8'>
					<Link
						to='/collections/all?gender=Men'
						className='text-[13px] uppercase tracking-[0.08em] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200'>
						Men
					</Link>
					<Link
						to='/collections/all?gender=Women'
						className='text-[13px] uppercase tracking-[0.08em] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200'>
						Women
					</Link>
					<Link
						to='/collections/all?category=Top Wear'
						className='text-[13px] uppercase tracking-[0.08em] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200'>
						Top Wear
					</Link>
					<Link
						to='/collections/all?category=Bottom Wear'
						className='text-[13px] uppercase tracking-[0.08em] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200'>
						Bottom Wear
					</Link>
				</div>
				{/* Icons */}
				<div className='flex items-center space-x-5'>
					{user && user?.role === 'admin' && (
						<Link
							to='/admin'
							className='block bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1 rounded-lg text-xs font-medium text-white tracking-wide uppercase transition-spring hover:scale-[0.97] active:scale-[0.95]'>
							Admin
						</Link>
					)}

					<ThemeToggle />

					<Link to='/profile' className='text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200'>
						<HiOutlineUser className='h-5 w-5' />
					</Link>

					<button
						onClick={toggleCartDrawer}
						className='relative text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200'>
						<HiOutlineShoppingBag className='h-5 w-5' />
						{cartItemCount > 0 && (
							<span className='absolute -top-2 -right-2 bg-rainbow-red text-white text-[10px] font-mono-brand font-bold rounded-full w-5 h-5 flex items-center justify-center'>
								{cartItemCount}
							</span>
						)}
					</button>

					{/* Search */}
					<div className='overflow-hidden'>
						<SearchBar />
					</div>

					<button className='md:hidden' onClick={toggleNavDrawer}>
						<HiBars3BottomRight className='h-5 w-5 text-zinc-600 dark:text-zinc-400' />
					</button>
				</div>
			</nav>
			{/* Cart Drawer */}
			<CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

			{/* Mobile Navigation Overlay */}
			{navDrawerOpen && (
				<div
					className='fixed inset-0 bg-black/30 z-40'
					onClick={toggleNavDrawer}
				/>
			)}

			{/* Mobile Navigation */}
			<div
				className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
					}`}>
				<div className='flex justify-end p-5'>
					<button onClick={toggleNavDrawer} className='text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors'>
						<IoMdClose className='h-6 w-6' />
					</button>
				</div>
				<div className='px-6 pt-2'>
					<nav className='space-y-6'>
						<Link
							to='/collections/all?gender=Men'
							onClick={toggleNavDrawer}
							className='block text-lg font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors'>
							Men
						</Link>
						<Link
							to='/collections/all?gender=Women'
							onClick={toggleNavDrawer}
							className='block text-lg font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors'>
							Women
						</Link>
						<Link
							to='/collections/all?category=Top Wear'
							onClick={toggleNavDrawer}
							className='block text-lg font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors'>
							Top Wear
						</Link>
						<Link
							to='/collections/all?category=Bottom Wear'
							onClick={toggleNavDrawer}
							className='block text-lg font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors'>
							Bottom Wear
						</Link>
					</nav>
				</div>
			</div>
		</>
	);
};

export default Navbar;
