import styles from "../styles/Bag.module.css";
import BackpackIcon from '@mui/icons-material/Backpack';

import { useState } from "react";
import { useSelector } from "react-redux";

const BACKEND_URL = "http://localhost:3001";

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

			{open && (items.length === 0 ? (
				<div className={styles.closing}>empty</div>
			) : (
				<ul className={styles.itemList}>
					{items.map((item) => (
						<li
							key={item._id}
							className={styles.smallItem}
						>
							<p className={styles.itemName}>{item.name}</p>
							<img src={`${BACKEND_URL}/static/${item.imagePath}`} alt={item.name} />
						</li>
					))}
				</ul>
			))}
		</div>
	);
}

export default Bag;
