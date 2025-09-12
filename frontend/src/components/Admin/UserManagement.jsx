import { useState } from 'react';

const UserManagement = () => {
	const user = [
		{
			_id: 13131,
			name: 'John Doe',
			email: 'john@example.com',
			role: 'admin',
		},
	];

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

		// Reset the form after submission
		setFormData({
			name: '',
			email: '',
			password: '',
			role: 'customer',
		});
	};

	const handleRoleChange = (userId, newRole) => {
		console.log({ id: userId, role: newRole });
	};

	const handleDeleteUser = (userId) => {
		if (window.confirm('Are you sure to delete this user?')) {
			console.log(userId);
		}
	};

	return (
		<div className='max-w-7xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4'>User Management</h2>
			{/* Add New User Form */}
			<div className='p-6 rounded-lg mb-6'>
				<h3 className='text-lg font-bold mb-4'>Add New User</h3>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700'>Name</label>
						<input
							type='text'
							onChange={handleChange}
							value={formData.name}
							name='name'
							className='w-full p-2 border rounded'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700'>Email</label>
						<input
							type='email'
							onChange={handleChange}
							value={formData.email}
							name='email'
							className='w-full p-2 border rounded'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700'>Password</label>
						<input
							type='password'
							onChange={handleChange}
							value={formData.password}
							name='password'
							className='w-full p-2 border rounded'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700'>Role</label>
						<select
							name='role'
							value={formData.role}
							onChange={handleChange}
							className='w-full p-2 border rounded'>
							<option value='customer'>Customer</option>
							<option value='Admin'>Admin</option>
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
			<div className='overflow-x-auto shadow-md sm:rounded-lg'>
				<table className='min-w-full text-left text-gray-500'>
					<thead className='bg-gray-100 text-xs uppercase text-gray-700'>
						<tr>
							<th className='px-3 py-4'>Name</th>
							<th className='px-3 py-4'>Email</th>
							<th className='px-3 py-4'>Role</th>
							<th className='px-3 py-4'>Action</th>
						</tr>
					</thead>
					<tbody>
						{user.map((user) => (
							<tr key={user._id} className='border-b hover:bg-gray-50 '>
								<td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
									{user.name}
								</td>
								<td className='p-4'>{user.email}</td>
								<td className='p-4'>
									<select
										value={user.role}
										onChange={(e) => handleRoleChange(user._id, e.target.value)}
										className='p-2 border rounded'>
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
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default UserManagement;
