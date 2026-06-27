import { Link } from 'react-router-dom';

const ProductGrid = ({ products, error }) => {
	if (error) return <p className='text-red-500 dark:text-red-400'>Error: {error}</p>;
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8'>
			{products.map((product, index) => (
				<Link key={index} to={`/product/${product._id}`} className='block group'>
					<div className='overflow-hidden rounded-xl mb-3'>
						<img
							src={product.images[0]?.url}
							alt={product.altText || product.name}
							className='w-full h-96 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]'
						/>
					</div>
					<h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate'>
						{product.name}
					</h3>
					<p className='font-mono-brand text-sm text-zinc-500 dark:text-zinc-400 mt-1'>
						${product.price}
					</p>
				</Link>
			))}
		</div>
	);
};

export default ProductGrid;
