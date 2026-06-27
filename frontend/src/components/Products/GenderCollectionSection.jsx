import { Link } from 'react-router-dom';
import menCollectionImage from '../../assets/men-collection.webp';
import womenCollectionImage from '../../assets/women-collection.webp';

const GenderCollectionSection = () => {
	return (
		<section className='py-20 px-4 lg:px-6'>
			<div className='container mx-auto grid grid-cols-1 md:grid-cols-5 gap-6'>
				{/* Cell 1: Women Photo */}
				<div className='md:col-span-3 overflow-hidden rounded-xl h-[350px] md:h-[450px] group'>
					<img
						src={womenCollectionImage}
						alt='Women Collection visual showcase'
						className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]'
					/>
				</div>

				{/* Cell 2: Women Typography/Metadata */}
				<div className='md:col-span-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-8 md:p-12 flex flex-col justify-center h-[350px] md:h-[450px]'>
					<h2 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4'>
						Women Collection
					</h2>
					<p className='text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-[30ch] mb-6'>
						Effortless silhouettes and minimal tailoring for modern daily wear.
					</p>
					<div>
						<Link
							to='collections/all?gender=Women'
							className='inline-block text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-900 dark:border-zinc-100 pb-0.5 hover:opacity-80 transition-opacity'>
							Shop now
						</Link>
					</div>
				</div>

				{/* Cell 3: Men Typography/Metadata */}
				<div className='md:col-span-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-8 md:p-12 flex flex-col justify-center h-[350px] md:h-[450px] order-4 md:order-3'>
					<h2 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4'>
						Men Collection
					</h2>
					<p className='text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-[30ch] mb-6'>
						Essential, refined basics designed to elevate the everyday uniform.
					</p>
					<div>
						<Link
							to='collections/all?gender=Men'
							className='inline-block text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-900 dark:border-zinc-100 pb-0.5 hover:opacity-80 transition-opacity'>
							Shop now
						</Link>
					</div>
				</div>

				{/* Cell 4: Men Photo */}
				<div className='md:col-span-3 overflow-hidden rounded-xl h-[350px] md:h-[450px] group order-3 md:order-4'>
					<img
						src={menCollectionImage}
						alt='Men Collection visual showcase'
						className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]'
					/>
				</div>
			</div>
		</section>
	);
};

export default GenderCollectionSection;
