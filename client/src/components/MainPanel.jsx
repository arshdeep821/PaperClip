import OfferBox from "./OfferBox";

function MainPanel() {
	return (
		<div className="main-panel">
			<TopOptionBar />
			<OfferBox />
			<BottomOptionBar />
		</div>
	);
}

export default MainPanel;
