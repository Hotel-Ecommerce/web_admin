import React, { useState, useCallback } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import styles from './SearchBox.module.scss';

const SearchBox = ({
  placeholder = 'Tìm kiếm...',
  value = '',
  onChange,
  onClear,
  onSearch,
  size = 'md',
  variant = 'default', // 'default', 'outlined', 'filled'
  disabled = false,
  className = '',
  debounceMs = 300,
  showClearButton = true,
  icon = <FaSearch />
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchTerm) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (onSearch) {
            onSearch(searchTerm);
          }
        }, debounceMs);
      };
    })(),
    [onSearch, debounceMs]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (onSearch) {
      debouncedSearch(newValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange('');
    }
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(localValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`${styles.searchBox} ${styles[variant]} ${styles[size]} ${className}`}>
      <InputGroup>
        <InputGroup.Text className={styles.searchIcon}>
          {icon}
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`${styles.searchInput} ${isFocused ? styles.focused : ''}`}
        />
        {showClearButton && localValue && (
          <InputGroup.Text 
            className={styles.clearButton}
            onClick={handleClear}
            style={{ cursor: 'pointer' }}
          >
            <FaTimes />
          </InputGroup.Text>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchBox; 