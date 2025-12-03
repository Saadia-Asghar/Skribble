import React from 'react';
import Lobby from '../components/Lobby';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleJoin = ({ roomId, playerId, name }) => {
        // Navigate to game room with state
        navigate(`/room/${roomId}`, { state: { playerId, name } });
    };

    return <Lobby onJoin={handleJoin} />;
};

export default Home;
