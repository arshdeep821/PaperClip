import React from "react";
import { useSelector } from "react-redux";
import styles from "../styles/ViewProducts.module.css";
import ProductItem from "../components/ProductItem";
import Sidebar from "../components/Sidebar";

import TopOptionButtons from "../components/TopOptionButtons";
import BottomOptionButtons from "../components/BottomOptionButtons";


const ViewProducts = () => {
	const products = useSelector((state) => state.products.products);
	return (
		<div className={styles.productsPage}>
			<TopOptionButtons />

			<Sidebar />

			<div className={styles.productItem}>
				<ProductItem item={products[0]} />
			</div>

			<BottomOptionButtons />
		</div>
	);
};

export default ViewProducts;
