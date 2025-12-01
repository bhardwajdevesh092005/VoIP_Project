#ifndef TRIE_HPP
#define TRIE_HPP

#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

// TrieNode represents a single node in the Trie
class TrieNode {
public:
    std::unordered_map<char, std::unique_ptr<TrieNode>> children;
    bool isEndOfWord;
    std::string data; // Optional: store associated data (e.g., full name, user ID)
    
    TrieNode() : isEndOfWord(false), data("") {}
};

// Trie class for efficient prefix-based search
class Trie {
private:
    std::unique_ptr<TrieNode> root;
    
    // Helper function for collecting all words with a given prefix
    void collectWords(TrieNode* node, const std::string& prefix, std::vector<std::string>& results);
    
public:
    Trie();
    ~Trie() = default;
    
    // Insert a word into the trie
    void insert(const std::string& word);
    
    // Insert a word with associated data
    void insert(const std::string& word, const std::string& data);
    
    // Search for an exact word
    bool search(const std::string& word) const;
    
    // Check if any word starts with the given prefix
    bool startsWith(const std::string& prefix) const;
    
    // Get all words that start with the given prefix
    std::vector<std::string> getWordsWithPrefix(const std::string& prefix);
    
    // Delete a word from the trie
    bool deleteWord(const std::string& word);
    
    // Clear all data from the trie
    void clear();
    
    // Get the node for a given prefix (helper for internal use)
    TrieNode* getNode(const std::string& prefix) const;
};

#endif // TRIE_HPP
