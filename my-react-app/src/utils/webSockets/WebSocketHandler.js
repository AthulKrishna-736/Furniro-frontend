import useWebSocket from "./userAuthSocket";

const WebSocketHandler = () => {
  const email = localStorage.getItem('email');
  const websocketUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

  if (email) {
    useWebSocket(websocketUrl); 
  }

  return null;
};

export default WebSocketHandler;
