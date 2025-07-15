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

	return (
		<div className={styles.renegPanel}>
			<h3>their items</h3>
			<TradeFrame items={theirItems} user={USER1} currOffer={currOffer} />

			<h3>my items</h3>
			<TradeFrame items={myItems} user={USER2} currOffer={currOffer} />
		</div>
	);
}

export default RenegPanel;
