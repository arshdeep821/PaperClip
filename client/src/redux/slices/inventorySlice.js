import { createSlice } from "@reduxjs/toolkit";
import iPhoneImg from "../../assets/iPhone.png"
import tShirt from "../../assets/tShirt.png"

const initialState = { // item consists of a Name, Description, Category, and Image 
    items: [
        {
            id: 1,
            name: "iPhone 15",
            description: "iPhone 15 with 16 GB RAM, M2 Chip",
            category: "Electronics",
            image: iPhoneImg
        },
        {
            id: 2,
            name: "T shirt",
            description: "Blue Legendary T shirt",
            category: "Clothes",
            image: tShirt
        }

    ] 
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
        }
    }
})

export const { addItem, removeItem, updateItem } = inventorySlice.actions;
export default inventorySlice.reducer;

