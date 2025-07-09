import { useSelector } from "react-redux";
import styles from "../styles/RenegPanel.module.css";
import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:3001";

function RenegPanel({ theirId }) {
	const myUser = useSelector((state) => state.user);
	const myId = myUser.id;
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
			<div className={styles.theirBag}>
				<ul>
					{theirItems.map((item) => (
						<li key={item._id}>
							<img
								src={`${BACKEND_URL}/static/${item.imagePath}`}
								alt={item.name}
							/>
						</li>
					))}
				</ul>
			</div>

			<h3>my items</h3>
			<div className={styles.myBag}>
				<ul>
					{myItems.map((item) => (
						<li key={item._id}>
							<img
								src={`${BACKEND_URL}/static/${item.imagePath}`}
								alt={item.name}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default RenegPanel;
