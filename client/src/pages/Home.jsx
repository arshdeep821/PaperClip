import React from "react";
import styles from "../styles/Home.module.css";

import NavBoxes from "../components/NavBoxes";

const Home = () => {
	return (
		<div className={styles.homePage}>
			<h1 className={styles.title}>Welcome to PaperClip!</h1>
			<h2 className={styles.subtitle}>
				The one stop shop for YOU to trade your way up, maybe even up to
				a house!
			</h2>
			<NavBoxes />
		</div>
	);
};

export default Home;
