import styles from "../styles/Bag.module.css";

import { useState } from "react";
import { useSelector } from "react-redux";

function Bag() {
	const [open, setOpen] = useState(false);
	const items = useSelector((state) => state.inventory.items);

	return (
		<div className="bag">
			{items.length === 0 ? (
				<div>empty</div>
			) : (
				<ul className={styles.itemList}>
					{items.map((item) => (
						<li key={item.id} className={styles.smallItem}>{item.image}</li>
					))}
				</ul>
			)}

			<button
				onClick={() => setOpen(!open)}
			>
			</button>
		</div>
	);
}

export default Bag;
