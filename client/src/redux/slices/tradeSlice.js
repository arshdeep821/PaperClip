import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	product: null,
	table: [],
};

export const tradeSlice = createSlice({
	name: "trade",
	initialState,
	reducers: {
		setProduct: (state, action) => {
			state.product = action.payload;
		},
		putOnTable: (state, action) => {
			const itemExists = state.table.some((item) => item._id === action.payload._id);
			if (!itemExists) {
				state.table.push(action.payload);
			}
		},
		takeOffTable: (state, action) => {
			state.table = state.table.filter((item) => item._id !== action.payload);
		},
		resetTrade: (state) => {
			state.product = null;
			state.table = [];
		},
	},
});

export const { setProduct, putOnTable, takeOffTable, resetTrade } = tradeSlice.actions;

export default tradeSlice.reducer;
