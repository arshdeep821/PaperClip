import { useEffect, useState } from "react";
import styles from "../styles/UserTrades.module.css";
import CloseIcon from "@mui/icons-material/Close";

const BACKEND_URL = "http://localhost:3001";

const getTradeById = async (tradeId) => {
	try {
		const response = await fetch(`${BACKEND_URL}/trades/one/${tradeId}`);
		if (response.ok) {
			const data = await response.json();
			return data;
		}
	} catch (err) {
		console.error("Error fetching trade:", err);
	}
};

const UserTradePopup = ({ currentUser, tradeId, onClose }) => {
	const [trade, setTrade] = useState(null);
	const [yourItems, setYourItems] = useState([]);
	const [theirItems, setTheirItems] = useState([]);

	const loadTrade = () => {
		getTradeById(tradeId).then((trade) => {
			setTrade(trade);

			if (trade.user1._id === currentUser) {
				setYourItems(trade.items1);
				setTheirItems(trade.items2);
			} else {
				setYourItems(trade.items2);
				setTheirItems(trade.items1);
			}
		});
	};

	useEffect(() => {
		loadTrade();
	}, [tradeId]);

	const getStatusColor = (status) => {
		switch (status) {
			case "successful":
				return styles.successful;
			case "pending":
				return styles.pending;
			case "accepted":
				return styles.accepted;
			case "rejected":
				return styles.rejected;
			case "cancelled":
				return styles.cancelled;
			default:
				return styles.pending;
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (!trade) return null;

	return (
		<div className={styles.popupOverlay}>
			<div className={styles.popupContainer}>
				<div className={styles.closeIconWrapper} onClick={onClose}>
					<CloseIcon className={styles.closeIcon} />
				</div>

				<div className={styles.tradeCard}>
					<div className={styles.tradeHeader}>
						<div className={styles.tradeUsers}>
							<span className={styles.userLabel}>You</span>
							<span className={styles.tradeArrow}>⇄</span>
							<span className={styles.otherUser}>
								{trade.user1.username}
							</span>
						</div>
						<div
							className={`${styles.status} ${getStatusColor(
								trade.status
							)}`}
						>
							{trade.status.charAt(0).toUpperCase() +
								trade.status.slice(1)}
						</div>
					</div>

					<div className={styles.tradeItems}>
						<div className={styles.itemsSection}>
							<h4>Your Items:</h4>
							<div className={styles.itemsList}>
								{yourItems.map((item) => (
									<div key={item._id} className={styles.item}>
										<img
											src={`${BACKEND_URL}/static/${item.imagePath}`}
											alt={item.name}
											className={styles.itemImage}
										/>
										<div className={styles.itemDetails}>
											<span className={styles.itemName}>
												{item.name}
											</span>
											<span
												className={styles.itemCondition}
											>
												{item.condition}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className={styles.itemsSection}>
							<h4>Their Items:</h4>
							<div className={styles.itemsList}>
								{theirItems.map((item) => (
									<div key={item._id} className={styles.item}>
										<img
											src={`${BACKEND_URL}/static/${item.imagePath}`}
											alt={item.name}
											className={styles.itemImage}
										/>
										<div className={styles.itemDetails}>
											<span className={styles.itemName}>
												{item.name}
											</span>
											<span
												className={styles.itemCondition}
											>
												{item.condition}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className={styles.tradeFooter}>
						<span className={styles.tradeDate}>
							Created: {formatDate(trade.createdAt)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserTradePopup;
