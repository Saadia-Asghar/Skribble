import React from 'react';

const GameSettings = ({ settings, setSettings }) => {
    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-gray-800 text-white p-6 rounded-xl border-4 border-gray-900 shadow-lg w-full max-w-md mx-auto mb-6">
            <h3 className="text-2xl font-['Permanent_Marker'] mb-4 text-center text-yellow-400 tracking-wider">Game Settings</h3>

            <div className="space-y-4">
                {/* Rounds */}
                <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-300">Rounds</label>
                    <select
                        value={settings.rounds}
                        onChange={(e) => handleChange('rounds', parseInt(e.target.value))}
                        className="bg-gray-700 border-2 border-gray-600 rounded-lg p-2 text-white font-bold focus:border-blue-500 outline-none"
                    >
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                {/* Draw Time */}
                <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-300">Draw Time (s)</label>
                    <select
                        value={settings.drawTime}
                        onChange={(e) => handleChange('drawTime', parseInt(e.target.value))}
                        className="bg-gray-700 border-2 border-gray-600 rounded-lg p-2 text-white font-bold focus:border-blue-500 outline-none"
                    >
                        {[30, 45, 60, 80, 90, 120].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                {/* Custom Words */}
                <div>
                    <label className="block font-bold text-gray-300 mb-2">Custom Words (comma separated)</label>
                    <textarea
                        value={settings.customWords}
                        onChange={(e) => handleChange('customWords', e.target.value)}
                        placeholder="Apple, Banana, Cat, Dog..."
                        className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-3 text-white font-bold focus:border-blue-500 outline-none h-24 resize-none placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">Leave empty to use default words only.</p>
                </div>
            </div>
        </div>
    );
};

export default GameSettings;
