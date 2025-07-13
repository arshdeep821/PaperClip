import { useSelector } from "react-redux";
import styles from "../styles/RenegPanel.module.css";
import { useEffect, useState } from "react";
import TradeFrame from "./TradeFrame";

const BACKEND_URL = "http://localhost:3001";

function RenegPanel({ theirId, currOffer }) {
	const myUser = useSelector((state) => state.user);
	const [theirItems, setTheirItems] = useState([]);
	const [myItems, setMyItems] = useState([]);
	const table1 = useSelector((state) => state.trade.table1 || []);
	const table2 = useSelector((state) => state.trade.table2 || [])

	useEffect(() => {
		setMyItems(myUser.inventory || []);
	}, [myUser.inventory]);

	useEffect(() => {
		const fetchTheirItems = async () => {
			try {
				const response = await fetch(`${BACKEND_URL}/users/${theirId}`);
				const data = await response.json();

				setTheirItems(data.inventory);
			} catch (err) {
				console.error(`Error retrieving items for user ${theirId}:`, err);
			}
		};

		fetchTheirItems();
	}, [theirId]);

	const handleSubmitReneg = async () => {
		if (!table1 || table1.length === 0 || !table2 || table2.length === 0) {
			console.log("not a valid trade");
			alert("Please select items for the new trade.");
			return;
		}
		try {
			const response = await fetch(`${BACKEND_URL}/trades/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user1:	product.owner._id,
					user2:	user.id,
					items1:	table1.map((item) => item._id),
					items2:	table2.map((item) => item._id),
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error("Server error:", result.error);
			}

			alert("Renegotiated trade submitted successfully");
		} catch (err) {
			console.error("Trade error:", err);
		}
	};

	return (
		<div className={styles.renegPanel}>
			<h3>their items</h3>
			<TradeFrame items={theirItems} user={"user1"} currOffer={currOffer} />

			<h3>my items</h3>
			<TradeFrame items={myItems} user={"user2"} currOffer={currOffer} />

			<div onClick={handleSubmitReneg}>Confirm Renegotiated Trade</div>
		</div>
	);
}

export default RenegPanel;
