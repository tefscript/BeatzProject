import React, { useState } from 'react';
import './FilterButtons.css';

const FilterButtons = ({ onFilterChange }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = ['All', 'Songs', 'Artists', 'Playlists'];

    const handleClick = (filter) => {
        setActiveFilter(filter);
        onFilterChange(filter);
    };

    return (
        <div className="filter-buttons">
            {filters.map((filter) => (
                <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => handleClick(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    )
    }

export default FilterButtons