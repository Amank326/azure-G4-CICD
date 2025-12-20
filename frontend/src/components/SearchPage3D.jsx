import React, { useState, Suspense } from 'react';
import AdvancedSearch from './AdvancedSearch';
import { Background3D } from './3D';
import './SearchPage3D.css';

const SearchPage3D = ({ files = [] }) => {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="search-page-3d">
      <Suspense fallback={null}>
        <Background3D cameraZ={30} intensity={0.85}>
          <div className="search-page-content">
            {/* Header */}
            <header className="search-header">
              <h1 className="search-title">🔍 Advanced Search</h1>
              <p className="search-subtitle">Find files with intelligent search</p>
            </header>

            {/* Search Tabs */}
            <div className="search-tabs">
              <button
                className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveTab('search')}
              >
                📝 Search
              </button>
              <button
                className={`tab-btn ${activeTab === 'filters' ? 'active' : ''}`}
                onClick={() => setActiveTab('filters')}
              >
                🎯 Filters
              </button>
              <button
                className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                📂 Categories
              </button>
            </div>

            {/* Content Area */}
            <div className="search-content-area">
              {activeTab === 'search' && <AdvancedSearch files={files} />}

              {activeTab === 'filters' && (
                <div className="filters-section">
                  <h2>Advanced Filters</h2>
                  <div className="filters-grid">
                    <div className="filter-box">
                      <h3>📅 Date</h3>
                      <p>Filter by date</p>
                    </div>
                    <div className="filter-box">
                      <h3>📊 Size</h3>
                      <p>Filter by size</p>
                    </div>
                    <div className="filter-box">
                      <h3>🏷️ Tags</h3>
                      <p>Filter by tags</p>
                    </div>
                    <div className="filter-box">
                      <h3>✨ Rating</h3>
                      <p>Filter by rating</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="categories-section">
                  <h2>Categories</h2>
                  <div className="categories-grid">
                    {['Documents', 'Images', 'Videos', 'Audio', 'Archives', 'Code', 'Other'].map(cat => (
                      <div key={cat} className="category-card">
                        <div className="category-icon">
                          {cat === 'Documents' && '📄'}
                          {cat === 'Images' && '🖼️'}
                          {cat === 'Videos' && '🎥'}
                          {cat === 'Audio' && '🎵'}
                          {cat === 'Archives' && '📦'}
                          {cat === 'Code' && '💻'}
                          {cat === 'Other' && '📌'}
                        </div>
                        <h3>{cat}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Background3D>
      </Suspense>
    </div>
  );
};

export default SearchPage3D;
