import styles from "../styles/BottomButtons.module.css";

import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector } from "react-redux";

function OffersActions({ handleLeftButton, handleRightButton, currentTrade }) {
	const offers = useSelector((state) => state.offers.offers);

	// TODO:
	// remove offer from offersSlice
	// remove offer from backend
	const handleReject = () => {
	};

	// TODO:
	// make a reneg side panel
	const handleReneg = () => {
	};

	// TODO:
	//
	const handleAccept = () => {
	};

	return (
		<div className={styles.bottomButtons}>
			<div className={styles.optionButton} onClick={() => {
				handleLeftButton();
			}}>
				<ArrowBackIosIcon fontSize="large" />
			</div>
			<div className={styles.actionButtons}>
				<div className={styles.rejectButton} onClick={handleReject}>
					<CloseIcon fontSize="large" />
				</div>
				<div className={styles.renegButton} onClick={handleReneg}>
					<QuestionMarkIcon fontSize="large" />
				</div>
				<div className={styles.acceptButton} onClick={handleAccept}>
					<CheckIcon fontSize="large" />
				</div>
			</div>
			<div className={styles.optionButton} onClick={() => {
				handleRightButton();
			}}>
				<ArrowForwardIosIcon fontSize="large" />
			</div>
		</div>
	);
}

export default OffersActions;
