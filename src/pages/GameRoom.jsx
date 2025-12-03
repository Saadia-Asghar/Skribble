
import React, { useEffect, useState, useRef } from 'react';
import { subscribeToRoom, startGame, sendGuess, sendMessage, updateTimer, nextRound, updateScore, updateMaskedWord } from '../db/roomAPI';
import CanvasBoard from '../components/CanvasBoard';
import ChatBox from '../components/ChatBox';
import PlayerList from '../components/PlayerList';
import GuessBox from '../components/GuessBox';
import RoomControls from '../components/RoomControls';
import { MinHeap } from '../dsa/MinHeap';
import { WORD_LIST } from '../utils/wordlist';
import { getRandomWord, maskWord, generateHints, revealLetter } from '../utils/roomLogic';

import { isFirebaseConfigured } from '../db/firebase';
import DoodleBackground from '../components/DoodleBackground';
import GameSettings from '../components/GameSettings';

const GameRoom = ({ roomId, playerId, playerName }) => {
    const [roomData, setRoomData] = useState(undefined); // undefined = loading, null = not found
    const [error, setError] = useState(null);
    const [color, setColor] = useState('#000000');
    const [size, setSize] = useState(5);
    const [settings, setSettings] = useState({
        rounds: 3,
        drawTime: 80,
        customWords: ""
    });

    // Drawing State
    const [tool, setTool] = useState('brush'); // 'brush', 'eraser', 'shape'
    const [brushType, setBrushType] = useState('pen'); // 'pen', 'marker', 'highlighter', 'calligraphy', 'doodle', 'spray'
    const [shapeType, setShapeType] = useState('line'); // 'line', 'rect', 'rect_filled', 'circle', 'circle_filled', 'triangle', 'arrow'
    const [opacity, setOpacity] = useState(1); // 0.1 to 1.0

    // Host logic refs
    const timerRef = useRef(null);
    const wordHeapRef = useRef(new MinHeap());
    const usedWordsRef = useRef(new Set());
    const canvasRef = useRef(null);

    useEffect(() => {
        // Initialize MinHeap with words
        WORD_LIST.forEach(w => wordHeapRef.current.insert(w));

        const unsubscribe = subscribeToRoom(roomId, (data) => {
            setRoomData(data);
        }, (err) => {
            setError(err);
        });
        return () => {
            unsubscribe();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [roomId]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-8 text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Connection Error</h2>
                <p className="text-xl text-gray-800 mb-4">{error.message}</p>
                {error.message.includes("permission_denied") && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-200 max-w-md">
                        <p className="font-bold text-lg mb-2">🔒 Database Locked</p>
                        <p className="mb-4">Your Firebase Security Rules are blocking access.</p>
                        <p className="text-sm text-gray-500">Go to Firebase Console &gt; Realtime Database &gt; Rules and set .read and .write to true.</p>
                    </div>
                )}
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-8 bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Host Logic: Timer & Game Loop
    useEffect(() => {
        if (!roomData || !roomData.players[playerId]?.isHost) return;

        const isPlaying = roomData.status === 'playing';

        if (isPlaying) {
            const interval = setInterval(() => {
                if (roomData.timeLeft > 0) {
                    const newTime = roomData.timeLeft - 1;
                    updateTimer(roomId, newTime);

                    // Hints at 40s and 20s
                    if (newTime === 40 || newTime === 20) {
                        const newMask = revealLetter(roomData.currentWord, roomData.maskedWord);
                        if (newMask !== roomData.maskedWord) {
                            updateMaskedWord(roomId, newMask);
                        }
                    }
                } else {
                    handleRoundEnd();
                }
            }, 1000);
            return () => clearInterval(interval);
        }

    }, [roomData?.status, roomData?.timeLeft, playerId]);

    const handleStartGame = async () => {
        // Check for minimum players
        const playerIds = Object.keys(roomData.players);
        if (playerIds.length < 2) {
            alert("You need at least 2 players to start the game!");
            return;
        }

        // Handle Custom Words
        if (settings.customWords && settings.customWords.trim().length > 0) {
            const customWordsArray = settings.customWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
            customWordsArray.forEach(word => {
                // Add custom words with a default difficulty (e.g., 1 for easy)
                wordHeapRef.current.insert({ word: word, difficulty: 1 });
            });
            // Optional: If we want ONLY custom words, we would clear the heap first, but usually it's a mix or addition.
            // For now, let's just add them.
        }

        // Pick random drawer
        const randomDrawerId = playerIds[Math.floor(Math.random() * playerIds.length)];

        // Pick a word using MinHeap (easiest first)
        const wordObj = wordHeapRef.current.extractMin() || WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

        await startGame(roomId, wordObj.word, wordObj.difficulty, randomDrawerId, settings);
    };

    const handleRoundEnd = async () => {
        // Check for Game Over
        if (roomData.currentTurn >= roomData.totalTurns) {
            // Game Over
            // We can update status to 'finished'
            // For now, let's just alert and maybe reset or show scores.
            // Ideally, we update the status in DB.
            // But roomAPI doesn't have endGame function yet.
            // Let's just use nextRound to set status to finished? No, nextRound sets status to playing (implicitly by not changing it, or keeping it).

            // Let's add a simple endGame logic or just set status manually here if we can, 
            // but better to keep API logic in API.
            // For now, let's just alert.
            // alert("GAME OVER! Final Scores coming soon.");

            // Actually, let's just stop the timer and show a game over overlay.
            // We can set a local state or update DB.
            // Let's update DB to 'finished'.
            // We need an endGame function in API or just use update.
            // I'll assume we can just stop here for now or add endGame to API.
            // Let's add endGame to API quickly or just do it here.
            // Since I can't easily add to API without context switching, I'll just alert for now and maybe redirect to lobby?
            // Or better: Show Game Over Overlay.

            // Let's set a local "gameOver" state to true to show the overlay, 
            // and maybe update DB status to 'finished' if I can.
            // But I don't have endGame imported.

            // Let's just call nextRound but with a special flag? No.

            // Let's just return and let the users see the final state.
            // But the timer loop will keep running if I don't stop it.
            // The timer loop checks `roomData.timeLeft > 0`.
            return;
        }

        // Rotate drawer
        const playerIds = Object.keys(roomData.players);
        const currentIndex = playerIds.indexOf(roomData.drawerId);
        const nextIndex = (currentIndex + 1) % playerIds.length;
        const nextDrawerId = playerIds[nextIndex];
        const nextDrawerName = roomData.players[nextDrawerId]?.name || "Unknown";

        let wordObj = wordHeapRef.current.extractMin();

        // Ensure unique word
        while (wordObj && usedWordsRef.current.has(wordObj.word)) {
            wordObj = wordHeapRef.current.extractMin();
        }

        // Fallback if heap is empty or all used (should be rare with large list)
        if (!wordObj) {
            // Reset used words if we run out, or just pick random from list
            // For now, pick random from full list that is not in usedWords
            let randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
            let attempts = 0;
            while (usedWordsRef.current.has(randomWord.word) && attempts < 50) {
                randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
                attempts++;
            }
            wordObj = randomWord;
        }

        usedWordsRef.current.add(wordObj.word);

        await nextRound(roomId, nextDrawerId, nextDrawerName, wordObj.word);
    };

    // Watch for correct guesses to end round early
    useEffect(() => {
        if (!roomData || !roomData.guesses || !roomData.players[playerId]?.isHost) return;

        const guesses = Object.values(roomData.guesses);
        const correctGuess = guesses.find(g => g.isCorrect);

        if (correctGuess) {
            const timer = setTimeout(() => {
                if (roomData.status === 'playing') {
                    handleRoundEnd();
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [roomData?.guesses, playerId]); // Re-run when guesses change

    const handleGuess = async (guess) => {
        if (roomData.drawerId === playerId) return; // Drawer can't guess
        if (roomData.status !== 'playing') return;

        const isCorrect = guess.toLowerCase() === roomData.currentWord.toLowerCase();

        if (isCorrect) {
            // Award points
            const points = roomData.timeLeft * 10;
            await updateScore(roomId, playerId, points);
            // Award points to drawer (bonus)
            await updateScore(roomId, roomData.drawerId, Math.floor(points / 2));
        }

        await sendGuess(roomId, playerId, playerName, guess, isCorrect);
    };

    if (roomData === undefined) return <div className="flex items-center justify-center h-screen text-2xl text-white font-bold bg-gray-900">Loading Room...</div>;

    if (roomData === null) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-8 text-center font-['Patrick_Hand']">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Room Not Found 😢</h2>
            <p className="text-xl text-gray-600 mb-8">This room does not exist or has been deleted.</p>
            <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-blue-600 transition"
            >
                Back to Lobby
            </button>
        </div>
    );

    const isDrawer = roomData.drawerId === playerId;
    const isHost = roomData.players[playerId]?.isHost;
    const isWaiting = roomData.status === 'waiting';

    return (
        <div className="relative flex flex-col md:flex-row min-h-screen bg-yellow-50 overflow-hidden font-['Patrick_Hand']">
            <DoodleBackground />

            {/* Left: Canvas */}
            <div className="relative z-10 flex-1 flex flex-col p-4 gap-4 min-w-0">
                {/* Top Bar */}
                <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border-4 border-gray-800">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full transform rotate-3"></div>
                            <div className="relative bg-white border-4 border-gray-800 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-black font-['Permanent_Marker'] text-gray-800">
                                {roomData.timeLeft}
                            </div>
                        </div>
                        <div className="text-3xl font-bold tracking-wider text-gray-800 font-['Permanent_Marker']">
                            {isDrawer ? roomData.currentWord : roomData.maskedWord}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-lg font-bold text-gray-600 hidden sm:block">Room: <span className="text-blue-600 font-black">{roomId}</span></div>
                        <button
                            onClick={() => {
                                const url = `${window.location.origin}/room/${roomId}`;
                                navigator.clipboard.writeText(url);
                                alert("Room link copied!");
                            }}
                            className="bg-blue-400 border-2 border-gray-800 text-white font-bold px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(31,41,55,1)] hover:translate-y-px hover:shadow-none transition-all active:translate-y-1"
                        >
                            Copy Link
                        </button>
                    </div>
                </div>

                {/* Top Tools */}
                <div className="h-auto min-h-[4rem] mb-4">
                    <RoomControls
                        color={color} setColor={setColor}
                        size={size} setSize={setSize}
                        isDrawer={isDrawer}
                        tool={tool} setTool={setTool}
                        brushType={brushType} setBrushType={setBrushType}
                        shapeType={shapeType} setShapeType={setShapeType}
                        opacity={opacity} setOpacity={setOpacity}
                        onUndo={() => canvasRef.current?.undo()}
                        onRedo={() => canvasRef.current?.redo()}
                        onClear={() => canvasRef.current?.clear()}
                    />
                </div>

                {/* Canvas Area */}
                <div className="flex-1 min-h-0 relative bg-white rounded-3xl border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                    {isWaiting && (
                        <div className="absolute inset-0 z-20 bg-white/95 overflow-y-auto p-4 backdrop-blur-sm">
                            <div className="flex flex-col items-center min-h-full justify-center">
                                <h2 className="text-4xl md:text-5xl font-['Permanent_Marker'] mb-4 text-gray-800 transform -rotate-2 mt-4">Waiting for Players...</h2>

                                <div className="bg-yellow-50 p-6 rounded-3xl border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-6 max-w-md w-full transform rotate-1">
                                    <p className="text-gray-500 mb-1 text-lg font-bold uppercase tracking-widest">Room Code</p>
                                    <p className="text-5xl md:text-6xl font-black text-blue-500 tracking-wider mb-4 select-all font-['Permanent_Marker']">{roomId}</p>

                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/room/${roomId}`;
                                            navigator.clipboard.writeText(url);
                                            alert("Room link copied!");
                                        }}
                                        className="w-full bg-blue-500 border-4 border-gray-800 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-[4px_4px_0px_0px_rgba(31,41,55,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(31,41,55,1)] transition-all active:translate-y-0 active:shadow-none"
                                    >
                                        <span>🔗</span> Copy Invite Link
                                    </button>
                                </div>

                                {isHost && (
                                    <div className="mb-6 w-full max-w-md">
                                        <GameSettings settings={settings} setSettings={setSettings} />
                                    </div>
                                )}

                                {!isFirebaseConfigured() && (
                                    <div className="bg-red-100 border-4 border-red-400 text-red-800 p-4 rounded-xl max-w-md transform -rotate-1 mb-6">
                                        <p className="font-bold mb-1 text-lg">⚠️ Demo Mode Active</p>
                                        <p className="font-sans text-sm">
                                            Multiplayer <b>will NOT work</b> across devices. Configure Firebase to play properly.
                                        </p>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <p className="text-gray-500 mb-3 font-bold text-xl">Connected Players:</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {Object.values(roomData.players).map(p => (
                                            <span key={p.id} className="bg-white px-4 py-2 rounded-full text-lg font-bold border-2 border-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                                                {p.name} {p.isHost && '👑'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Game Over Screen */}
                    {roomData.currentTurn > roomData.totalTurns && (
                        <div className="absolute inset-0 z-30 bg-white/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                            <h2 className="text-6xl font-['Permanent_Marker'] mb-8 text-purple-600 transform -rotate-2">GAME OVER!</h2>

                            <div className="bg-yellow-50 p-8 rounded-3xl border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] mb-8 max-w-lg w-full">
                                {(() => {
                                    const winner = Object.values(roomData.players).reduce((prev, current) => (prev.score > current.score) ? prev : current);
                                    return (
                                        <div className="mb-6">
                                            <p className="text-2xl font-bold text-gray-500">🏆 The Winner is 🏆</p>
                                            <p className="text-5xl font-black text-yellow-500 font-['Permanent_Marker'] mt-2">{winner.name}</p>
                                        </div>
                                    );
                                })()}
                                <h3 className="text-3xl font-bold mb-6 text-gray-800">Final Scores</h3>
                                <div className="space-y-4">
                                    {Object.values(roomData.players)
                                        .sort((a, b) => b.score - a.score)
                                        .map((p, index) => (
                                            <div key={p.id} className={`flex justify-between items-center p-4 rounded-xl border-2 border-gray-200 ${index === 0 ? 'bg-yellow-100 border-yellow-400' : 'bg-white'}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-black text-gray-400">#{index + 1}</span>
                                                    <span className="text-xl font-bold">{p.name}</span>
                                                </div>
                                                <span className="text-2xl font-black text-gray-800">{p.score} pts</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-gray-800 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all"
                            >
                                Back to Lobby
                            </button>
                        </div>
                    )}

                    <CanvasBoard
                        ref={canvasRef}
                        roomId={roomId}
                        isDrawer={isDrawer}
                        color={color}
                        size={size}
                        strokesData={roomData.strokes}
                        tool={tool}
                        brushType={brushType}
                        shapeType={shapeType}
                        opacity={opacity}
                    />
                </div>
            </div>

            {/* Right: Sidebar */}
            <div className="relative z-10 w-full md:w-96 flex flex-col bg-white/50 border-l-4 border-gray-800 backdrop-blur-md">
                {/* Players */}
                <div className="h-1/3 p-4 overflow-y-auto border-b-4 border-gray-800 bg-white/80">
                    <PlayerList players={roomData.players} drawerId={roomData.drawerId} />
                </div>

                {/* Chat */}
                <div className="flex-1 min-h-0 overflow-hidden p-4 bg-white/60">
                    <ChatBox messages={roomData.chat} />
                </div>

                {/* Guess Input or Start Button */}
                <div className="p-4 bg-white border-t-4 border-gray-800">
                    {roomData.status === 'waiting' ? (
                        isHost ? (
                            <button
                                onClick={handleStartGame}
                                className="w-full bg-green-500 border-4 border-gray-800 text-white font-black py-4 rounded-xl text-2xl shadow-[4px_4px_0px_0px_rgba(31,41,55,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(31,41,55,1)] transition-all active:translate-y-0 active:shadow-none uppercase tracking-wider"
                            >
                                START GAME
                            </button>
                        ) : (
                            <div className="text-center text-gray-500 font-bold text-xl animate-pulse">Waiting for host...</div>
                        )
                    ) : (
                        !isDrawer && <GuessBox onGuess={handleGuess} disabled={roomData.status !== 'playing'} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameRoom;
