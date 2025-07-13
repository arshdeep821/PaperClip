import styles from "../styles/ViewOffers.module.css";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchOffers, renegOffer } from "../redux/slices/offersSlice";
import OfferBox from "../components/OfferBox";
import Sidebar from "../components/Sidebar";
import TopOptionButtons from "../components/TopOptionButtons";
import OffersActions from "../components/OffersActions";
import RenegPanel from "../components/RenegPanel";

const BACKEND_URL = "http://localhost:3001";

function ViewOffers() {
	const dispatch = useDispatch()

	const offers = useSelector((state) => state.offers.offers);
	const userId = useSelector((state) => state.user.id);
	const myUser = useSelector((state) => state.user);
	const table1 = useSelector((state) => state.trade.table1 || []);
	const table2 = useSelector((state) => state.trade.table2 || []);

	const status = useSelector((state) => state.offers.status);
	const NUM_OFFERS = offers.length || 0;
	const [offerIdx, setOfferIdx] = useState(0);
	const [renegVisible, setRenegVisible] = useState(false);

	useEffect(() => {
		dispatch(fetchOffers(userId))
	}, [dispatch, userId])

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "ArrowRight") {
				setOfferIdx((currIdx) =>
					currIdx < NUM_OFFERS - 1 ? currIdx + 1 : 0
				);
			} else if (e.key === "ArrowLeft") {
				setOfferIdx((currIdx) =>
					currIdx > 0 ? currIdx - 1 : NUM_OFFERS - 1
				);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [NUM_OFFERS]);

	const handleLeftButton = () => {
		setOfferIdx((currIdx) => (currIdx > 0 ? currIdx - 1 : NUM_OFFERS - 1));
	};

	const handleRightButton = () => {
		setOfferIdx((currIdx) => (currIdx < NUM_OFFERS - 1 ? currIdx + 1 : 0));
	};

	const toggleRenegPanel = () => {
		setRenegVisible((prev) => !prev);
	};

	const handleSubmitReneg = async () => {
		const currOffer = offers[offerIdx];

		const sameItems = (array1, array2) => (
			array1.length === array2.length &&
			array1.every((item1) => array2.some((item2) => item2._id === item1._id))
		);

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
					user1:	currOffer.user2._id,
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
			dispatch(renegOffer(currOffer._id));
		} catch (err) {
			console.error("Trade error:", err);
		}
	};

	if (status !== "succeeded") {
		return <h1>Loading...</h1>
	}

	return (
		<div className={styles.offersPage}>
			<Sidebar />

			<div className={styles.top}>
				<TopOptionButtons />
			</div>

			<div className={styles.mainContent}>
				{
					(!offers[offerIdx] || offers.length === 0) ?
						<h1>No Current Offers</h1>
					:
						<OfferBox
							otherUser={{
								user: offers[offerIdx].user2,
								items: offers[offerIdx].items2
							}}
							currUser={{
								user: offers[offerIdx].user1,
								items: offers[offerIdx].items1
							}}
						/>
				}
			</div>

			<div className={styles.bottom}>
				<OffersActions
					handleLeftButton={handleLeftButton}
					handleRightButton={handleRightButton}
					currentOffer={offers[offerIdx] || undefined}
					toggleRenegPanel={toggleRenegPanel}
					renegVisible={renegVisible}
					handleSubmitReneg={handleSubmitReneg}
				/>
			</div>

			{renegVisible && offers[offerIdx] && offers[offerIdx].user2 && (
				<RenegPanel theirId={offers[offerIdx].user2._id} currOffer={offers[offerIdx]} />
			)}
		</div>
	);
}

export default ViewOffers;
