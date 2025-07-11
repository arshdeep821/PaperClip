import styles from "../styles/Bag.module.css";
import BackpackIcon from '@mui/icons-material/Backpack';

import { useState } from "react";
import { useSelector } from "react-redux";
import TradeFrame from "./TradeFrame";

function Bag() {
	const [open, setOpen] = useState(false);
	const items = useSelector((state) => state.user.inventory || []);

	return (
		<div className={styles.bag}>
			<div
				className={styles.bagIcon}
				onClick={() => setOpen(!open)}
			>
				<BackpackIcon />
			</div>

			{open && (
				<div className={styles.inventoryFrame}>
					<TradeFrame items={items} user={"user2"} />
					<span className={styles.instruction}>Select items to offer</span>
				</div>
			)}
		</div>
	);
}

export default Bag;
