import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';

const SearchableDropdown = ({
  options=[],
  value='',
  onChange=(arg:any) => {},
  placeholder = 'Select an option',
  searchPlaceholder = 'Type to search...',
  isDisabled = false,
  className = '',
  error = '',
  label = '',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef:any = useRef(null);
  const searchInputRef:any = useRef(null);

  // Parse options to handle both React elements and plain objects
  const normalizedOptions = options.map((option:any) => {
    if (option.$$typeof === Symbol.for('react.element') && option.type === 'option') {
      return {
        value: option.props.value,
        label: option.props.children,
        original: option
      };
    }
    return option;
  });

  // Find the selected option for display
  const selectedOption = normalizedOptions.find((opt:any) => 
    String(opt.value) === String(value)
  );

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter(option => {
    const label = String(option.label || '').toLowerCase();
    return label.includes(searchTerm.toLowerCase());
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelect = (option:any) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e:any) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={handleOpen}
          disabled={isDisabled}
          className={`
            relative w-full min-h-[42px] px-4 py-2 text-left bg-white dark:bg-gray-800 
            border rounded-lg shadow-sm text-sm
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}
            ${className}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span className={`block truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="flex items-center">
              {value && (
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                <ul className="py-1">
                  {filteredOptions.map((option:any) => (
                    <li
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className={`
                        px-4 py-2 text-sm cursor-pointer
                        ${String(option.value) === String(value)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchableDropdown;