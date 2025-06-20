import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import offersReducer from "./slices/offersSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
	reducer: {
		products: productsReducer,
		offers: offersReducer,
		user: userReducer,
	},
});

export default store;
