import styles from "../styles/BottomButtons.module.css";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";

function BottomOptionButtons({ handleLeftButton, handleRightButton }) {
	return (
<<<<<<< HEAD
		<div className={styles.bottomButtons}>
			<div className={styles.optionButton}>
=======
		<div className={styles.bottomOptionsButtons}>
			<div className={styles.optionButton} onClick={handleLeftButton}>
>>>>>>> main
				<ArrowBackIosIcon fontSize="large" />
			</div>
			<div className={styles.optionButton}>
				<CheckIcon fontSize="large" />
			</div>
			<div className={styles.optionButton} onClick={handleRightButton}>
				<ArrowForwardIosIcon fontSize="large" />
			</div>
		</div>
	);
}

export default BottomOptionButtons;
