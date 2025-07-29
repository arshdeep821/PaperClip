import styles from "../styles/OfferBox.module.css";
import Tooltip from "@mui/material/Tooltip";

const BACKEND_URL = "http://localhost:3001";

function OfferBox({ otherUser, currUser, onItemClick }) {
	return (
		<div className={styles.offerBox}>
			<div className={styles.theirOffer}>
				<h4 className={styles.boxHeader}>Their Offer</h4>
				<div className={styles.itemsContainer}>
					{otherUser.items.map((item) => (
						<Tooltip title="Click to view details" arrow key={item._id}>
							<div
								className={styles.offerItem}
								onClick={() => onItemClick && onItemClick(item)}
								style={{ cursor: "pointer" }}
							>
								<img src={`${BACKEND_URL}/static/${item.imagePath}`} alt={item.name} />
							</div>
						</Tooltip>
					))}
				</div>
			</div>
			<hr />
			<div className={styles.theirWants}>
				<h4 className={styles.boxHeader}>For your following item(s)</h4>
				<div className={styles.itemsContainer}>
					{currUser.items.map((item) => (
						<Tooltip title="Click to view details" arrow key={item._id}>
							<div
								className={styles.wantItem}
								onClick={() => onItemClick && onItemClick(item)}
								style={{ cursor: "pointer" }}
							>
								<img src={`${BACKEND_URL}/static/${item.imagePath}`} alt={item.name} />
							</div>
						</Tooltip>
					))}
				</div>
			</div>
		</div>
	);
}

export default OfferBox;