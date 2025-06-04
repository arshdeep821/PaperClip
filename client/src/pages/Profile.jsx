import React from "react";
import styles from "../styles/Profile.module.css";
import homeIcon from "../assets/home.png";
import threeLinesIcon from "../assets/threel.png";

function Profile() {
  return (
    <main className={styles.profilePage}>
      <div className={styles.sideButtons}>
        <div className={styles.iconButton}>
          <img src={homeIcon} alt="Home" />
        </div>
        <div className={styles.iconButton}>
          <img src={threeLinesIcon} alt="Dropdown" />
        </div>
      </div>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Profile</h1>
      </div>
      <div className={styles.profileContainer}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Private Information</h2>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Account Details</legend>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">Email:</label>
              <input className={styles.input} type="email" id="email" name="email" defaultValue="test@gmail.com" readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="location">Location:</label>
              <input className={styles.input} type="text" id="location" name="location" defaultValue="Canada" readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="radius">Radius:</label>
              <input className={styles.input} type="number" id="radius" name="radius" defaultValue="5" readOnly />
            </div>
          </fieldset>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Public Information</h2>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Wanted Items</legend>
            <div className={styles.inputGroup}>
              <textarea
                className={styles.textarea}
                id="wantedItems"
                name="wantedItems"
                rows="4"
                defaultValue="Computers, Laptops, Smartphones"
                readOnly
              />
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
