import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:3001";

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

const initialState = {
	isLoggedIn: false,
	id: null,
	username: null,
	name: null,
	email: null,
	city: null,
	country: null,
	tradingRadius: null,
	inventory: null,
	createdAt: null,
	loading: false,
	error: null,
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
			state.error = null;
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
	},
	extraReducers: (builder) => {
		builder
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
			});
	},
});

export const { setUser, logout, clearError } = userSlice.actions;

export default userSlice.reducer;
