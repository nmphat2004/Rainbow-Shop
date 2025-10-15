import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
	try {
		const storedCart = localStorage.getItem('cart');
		if (!storedCart || storedCart === 'undefined' || storedCart === 'null') {
			return { products: [] };
		}
		const parsed = JSON.parse(storedCart);
		if (!parsed || !Array.isArray(parsed.products)) {
			return { products: [] };
		}
		return parsed;
	} catch {
		// If parsing fails for any reason, return an empty cart and clear bad storage
		localStorage.removeItem('cart');
		return { products: [] };
	}
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
	try {
		if (!cart || !cart.products) {
			localStorage.removeItem('cart');
			return;
		}
		localStorage.setItem('cart', JSON.stringify(cart));
	} catch {
		// ignore storage errors (quota, etc.)
	}
};

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
	'cart/fetchCart',
	async ({ userId, guestId }, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
				{
					params: {
						userId,
						guestId,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error.response.data);
		}
	}
);

// Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk(
	'cart/addToCart',
	async (
		{ productId, quantity, size, color, guestId, userId },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
				{
					productId,
					quantity,
					size,
					color,
					guestId,
					userId,
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
	'cart/updateCartItemQuantity',
	async (
		{ productId, quantity, size, color, guestId, userId },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
				{
					productId,
					quantity,
					size,
					color,
					guestId,
					userId,
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Remove an item from the cart
export const removeFromCart = createAsyncThunk(
	'cart/removeFromCart',
	async ({ productId, size, color, guestId, userId }, { rejectWithValue }) => {
		try {
			const response = await axios({
				method: 'DELETE',
				url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
				data: {
					productId,
					size,
					color,
					guestId,
					userId,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
	'cart/mergeCart',
	async ({ guestId }, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
				{
					guestId,
				},
				{
					headers: {
						Authorization: `Bearer ${JSON.parse(
							localStorage.getItem('userToken')
						)}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// Slice
const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		cart: loadCartFromStorage(),
		loading: false,
		error: null,
	},
	reducers: {
		clearCart: (state) => {
			state.cart = {
				products: [],
			};
			localStorage.removeItem('cart');
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message || 'Failed to fetch cart';
			})
			.addCase(addToCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to add to cart';
			})
			.addCase(updateCartItemQuantity.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(updateCartItemQuantity.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload?.message || 'Failed to update item quantity';
			})
			.addCase(removeFromCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeFromCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to remove item';
			})
			.addCase(mergeCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(mergeCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(mergeCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to merge cart';
			});
	},
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
