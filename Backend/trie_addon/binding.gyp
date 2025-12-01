{
  "targets": [
    {
      "target_name": "trie",
      "sources": [ "trie/addon.cpp", "trie/trie.cpp" ],
      "cflags_cc": ["-std=c++17"],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS=1" ]
    }
  ]
}
