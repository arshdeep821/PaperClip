import styles from "../styles/Inventory.module.css";
import { useState } from "react";

function InventoryItem({ item, onEdit }) {

    const handleDelete = () => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }

    }

    const handleEdit = () => {
        onEdit(item)
    }


    return (
        <div
            key={item.id}
            className={styles.inventoryItem}
        >
            {item.image && (
                <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                />
            )}
            <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className={styles.itemCategory}>Category: {item.category}</p>
                <button
                    className={`${styles.itemButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete()}
                >
                    Delete
                </button>
                <button
                    className={`${styles.itemButton} ${styles.editButton}`}
                    onClick={() => handleEdit()}
                >
                    Edit
                </button>
            </div>
        </div>

    );
}

export default InventoryItem;