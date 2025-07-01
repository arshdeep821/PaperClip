import { useNavigate } from "react-router-dom";
import styles from "../styles/UserItem.module.css";
useNavigate

const UserItem = ({ user }) => {
	const navigate = useNavigate()

	if (!user) return null;

	const handleClick = (user) => {
		navigate(`/users/${user.username}`, { state: { user } })
	}

	return (
		<div className={styles.userCard} onClick={() => handleClick(user)}>
			<div className={styles.userInfo}>
				<div className={styles.name}>{user.name}</div>
				<div className={styles.username}>@{user.username}</div>
				<div className={styles.location}>{user.city}, {user.country}</div>
				<div className={styles.radius}>Radius: {user.tradingRadius}km</div>
			</div>
		</div>
	);
};

export default UserItem;
