import styles from "../styles/SearchItem.module.css";

const SearchItem = ({ item }) => {
    return (
        <div className={styles.card}>
            {item.image && (
                <>
                    <div className={styles.imageWrapper}>
                        <img
                            src={item.image}
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
                            {item.category}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchItem;
