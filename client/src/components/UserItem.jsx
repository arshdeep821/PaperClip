import styles from "../styles/UserItem.module.css";

const UserItem = ({ user }) => {
	if (!user) return null;
	return (
		<div className={styles.userCard}>
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
