import { Link } from "react-router-dom";
import styles from "../styles/TopOptionButtons.module.css";

function TopOptionButtons() {
	return (
		<div className={styles.topOptionButtons}>
			<Link to={"/products"}>
				<div className={styles.optionButton}>
						Products
				</div>
			</Link>
			<Link to={"/offers"}>
				<div className={styles.optionButton}>
					Offers
				</div>
			</Link>
		</div>
	);
}

export default TopOptionButtons;
