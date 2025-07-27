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
    const [filter, setFilter] = useState('all'); // 'all', 'products', 'users'

    const productResults = useSelector((state) => state.search.productResults)
    const userResults = useSelector((state) => state.search.userResults)
    const userId = useSelector((state) => state.user.id)

    useEffect(() => {
        if (searchTerm || searchTerm.trim() !== '') {
            dispatch(fetchSearch({ userId, query: searchTerm }))
        }
    }, [searchTerm, dispatch])

    // Filter results based on selected filter
    const shouldShowProducts = filter === 'all' || filter === 'products';
    const shouldShowUsers = filter === 'all' || filter === 'users';

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

                    {/* Filter Buttons */}
                    {searchTerm.trim() &&
                        <div className={styles.filterButtons}>
                            <button
                                className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All ({productResults.length + userResults.length})
                            </button>
                            <button
                                className={`${styles.filterButton} ${filter === 'products' ? styles.active : ''}`}
                                onClick={() => setFilter('products')}
                            >
                                Products ({productResults.length})
                            </button>
                            <button
                                className={`${styles.filterButton} ${filter === 'users' ? styles.active : ''}`}
                                onClick={() => setFilter('users')}
                            >
                                Users ({userResults.length})
                            </button>
                        </div>
                    }

                </div>

                <div className={styles.resultsWrapper}>
                    {searchTerm.trim() ? (
                        <>
                            {/* Product Results */}
                            {shouldShowProducts && productResults.length > 0 && (
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
                            {shouldShowUsers && userResults.length > 0 && (
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
                            {(
                                (filter === 'all' && productResults.length === 0 && userResults.length === 0) ||
                                (filter === 'products' && productResults.length === 0) ||
                                (filter === 'users' && userResults.length === 0)) && (
                                    <p className={styles.noResults}>
                                        No {filter === 'all' ? 'products or users' : filter} found matching "{searchTerm}"
                                    </p>
                                )}
                        </>
                    ) : (
                        <p className={styles.promptMessage}>
                            Enter a search term to find products or users
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;
