import { db, isFirebaseConfigured } from "./firebase";
import { ref, set, get, update, push, child, onValue, off, remove, runTransaction } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

// --- LOCAL STORAGE MOCK HELPER ---
const MOCK_DB_KEY = 'scribble_mock_db';
const getMockDB = () => JSON.parse(localStorage.getItem(MOCK_DB_KEY) || '{}');
const setMockDB = (data) => {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(data));
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
};

const mockDelay = () => new Promise(r => setTimeout(r, 100));

// --- API EXPORTS ---

export const createRoom = async (playerName) => {
    console.log("Creating room for:", playerName);
    if (!isFirebaseConfigured()) {
        console.log("Using Mock DB");
        const roomId = uuidv4().slice(0, 6).toUpperCase();
        const playerId = uuidv4();
        const dbData = getMockDB();

        dbData[`rooms/${roomId}`] = {
            roomId,
            drawerId: playerId,
            currentWord: "",
            maskedWord: "",
            round: 1,
            timeLeft: 60,
            status: "waiting",
            players: {
                [playerId]: { name: playerName, score: 0, id: playerId, isHost: true }
            },
            strokes: {},
            hintsQueue: [],
            chat: {}
        };
        setMockDB(dbData);
        return { roomId, playerId };
    }

    console.log("Using Firebase DB");
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    const playerId = uuidv4();
    const roomRef = ref(db, `rooms/${roomId}`);
    const initialData = {
        roomId,
        drawerId: playerId,
        currentWord: "",
        maskedWord: "",
        round: 1,
        timeLeft: 60,
        status: "waiting",
        players: {
            [playerId]: { name: playerName, score: 0, id: playerId, isHost: true }
        },
        strokes: {},
        hintsQueue: [],
        chat: {}
    };

    try {
        // Add a 5-second timeout to detect connection issues
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Connection timed out. Check your internet or Firebase Database rules.")), 5000)
        );

        await Promise.race([
            set(roomRef, initialData),
            timeout
        ]);

        console.log("Room created in Firebase:", roomId);
        return { roomId, playerId };
    } catch (error) {
        console.error("Firebase create error:", error);
        throw error;
    }
};

export const joinRoom = async (roomId, playerName) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        const room = dbData[`rooms/${roomId}`];
        if (!room) throw new Error("Room not found (Local Mode)");

        const playerId = uuidv4();
        if (!room.players) room.players = {};
        room.players[playerId] = {
            name: playerName,
            score: 0,
            id: playerId,
            isHost: false
        };
        setMockDB(dbData);
        return { roomId, playerId };
    }

    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) throw new Error("Room not found");

    const playerId = uuidv4();
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    await set(playerRef, {
        name: playerName,
        score: 0,
        id: playerId,
        isHost: false
    });
    return { roomId, playerId };
};

export const subscribeToRoom = (roomId, callback, onError) => {
    if (!isFirebaseConfigured()) {
        const checkUpdate = () => {
            const dbData = getMockDB();
            const room = dbData[`rooms/${roomId}`];
            callback(room);
        };

        checkUpdate(); // Initial call

        const handleStorage = (e) => {
            // In same tab, we might need custom event or just polling
            // For cross-tab, 'storage' event works
            checkUpdate();
        };

        // Polling for same-tab updates (since storage event only fires on other tabs)
        const interval = setInterval(checkUpdate, 500);
        window.addEventListener('storage', handleStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorage);
        };
    }

    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    }, (error) => {
        console.error("Firebase subscribe error:", error);
        if (onError) onError(error);
    });
    return () => off(roomRef, 'value', unsubscribe);
};

export const leaveRoom = async (roomId, playerId) => {
    if (!isFirebaseConfigured()) return; // Skip for mock
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    await remove(playerRef);
};

