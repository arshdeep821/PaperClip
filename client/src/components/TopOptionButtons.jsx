import styles from "../styles/TopOptionButtons.module.css";

function TopOptionButtons() {
	return (
		<div className={styles.topOptionButtons}>
			<div
				className={styles.optionButton}
				style={{ backgroundColor: "rgb(220, 220, 220)" }}
			>
				Products
			</div>
			<div className={styles.optionButton}>Offers</div>
		</div>
	);
}

export default TopOptionButtons;
