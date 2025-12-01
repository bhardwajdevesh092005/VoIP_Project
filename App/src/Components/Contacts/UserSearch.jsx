import { useState, useEffect } from 'react';
import searchService from '../../Utils/searchService';

const UserSearch = ({ onUserSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Debounced search effect with 150ms delay
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use debounced search with 150ms delay
        const results = await searchService.debouncedSearch(searchQuery);
        setSearchResults(results);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.response?.data?.message || 'Failed to search users');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();

    // Cleanup function to cancel search on unmount
    return () => {
      searchService.cancelSearch();
    };
  }, [searchQuery]);

  const handleUserClick = (user) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBlur = () => {
    // Delay hiding results to allow click event to fire
    setTimeout(() => setShowResults(false), 200);
  };

  const handleFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg 
                     focus:outline-none focus:border-blue-500 transition-colors
                     text-gray-900 placeholder-gray-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 
                        rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user.userID}
              onClick={() => handleUserClick(user)}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer 
                         border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <img
                src={user.profilePicture || '/default-avatar.png'}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover mr-3"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 
                        rounded-lg shadow-lg p-4 text-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
};

export default UserSearch;
