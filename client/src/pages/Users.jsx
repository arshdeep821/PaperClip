import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SearchItem from "../components/SearchItem";
import styles from "../styles/Users.module.css";

function Users() {
    const { state } = useLocation();

    if (!state || !state.user) {
        return (
            <div className={styles.usersPage}>
                <Sidebar />
                <div className={styles.mainContent}>
                    <h1>User Not Found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.usersPage}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>{state.user.username}'s Inventory</h1>
                </div>
                <div className={styles.inventorySection}>
                    {state.user.inventory.length === 0 ? (
                        <h3 className={styles.emptyInventory}>Inventory is empty</h3>
                    ) : (
                        <div className={styles.inventoryGrid}>
                            {state.user.inventory.map((product) => (
                                <SearchItem key={product._id} item={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Users;