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
		<div className='min-h-screen flex flex-col md:flex-row relative dark:bg-gray-900'>
			{/* Mobile Toggle Button */}
			<div className='flex md:hidden p-4 bg-gray-900 text-white z-20'>
				<button onClick={toggleSidebar}>
					<FaBars size={24} />
				</button>
				<h1 className='ml-4 text-xl font-medium'>Admin Dashboard</h1>
			</div>

			{/* Overlay for mobile sidebar */}
			{isSidebarOpen && (
				<div
					onClick={toggleSidebar}
					className='fixed inset-0 z-10 bg-black/50 md:hidden cursor-pointer'></div>
			)}

			{/* Sidebar */}
			<div
				className={`bg-gray-900 w-64 min-h-screen dark:border-r dark:border-r-gray-200 text-white absolute md:relative transform ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
				{/* Sidebar Component */}
				<AdminSidebar />
			</div>

			{/* Main content */}
			<div className='grow p-6 overflow-auto dark:text-gray-200'>
				<Outlet />
			</div>
		</div>
	);
};
export default AdminLayout;
