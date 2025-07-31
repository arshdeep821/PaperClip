import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:3001";

const initialState = {
	productResults: [],
    userResults: [],
	status: 'idle',
    error: null,
}

export const fetchSearch = createAsyncThunk('products/fetchSearch', async ({ userId, query }) => {
    const response = await fetch(`${BACKEND_URL}/items/search/${userId}/?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
});

export const offersSlice = createSlice({
    name: "offers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearch.pending, (state) => {
                state.status = 'loading';
                state.productResults = [];
                state.userResults = []
                state.error = null;
            })
            .addCase(fetchSearch.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.productResults = action.payload.items;
                state.userResults = action.payload.users
                state.error = null;

            })
            .addCase(fetchSearch.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.productResults = [];
                state.userResults = []
            });
    }
});

export default offersSlice.reducer;
