import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import productsReducer from "./slices/productsSlice";

export const store = configureStore({
	reducer: {
		inventory: inventoryReducer,
		products: productsReducer,
	},
});

export default store;
