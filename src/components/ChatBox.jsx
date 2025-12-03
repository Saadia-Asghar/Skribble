import React, { useEffect, useState, useRef } from 'react';
import { Queue } from '../dsa/Queue';

const ChatBox = ({ messages }) => {
    const [displayMessages, setDisplayMessages] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!messages) {
            setDisplayMessages([]);
            return;
        }

        // Use Queue to manage messages (DSA requirement)
        const queue = new Queue();
        const msgArray = Object.values(messages).sort((a, b) => a.timestamp - b.timestamp);

        msgArray.forEach(msg => queue.enqueue(msg));

        // If we wanted to limit chat history, we could dequeue
        while (queue.size() > 50) {
            queue.dequeue();
        }

        setDisplayMessages(queue.getAll());
    }, [messages]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [displayMessages]);

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
            <div className="bg-gray-800 text-white p-2 font-bold text-center text-sm uppercase tracking-wider">Chat</div>
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-2 space-y-2 bg-white"
            >
                {displayMessages.length === 0 && <div className="text-center text-gray-400 text-sm mt-4">No messages yet</div>}
                {displayMessages.map((msg, idx) => (
                    <div key={idx} className={`text-sm break-words ${msg.isSystem ? 'text-green-600 font-bold text-center bg-green-50 p-1 rounded' : ''}`}>
                        {!msg.isSystem && <span className="font-bold text-gray-700 mr-1">{msg.playerName}:</span>}
                        <span className={msg.isSystem ? '' : 'text-gray-800'}>{msg.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatBox;
