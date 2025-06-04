import BottomOptionButtons from "./BottomOptionButtons";
import TopOptionButtons from "./TopOptionButtons";

function MainPanel({middlePanel}) {
	return (
		<div className="main-panel">
			<TopOptionButtons />
			{middlePanel}
			<BottomOptionButtons />
		</div>
	);
}

export default MainPanel;
