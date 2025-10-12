import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to get all orders
export const fetchAdminOrders = createAsyncThunk(
	'adminOrders/fetchAdminOrders',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
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

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
	'adminOrders/updateOrderStatus',
	async ({ id, status }, { rejectWithValue }) => {
		try {
			const response = await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
				{ status },
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

// Async thunk to delete an order
export const deleteOrder = createAsyncThunk(
	'adminOrders/deleteOrder',
	async (id, { rejectWithValue }) => {
		try {
			await axios.delete(
				`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,

				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				}
			);
			return id;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const adminOrderSlice = createSlice({
	name: 'adminOrders',
	initialState: {
		orders: [],
		totalOrder: 0,
		totalSales: 0,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAdminOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAdminOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = Array.isArray(action.payload) ? action.payload : [];
				state.totalOrder = state.orders.length;

				const totalSales = action.payload.reduce((acc, order) => {
					return acc + order.totalPrice;
				}, 0);
				state.totalSales = totalSales;
			})
			.addCase(fetchAdminOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message;
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				const updatedOrder = action.payload;
				const orderIndex = state.orders.findIndex(
					(order) => order._id === updatedOrder._id
				);
				if (orderIndex !== -1) state.orders[orderIndex] = updatedOrder;
			})
			.addCase(deleteOrder.fulfilled, (state, action) => {
				state.orders = state.orders.filter(
					(order) => order._id !== action.payload
				);
			});
	},
});

export default adminOrderSlice.reducer;
