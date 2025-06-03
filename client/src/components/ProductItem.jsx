import styles from "../styles/ProductItem.module.css";

const ProductItem = ({ item }) => {
	return (
		<div key={item.id} className={styles.productItem}>
			{item.image && (
				<div className={styles.imageWrapper}>
					<img
						src={item.image}
						alt={item.name}
						className={styles.productImage}
					/>
					<div className={styles.overlay}>
						<div className={styles.overlayText}>
							{item.name}, {item.description},
						</div>
						<br />
						<div className={styles.overlayText}>
							{item.description}
						</div>
						<br />
						<div className={styles.overlayText}>
							{item.category}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductItem;
