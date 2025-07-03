import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import styles from "../styles//UserPreferences.module.css";
import { updateUserPreferences } from "../redux/slices/userSlice";
import DeleteIcon from "@mui/icons-material/Delete";

const UserPreferences = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [categories, setCategories] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [preferences, setPreferences] = useState(
		(user?.userPreferences || []).map((pref) => ({
			categoryName: pref.category.name,
			categoryId: pref.category._id,
			description: pref.description,
		}))
	);

	// TEMP - TODO - Make a categories redux slice
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch("http://localhost:3001/categories");
				if (!res.ok) {
					throw new Error("Failed to fetch categories");
				}
				const data = await res.json();
				setCategories(data);
			} catch (err) {
				console.error("Error:", err);
			}
		};

		fetchCategories();
	}, []);

	const handleChange = (index, field, value) => {
		setPreferences((prevPrefs) =>
			prevPrefs.map((pref, i) => {
				if (i !== index) return pref;

				if (field === "category") {
					const selectedCategory = categories.find(
						(c) => c._id === value
					);
					if (!selectedCategory) return pref;
					return {
						...pref,
						categoryId: selectedCategory._id,
						categoryName: selectedCategory.name,
					};
				}

				return { ...pref, [field]: value };
			})
		);
	};

	const handleUpdate = () => {
		const formattedPreferences = preferences.map((pref) => ({
			category: pref.categoryId,
			description: pref.description,
		}));

		dispatch(
			updateUserPreferences({
				userId: user.id,
				newUserPreferences: { userPreferences: formattedPreferences },
			})
		);

		setEditMode(false);
	};

	const handleCancel = () => {
		setPreferences(
			(user?.userPreferences || []).map((pref) => ({
				categoryName: pref.category.name,
				categoryId: pref.category._id,
				description: pref.description,
			}))
		);
		setEditMode(false);
	};

	const handleAddPreference = () => {
		setPreferences((prev) => [
			...prev,
			{
				categoryName: "Please Select a Category",
				categoryId: null,
				description: "",
			},
		]);
	};

	const handleDeletePreference = (indexToDelete) => {
		setPreferences((prev) =>
			prev.filter((_, index) => index !== indexToDelete)
		);
	};

	const renderButtons = () => (
		<div className={styles.buttonRow}>
			<button className={styles.button} onClick={handleUpdate}>
				Save
			</button>
			<button className={styles.button} onClick={handleCancel}>
				Cancel
			</button>
			<button className={styles.button} onClick={handleAddPreference}>
				+
			</button>
		</div>
	);

	if (!preferences || preferences.length === 0) {
		return (
			<div className={styles.wrapper}>
				<div className={styles.titleRow}>
					<h3 className={styles.title}>
						Your Preferences: What do you want?
					</h3>
					{editMode ? (
						renderButtons()
					) : (
						<button
							className={styles.button}
							onClick={() => setEditMode(true)}
						>
							Edit
						</button>
					)}
				</div>
				<h3 className={styles.title}>No preferences set.</h3>
			</div>
		);
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.titleRow}>
				<h3 className={styles.title}>
					Your Preferences: What do you want?
				</h3>
				{editMode ? (
					renderButtons()
				) : (
					<button
						className={styles.button}
						onClick={() => setEditMode(true)}
					>
						Edit
					</button>
				)}
			</div>

			<div className={styles.preferenceList}>
				{preferences.map((pref, index) => (
					<div key={index} className={styles.preferenceItem}>
						{editMode ? (
							<div className={styles.editRow}>
								<select
									className={styles.categoryInput}
									value={pref.categoryId}
									onChange={(e) =>
										handleChange(
											index,
											"category",
											e.target.value
										)
									}
								>
									<option value="">Select a category</option>
									{categories.map((cat) => (
										<option key={cat._id} value={cat._id}>
											{cat.name}
										</option>
									))}
								</select>
								<input
									className={styles.descriptionInput}
									value={pref.description}
									onChange={(e) =>
										handleChange(
											index,
											"description",
											e.target.value
										)
									}
									placeholder="Description"
								/>
								<DeleteIcon
									className={styles.deleteIcon}
									onClick={() =>
										handleDeletePreference(index)
									}
								/>
							</div>
						) : (
							<>
								<div className={styles.category}>
									{pref.categoryName}
								</div>
								<div className={styles.description}>
									{pref.description}
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default UserPreferences;
