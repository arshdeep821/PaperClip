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

			{open && (
				<div className={styles.inventoryFrame}>
					{items.length === 0 ? (
						<div className={styles.empty}>Empty</div>
					) : (
						<div className={styles.itemGrid}>
							{items.map((item) => (
								<div key={item._id} className={styles.item}>
									<img
										src={`${BACKEND_URL}/static/${item.imagePath}`}
										alt={item.name}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Bag;
