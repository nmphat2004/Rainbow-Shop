import Topbar from '../Layout/Topbar';
import Navbar from './Navbar';

const Header = () => {
	return (
		<header className='sticky top-0 z-100 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300'>
			<Topbar />
			<Navbar />
		</header>
	);
};

export default Header;
