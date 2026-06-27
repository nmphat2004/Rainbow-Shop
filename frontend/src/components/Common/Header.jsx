import Topbar from '../Layout/Topbar';
import Navbar from './Navbar';

const Header = () => {
	return (
		<header className='sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm transition-colors duration-300'>
			<Topbar />
			<Navbar />
		</header>
	);
};

export default Header;
