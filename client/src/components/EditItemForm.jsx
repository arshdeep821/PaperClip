import { useState, useEffect } from 'react';
import styles from '../styles/Inventory.module.css';

const EditItemForm = ({ item, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        condition: ''
    });

    useEffect(() => {
        // Initialize form with item data
        setFormData({
            name: item.name,
            description: item.description,
            category: item.category,
            condition: item.condition
        });
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        onSubmit({ ...formData, id: item.id });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Edit Item</h2>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="condition">Condition</label>
                        <select
                            id="condition"
                            name="condition"
                            value={formData.condition}
                            onChange={(e) => handleChange(e)}
                            required
                        >
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                            <option value="Damaged">Damaged</option>
                        </select>
                    </div>
                    <div className={styles.formButtons}>
                        <button type="submit" className={styles.submitButton}>
                            Save Changes
                        </button>
                        <button 
                            type="button" 
                            className={styles.cancelButton}
                            onClick={() => onClose()}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItemForm;