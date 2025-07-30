import { useLocation } from "react-router-dom";
import styles from "../styles/HelpModal.module.css";
import { Box, Modal, Typography } from "@mui/material";

function HelpModal({ open, handleClose }) {
	const location = useLocation();

	const HOME_HELP = ``;

	const PROFILE_HELP = `
		This is the profile page.\n
		You can edit your personal details, only you can see them.\n
		You can set your preference of items you'd like to trade for. Our recommender will prioritize those.\n
	`;

	const PRODUCTS_HELP = `
		This is where you browse items we think you'd like. You can hover over them to see details.\n
		Click on the bag icon to open your inventory and select items you would offer for the current product.\n
		Click on the checkmark to lock in and send the trade!\n
		If you'd like to see other items, use the arrow buttons or your arrow keys.\n
	`;

	const OFFERS_HELP = `
		This is where you can see trade offers for your items.\n
		You can click on an item to see more details.\n
		You can see all offers you currently have with the arrow buttons.\n
		If you don't like the current offer, you can reject it with the X button.\n
		If you like the offer, you can accept it and discuss a meeting spot with the other person by clicking the checkmark.\n
		You can also modify the offer with the ? button to initiate a renegotiation. You can select both yours and the other's items for the new trade.\n
	`;

	const CHATS_HELP = `
		These are the chats you currently have.\n
		You can see accepted trades with a person in the chats.\n
		If you both confirmed that the item has been traded, the items will be moved to your inventories.\n
	`;

	const INVENTORY_HELP = `
		Here are the items in your inventory that are up for trade.\n
		You can upload an item, edit an item, delete an item, or view its history.\n
		You can see all your trades and their statuses by clicking the "view trades" button.\n
	`;

	const SEARCH_HELP = `
		You can search items by their names, description, condition, or owner's username.\n
		You can also search users by their usernames.\n
		Click on a user's card to view their inventory and details.\n
		You can go to an item directly to offer a trade by clicking on the item card either in the search page or a user's profile.\n
		If you'd like to chat with a user, send them a message with the chat button in their profile.\n
	`;

	const SETTINGS_HELP = `
		Here are some settings you can do.\n
		Other users can't find your profile through the search page if you set your account to private.\n
	`;

	const HELP_CONTENT = {
		"/home": HOME_HELP,
		"/profile": PROFILE_HELP,
		"/products": PRODUCTS_HELP,
		"/offers": OFFERS_HELP,
		"/chats": CHATS_HELP,
		"/inventory": INVENTORY_HELP,
		"/search": SEARCH_HELP,
		"/settings": SETTINGS_HELP,
	};

	const content = HELP_CONTENT[location.pathname] || "no help available for this page";

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
				>
					Help for {location.pathname.slice(1)}
				</Typography>
				<Typography
					id="help-modal-description"
					variant="body1"
				>
					{content}
				</Typography>
			</Box>
		</Modal>
	);
}

export default HelpModal;
