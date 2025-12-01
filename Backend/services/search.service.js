import trie from '../trie_addon/trie/trie.cjs';
import prisma from '../prisma/index.js';
import database from '../db/dbService.js';
class TrieService {
  constructor() {
    this.contactTrie = null;
    this.initialized = false;
    this.initialize();
  }

  /**
   * Initialize the Trie with all users from the database
   */
  async initialize() {
    if (this.initialized) {
      console.log('⚠️ Trie already initialized');
      return;
    }

    try {
      console.log('🔄 Initializing Contact Trie...');
      this.contactTrie = new trie.Trie();

      // Fetch all users from database
      const users = await database.prismaService.prismaClientObject.user.findMany({
        select: {
          userID: true,
          fullName: true,
          email: true,
        },
      });

      // Insert each user into the Trie
      let count = 0;
      for (const user of users) {
        // Insert by name
        if (user.fullName) {
          this.contactTrie.insert(user.fullName.toLowerCase(), user.userID.toString());
          count++;
        }
        
        // Also insert by email for email-based search
        if (user.email) {
          this.contactTrie.insert(user.email.toLowerCase(), user.userID.toString());
          count++;
        }
      }

      this.initialized = true;
      console.log(`✅ Trie initialized with ${users.length} users (${count} entries)`);
    } catch (error) {
      console.error('❌ Error initializing Trie:', error);
      throw error;
    }
  }

  /**
   * Search for contacts by prefix
   */
  searchContacts(prefix) {
    if (!this.initialized) {
      throw new Error('Trie not initialized. Call initialize() first.');
    }
    return this.contactTrie.getWordsWithPrefix(prefix.toLowerCase());
  }

  /**
   * Add a new user to the Trie (call this when a new user registers)
   */
  addUser(userId, name, email) {
    if (!this.initialized) {
      console.warn('⚠️ Trie not initialized, skipping add');
      return;
    }

    if (name) {
      this.contactTrie.insert(name.toLowerCase(), userId.toString());
    }
    if (email) {
      this.contactTrie.insert(email.toLowerCase(), userId.toString());
    }
    console.log(`➕ Added user to Trie: ${name || email}`);
  }

  /**
   * Remove a user from the Trie (call this when a user is deleted)
   */
  removeUser(name, email) {
    if (!this.initialized) {
      console.warn('⚠️ Trie not initialized, skipping remove');
      return;
    }

    if (name) {
      this.contactTrie.deleteWord(name.toLowerCase());
    }
    if (email) {
      this.contactTrie.deleteWord(email.toLowerCase());
    }
    console.log(`➖ Removed user from Trie: ${name || email}`);
  }

  /**
   * Update a user in the Trie (call this when user info changes)
   */
  updateUser(userId, oldName, oldEmail, newName, newEmail) {
    if (!this.initialized) {
      console.warn('⚠️ Trie not initialized, skipping update');
      return;
    }

    // Remove old entries
    this.removeUser(oldName, oldEmail);
    
    // Add new entries
    this.addUser(userId, newName, newEmail);
    
    console.log(`🔄 Updated user in Trie: ${oldName} → ${newName}`);
  }

  /**
   * Reload the entire Trie from database (use for manual refresh)
   */
  async reload() {
    console.log('🔄 Reloading Trie from database...');
    this.initialized = false;
    await this.initialize();
  }
}

// Export a singleton instance
const trieService = new TrieService();
export default trieService;