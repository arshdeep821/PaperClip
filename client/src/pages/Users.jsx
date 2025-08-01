import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SearchItem from "../components/SearchItem";
import styles from "../styles/Users.module.css";
import MessageIcon from '@mui/icons-material/Message';
import hustlerIcon from "../assets/hustlericon.png";
import paperClipIcon from "../assets/PaperClip.png";
import houseIcon from "../assets/houseicon2.png";

const BACKEND_URL = "http://localhost:3001";

const iconMap = {
	paperClipIcon: paperClipIcon,
	hustlerIcon: hustlerIcon,
	houseIcon: houseIcon
};

function Users() {
    const { state } = useLocation();
    const navigate = useNavigate();
	const [achievements, setAchievements] = useState([]);

    if (!state || !state.user) {
        return (
            <div className={styles.usersPage}>
                <Sidebar />
                <div className={styles.mainContent}>
                    <h1>User Not Found</h1>
                </div>
            </div>
        );
    }

	useEffect(() => {
		const fetchAchievements = async () => {
			if (state && state.user && state.user._id) {
				try {
					const response = await fetch(
						`${BACKEND_URL}/users/${state.user._id}/achievements`
					);
					if (response.ok) {
						const data = await response.json();
						setAchievements(data.achievements || []);
					} else {
						setAchievements([]);
					}
				} catch (error) {
					setAchievements([]);
				}
			}
		};

		fetchAchievements();
	}, [state]);

    // Handler for starting a chat
    const handleMessageClick = () => {
        navigate("/chats", {
            state: {
                fromUserSearch: true,
                otherUserId: state.user._id,
                otherUsername: state.user.username,
            },
        });
    };

	const renderAchievements = () => {
		if (!achievements || achievements.length === 0) {
			return (
				<div className={styles.noAchievements}>
					<p>{state.user.username} has no Achievements yet.</p>
				</div>
			);
		}

		return (
			<ul className={styles.achievementsList}>
				{achievements.map((achievement, index) => {
					const iconSrc = iconMap[achievement.icon];

					return (
						<li key={index} className={styles.achievementItem}>
							<figure className={styles.achievementFigure}>
								<img
									className={styles.achievementIcon}
									src={iconSrc}
									alt={`${achievement.title} Achievement`}
								/>
								<figcaption>
									<div className={styles.achievementTitle}>
										{achievement.title}
									</div>
									<div className={styles.achievementDescription}>
										{achievement.description}
									</div>
								</figcaption>
							</figure>
						</li>
					);
				})}
			</ul>
		);
	};

    return (
        <div className={styles.usersPage}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>{state.user.username}'s Profile</h1>
                    <button
                        className={styles.messageButton}
                        onClick={handleMessageClick}
                        title="Message this user"
                    >
                        <MessageIcon />
                    </button>
                </div>
				<h2>{state.user.username}'s Inventory</h2>
                <div className={styles.inventorySection}>
                    {state.user.inventory.length === 0 ? (
                        <h3 className={styles.emptyInventory}>Inventory is empty</h3>
                    ) : (
                        <div className={styles.inventoryGrid}>
                            {state.user.inventory.map((product) => (
                                <SearchItem key={product._id} item={product} />
                            ))}
                        </div>
                    )}
                </div>
				<br />
				<br />
				<br />
				<h2>{state.user.username}'s Achievements</h2>
				<div className={styles.achievementsContainer}>
					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>Achievements</legend>
						{renderAchievements()}
					</fieldset>
				</div>
            </div>
        </div>
    );
}

export default Users;
