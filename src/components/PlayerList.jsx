import React, { useMemo } from 'react';
import { HashMap } from '../dsa/HashMap';

const PlayerList = ({ players, drawerId }) => {

    const sortedPlayers = useMemo(() => {
        if (!players) return [];

        // Use HashMap to store and process players (DSA requirement)
        const playerMap = new HashMap();
        Object.values(players).forEach(p => playerMap.set(p.id, p));

        // Sort by score descending
        return playerMap.values().sort((a, b) => b.score - a.score);
    }, [players]);

    return (
        <div className="bg-white/80 rounded-xl p-2">
            <h3 className="font-black text-xl mb-3 text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <span>👥</span> Players
            </h3>
            <ul className="space-y-2">
                {sortedPlayers.map(player => (
                    <li key={player.id} className={`flex justify-between items-center p-3 rounded-xl border-2 transition-all ${player.id === drawerId ? 'bg-yellow-100 border-yellow-400 shadow-sm' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-2">
                            {player.id === drawerId && <span className="text-xl animate-bounce">✏️</span>}
                            <span className={`font-bold text-lg ${player.id === drawerId ? 'text-gray-900' : 'text-gray-600'}`}>
                                {player.name}
                            </span>
                        </div>
                        <span className="font-black text-blue-500 text-xl">{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
