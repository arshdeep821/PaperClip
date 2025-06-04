import LeftPanel from "../components/LeftPanel";
import MainPanel from "../components/MainPanel";
import OfferBox from "../components/OfferBox";
import RightPanel from "../components/RightPanel";

function ViewOffers() {
	return (
		<div className="offersPage">
			<LeftPanel />
			<MainPanel middlePanel={<OfferBox />}/>
			<RightPanel />
		</div>
	);
}

export default ViewOffers;
