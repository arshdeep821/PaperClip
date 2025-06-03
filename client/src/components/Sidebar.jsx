import styles from "../styles/Sidebar.module.css";

import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

function Sidebar() {
	return (
		<div className={styles.leftNav}>
			<div className={styles.iconButton}>
				<AccountBoxRoundedIcon fontSize="large" />
			</div>
			<div className={styles.iconButton}>
				<SettingsIcon fontSize="large" />
			</div>
			<div className={styles.iconButton}>
				<ChatIcon fontSize="large" />
			</div>
			<div className={styles.iconButton}>
				<GridViewRoundedIcon fontSize="large" />
			</div>
			<div className={styles.iconButton}>
				<AddCircleOutlineRoundedIcon fontSize="large" />
			</div>
		</div>
	);
}

export default Sidebar;
