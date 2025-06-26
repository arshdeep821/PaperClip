import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:3001";


const initialState = {
	isLoggedIn: false,
	id: null,
	username: null,
	name: null,
	city: null,
	country: null,
	tradingRadius: null,
	inventory: [],
	createdAt: null,
	status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
};

export const uploadItem = createAsyncThunk('items/uploadItem', async (data) => {
	const response = await fetch(`${BACKEND_URL}/items`, {
		method: "POST",
		body: data,
	});
	const result = await response.json();
	return result
})

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
			state.inventory.push(action.payload);
		},
		removeItem: (state, action) => {
			state.inventory = state.inventory.filter((item) => item._id !== action.payload);
		},
		updateItem: (state, action) => {
			const { id, name, description, category, condition, image } = action.payload;
			const item = state.inventory.find((item) => item._id === id);
			if (item) {
				item.name = name;
				item.description = description;
				item.category = category;
				item.image = image;
				item.condition = condition;
			}
		},
		setItems: (state, action) => {
			state.items = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(uploadItem.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(uploadItem.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.inventory.push(action.payload);
			})
			.addCase(uploadItem.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	},
});

export const { setUser, addItem, removeItem, updateItem, setItems } = userSlice.actions;

export default userSlice.reducer;
