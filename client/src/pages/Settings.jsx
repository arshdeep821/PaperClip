import Sidebar from "../components/Sidebar";
import styles from "../styles/Settings.module.css";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

function Settings() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
        try {
            await dispatch(deleteUser(user.id)).unwrap();
            navigate("/login");
        } catch (err) {
            alert("Failed to delete account.");
        }
    };

    return (
        <main className={styles.settingsPage}>
            <Sidebar />
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>Settings</h1>
            </div>
            <div className={styles.settingsContainer}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Account Settings</h2>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.settingsButton}>Privacy Settings</button>
                        <button className={styles.settingsButton} onClick={handleDeleteAccount}>Delete Account</button>
                        <button className={styles.settingsButton}>Change Password</button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Settings;
