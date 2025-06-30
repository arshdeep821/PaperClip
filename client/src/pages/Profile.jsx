import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/userSlice";
import styles from "../styles/Profile.module.css";
import Sidebar from "../components/Sidebar";
import corgiImage from "../assets/corgi.jpg";
import hustlerIcon from "../assets/hustlericon.png";
import paperClipIcon from "../assets/PaperClip.png";
import houseIcon from "../assets/houseicon2.png";

function Profile() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState({
		name: user.name || "",
		email: user.email || "",
		city: user.city || "",
		country: user.country || "",
		tradingRadius: user.tradingRadius || 10,
	});

	const handleEdit = () => {
		setIsEditing(true);
		setEditData({
			name: user.name || "",
			email: user.email || "",
			city: user.city || "",
			country: user.country || "",
			tradingRadius: user.tradingRadius || 10,
		});
	};

	const handleSave = async () => {
		try {
			await dispatch(updateUser({ userId: user.id, userData: editData })).unwrap();
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleInputChange = (field, value) => {
		setEditData(prev => ({
			...prev,
			[field]: value
		}));
	};

	return (
		<main className={styles.profilePage}>
			<Sidebar />
			<div className={styles.header}>
				<h1 className={styles.headerTitle}>Profile</h1>
			</div>
			<div className={styles.profilePictureSection}>
				<img src={corgiImage} alt="Profile Picture" className={styles.profilePicture} />
			</div>
			<div className={styles.profileContainer}>
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Private Information</h2>
						{!isEditing ? (
							<button className={styles.editButton} onClick={handleEdit}>Edit Details</button>
						) : (
							<div>
								<button className={styles.editButton} onClick={handleSave}>Save</button>
								<button className={styles.editButton} onClick={handleCancel}>Cancel</button>
							</div>
						)}
					</div>
					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>Account Details</legend>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="username">Username:</label>
							<div className={styles.staticText}>{user.username}</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="password">Password:</label>
							<div className={styles.staticText}>••••••••</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="name">Name:</label>
							{isEditing ? (
								<input
									type="text"
									id="name"
									value={editData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									className={styles.input}
								/>
							) : (
								<div className={styles.staticText}>{user.name}</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="email">Email:</label>
							{isEditing ? (
								<input
									type="email"
									id="email"
									value={editData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									className={styles.input}
								/>
							) : (
								<div className={styles.staticText}>{user.email}</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="city">City:</label>
							{isEditing ? (
								<input
									type="text"
									id="city"
									value={editData.city}
									onChange={(e) => handleInputChange("city", e.target.value)}
									className={styles.input}
								/>
							) : (
								<div className={styles.staticText}>{user.city}</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="country">Country:</label>
							{isEditing ? (
								<input
									type="text"
									id="country"
									value={editData.country}
									onChange={(e) => handleInputChange("country", e.target.value)}
									className={styles.input}
								/>
							) : (
								<div className={styles.staticText}>{user.country}</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="radius">Radius:</label>
							{isEditing ? (
								<input
									type="number"
									id="radius"
									value={editData.tradingRadius}
									onChange={(e) => handleInputChange("tradingRadius", parseInt(e.target.value))}
									className={styles.input}
								/>
							) : (
								<div className={styles.staticText}>{user.tradingRadius}km</div>
							)}
						</div>
					</fieldset>
				</section>

				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Public Information</h2>
						<button className={styles.editButton}>Edit Details</button>
					</div>
					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>Wanted Items</legend>
						<div className={styles.inputGroup}>
							<div className={styles.staticText}>Computers, Laptops, Smartphones</div>
						</div>
					</fieldset>

					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>Achievements</legend>
						<ul className={styles.achievementsList}>
							<li className={styles.achievementItem}>
								<figure className={styles.achievementFigure}>
									<img
										className={styles.achievementIcon}
										src={hustlerIcon}
										alt="Hustler Achievement"
									/>
									<figcaption>
										<div className={styles.achievementTitle}>The Hustler</div>
										<div className={styles.achievementDescription}>
											Logged in and made at least 1 trade every day for 7 consecutive days
										</div>
									</figcaption>
								</figure>
							</li>
							<li className={styles.achievementItem}>
								<figure className={styles.achievementFigure}>
									<img
										className={styles.achievementIcon}
										src={paperClipIcon}
										alt="From Nothing Achievement"
									/>
									<figcaption>
										<div className={styles.achievementTitle}>From Nothing</div>
										<div className={styles.achievementDescription}>
											Yay! you completed your first trade
										</div>
									</figcaption>
								</figure>
							</li>
							<li className={styles.achievementItem}>
								<figure className={styles.achievementFigure}>
									<img
										className={styles.achievementIcon}
										src={houseIcon}
										alt="Closed the Deal Achievement"
									/>
									<figcaption>
										<div className={styles.achievementTitle}>Closed the Deal</div>
										<div className={styles.achievementDescription}>
											Traded up to a house!
										</div>
									</figcaption>
								</figure>
							</li>
						</ul>
					</fieldset>
				</section>
			</div>
		</main>
	);
}

export default Profile;
