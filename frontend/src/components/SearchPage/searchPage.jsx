import React, { useState } from 'react';
import './SearchPage.css';
import SearchBar from '../SearchBar/SearchBar';
import FilterButtons from '../FilterButtons/FilterButtons';
import ResultCard from '../ResultCard/ResultCard';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const filteredResults = mockResults.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="search-page">
      <h2 className="search-title">Explore</h2>
      <SearchBar onSearch={handleSearch} />
      <FilterButtons onFilterChange={handleFilterChange} />

      <div className="search-results">
        {filteredResults.map(item => (
          <ResultCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
