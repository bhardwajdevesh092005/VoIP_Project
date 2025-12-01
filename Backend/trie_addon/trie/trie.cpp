#include "trie.hpp"
#include <algorithm>

// Constructor
Trie::Trie() : root(std::make_unique<TrieNode>()) {}

// Insert a word into the trie
void Trie::insert(const std::string& word) {
    insert(word, "");
}

// Insert a word with associated data
void Trie::insert(const std::string& word, const std::string& data) {
    if (word.empty()) return;
    
    TrieNode* current = root.get();
    
    for (char ch : word) {
        // Convert to lowercase for case-insensitive search
        char lowerCh = std::tolower(ch);
        
        if (current->children.find(lowerCh) == current->children.end()) {
            current->children[lowerCh] = std::make_unique<TrieNode>();
        }
        current = current->children[lowerCh].get();
    }
    
    current->isEndOfWord = true;
    current->data = data;
}

// Search for an exact word
bool Trie::search(const std::string& word) const {
    if (word.empty()) return false;
    
    TrieNode* node = getNode(word);
    return node != nullptr && node->isEndOfWord;
}

// Check if any word starts with the given prefix
bool Trie::startsWith(const std::string& prefix) const {
    return getNode(prefix) != nullptr;
}

// Get the node for a given prefix
TrieNode* Trie::getNode(const std::string& prefix) const {
    if (prefix.empty()) return root.get();
    
    TrieNode* current = root.get();
    
    for (char ch : prefix) {
        char lowerCh = std::tolower(ch);
        
        auto it = current->children.find(lowerCh);
        if (it == current->children.end()) {
            return nullptr;
        }
        current = it->second.get();
    }
    
    return current;
}

// Helper function to collect all words with a given prefix
void Trie::collectWords(TrieNode* node, const std::string& prefix, std::vector<std::string>& results) {
    if (node == nullptr) return;
    
    if (node->isEndOfWord) {
        results.push_back(prefix);
    }
    
    for (auto& pair : node->children) {
        collectWords(pair.second.get(), prefix + pair.first, results);
    }
}

// Get all words that start with the given prefix
std::vector<std::string> Trie::getWordsWithPrefix(const std::string& prefix) {
    std::vector<std::string> results;
    TrieNode* node = getNode(prefix);
    
    if (node == nullptr) {
        return results;
    }
    
    // Convert prefix to lowercase
    std::string lowerPrefix = prefix;
    std::transform(lowerPrefix.begin(), lowerPrefix.end(), lowerPrefix.begin(), 
                   [](unsigned char c){ return std::tolower(c); });
    
    collectWords(node, lowerPrefix, results);
    return results;
}

// Delete a word from the trie
bool Trie::deleteWord(const std::string& word) {
    if (word.empty() || !search(word)) return false;
    
    TrieNode* current = root.get();
    std::vector<std::pair<TrieNode*, char>> path;
    
    // Build path to the word
    for (char ch : word) {
        char lowerCh = std::tolower(ch);
        path.push_back({current, lowerCh});
        current = current->children[lowerCh].get();
    }
    
    // Mark as not end of word
    current->isEndOfWord = false;
    current->data.clear();
    
    // Remove nodes that are no longer needed
    for (int i = path.size() - 1; i >= 0; --i) {
        TrieNode* parent = path[i].first;
        char ch = path[i].second;
        TrieNode* node = parent->children[ch].get();
        
        // If node has no children and is not end of another word, remove it
        if (node->children.empty() && !node->isEndOfWord) {
            parent->children.erase(ch);
        } else {
            break; // Stop if we can't delete further
        }
    }
    
    return true;
}

// Clear all data from the trie
void Trie::clear() {
    root = std::make_unique<TrieNode>();
}
