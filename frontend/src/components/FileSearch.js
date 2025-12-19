import React, { useState } from 'react';
import './FileSearch.css';

function FileSearch({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      onSearch([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch([]);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="🔍 Search files by name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={isSearching}>
            {isSearching ? '⏳ Searching...' : '🔍 Search'}
          </button>
          {searchQuery && (
            <button type="button" onClick={handleClear} className="clear-btn">
              ✕ Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FileSearch;
