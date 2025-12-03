import React, { useState } from 'react';
import { createRoom, joinRoom } from '../db/roomAPI';
import { isFirebaseConfigured } from '../db/firebase';
import DoodleBackground from './DoodleBackground';

const Lobby = ({ onJoin }) => {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [configError, setConfigError] = useState(!isFirebaseConfigured());

    const handleCreate = async () => {
        if (!name) return setError("Please enter your name");
        setLoading(true);
        try {
            const { roomId: newRoomId, playerId } = await createRoom(name);
            onJoin({ roomId: newRoomId, playerId, name });
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleJoin = async () => {
        if (!name || !roomId) return setError("Please enter name and room ID");
        setLoading(true);
        try {
            const { playerId } = await joinRoom(roomId, name);
            onJoin({ roomId, playerId, name });
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 font-['Patrick_Hand']">
            <DoodleBackground />

            <div className="relative z-10 w-full max-w-md">
                {/* Title Section */}
                <div className="text-center mb-8 transform -rotate-2">
                    <h1 className="text-8xl md:text-9xl font-['Permanent_Marker'] text-gray-900 tracking-wider relative inline-block transform -rotate-2">
                        <span className="relative z-10">
                            Scribble
                        </span>
                        <span className="absolute top-1 left-1 text-gray-400 opacity-50 z-0 select-none blur-[1px]">
                            Scribble
                        </span>
                        {/* Underline Stroke */}
                        <svg className="absolute w-full h-6 -bottom-4 left-0 transform -rotate-1" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 15, 100 5" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
                        </svg>
                    </h1>
                    <p className="mt-4 text-xl md:text-2xl text-gray-600 font-bold tracking-wide">
                        Draw. Guess. Laugh. Repeat.
                    </p>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">
                        — Play live in class! —
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] border-4 border-gray-800 transform rotate-1 transition-transform hover:rotate-0 duration-300">

                    {configError && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 text-sm rounded" role="alert">
                            <p className="font-bold font-sans">⚠️ Demo Mode Active</p>
                            <p className="font-sans">Firebase is not configured. Multiplayer will not work across devices.</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-center text-sm font-bold border-2 border-red-200">
                            {error.includes("PERMISSION_DENIED") ? (
                                <div className="text-left font-sans">
                                    <p className="font-bold mb-1">❌ Database Locked</p>
                                    <p>Enable access in Firebase Console &gt; Build &gt; Realtime Database &gt; Rules.</p>
                                </div>
                            ) : (
                                error
                            )}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xl font-bold text-gray-700 mb-2 ml-1">Who are you?</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-4 text-xl border-4 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors bg-gray-50 font-bold text-gray-700 placeholder-gray-300"
                                placeholder="Enter nickname..."
                            />
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="w-full group relative"
                        >
                            <div className="absolute inset-0 bg-gray-800 rounded-xl translate-y-2 translate-x-0 transition-transform group-hover:translate-y-3"></div>
                            <div className="relative bg-yellow-400 border-4 border-gray-800 text-gray-900 py-4 rounded-xl text-2xl font-black uppercase tracking-wider hover:-translate-y-1 transition-transform active:translate-y-1">
                                {loading ? "Creating..." : "Create Room"}
                            </div>
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t-4 border-gray-200 border-dashed"></div>
                            <span className="flex-shrink mx-4 text-gray-400 font-bold text-lg">OR</span>
                            <div className="flex-grow border-t-4 border-gray-200 border-dashed"></div>
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                className="flex-1 p-4 text-lg border-4 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors bg-gray-50 font-bold uppercase placeholder-gray-300"
                                placeholder="CODE"
                            />
                            <button
                                onClick={handleJoin}
                                disabled={loading}
                                className="group relative min-w-[100px]"
                            >
                                <div className="absolute inset-0 bg-gray-800 rounded-xl translate-y-2 translate-x-0 transition-transform group-hover:translate-y-3"></div>
                                <div className="relative bg-purple-400 border-4 border-gray-800 text-white py-4 px-6 rounded-xl text-xl font-black uppercase hover:-translate-y-1 transition-transform active:translate-y-1">
                                    {loading ? "..." : "Join"}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