export const startGame = async (roomId, word, difficulty, firstDrawerId, settings) => {
    // We need to fetch players to know count. 

    let playerCount = 0;
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        playerCount = Object.keys(dbData[`rooms/${roomId}`]?.players || {}).length;
    } else {
        const playersRef = ref(db, `rooms/${roomId}/players`);
        const snapshot = await get(playersRef);
        playerCount = snapshot.size;
    }

    const totalTurns = playerCount * (settings?.rounds || 3);

    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        const room = dbData[`rooms/${roomId}`];
        if (room) {
            room.status = "playing";
            room.drawerId = firstDrawerId;
            room.currentWord = word;
            room.maskedWord = word.replace(/[a-zA-Z]/g, "_");
            room.timeLeft = settings?.drawTime || 60;
            room.settings = settings;
            room.currentTurn = 1;
            room.totalTurns = totalTurns;
            room.strokes = {};
            room.chat = room.chat || {};
            room.guesses = {};

            // Announce drawer
            const drawerName = room.players[firstDrawerId]?.name || "Unknown";
            const chatId = uuidv4();
            room.chat[chatId] = {
                playerId: "SYSTEM",
                playerName: "Game",
                text: `Game Started! ${drawerName} is drawing first!`,
                isSystem: true,
                timestamp: Date.now()
            };

            setMockDB(dbData);
        }
        return;
    }

    const updates = {};
    updates[`rooms/${roomId}/status`] = "playing";
    updates[`rooms/${roomId}/drawerId`] = firstDrawerId;
    updates[`rooms/${roomId}/currentWord`] = word;
    updates[`rooms/${roomId}/maskedWord`] = word.replace(/[a-zA-Z]/g, "_");
    updates[`rooms/${roomId}/timeLeft`] = settings?.drawTime || 60;
    updates[`rooms/${roomId}/settings`] = settings;
    updates[`rooms/${roomId}/currentTurn`] = 1;
    updates[`rooms/${roomId}/totalTurns`] = totalTurns;
    updates[`rooms/${roomId}/strokes`] = null;
    updates[`rooms/${roomId}/chat`] = null;
    updates[`rooms/${roomId}/guesses`] = null;

    await update(ref(db), updates);

    // Announce via chat (separate push)
    // We need to fetch player name or pass it. 
    // For simplicity, we'll just push the message.
    const chatRef = ref(db, `rooms/${roomId}/chat`);
    await push(chatRef, {
        playerId: "SYSTEM",
        playerName: "Game",
        text: "Game Started! A new drawer has been chosen!",
        isSystem: true,
        timestamp: Date.now()
    });
};

export const sendStroke = async (roomId, stroke) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        const room = dbData[`rooms/${roomId}`];
        if (room) {
            if (!room.strokes) room.strokes = {};
            const strokeId = uuidv4();
            room.strokes[strokeId] = stroke;
            setMockDB(dbData);
            return strokeId;
        }
        return;
    }

    const strokesRef = ref(db, `rooms/${roomId}/strokes`);
    const newStrokeRef = await push(strokesRef, stroke);
    return newStrokeRef.key;
};

export const undoLastStroke = async (roomId, strokeId) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        if (dbData[`rooms/${roomId}`]?.strokes?.[strokeId]) {
            delete dbData[`rooms/${roomId}`].strokes[strokeId];
            setMockDB(dbData);
        }
        return;
    }
    if (!strokeId) return;
    const strokeRef = ref(db, `rooms/${roomId}/strokes/${strokeId}`);
    await remove(strokeRef);
}

export const clearCanvas = async (roomId) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        if (dbData[`rooms/${roomId}`]) {
            dbData[`rooms/${roomId}`].strokes = {};
            setMockDB(dbData);
        }
        return;
    }
    const strokesRef = ref(db, `rooms/${roomId}/strokes`);
    await remove(strokesRef);
}

export const sendGuess = async (roomId, playerId, playerName, text, isCorrect) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        const room = dbData[`rooms/${roomId}`];
        if (room) {
            if (!room.guesses) room.guesses = {};
            const guessId = uuidv4();
            room.guesses[guessId] = { playerId, playerName, text, isCorrect, timestamp: Date.now() };

            if (!room.chat) room.chat = {};
            const chatId = uuidv4();
            room.chat[chatId] = {
                playerId,
                playerName,
                text: isCorrect ? `${playerName} guessed the word!` : text,
                isSystem: isCorrect,
                timestamp: Date.now()
            };

            if (isCorrect && room.players[playerId]) {
                // Simple score update for mock
                room.players[playerId].score = (room.players[playerId].score || 0) + 100;
            }
            setMockDB(dbData);
        }
        return;
    }

    const guessesRef = ref(db, `rooms/${roomId}/guesses`);
    await push(guessesRef, {
        playerId,
        playerName,
        text,
        isCorrect,
        timestamp: Date.now()
    });

    const chatRef = ref(db, `rooms/${roomId}/chat`);
    await push(chatRef, {
        playerId,
        playerName,
        text: isCorrect ? `${playerName} guessed the word!` : text,
        isSystem: isCorrect,
        timestamp: Date.now()
    });
};

