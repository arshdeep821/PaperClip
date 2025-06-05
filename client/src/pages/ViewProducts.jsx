import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/ViewProducts.module.css";
import ProductItem from "../components/ProductItem";
import Sidebar from "../components/Sidebar";

import TopOptionButtons from "../components/TopOptionButtons";
import BottomOptionButtons from "../components/BottomOptionButtons";
import Bag from "../components/Bag";

const ViewProducts = () => {
	const products = useSelector((state) => state.products.products);
	const NUM_PRODUCTS = 3;

	const [itemIdx, setItemIdx] = useState(0);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "ArrowRight") {
				setItemIdx((currIdx) =>
					currIdx < NUM_PRODUCTS - 1 ? currIdx + 1 : 0
				);
			} else if (e.key === "ArrowLeft") {
				setItemIdx((currIdx) =>
					currIdx > 0 ? currIdx - 1 : NUM_PRODUCTS - 1
				);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleLeftButton = () => {
		setItemIdx((currIdx) => (currIdx > 0 ? currIdx - 1 : NUM_PRODUCTS - 1));
	};

	const handleRightButton = () => {
		setItemIdx((currIdx) => (currIdx < NUM_PRODUCTS - 1 ? currIdx + 1 : 0));
	};

	return (
		<div className={styles.productsPage}>
			<div style={{ backgroundColor: "rgb(220, 220, 220)" }}>
				<TopOptionButtons />
			</div>

			<Sidebar />

			<div className={styles.productItem}>
				<ProductItem item={products[itemIdx]} />
			</div>

			<BottomOptionButtons
				handleLeftButton={handleLeftButton}
				handleRightButton={handleRightButton}
			/>

			<Bag />
		</div>
	);
};

export default ViewProducts;
