import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "../styles/Inventory.module.css";
import InventoryItem from "../components/InventoryItem";
import Sidebar from "../components/Sidebar";
import UploadItemForm from "../components/UploadItemForm";
import EditItemForm from "../components/EditItemForm";
import { removeItem, updateItem } from "../redux/slices/userSlice";

const BACKEND_URL = "http://localhost:3001";

const Inventory = () => {
    const items = useSelector((state) => state.user.inventory || []);

    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const dispatch = useDispatch();


    const handleEditSubmit = async (formData) => {
        const data = new FormData()
        if (formData.name) {
            data.append("name", formData.name);
        }
        if (formData.description) {
            data.append("description", formData.description);
        }

        if (formData.category) {
            const categoryId = formData.category.id || formData.category._id;
            data.append("category", categoryId);
        }

		if (formData.category) {
			data.append("condition", formData.condition);
		}

        try {

            const response = await fetch(`${BACKEND_URL}/items/${editItem._id}`, {
                method: "PATCH",
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("Server error:", result.error);
            }

            dispatch(updateItem({
                "id": editItem._id,
                "name": formData.name,
                "description": formData.description,
                "category": formData.category,
				"condition": formData.condition,
            }));

        } catch (err) {
            console.error("Edit item error:", err);
        }

        setEditItem(null);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete these products? This action cannot be undone.")) {
            return;
        }

        try {
            await Promise.all(selectedItems.map(async (itemId) => {
                const res = await fetch(`${BACKEND_URL}/items/${itemId}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    console.error(`Failed to delete item with ID: ${itemId}`);
                }
            }));


            selectedItems.map((itemId) => {
                dispatch(removeItem(itemId))
            })

            setSelectedItems([]);
			setDeleteMode(false);
        } catch (error) {
            console.error("Error deleting items:", error);
        }
    };
    return (
        <div className={styles.inventoryPage}>
            <Sidebar />
            <div className={styles.uploadButtonWrapper}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowForm(true)}
                >
                    Upload Item
                </Button>
            </div>


            {showForm && (
                <UploadItemForm
                    onClose={() => setShowForm(false)}
                    onSubmit={() => (setShowForm(false))}
                />
            )}

            {editItem && (
                <EditItemForm
                    item={editItem}
                    onClose={() => setEditItem(null)}
                    onSubmit={handleEditSubmit}
                />
            )}

            <div className={styles.inventoryListWrapper}>

                <div className={styles.inventoryHeader}>
                    <h2>Inventory</h2>

                    {deleteMode && (
                        <button
                            className={styles.deleteConfirm}
                            onClick={handleDelete}
                        >
                            Confirm Delete
                        </button>
                    )}

                    <div className={styles.deleteButtonWrapper}>
                        <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            className={`${styles.itemButton} ${styles.deleteButton}`}
                            onClick={() => setDeleteMode((prev) => !prev)}
                        >
                            {deleteMode ? "Cancel Delete" : "Delete Item(s)"}
                        </Button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <p>No items in inventory</p>
                ) : (
                    <div className={styles.inventoryGrid}>
                        {items.map((item) => (
                            <InventoryItem
                                key={item._id}
                                item={item}
                                onEdit={(item) => setEditItem(item)}
                                deleteMode={deleteMode}
                                onSelect={(id) => {
                                    setSelectedItems((prev) =>
                                        prev.includes(id)
                                            ? prev.filter((itemId) => itemId !== id)
                                            : [...prev, id]
                                    );
                                }}

                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
