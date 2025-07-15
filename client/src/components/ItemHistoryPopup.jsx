import styles from "../styles/ItemHistoryPopup.module.css";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:3001";

function ItemHistoryPopup({ item, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BACKEND_URL}/trades/history/${item._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }
                const historyData = await response.json();
                setHistory(historyData);
            } catch (error) {
                console.error('Error fetching trade history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [item._id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return styles.statusAccepted;
            case 'pending':
                return styles.statusPending;
            case 'rejected':
                return styles.statusRejected;
            default:
                return styles.statusDefault;
        }
    };

    const renderTradeItem = (tradeItem) => {
        if (!tradeItem) return null;
        
        return (
            <div className={styles.tradeItem}>
                <div className={styles.itemImageContainer}>
                    {tradeItem.imagePath && (
                        <img
                            src={`${BACKEND_URL}/static/${tradeItem.imagePath.replace(/^\//, "")}`}
                            alt={tradeItem.name}
                            className={styles.itemImage}
                        />
                    )}
                </div>
                <div className={styles.itemDetails}>
                    <h4>{tradeItem.name}</h4>
                    <p>{tradeItem.description}</p>
                    <p className={styles.itemCondition}>Condition: {tradeItem.condition}</p>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>Trade History for {item.name}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <p>Loading trade history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className={styles.noHistory}>
                            <p>No trade history found for this item.</p>
                        </div>
                    ) : (
                        <div className={styles.historyList}>
                            {history.map((trade) => (
                                <div key={trade._id} className={styles.tradeEntry}>
                                    <div className={styles.tradeHeader}>
                                        <span className={`${styles.status} ${getStatusColor(trade.status)}`}>
                                            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                                        </span>
                                        <span className={styles.tradeDate}>
                                            {formatDate(trade.createdAt)}
                                        </span>
                                    </div>
                                    
                                    <div className={styles.tradeUsers}>
                                        <div className={styles.userSection}>
                                            <h4>{trade.user1.name} ({trade.user1.username})</h4>
                                            <div className={styles.itemsList}>
                                                {trade.items1.map((tradeItem) => (
                                                    <div key={tradeItem._id} className={styles.tradeItemContainer}>
                                                        {renderTradeItem(tradeItem)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className={styles.tradeArrow}>⇄</div>
                                        
                                        <div className={styles.userSection}>
                                            <h4>{trade.user2.name} ({trade.user2.username})</h4>
                                            <div className={styles.itemsList}>
                                                {trade.items2.map((tradeItem) => (
                                                    <div key={tradeItem._id} className={styles.tradeItemContainer}>
                                                        {renderTradeItem(tradeItem)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItemHistoryPopup;
