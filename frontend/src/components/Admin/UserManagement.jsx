import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	addUser,
	deleteUser,
	fetchUsers,
	updateUser,
} from '../../redux/slices/adminSlice';
import { toast } from 'sonner';
import Skeletion from '../Common/Skeletion';

const UserManagement = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);
	const { users, loading, error } = useSelector((state) => state.admin);

	useEffect(() => {
		if (user && user.role !== 'admin') {
			navigate('/');
		}
	}, [user, navigate]);

	useEffect(() => {
		if (user && user.role === 'admin') {
			dispatch(fetchUsers());
		}
	}, [user, dispatch]);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: 'customer', // Default role
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			dispatch(addUser(formData));

			// Reset the form after submission
			setFormData({
				name: '',
				email: '',
				password: '',
				role: 'customer',
			});

			toast.success('Add a user successfully!');
		} catch (error) {
			console.error(error);
			toast.error('Failed to add user');
		}
	};

	const handleRoleChange = (userId, newRole) => {
		try {
			dispatch(updateUser({ id: userId, role: newRole }));
			toast.success('Update role successfully!');
		} catch (error) {
			console.error(error);
			toast.error('Failed to update role');
		}
	};

	const handleDeleteUser = (userId) => {
		console.log(userId);

		if (window.confirm('Are you sure to delete this user?')) {
			try {
				dispatch(deleteUser(userId));
				toast.success('Delete user successfully!');
			} catch (error) {
				console.error(error);
				toast.error('Failed to delete user');
			}
		}
	};

	return (
		<div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
			<h2 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8'>
				User Management
			</h2>
			{error && <p className='text-red-500 p-4 border border-red-200 rounded-xl bg-red-50/50 mb-6'>Error: {error}</p>}
			
			{/* Add New User Form */}
			<div className='p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-8 shadow-sm'>
				<h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6'>Add New User</h3>
				<form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<label className='block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2'>
							Name
						</label>
						<input
							type='text'
							onChange={handleChange}
							value={formData.name}
							name='name'
							className='w-full p-2.5 text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors'
							required
						/>
					</div>
					<div>
						<label className='block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2'>
							Email Address
						</label>
						<input
							type='email'
							onChange={handleChange}
							value={formData.email}
							name='email'
							className='w-full p-2.5 text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors'
							required
						/>
					</div>
					<div>
						<label className='block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2'>
							Password
						</label>
						<input
							type='password'
							onChange={handleChange}
							value={formData.password}
							name='password'
							className='w-full p-2.5 text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors'
							required
						/>
					</div>
					<div>
						<label className='block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2'>
							Role
						</label>
						<select
							name='role'
							value={formData.role}
							onChange={handleChange}
							className='w-full p-2.5 text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors cursor-pointer'>
							<option value='customer'>Customer</option>
							<option value='admin'>Admin</option>
						</select>
					</div>
					<div className='md:col-span-2 flex justify-end mt-2'>
						<button
							className='bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-2.5 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer'
							type='submit'>
							Add User
						</button>
					</div>
				</form>
			</div>

			{/* User List Management */}
			<div className='border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm'>
				<table className='min-w-full text-left text-zinc-500 dark:text-zinc-400'>
					<thead className='bg-zinc-50 dark:bg-zinc-900/50 text-[11px] font-mono-brand uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800'>
						<tr>
							<th className='px-6 py-4'>Name</th>
							<th className='px-6 py-4'>Email</th>
							<th className='px-6 py-4'>Role</th>
							<th className='px-6 py-4 text-right'>Action</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-zinc-200 dark:divide-zinc-800'>
						{loading ?
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={i}>
									<td className='px-6 py-4'>
										<Skeletion className='h-4 w-1/3' />
									</td>
									<td className='px-6 py-4'>
										<Skeletion className='h-4 w-1/2' />
									</td>
									<td className='px-6 py-4'>
										<Skeletion className='h-6 w-20 rounded-lg' />
									</td>
									<td className='px-6 py-4 text-right'>
										<Skeletion className='h-4 w-12 ml-auto' />
									</td>
								</tr>
							))
						:	users.map((u) => (
								<tr
									key={u._id}
									className='hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-200'>
									<td className='px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200 whitespace-nowrap text-sm'>
										{u.name}
									</td>
									<td className='px-6 py-4 dark:text-zinc-300 text-sm font-mono-brand'>{u.email}</td>
									<td className='px-6 py-4'>
										<select
											value={u.role}
											onChange={(e) =>
												handleRoleChange(u._id, e.target.value)
											}
											className='p-1.5 text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors cursor-pointer'>
											<option value='customer'>Customer</option>
											<option value='admin'>Admin</option>
										</select>
									</td>
									<td className='px-6 py-4 text-right'>
										{/* Prevent self-deletion for safety */}
										{user?._id !== u._id ? (
											<button
												onClick={() => handleDeleteUser(u._id)}
												className='text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-rainbow-red transition-colors cursor-pointer'>
												Delete
											</button>
										) : (
											<span className='text-xs font-mono-brand text-zinc-300 dark:text-zinc-600'>Active Self</span>
										)}
									</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default UserManagement;
