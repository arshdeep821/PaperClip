import styles from "../styles/OfferBox.module.css";

function OfferBox({offer, theirWants}) {
	return (
		<div className={styles.offerBox}>
			<div className={styles.theirOffer}>
				<h4 className={styles.boxHeader}>Their Offer</h4>
				<div className={styles.itemsContainer}>
					{offer.map((item) => (
						<div key={item.id} className={styles.offerItem}>
							<img src={item.image} alt={item.name} />
						</div>
					))}
				</div>
			</div>

			<hr />

			<div className={styles.theirWants}>
				<h4 className={styles.boxHeader}>For your following item(s)</h4>
				<div className={styles.itemsContainer}>
					{theirWants.map((item) => (
						<div key={item.id} className={styles.wantItem}>
							<img src={item.image} alt={item.name} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default OfferBox;
