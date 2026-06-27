import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	useEffect(() => {
		isSidebarOpen ?
			(document.body.style.overflow = 'hidden')
		:	(document.body.style.overflow = 'auto');
		return () => (document.body.style.overflow = 'auto');
	}, [isSidebarOpen]);

	return (
		<div className='min-h-screen flex flex-col md:flex-row relative bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300'>
			{/* Mobile Toggle Button */}
			<div className='flex md:hidden items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-20 text-zinc-900 dark:text-zinc-100'>
				<button onClick={toggleSidebar} className='p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg active:scale-95 transition-all'>
					<FaBars size={20} className='text-zinc-600 dark:text-zinc-400' />
				</button>
				<h1 className='text-lg font-bold tracking-tight'>Control Panel</h1>
				<div className='w-5' /> {/* Spacer to center title */}
			</div>

			{/* Overlay for mobile sidebar */}
			{isSidebarOpen && (
				<div
					onClick={toggleSidebar}
					className='fixed inset-0 z-10 bg-black/25 backdrop-blur-sm md:hidden cursor-pointer'></div>
			)}

			{/* Sidebar */}
			<div
				className={`bg-white dark:bg-zinc-900 w-64 min-h-screen border-r border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 absolute md:relative transform ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
				{/* Sidebar Component */}
				<AdminSidebar />
			</div>

			{/* Main content */}
			<div className='grow p-6 md:p-8 lg:p-10 overflow-auto'>
				<Outlet />
			</div>
		</div>
	);
};
export default AdminLayout;
