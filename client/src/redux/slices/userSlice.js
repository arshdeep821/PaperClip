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
		addItem: (state, action) => {
			console.log("Action", action.payload);
			
            state.inventory.push(action.payload);
        },
        removeItem: (state, action) => {
			state.inventory = state.inventory.filter((item) => item._id !== action.payload);
        },
        updateItem: (state, action) => {
            const { id, name, description, category, image } = action.payload;
            const item = state.inventory.find((item) => item._id === id);
            if (item) {
                item.name = name;
                item.description = description;
                item.category = category;
                item.image = image;
            }
        },
		setItems: (state, action) => {
			state.items = action.payload;
		}
	},
});

export const { setUser, addItem, removeItem, updateItem, setItems } = userSlice.actions;

export default userSlice.reducer;
