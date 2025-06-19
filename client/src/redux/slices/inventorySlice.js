import { createSlice } from "@reduxjs/toolkit";
import iPhoneImg from "../../assets/iPhone.png"
import tShirt from "../../assets/tShirt.png"

const initialState = { // item consists of a Name, Description, Category, and Image
    items: []
}

export const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        updateItem: (state, action) => {
            const { id, name, description, category, image } = action.payload;
            const item = state.items.find((item) => item.id === id);
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
    }
})

export const { addItem, removeItem, updateItem, setItems } = inventorySlice.actions;
export default inventorySlice.reducer;

