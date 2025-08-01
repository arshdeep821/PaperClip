import styles from "../styles/ProductItem.module.css";

const BACKEND_URL = "http://localhost:3001";

const ProductItem = ({ item }) => {
	return (
		<div className={styles.productItem}>
			{item ? (
				<div className={styles.imageWrapper}>
					<img
						src={`${BACKEND_URL}/static/${item.imagePath}`}
						alt={item.name}
						className={styles.productImage}
					/>
					<div className={styles.overlay}>
						<div className={styles.overlayText}>
							{item.name} - {item.condition}
						</div>
						<br />
						<div className={styles.overlayText}>
							{item.description}
						</div>
						<br />
						<div className={styles.overlayText}>
							@{item.owner.username}
						</div>
					</div>
				</div>
			) : (
				<div className={styles.noProductsBox}>
					<div className={styles.noProductsText}>
						No Products Availabile within your Trading Radius.
					</div>
					<br />
					<div className={styles.noProductsText}>
						To find products, either increase your trading radius or
						update your location!
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductItem;
