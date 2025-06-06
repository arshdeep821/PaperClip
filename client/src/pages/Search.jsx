import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useSelector } from "react-redux";
import SearchItem from "../components/SearchItem";
import styles from "../styles/Search.module.css";

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const products = useSelector(state => state.products.products)

    const searchResults = products.filter(product =>
        searchTerm.trim() !== '' && (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
                                        <SearchItem key={product.id} item={product} />
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
