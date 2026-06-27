import { Link } from 'react-router-dom';
import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { FiPhoneCall } from 'react-icons/fi';

const Footer = () => {
	return (
		<footer className='border-t border-zinc-200 dark:border-zinc-800 py-16 bg-zinc-50 dark:bg-zinc-950'>
			<div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-4 lg:px-6'>
				<div>
					<h3 className='text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wide'>Newsletter</h3>
					<p className='text-sm text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed'>
						Be the first to hear about new products, exclusive events and online offers.
					</p>
					<p className='text-xs text-zinc-600 dark:text-zinc-400 mb-5'>
						Sign up and get 10% off your first order.
					</p>

					{/* Newsletter form */}
					<form className='flex'>
						<input
							type='email'
							placeholder='Enter your email'
							className='p-3 w-full text-sm border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500 rounded-l-lg focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-all'
							required
						/>
						<input
							type='submit'
							value='Subscribe'
							className='bg-rainbow-red text-white px-5 py-3 rounded-r-lg text-sm font-medium hover:bg-red-600 transition-all cursor-pointer'
						/>
					</form>
				</div>

				{/* Shop Links */}
				<div>
					<h3 className='text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wide'>Shop</h3>
					<ul className='space-y-2.5'>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								Men's Top Wear
							</Link>
						</li>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								Women's Top Wear
							</Link>
						</li>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								Men's Bottom Wear
							</Link>
						</li>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								Women's Bottom Wear
							</Link>
						</li>
					</ul>
				</div>

				{/* Support Links */}
				<div>
					<h3 className='text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wide'>Support</h3>
					<ul className='space-y-2.5'>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								Contact Us
							</Link>
						</li>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								About Us
							</Link>
						</li>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								FAQs
							</Link>
						</li>
						<li>
							<Link to='#' className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'>
								Features
							</Link>
						</li>
					</ul>
				</div>

				{/* Follow us */}
				<div>
					<h3 className='text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wide'>Follow Us</h3>
					<div className='flex items-center space-x-4 mb-6'>
						<a
							href='https://www.facebook.com'
							target='_blank'
							rel='noopener noreferrer'
							className='text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors'>
							<TbBrandMeta className='h-5 w-5' />
						</a>
						<a
							href='https://www.instagram.com'
							target='_blank'
							rel='noopener noreferrer'
							className='text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors'>
							<IoLogoInstagram className='h-5 w-5' />
						</a>
						<a
							href='https://www.x.com'
							target='_blank'
							rel='noopener noreferrer'
							className='text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors'>
							<RiTwitterXLine className='h-4 w-4' />
						</a>
					</div>
					<p className='text-xs text-zinc-500 dark:text-zinc-400 mb-1'>Call us</p>
					<p className='font-mono-brand text-sm text-zinc-700 dark:text-zinc-300'>
						<FiPhoneCall className='inline-block mr-2 w-3.5 h-3.5' />
						0123-456-789
					</p>
				</div>
			</div>
			{/* Copyright */}
			<div className='container mx-auto mt-14 px-4 lg:px-6 border-t border-zinc-200 dark:border-zinc-800 pt-6'>
				<p className='text-zinc-400 dark:text-zinc-500 text-xs text-center font-mono-brand'>
					2025 Rainbow. All Rights Reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
