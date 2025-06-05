import { Link } from "react-router-dom";
import styles from "../styles/NavBoxes.module.css";

import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import PageviewIcon from "@mui/icons-material/Pageview";
import SettingsIcon from "@mui/icons-material/Settings";

function NavBoxes() {
	return (
		<div className={styles.container}>
			<div className={styles.row}>
				<Link to="/profile" className={styles.link}>
					<div className={styles.buttonBox}>
						<div className={styles.iconButton}>
							<AccountBoxRoundedIcon fontSize="large" />
						</div>
						<p className={styles.description}>Your Profile</p>
					</div>
				</Link>
				<Link to="/products" className={styles.link}>
					<div className={styles.buttonBox}>
						<div className={styles.iconButton}>
							<ExploreIcon fontSize="large" />
						</div>
						<p className={styles.description}>
							Explore Trades & Offers
						</p>
					</div>
				</Link>
				<Link to="/chats" className={styles.link}>
					<div className={styles.buttonBox}>
						<div className={styles.iconButton}>
							<ChatIcon fontSize="large" />
						</div>
						<p className={styles.description}>Chats & Messages</p>
					</div>
				</Link>
			</div>
			<div className={styles.row}>
				<Link to="/inventory" className={styles.link}>
					<div className={styles.buttonBox}>
						<div className={styles.iconButton}>
							<GridViewRoundedIcon fontSize="large" />
						</div>
						<p className={styles.description}>Your Inventory</p>
					</div>
				</Link>
				<Link to="/search" className={styles.link}>
					<div className={styles.buttonBox}>
						<div className={styles.iconButton}>
							<PageviewIcon fontSize="large" />
						</div>
						<p className={styles.description}>
							Search Products or Users
						</p>
					</div>
				</Link>
				<Link to="/settings" className={styles.link}>
					<div className={styles.buttonBox}>
						<div className={styles.iconButton}>
							<SettingsIcon fontSize="large" />
						</div>
						<p className={styles.description}>Settings</p>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default NavBoxes;
