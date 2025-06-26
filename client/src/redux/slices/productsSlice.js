import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
	const response = await fetch('http://localhost:3001/items');
	const data = await response.json();
	return data;
});

const initialState = {
	products: [],
	status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null
}

export const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.status = 'loading';
				state.products = []
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.products = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	},
});

export default productsSlice.reducer;
