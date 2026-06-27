import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { 
	PiUsers, 
	PiPackage, 
	PiReceipt, 
	PiStorefront, 
	PiSignOut 
} from 'react-icons/pi';

const AdminSidebar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearCart());
		navigate('/');
	};

	return (
		<div className='p-6 sticky top-0 z-10 flex flex-col justify-between h-[calc(100vh-2rem)]'>
			<div>
				<div className='mb-8 px-2'>
					<Link to='/' className='font-mono-brand text-lg font-bold tracking-[0.15em] uppercase text-zinc-900 dark:text-zinc-100'>
						Rainbow
					</Link>
					<span className='block text-[10px] font-mono-brand text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1'>
						Admin Panel
					</span>
				</div>

				<nav className='flex flex-col space-y-1.5'>
					<NavLink
						to='/admin/users'
						className={({ isActive }) =>
							`relative pl-6 pr-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all ${
								isActive
									? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
									: 'text-zinc-500 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 hover:text-zinc-900 dark:hover:text-zinc-100'
							}`
						}>
						{({ isActive }) => (
							<>
								{isActive && (
									<span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-rainbow-red rounded-full' />
								)}
								<PiUsers size={18} className={isActive ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'} />
								<span>Users</span>
							</>
						)}
					</NavLink>
					<NavLink
						to='/admin/products'
						className={({ isActive }) =>
							`relative pl-6 pr-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all ${
								isActive
									? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
									: 'text-zinc-500 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 hover:text-zinc-900 dark:hover:text-zinc-100'
							}`
						}>
						{({ isActive }) => (
							<>
								{isActive && (
									<span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-rainbow-red rounded-full' />
								)}
								<PiPackage size={18} className={isActive ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'} />
								<span>Products</span>
							</>
						)}
					</NavLink>
					<NavLink
						to='/admin/orders'
						className={({ isActive }) =>
							`relative pl-6 pr-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all ${
								isActive
									? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
									: 'text-zinc-500 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 hover:text-zinc-900 dark:hover:text-zinc-100'
							}`
						}>
						{({ isActive }) => (
							<>
								{isActive && (
									<span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-rainbow-red rounded-full' />
								)}
								<PiReceipt size={18} className={isActive ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'} />
								<span>Orders</span>
							</>
						)}
					</NavLink>
					<NavLink
						to='/'
						className={({ isActive }) =>
							`relative pl-6 pr-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all ${
								isActive
									? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
									: 'text-zinc-500 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 hover:text-zinc-900 dark:hover:text-zinc-100'
							}`
						}>
						{({ isActive }) => (
							<>
								{isActive && (
									<span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-rainbow-red rounded-full' />
								)}
								<PiStorefront size={18} className={isActive ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'} />
								<span>Shop</span>
							</>
						)}
					</NavLink>
				</nav>
			</div>

			<div className='pt-6 border-t border-zinc-200 dark:border-zinc-800'>
				<button
					onClick={handleLogout}
					className='w-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer'>
					<PiSignOut size={16} />
					<span>Logout</span>
				</button>
			</div>
		</div>
	);
};

export default AdminSidebar;
