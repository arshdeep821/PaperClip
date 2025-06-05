import { Link } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";

import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import PageviewIcon from "@mui/icons-material/Pageview";
import SettingsIcon from "@mui/icons-material/Settings";

function Sidebar() {
	return (
		<div className={styles.leftNav}>
			<div className={styles.iconButton}>
				<Link to="/profile" className={styles.link}>
					<AccountBoxRoundedIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Link to="/products" className={styles.link}>
					<ExploreIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Link to="/chats" className={styles.link}>
					<ChatIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Link to="/inventory" className={styles.link}>
					<GridViewRoundedIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Link to="/search" className={styles.link}>
					<PageviewIcon fontSize="large" />
				</Link>
			</div>
			<div className={styles.iconButton}>
				<Link to="/settings" className={styles.link}>
					<SettingsIcon fontSize="large" />
				</Link>
			</div>
		</div>
	);
}

export default Sidebar;
