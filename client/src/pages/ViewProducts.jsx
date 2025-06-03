import React from "react";
import { useSelector } from "react-redux";
import styles from "../styles/ViewProducts.module.css";
import ProductItem from "../components/ProductItem";

import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";

const ViewProducts = () => {
	const products = useSelector((state) => state.products.products);
	return (
		<div className={styles.productsPage}>
			<div className={styles.topOptionButtons}>
				<div
					className={styles.optionButton}
					style={{ backgroundColor: "rgb(220, 220, 220)" }}
				>
					Products
				</div>
				<div className={styles.optionButton}>Offers</div>
			</div>
			<div className={styles.leftNav}>
				<div className={styles.iconButton}>
					<AccountBoxRoundedIcon fontSize="large" />
				</div>
				<div className={styles.iconButton}>
					<SettingsIcon fontSize="large" />
				</div>
				<div className={styles.iconButton}>
					<ChatIcon fontSize="large" />
				</div>
				<div className={styles.iconButton}>
					<GridViewRoundedIcon fontSize="large" />
				</div>
				<div className={styles.iconButton}>
					<AddCircleOutlineRoundedIcon fontSize="large" />
				</div>
			</div>
			<div className={styles.productItem}>
				<ProductItem item={products[0]} />
			</div>
			<div className={styles.bottomOptionsButtons}>
				<div className={styles.optionButton}>
					<ArrowBackIosIcon fontSize="large" />
				</div>
				<div className={styles.optionButton}>
					<CheckIcon fontSize="large" />
				</div>
				<div className={styles.optionButton}>
					<ArrowForwardIosIcon fontSize="large" />
				</div>
			</div>
		</div>
	);
};

export default ViewProducts;
