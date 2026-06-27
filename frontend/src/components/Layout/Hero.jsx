import { Link } from 'react-router-dom';
import heroImg from '../../assets/hero.webp';

const Hero = () => {
	return (
		<section className='container mx-auto px-4 lg:px-6'>
			<div className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center py-12 md:py-16 lg:py-20'>
				{/* Left: Typography block */}
				<div className='md:col-span-5 flex flex-col justify-center order-2 md:order-1'>
					<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-zinc-900 dark:text-zinc-50 mb-5'>
						Vacation<br />Ready
					</h1>
					<p className='text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[45ch] mb-8'>
						Explore our vacation-ready outfits with fast worldwide shipping.
					</p>
					<div>
						<Link
							to='/collections/all'
							className='inline-block bg-rainbow-red text-white px-8 py-3 rounded-lg text-sm font-medium uppercase tracking-[0.06em] transition-spring hover:scale-[0.97] active:scale-[0.95]'>
							Shop now
						</Link>
					</div>
				</div>
				{/* Right: Visual frame */}
				<div className='md:col-span-7 order-1 md:order-2'>
					<div className='overflow-hidden rounded-xl'>
						<img
							src={heroImg}
							alt='Vacation-ready fashion collection'
							className='w-full h-[340px] md:h-[500px] lg:h-[580px] object-cover transition-transform duration-700 ease-out hover:scale-[1.03]'
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
