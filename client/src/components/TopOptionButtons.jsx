import { Link } from "react-router-dom";
import styles from "../styles/TopOptionButtons.module.css";
import { useDispatch } from "react-redux";
import { resetTrade } from "../redux/slices/tradeSlice";

function TopOptionButtons() {
	const dispatch = useDispatch();

	const handleNewTrade = () => {
		dispatch(resetTrade());
	};

	return (
		<div className={styles.topOptionButtons}>
			<Link to={"/products"}>
				<div className={styles.optionButton} onClick={handleNewTrade}>
						Products
				</div>
			</Link>
			<Link to={"/offers"}>
				<div className={styles.optionButton} onClick={handleNewTrade}>
					Offers
				</div>
			</Link>
		</div>
	);
}

export default TopOptionButtons;
