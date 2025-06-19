import React from "react";
import styles from "../styles/Profile.module.css";
import Sidebar from "../components/Sidebar";
import corgiImage from "../assets/corgi.jpg";
import hustlerIcon from "../assets/hustlericon.png";
import paperClipIcon from "../assets/PaperClip.png";
import houseIcon from "../assets/houseicon2.png";

function Profile() {
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
            <button className={styles.editButton}>Edit Details</button>
          </div>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Account Details</legend>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username">Username:</label>
              <div className={styles.staticText}>Admin</div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">Password:</label>
              <div className={styles.staticText}>••••••••</div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="name">Name:</label>
              <div className={styles.staticText}>test</div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">Email:</label>
              <div className={styles.staticText}>test@gmail.com</div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="city">City:</label>
              <div className={styles.staticText}>Vancouver</div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="country">Country:</label>
              <div className={styles.staticText}>Canada</div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="radius">Radius:</label>
              <div className={styles.staticText}>5km</div>
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
