import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
	'adminProducts/fetchAdminProducts',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response && error.response.data
					? error.response.data
					: error.message
			);
		}
	}
);

// Async thunk to create a new product
export const createProduct = createAsyncThunk(
	'adminProducts/createProduct',
	async (productData, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/products`,
				productData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response && error.response.data
					? error.response.data
					: error.message
			);
		}
	}
);

// Async thunk to delete product
export const deleteProduct = createAsyncThunk(
	'adminProducts/deleteProduct',
	async (id, { rejectWithValue }) => {
		try {
			await axios.delete(
				`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			return id;
		} catch (error) {
			return rejectWithValue(
				error.response && error.response.data
					? error.response.data
					: error.message
			);
		}
	}
);

// Slice
const adminProductsSlice = createSlice({
	name: 'adminProducts',
	initialState: {
		products: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAdminProducts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAdminProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = Array.isArray(action.payload) ? action.payload : [];
			})
			.addCase(fetchAdminProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(createProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createProduct.fulfilled, (state, action) => {
				state.loading = false;
				state.products.push(action.payload);
			})
			.addCase(createProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || action.error.message;
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.loading = false;
				state.products = state.products.filter(
					(product) => product._id !== action.payload
				);
			});
	},
});

export default adminProductsSlice.reducer;
