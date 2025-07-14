import styles from "../styles/ViewOffers.module.css";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchOffers, renegOffer } from "../redux/slices/offersSlice";
import OfferBox from "../components/OfferBox";
import Sidebar from "../components/Sidebar";
import TopOptionButtons from "../components/TopOptionButtons";
import OffersActions from "../components/OffersActions";
import RenegPanel from "../components/RenegPanel";

function ViewOffers() {
	const dispatch = useDispatch()

	const offers = useSelector((state) => state.offers.offers);
	const userId = useSelector((state) => state.user.id);

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
				/>
			</div>

			{renegVisible && offers[offerIdx] && offers[offerIdx].user2 && (
				<RenegPanel theirId={offers[offerIdx].user2._id} currOffer={offers[offerIdx]} />
			)}
		</div>
	);
}

export default ViewOffers;
