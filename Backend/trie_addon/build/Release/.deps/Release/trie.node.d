cmd_Release/trie.node := ln -f "Release/obj.target/trie.node" "Release/trie.node" 2>/dev/null || (rm -rf "Release/trie.node" && cp -af "Release/obj.target/trie.node" "Release/trie.node")
