import styles from "../styles/ViewOffers.module.css";

import { useSelector } from "react-redux";

import OfferBox from "../components/OfferBox";
import Sidebar from "../components/Sidebar";
import Bag from "../components/Bag";
import TopOptionButtons from "../components/TopOptionButtons";
import OffersActions from "../components/OffersActions";

function ViewOffers() {
	const offers = useSelector((state) => state.offers.offers[0].offer);
	const theirWants = useSelector((state) => state.offers.theirWants[0].want);

	return (
		<div className={styles.offersPage}>
			<TopOptionButtons />
			<Sidebar />
			<OfferBox offer={offers} theirWants={theirWants} />
			<Bag />
			<OffersActions />
		</div>
	);
}

export default ViewOffers;
