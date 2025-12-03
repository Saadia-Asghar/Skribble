export const maskWord = (word) => {
    return word.replace(/[a-zA-Z]/g, "_");
};

export const generateHints = (word) => {
    const hints = [];
    const len = word.length;
    // Reveal 1/3 of the letters gradually
    const numReveals = Math.floor(len / 3);
    const indices = new Set();

    while (indices.size < numReveals) {
        indices.add(Math.floor(Math.random() * len));
    }

    let currentMask = word.split('').map(() => '_');

    // Create progressive hints
    // Hint 1: Just length (already known by mask, but maybe reveal 1 char)
    // Actually, let's just create a sequence of masked strings

    const indicesArray = Array.from(indices);

    for (let i = 0; i < indicesArray.length; i++) {
        const idx = indicesArray[i];
        currentMask[idx] = word[idx];
        hints.push(currentMask.join(''));
    }

    return hints;
};

export const revealLetter = (word, currentMask) => {
    const unrevealedIndices = [];
    for (let i = 0; i < word.length; i++) {
        if (currentMask[i] === '_' && word[i] !== ' ') {
            unrevealedIndices.push(i);
        }
    }

    if (unrevealedIndices.length === 0) return currentMask;

    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    const newMaskChars = currentMask.split('');
    newMaskChars[randomIndex] = word[randomIndex];
    return newMaskChars.join('');
};

export const getRandomWord = (minHeap) => {
    // In a real game, we might pop from heap, but here we might just peek or pick random from list if heap is empty
    // Assuming the heap is populated with words.
    // If we want random weighted by difficulty, we can extract min (easiest) or implement a different strategy.
    // For this game, let's say we pick 3 words of varying difficulty for the drawer to choose, 
    // or just pick one random word for MVP.

    // If using MinHeap to get easiest words first:
    return minHeap.extractMin();
};
