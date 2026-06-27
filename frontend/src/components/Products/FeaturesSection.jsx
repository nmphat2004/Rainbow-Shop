import {
	HiArrowPathRoundedSquare,
	HiOutlineCreditCard,
	HiShoppingBag,
} from 'react-icons/hi2';

const features = [
	{
		icon: HiShoppingBag,
		title: 'Free International Shipping',
		description: 'On all orders over $100',
	},
	{
		icon: HiArrowPathRoundedSquare,
		title: '45 Days Return',
		description: 'Money back guarantee',
	},
	{
		icon: HiOutlineCreditCard,
		title: 'Secure Checkout',
		description: '100% secured checkout',
	},
];

const FeaturesSection = () => {
	return (
		<section className='py-16 px-4 lg:px-6 border-t border-zinc-200 dark:border-zinc-800'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-0'>
					{features.map((feature, index) => (
						<div
							key={index}
							className={`flex items-center gap-4 py-6 md:py-0 md:px-8 ${index < features.length - 1
								? 'border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800'
								: ''
								}`}>
							<div className='w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0'>
								<feature.icon className='w-5 h-5 text-zinc-600 dark:text-zinc-400' />
							</div>
							<div>
								<h4 className='text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight'>
									{feature.title}
								</h4>
								<p className='text-xs text-zinc-500 dark:text-zinc-400 mt-0.5'>
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeaturesSection;
