import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	username: null,
	name: null,
	city: null,
	country: null,
	tradingRadius: null,
	inventory: null,
	createdAt: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
});

export default userSlice.reducer;
