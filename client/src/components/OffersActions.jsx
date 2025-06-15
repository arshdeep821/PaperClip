import styles from "../styles/BottomButtons.module.css";

import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';

function OffersActions() {
	return (
		<div className={styles.bottomButtons}>
			<div className={styles.rejectButton}>
				<CloseIcon fontSize="large" />
			</div>
			<div className={styles.renegButton}>
				<QuestionMarkIcon fontSize="large" />
			</div>
			<div className={styles.acceptButton}>
				<CheckIcon fontSize="large" />
			</div>
		</div>
	);
}

export default OffersActions;
