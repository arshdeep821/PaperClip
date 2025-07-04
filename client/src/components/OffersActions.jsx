import styles from "../styles/BottomButtons.module.css";

import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { rejectOffer } from "../redux/slices/offersSlice";

const BACKEND_URL = "http://localhost:3001";

function OffersActions({ handleLeftButton, handleRightButton, currentOfferId }) {
	const dispatch = useDispatch();

	const handleReject = async () => {
		if (!currentOfferId) {
			return; // TODO: handle case with no offer
		}

		try {
			const response = await fetch(`${BACKEND_URL}/trades/${currentOfferId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: "rejected"
				}),
			});

            const result = await response.json();

            if (!response.ok) {
                console.error("Server error rejecting offer:", result.error);
            }

			dispatch(rejectOffer(currentOfferId));

        } catch (err) {
            console.error("Reject offer error:", err);
        }
	};

	// TODO:
	// make a reneg side panel
	const handleReneg = () => {
	};

	// TODO:
	// remove offer from offersSlice
	// swap items
	// remove the traded items from current trades
	// change trade status to accepted
	const handleAccept = async () => {
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
