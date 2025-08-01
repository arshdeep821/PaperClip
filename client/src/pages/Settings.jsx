import Sidebar from "../components/Sidebar";
import styles from "../styles/Settings.module.css";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateUserPrivacy, logoutUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { toast } from "react-toastify";

function Settings() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
    const [privacySetting, setPrivacySetting] = useState(user.isPrivate ? "private" : "public");
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
        try {
            await dispatch(deleteUser(user.id)).unwrap();
            navigate("/login");
        } catch {
            toast.error("Failed to delete account.");
        }
    };

    const handlePrivacyChange = async (setting) => {
        const isPrivate = setting === "private";
        try {
            await dispatch(updateUserPrivacy({ userId: user.id, isPrivate })).unwrap();
            setPrivacySetting(setting);
            setShowPrivacyDropdown(false);
        } catch {
            toast.error("Failed to update privacy setting.");
        }
    };

    const handlePasswordChange = async (formData) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${user.id}/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to change password");
            }

           toast.success("Password changed successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to change password. Please try again.");
            throw error;
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                await dispatch(logoutUser()).unwrap();
                navigate("/login");
            } catch {
                alert("Failed to logout. Please try again.");
            }
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
                        <div className={styles.settingItem}>
                            <button
                                className={styles.settingsButton}
                                onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                            >
                                Privacy Settings: {privacySetting}
                            </button>
                            {showPrivacyDropdown && (
                                <div className={styles.dropdown}>
                                    <button
                                        className={`${styles.dropdownItem} ${privacySetting === "public" ? styles.active : ""}`}
                                        onClick={() => handlePrivacyChange("public")}
                                    >
                                        Public
                                    </button>
                                    <button
                                        className={`${styles.dropdownItem} ${privacySetting === "private" ? styles.active : ""}`}
                                        onClick={() => handlePrivacyChange("private")}
                                    >
                                        Private
                                    </button>
                                </div>
                            )}
                        </div>
                        <button className={styles.settingsButton} onClick={handleDeleteAccount}>Delete Account</button>
                        <button className={styles.settingsButton} onClick={() => setShowPasswordModal(true)}>Change Password</button>
                        <button className={styles.settingsButton} onClick={handleLogout}>Logout</button>
                    </div>
                </section>
            </div>
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSubmit={handlePasswordChange}
            />
        </main>
    );
}

export default Settings;
