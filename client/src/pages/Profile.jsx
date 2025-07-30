import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, updateUserProfilePicture } from "../redux/slices/userSlice";
import styles from "../styles/Profile.module.css";
import Sidebar from "../components/Sidebar";
import UserPreferences from "../components/UserPreferences";
import defaultProfileImage from "../assets/PaperclipDefault.png";
import hustlerIcon from "../assets/hustlericon.png";
import paperClipIcon from "../assets/PaperClip.png";
import houseIcon from "../assets/houseicon2.png";
import { Country, City } from "country-state-city";

const BACKEND_URL = "http://localhost:3001";

function Profile() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const fileInputRef = useRef(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState({
		username: user.username || "",
		name: user.name || "",
		email: user.email || "",
		city: user.city || "",
		country: user.country || "",
		tradingRadius: user.tradingRadius || 10,
	});
	const [errors, setErrors] = useState({});
	const [usernameAvailable, setUsernameAvailable] = useState(true);
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [cities, setCities] = useState([]);
	const [achievements, setAchievements] = useState([]);
	const [achievementsLoading, setAchievementsLoading] = useState(false);
	const countries = Country.getAllCountries();

	// Icon mapping for achievements
	const iconMap = {
		paperClipIcon: paperClipIcon,
		hustlerIcon: hustlerIcon,
		houseIcon: houseIcon
	};

	// Fetch achievements when component mounts or user changes
	useEffect(() => {
		const fetchAchievements = async () => {
			if (user.isLoggedIn && user.id) {
				setAchievementsLoading(true);
				try {
					const response = await fetch(`${BACKEND_URL}/users/${user.id}/achievements`);
					if (response.ok) {
						const data = await response.json();
						setAchievements(data.achievements || []);
					} else {
						// console.error('Failed to fetch achievements');
						setAchievements([]);
					}
				} catch (error) {
					// console.error('Error fetching achievements:', error);
					setAchievements([]);
				} finally {
					setAchievementsLoading(false);
				}
			}
		};

		fetchAchievements();
	// }, [user.isLoggedIn, user.id, location.pathname]);
	}, [user.isLoggedIn, user.id]);

	useEffect(() => {
		if (editData.country) {
			const countryObject = countries.find(
				(c) => c.name.toLowerCase() === editData.country.toLowerCase()
			);
			if (countryObject) {
				const isoCode = countryObject.isoCode;
				const cityList = City.getCitiesOfCountry(isoCode);
				setCities(cityList || []);
			}
		} else {
			setCities([]);
		}
	}, [editData.country, countries]);

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

		const checkUsernameAvailability = async (username) => {
		if (username === user.username) {
			setUsernameAvailable(true);
			return;
		}

		setIsCheckingUsername(true);
		try {
			const response = await fetch(`http://localhost:3001/users/check-username/${username}`);
			const data = await response.json();
			setUsernameAvailable(data.available);
		} catch {
			setUsernameAvailable(false);
		} finally {
			setIsCheckingUsername(false);
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!editData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!editData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(editData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!editData.country) {
			newErrors.country = "Country is required";
		} else {
			const countryExists = countries.find(
				(c) => c.name.toLowerCase() === editData.country.toLowerCase()
			);
			if (!countryExists) {
				newErrors.country = "Please select a valid country from the list";
			}
		}

		if (!editData.city) {
			newErrors.city = "City is required";
		} else {
			const cityExists = cities.find(
				(c) => c.name.toLowerCase() === editData.city.toLowerCase()
			);
			if (!cityExists) {
				newErrors.city = "Please select a valid city from the list";
			}
		}

		if (editData.tradingRadius < 0) {
			newErrors.tradingRadius = "Trading radius cannot be negative";
		} else if (editData.tradingRadius > 1000) {
			newErrors.tradingRadius = "Trading radius cannot exceed 1000km";
		}

		if (!usernameAvailable && editData.username !== user.username) {
			newErrors.username = "Username is not available";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleEdit = () => {
		setIsEditing(true);
		setEditData({
			username: user.username || "",
			name: user.name || "",
			email: user.email || "",
			city: user.city || "",
			country: user.country || "",
			tradingRadius: user.tradingRadius || 10,
		});
		setErrors({});
		setUsernameAvailable(true);
	};

	const handleSave = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			const selectedCity = cities.find(
				(c) => c.name.toLowerCase() === editData.city.toLowerCase()
			);

			const lat = selectedCity?.latitude || null;
			const lon = selectedCity?.longitude || null;

			const userDataWithCoords = {
				...editData,
				lat,
				lon,
			};

			await dispatch(
				updateUser({ userId: user.id, userData: userDataWithCoords })
			).unwrap();
			setIsEditing(false);
			setErrors({});
		} catch (error) {
			console.error("Failed to update profile:", error);
			alert("Failed to update profile. Please try again.");
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleInputChange = (field, value) => {
		setEditData((prev) => ({
			...prev,
			[field]: value,
		}));

		if (field === "country") {
			setEditData((prev) => ({ ...prev, city: "" }));
		}

		if (field === "username" && value !== user.username) {
			checkUsernameAvailability(value);
		}

		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: "" }));
		}
	};

	const handleChangePicture = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		if (!allowedTypes.includes(file.type)) {
			alert('Please select a valid image file (JPEG, PNG, or GIF)');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			alert('File size must be less than 5MB');
			return;
		}

		try {
			await dispatch(updateUserProfilePicture({ userId: user.id, file })).unwrap();
		} catch (error) {
			alert(error.message || 'Failed to update profile picture');
		}
	};

	const renderAchievements = () => {
		if (achievementsLoading) {
			return (
				<div className={styles.noAchievements}>
					<p>Loading achievements...</p>
				</div>
			);
		}

		if (!achievements || achievements.length === 0) {
			return (
				<div className={styles.noAchievements}>
					<p>No achievements yet. Start trading to earn achievements!</p>
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

	console.log(achievements);
	

	return (
		<main className={styles.profilePage}>
			<Sidebar />
			<div className={styles.header}>
				<h1 className={styles.headerTitle}>Profile</h1>
			</div>
			<div className={styles.profilePictureSection}>
				<img
					src={user.profilePicture ? `http://localhost:3001/static/${user.profilePicture}` : defaultProfileImage}
					alt="Profile Picture"
					className={styles.profilePicture}
				/>
				<button
					className={styles.changePictureButton}
					onClick={handleChangePicture}
				>
					Change Image
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					style={{ display: 'none' }}
				/>
			</div>
			<div className={styles.profileContainer}>
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>
							Private Information
						</h2>
						{!isEditing ? (
							<button
								className={styles.editButton}
								onClick={handleEdit}
							>
								Edit Details
							</button>
						) : (
							<div>
								<button
									className={styles.editButton}
									onClick={handleSave}
								>
									Save
								</button>
								<button
									className={styles.editButton}
									onClick={handleCancel}
								>
									Cancel
								</button>
							</div>
						)}
					</div>
					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>
							Account Details
						</legend>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="username">
								Username:
							</label>
							{isEditing ? (
								<div>
								<input
									type="text"
									id="username"
									value={editData.username}
									onChange={(e) =>
										handleInputChange(
											"username",
											e.target.value
										)
									}
										className={`${styles.input} ${errors.username ? styles.inputError : ""}`}
										disabled
									/>
									<div className={styles.helpText}>
										Username cannot be changed
									</div>
									{isCheckingUsername && (
										<div className={styles.checkingText}>
											Checking availability...
										</div>
									)}
									{errors.username && (
										<div className={styles.errorText}>
											{errors.username}
										</div>
									)}
								</div>
							) : (
								<div className={styles.staticText}>
									{user.username}
								</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="name">
								Name:
							</label>
							{isEditing ? (
								<div>
								<input
									type="text"
									id="name"
									value={editData.name}
									onChange={(e) =>
										handleInputChange(
											"name",
											e.target.value
										)
									}
										className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
									/>
									{errors.name && (
										<div className={styles.errorText}>
											{errors.name}
										</div>
									)}
								</div>
							) : (
								<div className={styles.staticText}>
									{user.name}
								</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="email">
								Email:
							</label>
							{isEditing ? (
								<div>
								<input
									type="email"
									id="email"
									value={editData.email}
									onChange={(e) =>
										handleInputChange(
											"email",
											e.target.value
										)
									}
										className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
									/>
									{errors.email && (
										<div className={styles.errorText}>
											{errors.email}
										</div>
									)}
								</div>
							) : (
								<div className={styles.staticText}>
									{user.email}
								</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="country">
								Country:
							</label>
							{isEditing ? (
								<div>
								<input
										id="country"
									type="text"
										value={editData.country}
									onChange={(e) =>
										handleInputChange(
												"country",
											e.target.value
										)
									}
										list="country-options"
										className={`${styles.input} ${errors.country ? styles.inputError : ""}`}
									/>
									<datalist id="country-options">
										{countries.map((country) => (
											<option key={country.isoCode} value={country.name}>
												{country.name}
											</option>
										))}
									</datalist>
									{errors.country && (
										<div className={styles.errorText}>
											{errors.country}
										</div>
									)}
								</div>
							) : (
								<div className={styles.staticText}>
									{user.country}
								</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="city">
								City:
							</label>
							{isEditing ? (
								<div>
								<input
										id="city"
									type="text"
										value={editData.city}
									onChange={(e) =>
										handleInputChange(
												"city",
											e.target.value
										)
									}
										list="city-options"
										className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
										disabled={!editData.country}
									/>
									<datalist id="city-options">
										{cities.map((city) => (
											<option
												key={`${city.name}-${city.latitude}-${city.longitude}`}
												value={city.name}
											/>
										))}
									</datalist>
									{errors.city && (
										<div className={styles.errorText}>
											{errors.city}
										</div>
									)}
								</div>
							) : (
								<div className={styles.staticText}>
									{user.city}
								</div>
							)}
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label} htmlFor="radius">
								Trading Radius:
							</label>
							{isEditing ? (
								<div>
								<input
									type="number"
									id="radius"
									value={editData.tradingRadius}
									onChange={(e) =>
										handleInputChange(
											"tradingRadius",
												parseInt(e.target.value) || 0
										)
									}
										min="0"
										max="1000"
										className={`${styles.input} ${errors.tradingRadius ? styles.inputError : ""}`}
									/>
									{errors.tradingRadius && (
										<div className={styles.errorText}>
											{errors.tradingRadius}
										</div>
									)}
								</div>
							) : (
								<div className={styles.staticText}>
									{user.tradingRadius}km
								</div>
							)}
						</div>
					</fieldset>
				</section>

				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>
							Public Information
						</h2>
					</div>

					<UserPreferences />

					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>Achievements</legend>
						{renderAchievements()}
					</fieldset>
				</section>
			</div>
		</main>
	);
}

export default Profile;
