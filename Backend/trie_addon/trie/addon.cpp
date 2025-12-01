#include <napi.h>
#include "trie.hpp"
#include <memory>

// Wrapper class for Trie to work with N-API
class TrieWrapper : public Napi::ObjectWrap<TrieWrapper> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    TrieWrapper(const Napi::CallbackInfo& info);

private:
    std::unique_ptr<Trie> trie_;

    Napi::Value Insert(const Napi::CallbackInfo& info);
    Napi::Value Search(const Napi::CallbackInfo& info);
    Napi::Value StartsWith(const Napi::CallbackInfo& info);
    Napi::Value GetWordsWithPrefix(const Napi::CallbackInfo& info);
    Napi::Value DeleteWord(const Napi::CallbackInfo& info);
    Napi::Value Clear(const Napi::CallbackInfo& info);
};

TrieWrapper::TrieWrapper(const Napi::CallbackInfo& info) 
    : Napi::ObjectWrap<TrieWrapper>(info) {
    trie_ = std::make_unique<Trie>();
}

Napi::Value TrieWrapper::Insert(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string word = info[0].As<Napi::String>().Utf8Value();
    
    if (info.Length() >= 2 && info[1].IsString()) {
        std::string data = info[1].As<Napi::String>().Utf8Value();
        trie_->insert(word, data);
    } else {
        trie_->insert(word);
    }
    
    return Napi::Boolean::New(env, true);
}

Napi::Value TrieWrapper::Search(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string word = info[0].As<Napi::String>().Utf8Value();
    bool found = trie_->search(word);
    
    return Napi::Boolean::New(env, found);
}

Napi::Value TrieWrapper::StartsWith(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string prefix = info[0].As<Napi::String>().Utf8Value();
    bool found = trie_->startsWith(prefix);
    
    return Napi::Boolean::New(env, found);
}

Napi::Value TrieWrapper::GetWordsWithPrefix(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string prefix = info[0].As<Napi::String>().Utf8Value();
    std::vector<std::string> words = trie_->getWordsWithPrefix(prefix);
    
    Napi::Array result = Napi::Array::New(env, words.size());
    for (size_t i = 0; i < words.size(); i++) {
        result[i] = Napi::String::New(env, words[i]);
    }
    
    return result;
}

Napi::Value TrieWrapper::DeleteWord(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string word = info[0].As<Napi::String>().Utf8Value();
    bool deleted = trie_->deleteWord(word);
    
    return Napi::Boolean::New(env, deleted);
}

Napi::Value TrieWrapper::Clear(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    trie_->clear();
    return env.Undefined();
}

Napi::Object TrieWrapper::Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "Trie", {
        InstanceMethod("insert", &TrieWrapper::Insert),
        InstanceMethod("search", &TrieWrapper::Search),
        InstanceMethod("startsWith", &TrieWrapper::StartsWith),
        InstanceMethod("getWordsWithPrefix", &TrieWrapper::GetWordsWithPrefix),
        InstanceMethod("deleteWord", &TrieWrapper::DeleteWord),
        InstanceMethod("clear", &TrieWrapper::Clear)
    });
    
    Napi::FunctionReference* constructor = new Napi::FunctionReference();
    *constructor = Napi::Persistent(func);
    env.SetInstanceData(constructor);
    
    exports.Set("Trie", func);
    return exports;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    return TrieWrapper::Init(env, exports);
}

NODE_API_MODULE(trie, Init)
