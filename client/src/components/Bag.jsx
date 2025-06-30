import styles from "../styles/Bag.module.css";
import BackpackIcon from '@mui/icons-material/Backpack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useState } from "react";
import { useSelector } from "react-redux";

const BACKEND_URL = "http://localhost:3001";

function Bag({ currentProduct }) {
	const [open, setOpen] = useState(false);
	const items = useSelector((state) => state.user.inventory || []);

	const [selectedItems, setSelectedItems] = useState([]);

	const handleItemSelection = (item) => {
		setSelectedItems((prevSelectedItems) => {
			if (prevSelectedItems.some((selection) => selection._id === item._id)) {
				return prevSelectedItems.filter((e) => e !== item);
			} else {
				return [...prevSelectedItems, item];
			}
		});
	};

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
							{items.map((item) => {
								const isSelected = selectedItems.some((e) => e._id === item._id);
								return (
									<div
										key={item._id}
										className={`${styles.item} ${isSelected ? styles.selected : ""}`}
										onClick={() => handleItemSelection(item)}
									>
										<img
											src={`${BACKEND_URL}/static/${item.imagePath}`}
											alt={item.name}
										/>
										{isSelected && (
											<div className={styles.checkmark}>
												<CheckCircleIcon />
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Bag;
