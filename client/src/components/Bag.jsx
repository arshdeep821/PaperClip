import styles from "../styles/Bag.module.css";
import BackpackIcon from '@mui/icons-material/Backpack';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TradeFrame from "./TradeFrame";
import { setInventory } from "../redux/slices/userSlice";

const BACKEND_URL = "http://localhost:3001";

function Bag() {
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);
	const userId = useSelector((state) => state.user.id);
	const items = useSelector((state) => state.user.inventory || []);

	useEffect(() => {
		const fetchInventoryItems = async () => {
			try {
				const response = await fetch(`${BACKEND_URL}/users/${userId}`);
				const data = await response.json();

				dispatch(setInventory(data.inventory));
			} catch (err) {
				console.error(`Error retrieving inventory items for user:`, err);
			}
		};

		fetchInventoryItems();
	}, [userId]);

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
