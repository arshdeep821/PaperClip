import { Link } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import Tooltip from "@mui/material/Tooltip";

import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import PageviewIcon from "@mui/icons-material/Pageview";
import SettingsIcon from "@mui/icons-material/Settings";
import BackpackIcon from '@mui/icons-material/Backpack';
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";

function Sidebar() {
	return (
		<div className={styles.leftNav}>
			<div className={styles.iconButton}>
				<Tooltip title="Profile" placement="right">
					<Link to="/profile" className={styles.link}>
						<AccountBoxRoundedIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Products" placement="right">
					<Link to="/products" className={styles.link}>
						<ExploreIcon fontSize="large" />
					</Link>
				</Tooltip>
			</div>
			<div className={styles.iconButton}>
				<Tooltip title="Offers" placement="right">
					<Link to="/offers" className={styles.link}>
						<SwapHorizontalCircleIcon fontSize="large" />
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
		</div>
	);
}

export default Sidebar;
