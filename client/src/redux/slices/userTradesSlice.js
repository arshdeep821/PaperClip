import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:3001";

const initialState = {
	userTrades: [],
	status: 'idle',
	error: null
}

export const fetchUserTrades = createAsyncThunk("userTrades/fetchUserTrades", async (userId) => {
	const res = await fetch(`${BACKEND_URL}/trades/user2/${userId}`)
	const trades = await res.json()
	return trades
})

export const userTradesSlice = createSlice({
	name: "userTrades",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserTrades.pending, (state) => {
				state.status = 'loading';
				state.userTrades = []
			})
			.addCase(fetchUserTrades.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.userTrades = action.payload;
			})
			.addCase(fetchUserTrades.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	}
});

export default userTradesSlice.reducer;
