import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/ViewProducts.module.css";
import ProductItem from "../components/ProductItem";
import Sidebar from "../components/Sidebar";

import TopOptionButtons from "../components/TopOptionButtons";
import BottomOptionButtons from "../components/BottomOptionButtons";
import Bag from "../components/Bag";
import { getRecommendedProducts } from "../redux/slices/productsSlice";
import { useLocation } from "react-router-dom";
import { setProduct } from "../redux/slices/tradeSlice";

const ViewProducts = () => {
	let products = useSelector((state) => state.products.products);
	const status = useSelector((state) => state.products.status);
	const error = useSelector((state) => state.products.error);
	const userId = useSelector((state) => state.user.id);

	const dispatch = useDispatch();
	console.log(products);
	//const NUM_PRODUCTS = products.length || 0;

	const [itemIdx, setItemIdx] = useState(0);

	useEffect(() => {
		dispatch(getRecommendedProducts(userId));
	}, [dispatch, userId]);

	// set the current product for trading once products are available
	useEffect(() => {
		if (status === "succeeded" && products.length > 0) {
			dispatch(setProduct(products[itemIdx]));
		}
	}, [dispatch, status, products, itemIdx]);

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

	const { state } = useLocation();

	if (state && state.item) {
		products = [
			state.item,
			...products.filter((product) => product._id !== state.item._id),
		];
	}

	const handleLeftButton = () => {
		setItemIdx((currIdx) => (currIdx > 0 ? currIdx - 1 : NUM_PRODUCTS - 1));
	};

	const handleRightButton = () => {
		setItemIdx((currIdx) => (currIdx < NUM_PRODUCTS - 1 ? currIdx + 1 : 0));
	};

	if (!products || products.length === 0 || status === "loading") {
		return <h1>Loading ...</h1>;
	}

	if (status == "failed") {
		return <h1>Error loading products {error}</h1>;
	}

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
				product={products[itemIdx]}
			/>

			<Bag currentProduct={products[itemIdx]} />
		</div>
	);
};

export default ViewProducts;
