import React from 'react';

const COLORS = [
    '#000000', '#FFFFFF', '#7f7f7f', '#c3c3c3', '#880015', '#b97a57', '#ff7f27', '#ffaec9',
    '#ed1c24', '#ffc90e', '#fff200', '#efe4b0', '#22b14c', '#b5e61d', '#00a2e8', '#99d9ea',
    '#3f48cc', '#7092be', '#a349a4', '#c8bfe7', '#4b0082', '#663399', '#ff00ff', '#ff69b4'
];

const BRUSH_TYPES = [
    { id: 'pen', label: '🖊️', name: 'Pen' },
    { id: 'marker', label: '🖍️', name: 'Marker' },
    { id: 'highlighter', label: '🔦', name: 'Highlighter' },
    { id: 'calligraphy', label: '✒️', name: 'Calligraphy' },
    { id: 'doodle', label: '🌀', name: 'Doodle' },
    { id: 'spray', label: '🚿', name: 'Spray' },
];

const SHAPE_TYPES = [
    { id: 'line', label: '📏', name: 'Line' },
    { id: 'rect', label: '⬜', name: 'Rectangle' },
    { id: 'rect_filled', label: '⬛', name: 'Filled Rect' },
    { id: 'circle', label: '⭕', name: 'Circle' },
    { id: 'circle_filled', label: '⚫', name: 'Filled Circle' },
    { id: 'triangle', label: '🔺', name: 'Triangle' },
    { id: 'arrow', label: '➡️', name: 'Arrow' },
];

const RoomControls = ({
    color, setColor, size, setSize, isDrawer,
    tool, setTool, brushType, setBrushType, shapeType, setShapeType, opacity, setOpacity,
    onUndo, onRedo, onClear
}) => {
    if (!isDrawer) return <div className="p-4 text-center text-gray-500 italic font-bold bg-white/50 rounded-xl">You are guessing! Watch the magic happen.</div>;

    return (
        <div className="flex flex-col gap-2 p-3 bg-white rounded-3xl border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-full select-none">

            {/* Row 1: Main Tools & Actions */}
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTool('brush')}
                        className={`p-2 rounded-xl border-2 font-bold transition-all ${tool === 'brush' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        title="Brush Tool"
                    >
                        🖌️ Brush
                    </button>
                    <button
                        onClick={() => setTool('shape')}
                        className={`p-2 rounded-xl border-2 font-bold transition-all ${tool === 'shape' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        title="Shape Tool"
                    >
                        🔺 Shapes
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={`p-2 rounded-xl border-2 font-bold transition-all ${tool === 'eraser' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        title="Eraser"
                    >
                        🧼 Eraser
                    </button>
                </div>

                <div className="flex gap-2">
                    <button onClick={onUndo} className="p-2 rounded-xl border-2 border-gray-200 hover:bg-gray-100" title="Undo">↩️</button>
                    <button onClick={onRedo} className="p-2 rounded-xl border-2 border-gray-200 hover:bg-gray-100" title="Redo">↪️</button>
                    <button onClick={onClear} className="p-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50" title="Clear Canvas">🗑️</button>
                </div>
            </div>

            {/* Row 2: Sub-Tools & Settings */}
            <div className="flex flex-wrap gap-4 items-center py-1">

                {/* Brush Types */}
                {tool === 'brush' && (
                    <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                        {BRUSH_TYPES.map(b => (
                            <button
                                key={b.id}
                                onClick={() => setBrushType(b.id)}
                                className={`p-2 rounded-lg transition-all ${brushType === b.id ? 'bg-white shadow-sm ring-1 ring-gray-300' : 'hover:bg-gray-200 opacity-70 hover:opacity-100'}`}
                                title={b.name}
                            >
                                {b.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Shape Types */}
                {tool === 'shape' && (
                    <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                        {SHAPE_TYPES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setShapeType(s.id)}
                                className={`p-2 rounded-lg transition-all ${shapeType === s.id ? 'bg-white shadow-sm ring-1 ring-gray-300' : 'hover:bg-gray-200 opacity-70 hover:opacity-100'}`}
                                title={s.name}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Sliders */}
                <div className="flex items-center gap-4 ml-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">SIZE</span>
                        <input
                            type="range"
                            min="1" max="50"
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">OPACITY</span>
                        <input
                            type="range"
                            min="10" max="100"
                            value={opacity * 100}
                            onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                        />
                    </div>
                </div>
            </div>

            {/* Row 3: Colors */}
            <div className="flex flex-wrap gap-1 justify-center pt-1">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-full overflow-hidden border-0 p-0 cursor-pointer shadow-sm"
                    title="Custom Color"
                />
                <div className="w-px h-8 bg-gray-200 mx-2"></div>
                {COLORS.map((c, i) => (
                    <button
                        key={`${c}-${i}`}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-gray-900 ring-2 ring-gray-400 scale-110 z-10 shadow-lg' : 'border-gray-300'}`}
                        style={{ backgroundColor: c }}
                        title={c}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomControls;
