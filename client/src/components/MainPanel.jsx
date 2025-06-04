import BottomOptionButtons from "./BottomOptionButtons";
import TopOptionButtons from "./TopOptionButtons";

function MainPanel({middlePannel}) {
	return (
		<div className="main-panel">
			<TopOptionButtons />
			{middlePannel}
			<BottomOptionButtons />
		</div>
	);
}

export default MainPanel;
