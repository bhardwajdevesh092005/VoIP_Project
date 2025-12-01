import api from './api';

/**
 * Search Service for user search functionality
 */
class SearchService {
  /**
   * Search users by name or email
   * @param {string} query - Search query string
   * @returns {Promise<Array>} - Array of user objects
   */
  async searchUsers(query) {
    try {
      const response = await api.get('/user/search', {
        params: { query },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  /**
   * Debounced search function
   * @param {string} query - Search query string
   * @param {number} delay - Delay in milliseconds (default: 150ms)
   * @returns {Promise<Array>} - Array of user objects
   */
  debouncedSearch(query, delay = 150) {
    return new Promise((resolve, reject) => {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(async () => {
        try {
          const results = await this.searchUsers(query);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  /**
   * Cancel pending search
   */
  cancelSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }
}

// Export singleton instance
const searchService = new SearchService();
export default searchService;
