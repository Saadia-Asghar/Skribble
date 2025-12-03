import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';
import { joinRoom } from './db/roomAPI';
import DoodleBackground from './components/DoodleBackground';

const GameRoomWrapper = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const [joinState, setJoinState] = React.useState(location.state || null);
    const [name, setName] = React.useState("");

    if (joinState) {
        return <GameRoom roomId={roomId} playerId={joinState.playerId} playerName={joinState.name} />;
    }

    // If no state, ask for name to join
    const handleJoin = async () => {
        if (!name) return;
        // We need to join the room via API to get playerId

        try {
            const { playerId } = await joinRoom(roomId, name);
            setJoinState({ playerId, name });
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 font-['Patrick_Hand']">
            <DoodleBackground />

            <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] border-4 border-gray-800 transform rotate-1 transition-transform hover:rotate-0 duration-300">
                <h2 className="text-4xl font-['Permanent_Marker'] text-gray-900 mb-8 text-center transform -rotate-2">
                    Join Room: <span className="text-blue-600">{roomId}</span>
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xl font-bold text-gray-700 mb-2 ml-1">Who are you?</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="w-full p-4 text-xl border-4 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors bg-gray-50 font-bold text-gray-700 placeholder-gray-300"
                        />
                    </div>

                    <button
                        onClick={handleJoin}
                        className="w-full group relative"
                    >
                        <div className="absolute inset-0 bg-gray-800 rounded-xl translate-y-2 translate-x-0 transition-transform group-hover:translate-y-3"></div>
                        <div className="relative bg-blue-500 border-4 border-gray-800 text-white py-4 rounded-xl text-2xl font-black uppercase tracking-wider hover:-translate-y-1 transition-transform active:translate-y-1">
                            Join Game
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room/:roomId" element={<GameRoomWrapper />} />
            </Routes>
        </Router>
    );
}

export default App;
