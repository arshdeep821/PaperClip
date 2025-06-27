import styles from "../styles/OfferBox.module.css";

const BACKEND_URL = "http://localhost:3001";

function OfferBox({otherUser, currUser}) {
	return (
		<div className={styles.offerBox}>
			<div className={styles.theirOffer}>
				<h4 className={styles.boxHeader}>Their Offer</h4>
				<div className={styles.itemsContainer}>
					{otherUser.items.map((item) => (
						<div key={item._id} className={styles.offerItem}>
							<img src={`${BACKEND_URL}/static/${item.imagePath}`} alt={item.name} />
						</div>
					))}
				</div>
			</div>

			<hr />

			<div className={styles.theirWants}>
				<h4 className={styles.boxHeader}>For your following item(s)</h4>
				<div className={styles.itemsContainer}>
					{currUser.items.map((item) => (
						<div key={item._id} className={styles.wantItem}>
							<img src={`${BACKEND_URL}/static/${item.imagePath}`} alt={item.name} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default OfferBox;
