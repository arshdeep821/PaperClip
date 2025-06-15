import styles from "../styles/ViewOffers.module.css";

import { useSelector } from "react-redux";

import OfferBox from "../components/OfferBox";
import Sidebar from "../components/Sidebar";
import TopOptionButtons from "../components/TopOptionButtons";
import OffersActions from "../components/OffersActions";

function ViewOffers() {
	const offers = useSelector((state) => state.offers.offers[0].offer);
	const theirWants = useSelector((state) => state.offers.theirWants[0].want);

	return (
		<div className={styles.offersPage}>
			<Sidebar />

			<div className={styles.top}>
				<TopOptionButtons />
			</div>

			<div className={styles.mainContent}>
				<OfferBox offer={offers} theirWants={theirWants} />
			</div>

			<div className={styles.bottom}>
				<OffersActions />
			</div>
		</div>
	);
}

export default ViewOffers;
