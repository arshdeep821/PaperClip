import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchItem from "../components/SearchItem";
import UserItem from "../components/UserItem";
import styles from "../styles/Search.module.css";
import { fetchSearch } from "../redux/slices/searchSlice";

function Search() {
    const dispatch = useDispatch()
    const [searchTerm, setSearchTerm] = useState('');

    const productResults = useSelector((state) => state.search.productResults)
    const userResults = useSelector((state) => state.search.userResults)
    const userId = useSelector((state) => state.user.id)

    useEffect(() => {
        if (searchTerm || searchTerm.trim() !== '') {
            dispatch(fetchSearch({ userId, query: searchTerm }))
        }
    }, [searchTerm, dispatch])

    return (
        <div className={styles.searchPage}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.searchHeader}>
                    <h1>Search Products & Users</h1>
                    <div className={styles.searchInputContainer}>
                        <input
                            type="text"
                            placeholder="Search by name, description, category, username, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.resultsWrapper}>
                    {searchTerm.trim() ? (
                        <>
                            {/* Product Results */}
                            {productResults.length > 0 && (
                                <>
                                    <h2 className={styles.resultsTitle}>
                                        Product Results ({productResults.length})
                                    </h2>
                                    <div className={styles.resultsContainer}>
                                        {productResults.map(product => (
                                            <SearchItem key={product._id} item={product} />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* User Results */}
                            {userResults.length > 0 && (
                                <>
                                    <h2 className={styles.resultsTitle}>
                                        User Results ({userResults.length})
                                    </h2>
                                    <div className={styles.resultsContainer}>
                                        {userResults.map(user => (
                                            <UserItem key={user._id} user={user} />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* No Results Message */}
                            {productResults.length === 0 && userResults.length === 0 && (
                                <p className={styles.noResults}>
                                    No products or users found matching "{searchTerm}"
                                </p>
                            )}
                        </>
                    ) : (
                        <p className={styles.promptMessage}>
                            Enter a search term to find products and users
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;
