import LeftPanel from "../components/LeftPanel";
import MainPanel from "../components/MainPanel";
import RightPanel from "../components/RightPanel";

function ViewOffers() {
	return (
		<div className="offersPage">
			<LeftPanel />
			<MainPanel />
			<RightPanel />
		</div>
	);
}

export default ViewOffers;
