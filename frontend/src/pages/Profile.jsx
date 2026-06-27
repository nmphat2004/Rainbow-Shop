import { useDispatch, useSelector } from 'react-redux';
import MyOrdersPage from './MyOrdersPage';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

const Profile = () => {
	const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearCart());
		navigate('/login');
	};

	const getInitials = (name) => {
		if (!name) return 'U';
		const parts = name.trim().split(/\s+/);
		if (parts.length > 1) {
			return (parts[0][0] + parts[1][0]).toUpperCase();
		}
		return name[0].toUpperCase();
	};

	return (
		<div className='min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300'>
			<div className='grow container mx-auto p-4 md:p-6 lg:p-8'>
				<div className='flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0'>
					{/* Left Section */}
					<div className='w-full md:w-1/3 lg:w-1/4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl p-6'>
						<div className='flex flex-col items-center md:items-start text-center md:text-left'>
							<div className='w-16 h-16 rounded-xl bg-linear-to-br from-zinc-200 to-zinc-150 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center mb-4 shadow-inner'>
								<span className='font-mono-brand text-lg font-bold text-zinc-700 dark:text-zinc-300'>
									{getInitials(user?.name)}
								</span>
							</div>
							<h1 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1 leading-tight'>
								{user?.name}
							</h1>
							<p className='font-mono-brand text-xs text-zinc-400 dark:text-zinc-500 mb-6'>
								{user?.email}
							</p>
							<button
								onClick={handleLogout}
								className='w-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer'>
								Logout
							</button>
						</div>
					</div>
					{/* Right Section: Orders Table */}
					<div className='w-full md:w-2/3 lg:w-3/4'>
						<MyOrdersPage />
					</div>
				</div>
			</div>
		</div>
	);
};
export default Profile;
