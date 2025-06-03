import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "../styles/Inventory.module.css";
import InventoryItem from "../components/InventoryItem";

const Inventory = () => {
    const items = useSelector((state) => state.inventory.items);

    return (
        <div className={styles.inventoryPage}>
            <div className={styles.uploadButtonWrapper}>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                >
                    Upload Item
                </Button>
            </div>

            <div className={styles.inventoryListWrapper}>
                <h2>Inventory</h2>
                {items.length === 0 ? (
                    <p>No items in inventory</p>
                ) : (
                    <div className={styles.inventoryGrid}>
                        {items.map((item) => (
                            <InventoryItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
