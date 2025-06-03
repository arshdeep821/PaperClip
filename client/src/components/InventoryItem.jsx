import styles from "../styles/Inventory.module.css";

function InventoryItem({ item }) {

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
            </div>
        </div>

    );
}

export default InventoryItem;