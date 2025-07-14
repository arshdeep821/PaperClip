import styles from "../styles/BottomButtons.module.css";

import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { acceptOffer, rejectOffer, renegOffer } from "../redux/slices/offersSlice";
import { addItem, removeItem } from "../redux/slices/userSlice";
import { resetTrade } from "../redux/slices/tradeSlice";

const BACKEND_URL = "http://localhost:3001";

function OffersActions({ handleLeftButton, handleRightButton, currentOffer, toggleRenegPanel, renegVisible }) {
	const dispatch = useDispatch();
	const currentOfferId = currentOffer?._id;
	const myUser = useSelector((state) => state.user);
	const table1 = useSelector((state) => state.trade.table1 || []);
	const table2 = useSelector((state) => state.trade.table2 || []);

	const handleNewTrade = () => {
		dispatch(resetTrade());
	};

	const handleSubmitReneg = async () => {
		const currOffer = currentOffer;

		const sameItems = (array1, array2) => (
			array1.length === array2.length &&
			array1.every((item1) => array2.some((item2) => item2._id === item1._id))
		);

		if (sameItems(table1, currOffer.items2) && sameItems(table2, currOffer.items1)) {
			console.log("the renegotiated offer is the same as the starting one")
			alert("You are renegotiating a trade with the same starting items!");
			return false;
		}

		if (!table1 || table1.length === 0) {
			console.log("not a valid trade: missing/empty table1");
			alert("Please select the items you would like to trade for.");
			return false;
		} else if (!table2 || table2.length === 0) {
			console.log("not a valid trade: missing/empty table2");
			alert("Please select the items you would like to offer for the new trade.");
			return false;
		}
		try {
			const response = await fetch(`${BACKEND_URL}/trades/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user1:	currOffer.user2._id,
					user2:	myUser.id,
					items1:	table1.map((item) => item._id),
					items2:	table2.map((item) => item._id),
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error("Server error:", result.error);
			}

			alert("Renegotiated trade submitted successfully");
			dispatch(renegOffer(currOffer._id));
			return true;

		} catch (err) {
			console.error("Trade error:", err);
			return false
		}
	};

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

	const handleReneg = () => {
		toggleRenegPanel();
	};

	// TODO:
	// change status of all other trades involving items in an accepted trade to "canceled"
	const handleAccept = async () => {
		if (renegVisible) {
			//await handleSubmitReneg();
			const submitted = await handleSubmitReneg();
			if (submitted) {
				try {
					const response = await fetch(`${BACKEND_URL}/trades/${currentOfferId}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							status: "renegotiated"
						}),
					});

					const result = await response.json();

					if (!response.ok) {
						console.error("Server error changing status of offer to renegotiated:", result.error);
					}

				} catch (err) {
					console.error("Renegotiating offer error:", err);
				}
			}
			return;
		}

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

	//const offers = useSelector((state) => state.offers);
	//const handleTest = () => {
	//	console.log(offers);
	//};

	return (
		<div className={styles.bottomButtons}>
			<div className={styles.optionButton} onClick={() => {
				handleLeftButton();
				handleNewTrade();
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
				handleNewTrade();
			}}>
				<ArrowForwardIosIcon fontSize="large" />
			</div>
		</div>
	);
}

export default OffersActions;
