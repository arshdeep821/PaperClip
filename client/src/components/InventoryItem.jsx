import styles from "../styles/Inventory.module.css";
import { useState } from "react";
import { Checkbox } from "@mui/material";

function InventoryItem({ item, onEdit, deleteMode, onSelect }) {

	const [deleteStatus, setDeleteStatus] = useState(false);

    const handleEdit = () => {
        onEdit(item)
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
                    src={`http://localhost:3001/static/${item.imagePath.replace(/^\//, "")}?t=${item._id || Date.now()}`}
                    alt={item.name}
                    className={styles.itemImage}
                />
            )}
            <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className={styles.itemCategory}>Category: {item.category.name}</p>
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
