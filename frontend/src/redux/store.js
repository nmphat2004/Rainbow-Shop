import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import adminProductsReducer from './slices/adminProductSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		products: productsReducer,
		cart: cartReducer,
		checkout: checkoutReducer,
		order: orderReducer,
		admin: adminReducer,
		adminProducts: adminProductsReducer,
	},
});

export default store;
