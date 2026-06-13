const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Function to seed data

const seedData = async () => {
	try {
		// Clear existing data
		await Product.deleteMany();
		await User.deleteMany();
		await Cart.deleteMany();

		// Create a default admin User
		await User.create({
			name: 'Admin',
			email: 'admin@example.com',
			password: '123456',
			role: 'admin',
		});

		console.log('Seeded successfully');
		process.exit();
	} catch (error) {
		console.error('Error seeding the data', error);
		process.exit(1);
	}
};

seedData();
