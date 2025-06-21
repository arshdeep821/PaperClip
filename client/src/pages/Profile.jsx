import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import styles from "../styles/Profile.module.css";
import Sidebar from "../components/Sidebar";
import corgiImage from "../assets/corgi.jpg";

const BACKEND_URL = "http://localhost:3001";

function Profile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    city: user.city || "",
    country: user.country || "",
    tradingRadius: user.tradingRadius || 10,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user._id || user._id === "null" || user._id === null || user._id === undefined) {
      alert("User ID is missing or invalid. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password ? form.password : undefined,
          city: form.city,
          country: form.country,
          tradingRadius: form.tradingRadius,
        }),
      });
      const updatedUser = await response.json();
      if (!response.ok) {
        if (updatedUser.error && updatedUser.error.includes("Username")) {
          alert(updatedUser.error);
        } else if (updatedUser.error && updatedUser.error.includes("Email")) {
          alert(updatedUser.error);
        } else {
          alert("Error updating user");
        }
        setLoading(false);
        return;
      }
      dispatch(setUser(updatedUser));
      setEditMode(false);
    } catch {
      alert("Network error. Please try again.");
    }
    setLoading(false);
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
            {!editMode && (
              <button className={styles.editButton} onClick={handleEdit}>Edit Details</button>
            )}
          </div>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Account Details</legend>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username">Username:</label>
              <div className={styles.staticText}>{user.username || "Not available"}</div>
            </div>
            {editMode ? (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="name">Name:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="email">Email:</label>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="password">Password:</label>
                  <input
                    className={styles.input}
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="city">City:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="country">Country:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="tradingRadius">Radius:</label>
                  <input
                    className={styles.input}
                    type="number"
                    name="tradingRadius"
                    value={form.tradingRadius}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.buttonRow}>
                  <button className={styles.saveButton} onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button className={styles.cancelButton} onClick={handleCancel} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="name">Name:</label>
                  <div className={styles.staticText}>{user.name || "Not available"}</div>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="email">Email:</label>
                  <div className={styles.staticText}>{user.email || "Not available"}</div>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="city">City:</label>
                  <div className={styles.staticText}>{user.city || "Not available"}</div>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="country">Country:</label>
                  <div className={styles.staticText}>{user.country || "Not available"}</div>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="radius">Radius:</label>
                  <div className={styles.staticText}>{user.tradingRadius ? `${user.tradingRadius}km` : "Not available"}</div>
                </div>
              </>
            )}
          </fieldset>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Public Information</h2>
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
                    src="/src/assets/hustlericon.png"
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
                    src="/src/assets/PaperClip.png"
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
                    src="/src/assets/houseicon2.png"
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
