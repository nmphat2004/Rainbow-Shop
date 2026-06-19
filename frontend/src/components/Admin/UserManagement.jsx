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
		<div className='max-w-7xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4 dark:text-white'>
				User Management
			</h2>
			{error && <p className='dark:text-red-400'>Error: {error}</p>}
			{/* Add New User Form */}
			<div className='p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6 transition-colors duration-300'>
				<h3 className='text-lg font-bold mb-4 dark:text-white'>Add New User</h3>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Name
						</label>
						<input
							type='text'
							onChange={handleChange}
							value={formData.name}
							name='name'
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Email
						</label>
						<input
							type='email'
							onChange={handleChange}
							value={formData.email}
							name='email'
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Password
						</label>
						<input
							type='password'
							onChange={handleChange}
							value={formData.password}
							name='password'
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Role
						</label>
						<select
							name='role'
							value={formData.role}
							onChange={handleChange}
							className='w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'>
							<option value='customer'>Customer</option>
							<option value='admin'>Admin</option>
						</select>
					</div>
					<button
						className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
						type='submit'>
						Add User
					</button>
				</form>
			</div>

			{/* User List Management */}
			<div className='overflow-x-auto bg-white dark:bg-gray-800 shadow-md sm:rounded-lg transition-colors duration-300'>
				<table className='min-w-full text-left text-gray-500 dark:text-gray-400'>
					<thead className='bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300'>
						<tr>
							<th className='px-3 py-4'>Name</th>
							<th className='px-3 py-4'>Email</th>
							<th className='px-3 py-4'>Role</th>
							<th className='px-3 py-4'>Action</th>
						</tr>
					</thead>
					<tbody>
						{loading ?
							Array.from({ length: 5 }).map((_, i) => (
								<tr
									key={i}
									className='border-b border-gray-200 dark:border-gray-700'>
									<td className='p-4'>
										<Skeletion className='h-4 w-1/4' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-30' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-16' />
									</td>
									<td className='p-4'>
										<Skeletion className='h-4 w-16' />
									</td>
								</tr>
							))
						:	users.map((user) => (
								<tr
									key={user._id}
									className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
									<td className='p-4 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap'>
										{user.name}
									</td>
									<td className='p-4 dark:text-gray-300'>{user.email}</td>
									<td className='p-4'>
										<select
											value={user.role}
											onChange={(e) =>
												handleRoleChange(user._id, e.target.value)
											}
											className='p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'>
											<option value='customer'>Customer</option>
											<option value='admin'>Admin</option>
										</select>
									</td>
									<td className='p-4'>
										<button
											onClick={() => handleDeleteUser(user._id)}
											className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
											Delete
										</button>
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
