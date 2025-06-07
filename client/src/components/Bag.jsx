import styles from "../styles/Bag.module.css";
import BackpackIcon from '@mui/icons-material/Backpack';

import { useState } from "react";
import { useSelector } from "react-redux";

function Bag() {
	const [open, setOpen] = useState(false);
	const items = useSelector((state) => state.inventory.items);

	return (
		<div className={styles.bag}>
			<div
				className={styles.bagIcon}
				onClick={() => setOpen(!open)}
			>
				<BackpackIcon />
			</div>

			{open && (items.length === 0 ? (
				<div className={styles.closing}>empty</div>
			) : (
				<ul className={styles.itemList}>
					{items.map((item) => (
						<li
							key={item.id}
							className={styles.smallItem}
						>
							<img src={item.image} alt={item.name} />
						</li>
					))}
				</ul>
			))}
		</div>
	);
}

export default Bag;
