import { createSlice } from "@reduxjs/toolkit";
import iPhoneImg from "../../assets/iPhone.png";
import tShirt from "../../assets/tShirt.png";
import samsung from "../../assets/samsung_phone.png";
import jeans from "../../assets/jeans.png";

const initialState = {
	// TODO: add test offers
	offers: [
		{
			from: "person1",
			offer: [
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
			]
		},
		{
			from: "person2",
			offer: []
		}
	],

	theirWants: [
		{
			from: "person1",
			want: [
				{
					id: 1,
					name: "Samsung Phone",
					description: "Titanium Silver Samsung Galaxy S25 Edge with 256GB storage",
					category: "Electronics",
					image: samsung,
				},
				{
					id: 2,
					name: "Jeans",
					description: "Beat up vintage jeans",
					category: "Clothes",
					image: jeans,
				}
			]
		},
		{
			from: "person2",
			want: [
				{
					id: 1,
					name: "Samsung Phone",
					description: "Titanium Silver Samsung Galaxy S25 Edge with 256GB storage",
					category: "Electronics",
					image: samsung,
				},
				{
					id: 2,
					name: "Jeans",
					description: "Beat up vintage jeans",
					category: "Clothes",
					image: jeans,
				}
			]
		}
	],
};

export const offersSlice = createSlice({
	name: "offers",
	initialState,
	reducers: {},
});

export default offersSlice.reducer;
