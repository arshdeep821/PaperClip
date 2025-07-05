import styles from "../styles/BottomButtons.module.css";

import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch } from "react-redux";
import { acceptOffer, rejectOffer } from "../redux/slices/offersSlice";
import { addItem, removeItem } from "../redux/slices/userSlice";

const BACKEND_URL = "http://localhost:3001";

function OffersActions({ handleLeftButton, handleRightButton, currentOffer }) {
	const dispatch = useDispatch();
	const currentOfferId = currentOffer?._id;

	const handleReject = async () => {
		if (!currentOfferId) {
			return; // TODO: handle case with no offer
		}

		if (currentOffer.status !== "pending") {
			alert("The trade is not valid anymore!");
			return; // TODO: handle case when trade isn't pending
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

		if (currentOffer.status !== "pending") {
			alert("The trade is not valid anymore!");
			return; // TODO: handle case when trade isn't pending
		}

		if (!currentOffer?.user1?._id || !currentOffer?.user2?._id) {
			alert("Invalid trade offer — missing user data");
			return;
		}

		try {
			// ----- swap items owners -----
			const tradeBody = {
				user1Id: currentOffer.user1._id,
				user2Id: currentOffer.user2._id,
				items1Id: currentOffer.items1.map((item) => item._id),
				items2Id: currentOffer.items2.map((item) => item._id),
			};

			console.log("current offer:", currentOffer);
			console.log("trade body:", tradeBody);


			const tradeResponse = await fetch(`${BACKEND_URL}/trades/execute`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(tradeBody),
			});

			const tradeResult = tradeResponse.json();

            if (!tradeResponse.ok) {
                console.error("Server error accepting offer:", tradeResult.error);
            }

			//const swapPromises = [
			//	...currentOffer.items1.map((item) => {
			//		return fetch(`${BACKEND_URL}/items/${item._id}/changeOwner`, {
			//			method: "PATCH",
			//			headers: {
			//				"Content-Type": "application/json",
			//			},
			//			body: JSON.stringify({
			//				user: currentOffer.user2._id
			//			}),
			//		})
			//	}),
			//	...currentOffer.items2.map((item) => {
			//		return fetch(`${BACKEND_URL}/items/${item._id}/changeOwner`, {
			//			method: "PATCH",
			//			headers: {
			//				"Content-Type": "application/json",
			//			},
			//			body: JSON.stringify({
			//				user: currentOffer.user1._id
			//			}),
			//		})
			//	})
			//];
			//
			//await Promise.all(swapPromises);

			// ----- add/remove traded items from user's inventory in redux -----
			currentOffer.items1.forEach((item) => dispatch(removeItem(item._id)));
			currentOffer.items2.forEach((item) => dispatch(addItem(item)));

			// ----- change status to "canceled" or delete all trades with items involved


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
