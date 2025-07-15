import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SearchItem from "../components/SearchItem";
import styles from "../styles/Users.module.css";
import MessageIcon from '@mui/icons-material/Message';

function Users() {
    const { state } = useLocation();
    const navigate = useNavigate();

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

    // Handler for starting a chat
    const handleMessageClick = () => {
        navigate("/chats", {
            state: {
                fromUserSearch: true,
                otherUserId: state.user._id,
                otherUsername: state.user.username,
            },
        });
    };

    return (
        <div className={styles.usersPage}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>{state.user.username}'s Inventory</h1>
                    <button
                        className={styles.messageButton}
                        onClick={handleMessageClick}
                        title="Message this user"
                    >
                        <MessageIcon />
                    </button>
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