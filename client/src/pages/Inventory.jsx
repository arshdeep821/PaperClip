import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "../styles/Inventory.module.css";
import InventoryItem from "../components/InventoryItem";
import Sidebar from "../components/Sidebar";
import UploadItemForm from "../components/UploadItemForm";
import EditItemForm from "../components/EditItemForm";

const Inventory = () => {
    const items = useSelector((state) => state.inventory.items);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const handleEditSubmit = (formData) => {
        console.log("Editing item:", formData);
        // TODO: Dispatch action to update item
        setEditItem(null);
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
                    onSubmit={(formData) => {
                        console.log("Submitting:", formData);
                        setShowForm(false);
                    }}
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
                <h2>Inventory</h2>
                {items.length === 0 ? (
                    <p>No items in inventory</p>
                ) : (
                    <div className={styles.inventoryGrid}>
                        {items.map((item) => (
                            <InventoryItem 
                                key={item.id} 
                                item={item} 
                                onEdit={(item) => setEditItem(item)} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
