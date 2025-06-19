import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	id: null,
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
	reducers: {
		setUser: (state, action) => {
			const {
				_id,
				username,
				name,
				city,
				country,
				tradingRadius,
				inventory,
				createdAt,
			} = action.payload;

			state.isLoggedIn = true;
			state.id = _id;
			state.username = username;
			state.name = name;
			state.city = city;
			state.country = country;
			state.tradingRadius = tradingRadius;
			state.inventory = inventory;
			state.createdAt = createdAt;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
