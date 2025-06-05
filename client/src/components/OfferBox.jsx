import styles from "../styles/OfferBox.module.css";

function OfferBox({offer, theirWants}) {
	return (
		<div className={styles.offerBox}>
			<div className={styles.theirOffer}>
				{offer.map((item) => (item.image))}
				<div key={offer.id}>
					{offer.image &&
						<img
							src={offer.image}
							alt={offer.name}
						/>
					}
				</div>
			</div>

			<div className={styles.theirWants}>
				<img src={theirWants.image} />
			</div>
		</div>
	);
}

export default OfferBox;