export const updateScore = async (roomId, playerId, points) => {
    if (!isFirebaseConfigured()) {
        // Handled in sendGuess for mock usually, but if called explicitly:
        const dbData = getMockDB();
        if (dbData[`rooms/${roomId}`]?.players?.[playerId]) {
            dbData[`rooms/${roomId}`].players[playerId].score += points;
            setMockDB(dbData);
        }
        return;
    }

    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}/score`);
    await runTransaction(playerRef, (score) => {
        return (score || 0) + points;
    });
}

export const sendMessage = async (roomId, playerId, playerName, text) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        const room = dbData[`rooms/${roomId}`];
        if (room) {
            if (!room.chat) room.chat = {};
            const chatId = uuidv4();
            room.chat[chatId] = { playerId, playerName, text, timestamp: Date.now() };
            setMockDB(dbData);
        }
        return;
    }

    const chatRef = ref(db, `rooms/${roomId}/chat`);
    await push(chatRef, {
        playerId,
        playerName,
        text,
        timestamp: Date.now()
    });
};

export const updateTimer = async (roomId, time) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        if (dbData[`rooms/${roomId}`]) {
            dbData[`rooms/${roomId}`].timeLeft = time;
            setMockDB(dbData);
        }
        return;
    }
    const timeRef = ref(db, `rooms/${roomId}/timeLeft`);
    await set(timeRef, time);
}

export const updateMaskedWord = async (roomId, maskedWord) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        if (dbData[`rooms/${roomId}`]) {
            dbData[`rooms/${roomId}`].maskedWord = maskedWord;
            setMockDB(dbData);
        }
        return;
    }
    const maskRef = ref(db, `rooms/${roomId}/maskedWord`);
    await set(maskRef, maskedWord);
}

export const nextRound = async (roomId, nextDrawerId, nextDrawerName, word) => {
    if (!isFirebaseConfigured()) {
        const dbData = getMockDB();
        const room = dbData[`rooms/${roomId}`];
        if (room) {
            room.drawerId = nextDrawerId;
            room.currentWord = word;
            room.maskedWord = word.replace(/[a-zA-Z]/g, "_");
            room.timeLeft = room.settings?.drawTime || 60;
            room.strokes = {};
            room.guesses = {};

            // Announce new drawer
            const chatId = uuidv4();
            if (!room.chat) room.chat = {};
            room.chat[chatId] = {
                playerId: "SYSTEM",
                playerName: "Game",
                text: `Round started! ${nextDrawerName} is drawing now!`,
                isSystem: true,
                timestamp: Date.now()
            };

            setMockDB(dbData);
        }
        return;
    }

    // We need to fetch the current settings to know the draw time.
    const settingsRef = ref(db, `rooms/${roomId}/settings`);
    const turnRef = ref(db, `rooms/${roomId}/currentTurn`);

    const [settingsSnapshot, turnSnapshot] = await Promise.all([
        get(settingsRef),
        get(turnRef)
    ]);

    const settings = settingsSnapshot.val();
    const currentTurn = turnSnapshot.val() || 0;
    const drawTime = settings?.drawTime || 60;

    const updates = {};
    updates[`rooms/${roomId}/drawerId`] = nextDrawerId;
    updates[`rooms/${roomId}/currentWord`] = word;
    updates[`rooms/${roomId}/maskedWord`] = word.replace(/[a-zA-Z]/g, "_");
    updates[`rooms/${roomId}/timeLeft`] = drawTime;
    updates[`rooms/${roomId}/currentTurn`] = currentTurn + 1;
    updates[`rooms/${roomId}/strokes`] = null;
    updates[`rooms/${roomId}/guesses`] = null;
    await update(ref(db), updates);

    // Announce via chat
    const chatRef = ref(db, `rooms/${roomId}/chat`);
    await push(chatRef, {
        playerId: "SYSTEM",
        playerName: "Game",
        text: `Round started! ${nextDrawerName} is drawing now!`,
        isSystem: true,
        timestamp: Date.now()
    });
}
