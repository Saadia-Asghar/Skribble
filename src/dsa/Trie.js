/**
 * Trie Data Structure (Prefix Tree)
 * Used for fast word validation and prefix checking.
 */

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insert a word into the Trie
    insert(word) {
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i].toLowerCase();
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        current.isEndOfWord = true;
    }

    // Search for a word (exact match)
    search(word) {
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i].toLowerCase();
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        return current.isEndOfWord;
    }

    // Check if there is any word in the trie that starts with the given prefix
    startsWith(prefix) {
        let current = this.root;
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i].toLowerCase();
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        return true;
    }
}
