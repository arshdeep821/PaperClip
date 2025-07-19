import { useEffect, useState } from "react";
import styles from "../styles/InMessageTradePanel.module.css";
import UserTradePopup from "./UserTradePopup"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";

const BACKEND_URL = "http://localhost:3001";

const getTradesFor2Users = async (id1, id2) => {
	try {
		const response = await fetch(
			`${BACKEND_URL}/trades/${id1}/${id2}`
		);
		if (response.ok) {
			const data = await response.json();
			return data
		}
	} catch (err) {
		console.error("Error fetching conversations:", err);
	}
}

const InMessageTradePanel = ({ currentUser, otherUser }) => {
	const [trades, setTrades] = useState([]);
	const [currTradeIdx, setCurrTradeIdx] = useState(0);
	const [currUserConfirmation, setCurrUserConfirmation] = useState(null);
	const [otherUserConfirmation, setOtherUserConfirmation] = useState(null);
	const [otherUsername, setOtherUsername] = useState("");
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const loadTrades = () => {
		getTradesFor2Users(currentUser, otherUser).then((trades) => {
			setTrades(trades);
			setCurrTradeIdx(0);
		});
	};

	useEffect(() => {
		loadTrades();
	}, [currentUser, otherUser]);

	useEffect(() => {
		if (trades.length === 0) return;

		const currTrade = trades[currTradeIdx];
		if (currTrade.tradeConfirmation === null) return;

		if (currTrade.user1._id === currentUser) {
			setCurrUserConfirmation(
				currTrade.tradeConfirmation.user1Confirmation
			);

			setOtherUserConfirmation(
				currTrade.tradeConfirmation.user2Confirmation
			);
			setOtherUsername(currTrade.user2.username)
		} else {
			setCurrUserConfirmation(
				currTrade.tradeConfirmation.user2Confirmation
			);

			setOtherUserConfirmation(
				currTrade.tradeConfirmation.user1Confirmation
			);
			setOtherUsername(currTrade.user1.username);
		}
	}, [trades, currTradeIdx]);

	const goToNextTrade = () => {
		if (trades.length === 0) return;
		setCurrTradeIdx((currTradeIdx + 1) % trades.length);
	};

	const goToPrevTrade = () => {
		if (trades.length === 0) return;
		setCurrTradeIdx((currTradeIdx - 1 + trades.length) % trades.length);
	};

	if (trades.length === 0) {
		return (
			<></>
		);
	}

	const currTrade = trades[currTradeIdx];

	const updateCurrUserConfirmation = async () => {
		const updatedVal = !currUserConfirmation;
		setCurrUserConfirmation(updatedVal);

		const requestBody = {
			userId: currentUser,
			updatedUserConfirmation: updatedVal,
		};

		const response = await fetch(
			`${BACKEND_URL}/trades/${currTrade._id}/confirmation`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			}
		);

		if (!response.ok) {
			const result = await response.json();
			console.error(
				"Server error updating the user confirmation:",
				result.error
			);
		}
	};

	const executeTrade = async () => {
		const tradeBody = {
			user1Id: currTrade.user1._id,
			user2Id: currTrade.user2._id,
			items1Id: currTrade.items1,
			items2Id: currTrade.items2,
			tradeId: currTrade._id
		};

		const tradeResponse = await fetch(`${BACKEND_URL}/trades/execute`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tradeBody),
		});

		const tradeResult = await tradeResponse.json();

		if (!tradeResponse.ok) {
			console.error("Server error executing the trade:", tradeResult.error);
		} else {
			await cancelConflictingTrades();
			loadTrades();
			alert("The Trade was a success!")
		}
	};

	const cancelConflictingTrades = async () => {
		const tradedItemIds = new Set([
			...currTrade.items1,
			...currTrade.items2,
		]);

		const allTradesResponse = await fetch(`${BACKEND_URL}/trades/`);
		const allTrades = await allTradesResponse.json();

		if (!allTradesResponse.ok) {
			console.error("Error fetching pending trades:", allTrades.error);
			return;
		}

		const conflictingTrades = allTrades.filter((trade) => {
			if (trade._id === currTrade._id) return false;

			const itemIds = [
				...(trade.items1 || []).map((itemId) => String(itemId)),
				...(trade.items2 || []).map((itemId) => String(itemId)),
			];

			return itemIds.some((id) => tradedItemIds.has(id));
		});

		await Promise.all(
			conflictingTrades.map((trade) =>
				fetch(`${BACKEND_URL}/trades/${trade._id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						status: "cancelled",
					}),
				}).catch((err) =>
					console.error(`Failed to cancel trade ${trade._id}:`, err)
				)
			)
		);
	};

	let middleSectionText = "";
	let middleSectionButton = "";
	if (currTrade.status === "accepted") {
		if (currUserConfirmation && otherUserConfirmation) {
			middleSectionText = `You & ${otherUsername} have both confirmed you successfully swapped items!`;
			middleSectionButton = (
				<Button variant="outlined" onClick={executeTrade}>
					Swap Items in App
				</Button>
			);
		} else if (currUserConfirmation) {
			middleSectionText = `You have confirmed the swap! Waiting for ${otherUsername}'s confirmation!`;
			middleSectionButton = (
				<Button variant="outlined" onClick={updateCurrUserConfirmation}>
					Cancel Trade Swap Confirmation
				</Button>
			);
		} else if (otherUserConfirmation) {
			middleSectionText = `${otherUsername} has confirmed the swap, please confirm that below!`;
			middleSectionButton = (
				<Button variant="outlined" onClick={updateCurrUserConfirmation}>
					Confirm Successful Trade Swap
				</Button>
			);
		} else {
			middleSectionText =
				"If you have successfully swapped items, please confirm that below!";
			middleSectionButton = (
				<Button variant="outlined" onClick={updateCurrUserConfirmation}>
					Confirm Successful Trade Swap
				</Button>
			);
		}
	} else {
		middleSectionText = `This trade is currently ${currTrade.status}!`
	}

	return (
		<>
			<div className={styles.panelBox}>
				<div className={styles.arrowButton} onClick={goToPrevTrade}>
					<ArrowBackIosNewIcon fontSize="large" />
				</div>
				<div className={styles.panelText}>
					<div style={{ fontWeight: "bold" }}>
						Your Trades with {otherUsername}:
					</div>
					{middleSectionText}
					<div className={styles.panelButtons}>
						{middleSectionButton}
						<Button
							variant="outlined"
							onClick={() => setIsPopupOpen(true)}
						>
							View Trade
						</Button>
					</div>
				</div>
				<div className={styles.arrowButton} onClick={goToNextTrade}>
					<ArrowForwardIosIcon fontSize="large" />
				</div>
			</div>
			{isPopupOpen && (
				<UserTradePopup
					currentUser={currentUser}
					tradeId={currTrade._id}
					onClose={() => setIsPopupOpen(false)}
				/>
			)}
		</>
	);
};

export default InMessageTradePanel;
