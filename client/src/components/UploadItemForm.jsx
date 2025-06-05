import { useState } from "react";
import { TextField, MenuItem, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/UploadItemForm.module.css";

const conditions = ["New", "Used", "Damaged"];

const UploadItemForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        condition: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
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
                    value={formData.name}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    required
                />
                <TextField
                    label="Item Description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    multiline
                    rows={4}
                    required
                />
                <TextField
                    label="Condition"
                    name="condition"
                    value={formData.condition}
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
                    {formData.image && (
                        <p className={styles.fileName}>Selected: {formData.image.name}</p>
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
