import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:3001";

const initialState = {
	offers: [],
	status: 'idle',
}

export const fetchOffers = createAsyncThunk("offers/fetchOffers", async (userId) => {
	const res = await fetch(`${BACKEND_URL}/trades/${userId}`)
	const offers = await res.json()
	return offers
})

export const offersSlice = createSlice({
	name: "offers",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOffers.pending, (state) => {
				state.status = 'loading';
				state.offers = []
			})
			.addCase(fetchOffers.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.offers = action.payload;
			})
			.addCase(fetchOffers.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	}
});

export default offersSlice.reducer;
