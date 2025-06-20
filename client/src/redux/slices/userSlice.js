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

export const getUser = createAsyncThunk(
	"user/getUser",
	async (userId) => {
		const response = await fetch(`${BACKEND_URL}/users/${userId}`);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to fetch user");
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

export const validateSession = createAsyncThunk(
	"user/validateSession",
	async () => {
		const response = await fetch(`${BACKEND_URL}/users/validate-session`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Session invalid");
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

const loadUserFromStorage = () => {
	try {
		const userData = localStorage.getItem('user');
		if (userData) {
			const user = JSON.parse(userData);
			return {
				isLoggedIn: true,
				id: user.id,
				username: user.username,
				name: user.name,
				email: user.email,
				city: user.city,
				country: user.country,
				tradingRadius: user.tradingRadius,
				inventory: user.inventory,
				createdAt: user.createdAt,
				loading: false,
				error: null,
			};
		}
	} catch (error) {
		console.error('Error loading user from storage:', error);
	}
	return initialState;
};

export const userSlice = createSlice({
	name: "user",
	initialState: loadUserFromStorage(),
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

			localStorage.setItem('user', JSON.stringify({
				id: _id,
				username,
				name,
				email,
				city,
				country,
				tradingRadius,
				inventory,
				createdAt,
			}));
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

			localStorage.removeItem('user');
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

				localStorage.setItem('user', JSON.stringify({
					id: _id,
					username,
					name,
					email,
					city,
					country,
					tradingRadius,
					inventory,
					createdAt,
				}));
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(getUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getUser.fulfilled, (state, action) => {
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
				localStorage.setItem('user', JSON.stringify(action.payload));
			})
			.addCase(getUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(updateUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
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
				localStorage.setItem('user', JSON.stringify({
					id: _id,
					username,
					name,
					email,
					city,
					country,
					tradingRadius,
					inventory,
					createdAt,
				}));
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(validateSession.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(validateSession.fulfilled, (state) => {
				state.loading = false;
				state.error = null;
			})
			.addCase(validateSession.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
				localStorage.removeItem('user');
			});
	},
});

export const { setUser, logout, clearError } = userSlice.actions;

export default userSlice.reducer;
