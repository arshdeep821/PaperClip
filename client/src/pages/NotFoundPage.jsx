import Sidebar from "../components/Sidebar";

function NotFoundPage() {
	return (
		<div className="not-found-page"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				fontFamily: "serif"
			}}
		>
			<Sidebar />
			<p>Page does not exist</p>
		</div>
	);
}

export default NotFoundPage;
