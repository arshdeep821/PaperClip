import { useSelector } from "react-redux";
import styles from "../styles/RenegPanel.module.css";
import { useEffect, useState } from "react";
import TradeFrame from "./TradeFrame";

const BACKEND_URL = "http://localhost:3001";
const USER1 = "user1";
const USER2 = "user2";

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
		console.log("currOffer:", currOffer);
		const sameItems = (array1, array2) => (
			array1.length === array2.length &&
			array1.every((item1) => array2.some((item2) => item2._id === item1._id))
		);

		// checks if table1 is the same as currOffer.table1
		if (sameItems(table1, currOffer.items2) && sameItems(table2, currOffer.items1)) {
			console.log("the renegotiated offer is the same as the starting one")
			alert("You are renegotiating a trade with the same starting items!");
			return;
		}

		if (!table1 || table1.length === 0) {
			console.log("not a valid trade: missing/empty table1");
			alert("Please select the items you would like to trade for.");
			return;
		} else if (!table2 || table2.length === 0) {
			console.log("not a valid trade: missing/empty table2");
			alert("Please select the items you would like to offer for the new trade.");
			return;
		}
		try {
			const response = await fetch(`${BACKEND_URL}/trades/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user1:	theirId,
					user2:	myUser.id,
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
			<TradeFrame items={theirItems} user={USER1} currOffer={currOffer} />

			<h3>my items</h3>
			<TradeFrame items={myItems} user={USER2} currOffer={currOffer} />

			<button onClick={handleSubmitReneg}>Confirm Renegotiated Trade</button>
		</div>
	);
}

export default RenegPanel;
