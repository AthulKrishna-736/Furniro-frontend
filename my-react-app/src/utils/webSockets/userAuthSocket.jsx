import { useEffect } from 'react';

const useWebSocket = (url) => {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => console.log('WebSocket connected');
        socket.onmessage = (event) => console.log('Message from server:', event.data);
        socket.onerror = (error) => console.log('WebSocket error:', error);
        socket.onclose = () => console.log('WebSocket disconnected');

        return () => socket.close();
    }, [url]);
};

export default useWebSocket;
