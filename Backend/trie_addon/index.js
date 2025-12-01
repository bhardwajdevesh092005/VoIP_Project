import trie from './trie/trie.cjs';

console.log("Trie Addon Loaded");

// Create a new Trie instance
const contactTrie = new trie.Trie();

// Test insertions
console.log("\n--- Testing Insert ---");
contactTrie.insert("john");
contactTrie.insert("johnny");
contactTrie.insert("jane");
contactTrie.insert("jack");
contactTrie.insert("jake");
console.log("Inserted: john, johnny, jane, jack, jake");

// Test search
console.log("\n--- Testing Search ---");
console.log("Search 'john':", contactTrie.search("john")); // true
console.log("Search 'johnny':", contactTrie.search("johnny")); // true
console.log("Search 'jo':", contactTrie.search("jo")); // false (prefix, not complete word)
console.log("Search 'james':", contactTrie.search("james")); // false

// Test startsWith
console.log("\n--- Testing StartsWith ---");
console.log("StartsWith 'jo':", contactTrie.startsWith("jo")); // true
console.log("StartsWith 'ja':", contactTrie.startsWith("ja")); // true
console.log("StartsWith 'jim':", contactTrie.startsWith("jim")); // false

// Test getWordsWithPrefix
console.log("\n--- Testing GetWordsWithPrefix ---");
console.log("Words with prefix 'jo':", contactTrie.getWordsWithPrefix("jo"));
console.log("Words with prefix 'ja':", contactTrie.getWordsWithPrefix("ja"));
console.log("Words with prefix 'j':", contactTrie.getWordsWithPrefix("j"));

// Test delete
console.log("\n--- Testing Delete ---");
console.log("Delete 'john':", contactTrie.deleteWord("john")); // true
console.log("Search 'john' after delete:", contactTrie.search("john")); // false
console.log("Words with prefix 'jo' after delete:", contactTrie.getWordsWithPrefix("jo"));

// Test with contact names (practical use case)
console.log("\n--- Practical Use Case: Contact Search ---");
const contactNames = new trie.Trie();
contactNames.insert("alice johnson", "user123");
contactNames.insert("alice williams", "user456");
contactNames.insert("bob smith", "user789");
contactNames.insert("charlie brown", "user101");

console.log("Contacts starting with 'ali':", contactNames.getWordsWithPrefix("ali"));
console.log("Contacts starting with 'bob':", contactNames.getWordsWithPrefix("bob"));

console.log("\n✅ All tests completed!");
