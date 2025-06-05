import styles from "../styles/BottomButtons.module.css";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";

function BottomOptionButtons() {
	return (
		<div className={styles.bottomButtons}>
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
	);
}

export default BottomOptionButtons;
