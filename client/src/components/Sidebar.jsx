import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import Tooltip from "@mui/material/Tooltip";

import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import PageviewIcon from "@mui/icons-material/Pageview";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import BackpackIcon from '@mui/icons-material/Backpack';
import HelpIcon from '@mui/icons-material/Help';
import HelpModal from "./HelpModal";
import { useState } from "react";

function Sidebar() {
	const location = useLocation();
	const [openModal, setOpenModal] = useState(false);
	const [helpContent, setHelpContent] = useState("");

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

	const handleHelp = () => {
		let content = "";

		switch (location.pathname) {
			case "/home":
				content = HOME_HELP;
				break;
			case "/profile":
				content = PROFILE_HELP;
				break;
			case "/products":
				content = PRODUCTS_HELP;
				break;
			case "/offers":
				content = OFFERS_HELP;
				break;
			case "/chats":
				content = CHATS_HELP;
				break;
			case "/inventory":
				content = INVENTORY_HELP;
				break;
			case "/search":
				content = SEARCH_HELP;
				break;
			case "/settings":
				content = SETTINGS_HELP;
				break;
		}

		setHelpContent(content);
		setOpenModal(true);
	};

	return (
		<div className={styles.leftNav}>
			<div className={styles.iconButton}>
				<Tooltip title="Home" placement="right">
					<Link to="/home" className={styles.link}>
						<HomeFilledIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Profile" placement="right">
					<Link to="/profile" className={styles.link}>
						<AccountBoxRoundedIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Products & Offers" placement="right">
					<Link to="/products" className={styles.link}>
						<ExploreIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Chats" placement="right">
					<Link to="/chats" className={styles.link}>
						<ChatIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Inventory" placement="right">
					<Link to="/inventory" className={styles.link}>
						<BackpackIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Search" placement="right">
					<Link to="/search" className={styles.link}>
						<PageviewIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Settings" placement="right">
					<Link to="/settings" className={styles.link}>
						<SettingsIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Help" placement="right">
					<div onClick={handleHelp}>
						<HelpIcon fontSize="large" />
					</div>
				</Tooltip>
			</div>

			<HelpModal
				open={openModal}
				handleClose={() => setOpenModal(false)}
				content={helpContent}
			/>
		</div>
	);
}

export default Sidebar;
