import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	product: null,
	table1: [],
	table2: [],
};

export const tradeSlice = createSlice({
	name: "trade",
	initialState,
	reducers: {
		setProduct: (state, action) => {
			state.product = action.payload;
		},
		putOnTable: (state, action) => {
			switch (action.payload.user) {
				case "user1": {
					const itemExists = state.table1.some((item) => item._id === action.payload.item._id);
					if (!itemExists) {
						state.table1.push(action.payload.item);
					}
					break;
				}
				case "user2": {
					const itemExists = state.table2.some((item) => item._id === action.payload.item._id);
					if (!itemExists) {
						state.table2.push(action.payload.item);
					}
					break;
				}
			}
		},
		takeOffTable: (state, action) => {
			switch (action.payload.user) {
				case "user1":
					state.table1 = state.table1.filter((item) => item._id !== action.payload.itemId);
					break;
				case "user2":
					state.table2 = state.table2.filter((item) => item._id !== action.payload.itemId);
					break;
			}
		},
		resetTrade: (state) => {
			state.product = null;
			state.table1 = [];
			state.table2 = [];
		},
	},
});

export const { setProduct, putOnTable, takeOffTable, resetTrade } = tradeSlice.actions;

export default tradeSlice.reducer;
