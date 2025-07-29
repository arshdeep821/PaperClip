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

	const handleHelp = () => {
		let content = "";

		switch (location.pathname) {
			case "/home":
				content = location.pathname;
				break;
			case "/profile":
				content = location.pathname;
				break;
			case "/products":
				content = location.pathname;
				break;
			case "/offers":
				content = location.pathname;
				break;
			case "/chats":
				content = location.pathname;
				break;
			case "/inventory":
				content = location.pathname;
				break;
			case "/search":
				content = location.pathname;
				break;
			case "/settings":
				content = location.pathname;
				break;
		}

		setHelpContent(content);
		setOpenModal(true);
	};

	return (
		<div className={styles.leftNav}>
			<div className={styles.iconButton}>
				<Tooltip title="Home" placement="right" />

				<Link to="/home" className={styles.link}>
					<HomeFilledIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Profile" placement="right" />

				<Link to="/profile" className={styles.link}>
					<AccountBoxRoundedIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Products & Offers" placement="right" />

				<Link to="/products" className={styles.link}>
					<ExploreIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Chats" placement="right" />

				<Link to="/chats" className={styles.link}>
					<ChatIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Inventory" placement="right" />

				<Link to="/inventory" className={styles.link}>
					<BackpackIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Search" placement="right" />

				<Link to="/search" className={styles.link}>
					<PageviewIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Settings" placement="right" />

				<Link to="/settings" className={styles.link}>
					<SettingsIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.helpButton}>
				<Tooltip title="Help" placement="right" />

				<div onClick={handleHelp}>
					<HelpIcon fontSize="large" />
				</div>
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
