import styles from "../styles/Inventory.module.css";
import { useState } from "react";
import { Checkbox } from "@mui/material";

const BACKEND_URL = "http://localhost:3001";

function InventoryItem({ item, onEdit, deleteMode, onSelect, onViewHistory }) {
    const [deleteStatus, setDeleteStatus] = useState(false);

    const handleEdit = () => {
        onEdit(item)
    }

    const handleViewHistory = () => {
        onViewHistory(item)
    }

    return (
        <div
            key={item._id}
            className={styles.inventoryItem}
        >
			{deleteMode && (
				<Checkbox
					style={{ position: "absolute", top: 8, right: 8 }}
					onChange={() => {
                        setDeleteStatus(!deleteStatus)
                        onSelect(item._id)
                    }}
				/>
			)}
            {item.imagePath && (
                <img
                    src={`${BACKEND_URL}/static/${item.imagePath.replace(/^\//, "")}?t=${item._id || Date.now()}`}
                    alt={item.name}
                    className={styles.itemImage}
                />
            )}
            <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className={styles.itemCategory}>Category: {item.category.name}</p>
				<p className={styles.itemCondition}>Condition: {item.condition}</p>
                <button
                    className={`${styles.itemButton} ${styles.editButton}`}
                    onClick={() => handleEdit()}
                >
                    Edit
                </button>
                <button
                    className={`${styles.itemButton} ${styles.editButton}`}
                    onClick={() => handleViewHistory()}>
                    View History
                </button>
            </div>
        </div>

    );
}

export default InventoryItem;
