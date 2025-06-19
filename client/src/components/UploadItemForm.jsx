import { useEffect, useState } from "react";
import { TextField, MenuItem, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/UploadItemForm.module.css";

const conditions = ["New", "Used", "Damaged"];

const UploadItemForm = ({ onClose, onSubmit }) => {
    const [fields, setFields] = useState({
        name: "",
        description: "",
		category: "",
        condition: "",
        image: null,
    });

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		fetch("http://localhost:3001/categories")
		.then(response => response.json())
		.then(data => {
			const fetchedCategories = data.map(category => ({
				id: category._id,
				name: category.name,
			}));

			console.log(fetchedCategories);
			setCategories(fetchedCategories);
		}).catch(error => console.error("Error fetching categories:", error));
	}, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFields((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

		const data = new FormData();

		data.append("name", fields.name);
		data.append("description", fields.description);
		data.append("category", fields.category.id);
		data.append("owner", "123456789012345678901234");
		data.append("condition", fields.condition);

		if (fields.image) {
			data.append("image", fields.image);
		}

		try {
			console.log(data);
			const response = await fetch("http://localhost:3001/items", {
				method: "POST",
				headers: { "Content-Type": "multipart/form-data" },
				body: data,
			});

			const result = await response.json();

			if (!response.ok) {
				console.error("Server error:", result.error);
			}

			console.log("Item created:", result);
			onSubmit(result);
			onClose();

		} catch (error) {
			console.error("Submission error:", error);
		}
    };

    return (
        <div className={styles.formOverlay}>
            <form className={styles.uploadForm} onSubmit={(e) => handleSubmit(e)}>
                <IconButton className={styles.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>

                <h2>Upload New Item</h2>
                <TextField
                	label="Item Name"
                    name="name"
                    value={fields.name}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    required
                />
                <TextField
                    label="Item Description"
                    name="description"
                    value={fields.description}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    multiline
                    rows={4}
                    required
                />
                <TextField
                    label="Item Category"
                    name="category"
                    value={fields.category}
                    onChange={(e) => handleChange(e)}
                    select
                    fullWidth
                    required
                >
                    {categories.length > 0 ? (
						categories.map((category) => (
                        <MenuItem key={category.id} value={category}>
							{category.name}
                        </MenuItem>
						))) : (
							<MenuItem disabled>No categories found</MenuItem>
						)
					}
                </TextField>
                <TextField
                    label="Condition"
                    name="condition"
                    value={fields.condition}
                    onChange={(e) => handleChange(e)}
                    select
                    fullWidth
                    required
                >
                    {conditions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                <div className={styles.fileUploadWrapper}>
                    <label htmlFor="image-upload" className={styles.fileUploadLabel}>
                        Choose an Image
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={(e) => handleChange(e)}
                        required
                        className={styles.hiddenFileInput}
                    />
                    {fields.image && (
                        <p className={styles.fileName}>Selected: {fields.image.name}</p>
                    )}
                </div>

                <Button variant="contained" type="submit" fullWidth>
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default UploadItemForm;
