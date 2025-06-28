import styles from "../styles/ViewOffers.module.css";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchOffers } from "../redux/slices/offersSlice";
import OfferBox from "../components/OfferBox";
import Sidebar from "../components/Sidebar";
import TopOptionButtons from "../components/TopOptionButtons";
import OffersActions from "../components/OffersActions";

function ViewOffers() {
	const dispatch = useDispatch()


	const offers = useSelector((state) => state.offers.offers);
	const userId = useSelector((state) => state.user.id)
	const status = useSelector((state) => state.offers.status)


	useEffect(() => {
		dispatch(fetchOffers(userId))
	}, [])


	if (status !== "succeeded") {
		return <h1>Loading...</h1>
	}

	if (!offers || offers.length === 0) {

	}

	return (
		<div className={styles.offersPage}>
			<Sidebar />

			<div className={styles.top}>
				<TopOptionButtons />
			</div>

			<div className={styles.mainContent}>
				{
					(!offers || offers.length === 0) ?
						<h1>No Current Offers</h1> :
						<OfferBox otherUser={{ user: offers[0].user2, items: offers[0].items2 }} currUser={{ user: offers[0].user1, items: offers[0].items1 }} />
				}
			</div>

			<div className={styles.bottom}>
				<OffersActions />
			</div>
		</div>
	);
}

export default ViewOffers;
