import styles from "../styles/ViewOffers.module.css";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchOffers, renegOffer } from "../redux/slices/offersSlice";
import OfferBox from "../components/OfferBox";
import Sidebar from "../components/Sidebar";
import OffersActions from "../components/OffersActions";
import RenegPanel from "../components/RenegPanel";
import ItemOfferDetails from "../components/ItemOfferDetails";

function ViewOffers() {
	const dispatch = useDispatch()

	const offers = useSelector((state) => state.offers.offers);
	const userId = useSelector((state) => state.user.id);

	const status = useSelector((state) => state.offers.status);
	const NUM_OFFERS = offers.length || 0;
	const [offerIdx, setOfferIdx] = useState(0);
	const [renegVisible, setRenegVisible] = useState(false);
	const [detailedItem, setDetailedItem] = useState(null);

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

	if (status !== "succeeded") {
		return <h1>Loading...</h1>
	}

	return (
		<div className={styles.offersPage}>
			<Sidebar />

			<h1 className={styles.header}>Offers You've Received</h1>

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
							onItemClick={setDetailedItem}
						/>
				}

				{detailedItem && (
					<ItemOfferDetails
						item={detailedItem}
						onClose={() => setDetailedItem(null)}
					/>
				)}

			</div>

			<div className={styles.bottom}>
				<OffersActions
					handleLeftButton={handleLeftButton}
					handleRightButton={handleRightButton}
					currentOffer={offers[offerIdx] || undefined}
					toggleRenegPanel={toggleRenegPanel}
					renegVisible={renegVisible}
				/>
			</div>

			{renegVisible && offers[offerIdx] && offers[offerIdx].user2 && (
				<RenegPanel theirId={offers[offerIdx].user2._id} currOffer={offers[offerIdx]} />
			)}
		</div>
	);
}

export default ViewOffers;
