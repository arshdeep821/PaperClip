import { Link } from "react-router-dom";
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
	const [openModal, setOpenModal] = useState(false);

	return (
		<div className={styles.leftNav}>
			<Tooltip title="Home" placement="right">
				<div className={styles.iconButton}>
					<Link to="/home" className={styles.link}>
						<HomeFilledIcon fontSize="large" />
					</Link>
				</div>
			</Tooltip>
			<Tooltip title="Profile" placement="right">
				<div className={styles.iconButton}>
					<Link to="/profile" className={styles.link}>
						<AccountBoxRoundedIcon fontSize="large" />
					</Link>
				</div>
			</Tooltip>
			<Tooltip title="Products & Offers" placement="right">
				<div className={styles.iconButton}>
					<Link to="/products" className={styles.link}>
						<ExploreIcon fontSize="large" />
					</Link>
				</div>
			</Tooltip>
			<Tooltip title="Chats" placement="right">
				<div className={styles.iconButton}>
					<Link to="/chats" className={styles.link}>
						<ChatIcon fontSize="large" />
					</Link>
				</div>
			</Tooltip>
			<Tooltip title="Inventory" placement="right">
				<div className={styles.iconButton}>
					<Link to="/inventory" className={styles.link}>
						<BackpackIcon fontSize="large" />
					</Link>
				</div>
			</Tooltip>
			<Tooltip title="Search" placement="right">
				<div className={styles.iconButton}>
					<Link to="/search" className={styles.link}>
						<PageviewIcon fontSize="large" />
					</Link>
				</div>
			</Tooltip>
			<Tooltip title="Settings" placement="right">
				<div className={styles.iconButton}>
					<Link to="/settings" className={styles.link}>
						<SettingsIcon fontSize="large" />
					</Link>
				</div>
			</Tooltip>
			<Tooltip title="Help" placement="right">
				<div className={`${styles.iconButton} ${styles.helpButton}`}>
						<div onClick={() => setOpenModal(true)}>
							<HelpIcon fontSize="large" />
						</div>
				</div>
			</Tooltip>

			<HelpModal
				open={openModal}
				handleClose={() => setOpenModal(false)}
			/>
		</div>
	);
}

export default Sidebar;
