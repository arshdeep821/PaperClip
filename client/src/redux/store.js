import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import productsReducer from "./slices/productsSlice";
import offersReducer from "./slices/offersSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
	reducer: {
		inventory: inventoryReducer,
		products: productsReducer,
		offers: offersReducer,
		user: userReducer,
	},
});

export default store;
