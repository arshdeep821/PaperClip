import Sidebar from "../components/Sidebar";
import styles from "../styles/Settings.module.css";

function Settings() {
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
                        <button className={styles.settingsButton}>Delete Account</button>
                        <button className={styles.settingsButton}>Privacy Settings</button>
                        <button className={styles.settingsButton}>Change Password</button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Settings;
