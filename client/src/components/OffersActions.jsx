import styles from "../styles/BottomButtons.module.css";

import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch } from "react-redux";
import { acceptOffer, rejectOffer } from "../redux/slices/offersSlice";

const BACKEND_URL = "http://localhost:3001";

function OffersActions({ handleLeftButton, handleRightButton, currentOffer }) {
	const dispatch = useDispatch();
	const currentOfferId = currentOffer?._id;

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
	const handleAccept = async () => {
		if (!currentOfferId) {
			return; // TODO: handle case with no offer
		}

		try {
			// ----- swap items owners -----
			const swapPromises = [
				...currentOffer.items1.map((item) => {
					return fetch(`${BACKEND_URL}/items/${item._id}/changeOwner`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							user: currentOffer.user2._id
						}),
					})
				}),
				...currentOffer.items2.map((item) => {
					return fetch(`${BACKEND_URL}/items/${item._id}/changeOwner`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							user: currentOffer.user1._id
						}),
					})
				})
			];

			await Promise.all(swapPromises);

			// ----- update trade status to "accepted" -----
			const statusResponse = await fetch(`${BACKEND_URL}/trades/${currentOfferId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: "accepted"
				}),
			});

            const statusResult = await statusResponse.json();

            if (!statusResponse.ok) {
                console.error("Server error accepting offer:", statusResult.error);
            }

			dispatch(acceptOffer(currentOfferId));
			// ---------------------------------------------

        } catch (err) {
            console.error("Accept offer error:", err);
        }
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
