import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchItem from "../components/SearchItem";
import styles from "../styles/Search.module.css";
import { fetchSearch } from "../redux/slices/searchSlice";

function Search() {
    const dispatch = useDispatch()
    const [searchTerm, setSearchTerm] = useState('');

    const searchResults = useSelector((state) => state.search.searchResults)
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
                    <h1>Search Products</h1>
                    <div className={styles.searchInputContainer}>
                        <input
                            type="text"
                            placeholder="Search by name, description, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.resultsWrapper}>
                    {searchTerm.trim() ? (
                        searchResults.length > 0 ? (
                            <>
                                <h2 className={styles.resultsTitle}>
                                    Search Results ({searchResults.length})
                                </h2>
                                <div className={styles.resultsContainer}>
                                    {searchResults.map(product => (
                                        <SearchItem key={product._id} item={product} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className={styles.noResults}>
                                No products found matching "{searchTerm}"
                            </p>
                        )
                    ) : (
                        <p className={styles.promptMessage}>
                            Enter a search term to find products
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;
