import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';

const Topbar = () => {
	return (
		<div className='bg-zinc-900 dark:bg-zinc-950 text-zinc-300'>
			<div className='container mx-auto flex items-center justify-between py-2 px-4'>
				<div className='hidden md:flex items-center space-x-4'>
					<a href='#' className='hover:text-white transition-colors duration-200'>
						<TbBrandMeta className='h-4 w-4' />
					</a>
					<a href='#' className='hover:text-white transition-colors duration-200'>
						<IoLogoInstagram className='h-4 w-4' />
					</a>
					<a href='#' className='hover:text-white transition-colors duration-200'>
						<RiTwitterXLine className='h-4 w-4' />
					</a>
				</div>
				<div className='text-xs text-center grow tracking-wide uppercase'>
					<span>Free worldwide shipping on orders over $100</span>
				</div>
				<div className='hidden md:block'>
					<a href='tel:+84123456789' className='font-mono-brand text-xs text-zinc-400 hover:text-white transition-colors duration-200'>
						+84 123-456-789
					</a>
				</div>
			</div>
		</div>
	);
};

export default Topbar;
