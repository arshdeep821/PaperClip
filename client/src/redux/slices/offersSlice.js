import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:3001";

const initialState = {
	offers: [],
	status: 'idle',
}

export const fetchOffers = createAsyncThunk("offers/fetchOffers", async (userId) => {
	const res = await fetch(`${BACKEND_URL}/trades/${userId}`)
	const offers = await res.json()
	return offers.filter((trade) => trade.status === "pending");
})

export const offersSlice = createSlice({
	name: "offers",
	initialState,
	reducers: {
		rejectOffer: (state, action) => {
			const trade = state.offers.find((trade) => trade._id === action.payload);
			if (trade) {
				trade.status = "rejected";
			}

			// removes the offer from the offers page immediately
			state.offers = state.offers.filter((trade) => trade._id !== action.payload);
		},
		acceptOffer: (state, action) => {
			const trade = state.offers.find((trade) => trade._id === action.payload);
			if (trade) {
				trade.status = "accepted";
			}

			// removes the offer from the offers page immediately
			state.offers = state.offers.filter((trade) => trade._id !== action.payload);
		},
		renegOffer: (state, action) => {
			const trade = state.offers.find((trade) => trade._id === action.payload);
			if (trade) {
				trade.status = "renegotiated";
			}

			// removes the offer from the offers page immediately
			state.offers = state.offers.filter((trade) => trade._id !== action.payload);
		}
	},
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

export const { rejectOffer, acceptOffer, renegOffer } = offersSlice.actions;

export default offersSlice.reducer;
