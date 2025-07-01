import styles from "../styles/SearchItem.module.css";

const BACKEND_URL = "http://localhost:3001";

const SearchItem = ({ item }) => {
    return (
        <div className={styles.card}>
            {item.imagePath && (
                <>
                    <div className={styles.imageWrapper}>
                        <img
                            src={`${BACKEND_URL}/static/${item.imagePath}`}
                            alt={item.name}
                        />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.name}>
                            {item.name}
                        </div>
                        <div className={styles.description}>
                            {item.description}
                        </div>
                        <div className={styles.category}>
                            {item.category.name} - {item.condition}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchItem;
