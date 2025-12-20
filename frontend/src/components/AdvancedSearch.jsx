import React, { useState } from 'react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ files }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    const results = files.filter(file => {
      const matchesSearch = 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterType === 'all') return matchesSearch;
      
      const fileExt = file.name.split('.').pop().toLowerCase();
      return matchesSearch && fileExt === filterType;
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="advanced-search">
      <h2 className="section-title">🔍 Advanced Global Search</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by filename, notes, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="jpg">Images</option>
          <option value="doc">Documents</option>
          <option value="txt">Text</option>
        </select>
        <button className="search-button" onClick={handleSearch}>
          🔍 Search
        </button>
      </div>

      {hasSearched && (
        <div className="search-results-section">
          <h3 className="results-title">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </h3>
          {searchResults.length === 0 ? (
            <div className="no-results">
              <p>No files found matching your search criteria.</p>
            </div>
          ) : (
            <div className="results-list">
              {searchResults.map((file) => (
                <div key={file.id} className="result-item">
                  <div className="result-icon">📄</div>
                  <div className="result-info">
                    <p className="result-name">{file.name}</p>
                    <p className="result-desc">{file.description || 'No description'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdvancedSearch;
