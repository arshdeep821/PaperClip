import { useLocation } from "react-router-dom";
import styles from "../styles/HelpModal.module.css";
import { Box, Modal, Typography } from "@mui/material";

function HelpModal({ open, handleClose }) {
	const location = useLocation();

	const PROFILE_HELP = [
		"This is the profile page.",
		"You can edit your personal details here, only you can see them.",
		"You can set your user preferences here.",
		"By updating your preferences our recommender will prioritize showing you those types of items.",
	];

	const PRODUCTS_HELP = [
		"This is where you browse items we think you'd like based on your preferences.",
		"You can change your preferences on the profile page!",
		"You can go through your recommended products by using the arrow buttons on screen!",
		"You can hover over the items to see more details about them.",
		"To send an offer for an item, you can click on the bag icon in the bottom right corner to and select your items to send in an offer for the current product.",
		"Once you've selected items of yours, click on the checkmark to lock in and send the trade!",
	];

	const OFFERS_HELP = [
		"This is where you can see offers that others have send you.",
		"You can click on an item to see more details about it.",
		"You can swipe through all of your pending offers that require your action with the arrow buttons.",
		"If you don't like the current offer, you can reject it with the X button.",
		"If you like the offer, you can accept it by clicking the checkmark, and starting a chat with the other user to dicuss the logistics regarding the swap.",
		"You can also negotiate the offer with the ? button. You can browse and select/unselect both yours and the other's users' items for the renegotiated offer.",
	];

	const CHATS_HELP = [
		"These are the chats you currently have.",
		"You can see accepted trades with a person in the chats.",
		"If you both confirmed that the item has been traded, the items will be moved to your inventories.",
	];

	const INVENTORY_HELP = [
		"Here are the items in your inventory that are up for trade.",
		"You can upload an item, edit an item, delete an item, or view its history.",
		"You can see all your trades and their statuses by clicking the 'view trades' button.",
	];

	const SEARCH_HELP = [
		"You can search items by their names, description, condition, or owner's username.",
		"You can also search users by their usernames.",
		"Click on a user's card to view their inventory and details.",
		"You can go to an item directly to offer a trade by clicking on the item card either in the search page or a user's profile.",
		"If you'd like to chat with a user, send them a message with the chat button in their profile.",
	];

	const SETTINGS_HELP = [
		"Here are some settings you can change.",
		"Other users can't find your profile through the search page if you set your account to private.",
	];

	const HELP_CONTENT = {
		"/profile": PROFILE_HELP,
		"/products": PRODUCTS_HELP,
		"/offers": OFFERS_HELP,
		"/chats": CHATS_HELP,
		"/inventory": INVENTORY_HELP,
		"/search": SEARCH_HELP,
		"/settings": SETTINGS_HELP,
	};

	const content = HELP_CONTENT[location.pathname] || ["no help available for this page"];

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="help-modal-title"
			aria-describedby="help-modal-description"
		>
			<Box className={styles.modalBox}>
				<Typography
					id="help-modal-title"
					variant="h6"
					component="h2"
					gutterBottom
					align="center"
				>
					Help for{" "}
					{location.pathname.charAt(1).toUpperCase() +
						location.pathname.slice(2)}
				</Typography>
				<Typography
					id="help-modal-description"
					variant="body1"
					align="center"
				>
					{content.map((text) => {
						return (
							<>
								<div className={styles.gap}></div>
								{text}
							</>
						);
					})}
				</Typography>
			</Box>
		</Modal>
	);
}

export default HelpModal;
