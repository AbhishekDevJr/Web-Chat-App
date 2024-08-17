import { io } from 'socket.io-client';

const URL = 'https://web-chat-app-1-99cb.onrender.com/';
const socket = io(URL, { autoConnect: false });

export default socket;