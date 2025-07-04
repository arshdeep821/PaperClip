import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:3001";

const initialState = {
	products: [],
	status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
};

export const getRecommendedProducts = createAsyncThunk(
	"products/getRecommendedProducts",
	async (userId) => {
		const response = await fetch(
			`${BACKEND_URL}/users/${userId}/recommend`
		);
		const data = await response.json();
		return data.data;
	}
);

export const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getRecommendedProducts.pending, (state) => {
				state.status = "loading";
				state.products = [];
			})
			.addCase(getRecommendedProducts.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = action.payload;
			})
			.addCase(getRecommendedProducts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export default productsSlice.reducer;
