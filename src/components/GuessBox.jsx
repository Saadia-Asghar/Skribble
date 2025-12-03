import React, { useState, useEffect, useMemo } from 'react';
import { Trie } from '../dsa/Trie';
import { WORD_LIST } from '../utils/wordlist';

const GuessBox = ({ onGuess, disabled }) => {
    const [guess, setGuess] = useState("");
    const [isValid, setIsValid] = useState(false);

    // Initialize Trie with word list
    const trie = useMemo(() => {
        const t = new Trie();
        WORD_LIST.forEach(item => t.insert(item.word));
        return t;
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setGuess(val);

        // Check if it's a valid word in our dictionary (optional feature)
        // or just let them guess anything.
        // The PRD says "Auto-validate using Trie".
        setIsValid(trie.search(val));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guess.trim()) return;
        onGuess(guess);
        setGuess("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-2">
            <input
                type="text"
                value={guess}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Type your guess..."
                className={`flex-1 p-2 border-2 rounded ${isValid ? 'border-green-400' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
            />
            <button
                type="submit"
                disabled={disabled || !guess}
                className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
            >
                Guess
            </button>
        </form>
    );
};

export default GuessBox;
