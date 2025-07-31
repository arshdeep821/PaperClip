import styles from "../styles/BottomButtons.module.css";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { resetTrade } from "../redux/slices/tradeSlice";

const BACKEND_URL = "http://localhost:3001";

function BottomOptionButtons({ handleLeftButton, handleRightButton, bagOpen, setBagOpen }) {
	const dispatch = useDispatch();

	const product = useSelector((state) => state.trade?.product);
	const table2 = useSelector((state) => state.trade?.table2 || []);
	const user = useSelector((state) => state.user);

	const handleSubmitTrade = async () => {
		if (!product || !table2 || table2.length === 0 || !user) {
			if (!bagOpen) {
				setBagOpen(true);
			}

			// TODO: add a toast to tell users tell users to select items
			return;
		}
		try {
			const response = await fetch(`${BACKEND_URL}/trades/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user1:	product.owner._id,
					user2:	user.id,
					items1:	[product._id],
					items2:	table2.map((item) => item._id),
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error("Server error:", result.error);
			}

			alert("Trade submitted successfully");
		} catch (err) {
			console.error("Trade error:", err);
		}
	}

	const handleNewTrade = () => {
		dispatch(resetTrade());
	};

	return (
		<div className={styles.bottomButtons}>
			<div className={styles.optionButton} onClick={() => {
				handleLeftButton();
				handleNewTrade();
			}}>
				<ArrowBackIosIcon fontSize="large" />
			</div>
			<div className={styles.optionButton} onClick={handleSubmitTrade}>
				<CheckIcon fontSize="large" />
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

export default BottomOptionButtons;
