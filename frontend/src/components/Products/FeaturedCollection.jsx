import { Link } from 'react-router-dom';
import featured from '../../assets/featured.webp';

const FeaturedCollection = () => {
	return (
		<section className='py-20 px-4 lg:px-6'>
			<div className='container mx-auto flex flex-col-reverse lg:flex-row items-stretch bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden'>
				{/* Left Content */}
				<div className='lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center'>
					<h2 className='text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5 leading-[1.1]'>
						Apparel made for your everyday life
					</h2>
					<p className='text-base text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed max-w-[50ch]'>
						High-quality, comfortable clothing that blends fashion and function. Designed to make you look and feel great.
					</p>
					<div>
						<Link
							to='/collections/all'
							className='inline-block bg-rainbow-red text-white px-8 py-3 rounded-lg text-sm font-medium uppercase tracking-[0.06em] transition-spring hover:scale-[0.97] active:scale-[0.95]'>
							Shop now
						</Link>
					</div>
				</div>
				{/* Right Content */}
				<div className='lg:w-1/2 overflow-hidden'>
					<img
						src={featured}
						alt='Featured clothing collection'
						className='w-full h-[300px] lg:h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]'
					/>
				</div>
			</div>
		</section>
	);
};

export default FeaturedCollection;
