import { useDispatch, useSelector } from "react-redux";
import { putOnTable, takeOffTable } from "../redux/slices/tradeSlice";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from "../styles/TradeFrame.module.css"
import { useEffect } from "react";

const BACKEND_URL = "http://localhost:3001";
// the one sending offer
const USER1 = "user1";
// the one receiving offer
const USER2 = "user2";

function TradeFrame({ items, user, currOffer }) {
	const dispatch = useDispatch();
	const table1 = useSelector((state) => state.trade.table1 || []);
	const table2 = useSelector((state) => state.trade.table2 || []);
	const selectedItems = (user === USER1) ? table1 : (user === USER2) ? table2 : [];

	// pre-selects items already in offer
	useEffect(() => {
		if (!currOffer) return;

		// items1 and items2 are reversed; TODO: fix our naming
		currOffer.items2.forEach((item) => handleItemSelection(item, USER1));
		currOffer.items1.forEach((item) => handleItemSelection(item, USER2));
	}, [currOffer]);

	const handleItemSelection = (item, user) => {
		const isSelected = selectedItems.some((selection) => selection._id === item._id);
		// item is already selected -> remove from trade
		if (isSelected) {
			console.log("removed item:", item._id);
			setTimeout(() => dispatch(takeOffTable({ itemId: item._id, user: user })), 0);
		// add item to trade
		} else {
			console.log("added item:", item._id);
			setTimeout(() => dispatch(putOnTable({ item: item, user: user })), 0);
		}
	};

	return (
		<div className={styles.tradeFrame}>
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
		</div>
	);
}

export default TradeFrame;
