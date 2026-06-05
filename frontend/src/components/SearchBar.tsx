import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        display: 'flex', 
        gap: '12px', 
        width: '100%', 
        maxWidth: '500px',
        marginBottom: '24px'
      }}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            paddingLeft: '40px',
          }}
        />
        <FiSearch 
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            fontSize: '16px',
            pointerEvents: 'none'
          }}
        />
      </div>
      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ 
          padding: '0 24px',
          height: '46px',
          borderRadius: '10px'
        }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
