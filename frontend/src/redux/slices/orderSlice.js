import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user orders
export const fetchUserOrder = createAsyncThunk(
	'orders/fetchUserOrders',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_API}/api/orders/my-orders`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Async thunk to fetch orders details by ID
export const fetchOrderDetails = createAsyncThunk(
	'orders/fetchOrderDetails',
	async (orderId, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_API}/api/orders/${orderId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const orderSlice = createSlice({
	name: 'order',
	initialState: {
		orders: [],
		totalOrders: 0,
		orderDetails: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = Array.isArray(action.payload) ? action.payload : [];
			})
			.addCase(fetchUserOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message || "Failed to get user's order";
			})
			.addCase(fetchOrderDetails.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchOrderDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetails = action.payload;
			})
			.addCase(fetchOrderDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message || 'Failed to get order details';
			});
	},
});

export default orderSlice.reducer;
