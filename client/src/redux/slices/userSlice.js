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
	status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
};

export const createUser = createAsyncThunk(
	"user/createUser",
	async (userData) => {
		const response = await fetch(`${BACKEND_URL}/users`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to create user");
		}

		return await response.json();
	}
);

export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (credentials) => {
		const response = await fetch(`${BACKEND_URL}/users/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credentials),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Login failed");
		}

		return await response.json();
	}
);

export const updateUser = createAsyncThunk(
	"user/updateUser",
	async ({ userId, userData }) => {
		const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to update user");
		}

		return await response.json();
	}
);

export const uploadItem = createAsyncThunk("items/uploadItem", async (data) => {
	const response = await fetch(`${BACKEND_URL}/items`, {
		method: "POST",
		body: data,
	});
	const result = await response.json();
	return result;
});

export const deleteItem = createAsyncThunk(
	"items/deleteItem",
	async (itemId) => {
		const res = await fetch(`${BACKEND_URL}/items/${itemId}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			throw new Error(`Error deleting item with id: ${itemId}`);
		}
		return itemId;
	}
);

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
		logout: (state) => {
			state.isLoggedIn = false;
			state.id = null;
			state.username = null;
			state.name = null;
			state.email = null;
			state.city = null;
			state.country = null;
			state.tradingRadius = null;
			state.inventory = null;
			state.createdAt = null;
			state.error = null;
		},
		clearError: (state) => {
			state.error = null;
		},
		addItem: (state, action) => {
			state.inventory.push(action.payload);
		},
		removeItem: (state, action) => {
			state.inventory = state.inventory.filter(
				(item) => item._id !== action.payload
			);
		},
		updateItem: (state, action) => {
			const { id, name, description, category, condition, image } =
				action.payload;
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
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(uploadItem.pending, (state) => {
				state.status = "loading";
			})
			.addCase(uploadItem.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.inventory.push(action.payload);
			})
			.addCase(uploadItem.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(deleteItem.pending, (state) => {
				state.status = "deleting_item";
			})
			.addCase(deleteItem.fulfilled, (state, action) => {
				state.status = "deleted";
				state.inventory = state.inventory.filter(
					(item) => item._id !== action.payload
				);
			})
			.addCase(deleteItem.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || action.error.message;
			})
			.addCase(createUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createUser.fulfilled, (state) => {
				state.loading = false;
				state.error = null;
			})
			.addCase(createUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				const {
					_id,
					username,
					name,
					email,
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
				state.email = email;
				state.city = city;
				state.country = country;
				state.tradingRadius = tradingRadius;
				state.inventory = inventory;
				state.createdAt = createdAt;
				state.loading = false;
				state.error = null;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(updateUser.pending, (state) => {
				state.status = "updating_user";
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.status = "updated";
				state.isLoggedIn = true;
				state.id = action.payload._id;
				state.username = action.payload.username;
				state.name = action.payload.name;
				state.email = action.payload.email;
				state.city = action.payload.city;
				state.country = action.payload.country;
				state.tradingRadius = action.payload.tradingRadius;
				state.inventory = action.payload.inventory;
				state.createdAt = action.payload.createdAt;
				state.error = null;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const {
	setUser,
	logout,
	clearError,
	addItem,
	removeItem,
	updateItem,
	setItems,
} = userSlice.actions;

export default userSlice.reducer;
