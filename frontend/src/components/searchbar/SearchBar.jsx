import React, { useState } from "react";
import "./SearchBar.css";
import SearchLogo from "../../assets/SearchLogo.png";
import CancelSearchLogo from "../../assets/CancelSearchLogo.png";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="search-bar">
            <img src={SearchLogo} alt="Buscar" className="icon-search"/>
            <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleInputChange}
            />
            {query && (<button className="clear-button" onClick={clearSearch}> 
                <img src={CancelSearchLogo} alt="Limpar" className="icon-cancel"/>
            </button>
            )}
        </div>
    )
}

export default SearchBar;