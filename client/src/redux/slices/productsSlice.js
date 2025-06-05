import { createSlice } from "@reduxjs/toolkit";
import iPhoneImg from "../../assets/iPhone.png";
import tShirt from "../../assets/tShirt.png";
import tShirt2 from "../../assets/tShirt2.png";

const initialState = {
	products: [
		{
			id: 1,
			name: "iPhone 15",
			description: "iPhone 15 with 16 GB RAM, M2 Chip",
			category: "Electronics",
			image: iPhoneImg,
		},
		{
			id: 2,
			name: "T shirt",
			description: "Blue Legendary T shirt",
			category: "Clothes",
			image: tShirt,
		},
		{
			id: 3,
			name: "Travis Scott T shirt",
			description: "Travis Scott merch",
			category: "Clothes",
			image: tShirt2,
		},
	],
};

export const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {},
});

export default productsSlice.reducer;
