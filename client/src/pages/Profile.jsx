import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "../redux/slices/userSlice";
import styles from "../styles/Profile.module.css";
import Sidebar from "../components/Sidebar";
import corgiImage from "../assets/corgi.jpg";
import hustlerIcon from "../assets/hustlericon.png";
import paperClipIcon from "../assets/PaperClip.png";
import houseIcon from "../assets/houseicon2.png";

function Profile() {
  const dispatch = useDispatch();
  const { id, username, name, email, city, country, tradingRadius, loading, error, isLoggedIn } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    city: "",
    country: "",
    tradingRadius: ""
  });

  useEffect(() => {
    if (id) {
      dispatch(getUser(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (name && email && city && country && tradingRadius) {
      setEditForm({
        name,
        email,
        city,
        country,
        tradingRadius: tradingRadius.toString()
      });
    }
  }, [name, email, city, country, tradingRadius]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await dispatch(updateUser({
        userId: id,
        userData: {
          name: editForm.name,
          email: editForm.email,
          city: editForm.city,
          country: editForm.country,
          tradingRadius: parseInt(editForm.tradingRadius)
        }
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleCancelClick = () => {
    setEditForm({
      name,
      email,
      city,
      country,
      tradingRadius: tradingRadius.toString()
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <main className={styles.profilePage}>
        <Sidebar />
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Profile</h1>
        </div>
        <div className={styles.profileContainer}>
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className={styles.profilePage}>
        <Sidebar />
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Profile</h1>
        </div>
        <div className={styles.profileContainer}>
          <p>Please log in to view your profile.</p>
        </div>
      </main>
    );
  }

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
	  {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Private Information</h2>
            {!isEditing ? (
              <button className={styles.editButton} onClick={handleEditClick}>Edit Details</button>
            ) : (
              <div>
                <button className={styles.editButton} onClick={handleSaveClick}>Save</button>
                <button className={styles.editButton} onClick={handleCancelClick}>Cancel</button>
              </div>
            )}
          </div>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Account Details</legend>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username">Username:</label>
              <div className={styles.staticText}>{username || "Loading..."}</div>
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
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.staticText}>{name || "Loading..."}</div>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.staticText}>{email || "Loading..."}</div>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="city">City:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={editForm.city}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.staticText}>{city || "Loading..."}</div>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="country">Country:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={editForm.country}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.staticText}>{country || "Loading..."}</div>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="radius">Radius:</label>
              {isEditing ? (
                <input
                  type="number"
                  id="tradingRadius"
                  name="tradingRadius"
                  value={editForm.tradingRadius}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <div className={styles.staticText}>{tradingRadius ? `${tradingRadius}km` : "Loading..."}</div>
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
