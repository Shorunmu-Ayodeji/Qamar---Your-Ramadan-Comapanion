import React, { useState, useEffect, useRef } from 'react';
import { searchCountries, getCountryByCode } from '../utils/countries';

const CountrySelect = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setResults(searchCountries(searchTerm));
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = value ? getCountryByCode(value) : null;

  return (
    <div className="country-select-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="selected-display" 
        onClick={() => setShowDropdown(!showDropdown)} 
        style={{ 
          padding: '10px', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: '#fff'
        }}
      >
        <span>
          {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Select Country'}
        </span>
        <span style={{ fontSize: '0.8em', color: '#666' }}>▼</span>
      </div>

      {showDropdown && (
        <div className="dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', zIndex: 1000, maxHeight: '250px', overflowY: 'auto', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <input
            type="text"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: 'none', borderBottom: '1px solid #eee', outline: 'none' }}
            autoFocus
          />
          {results.map((country) => (
            <div
              key={country.code}
              onClick={() => {
                onChange(country.code);
                setShowDropdown(false);
                setSearchTerm('');
              }}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <span style={{ fontSize: '1.2em' }}>{country.flag}</span>
              <span>{country.name}</span>
            </div>
          ))}
          {results.length === 0 && (
            <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>No countries found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;