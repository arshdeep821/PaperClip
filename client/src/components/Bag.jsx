import styles from "../styles/Bag.module.css";
import BackpackIcon from '@mui/icons-material/Backpack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { putOnTable, takeOffTable } from "../redux/slices/tradeSlice";

const BACKEND_URL = "http://localhost:3001";

function Bag() {
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);
	const items = useSelector((state) => state.user.inventory || []);
	const selectedItems = useSelector((state) => state.trade.table || []);

	const handleItemSelection = (item) => {
		const isSelected = selectedItems.some((selection) => selection._id === item._id);
		// item is already selected -> remove from bag
		if (isSelected) {
			console.log("removed item:", item._id);
			setTimeout(() => dispatch(takeOffTable(item._id)), 0);
		// add item to bag
		} else {
			console.log("added item:", item._id);
			setTimeout(() => dispatch(putOnTable(item)), 0);
		}
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
										<span className={styles.tooltip}>{item.name}</span>
									</div>
								);
							})}
						</div>
					)}
					<span className={styles.instruction}>Select items to offer</span>
				</div>
			)}
		</div>
	);
}

export default Bag;
