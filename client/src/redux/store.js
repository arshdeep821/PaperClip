import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import offersReducer from "./slices/offersSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice";
import tradeReducer from "./slices/tradeSlice";

export const store = configureStore({
	reducer: {
		products: productsReducer,
		offers: offersReducer,
		user: userReducer,
		search: searchReducer,
		trade: tradeReducer,
	},
});

export default store;
