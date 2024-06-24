import { io } from 'socket.io-client';

const URL = 'exclusive-messenger-server.up.railway.app';
const socket = io(URL, { autoConnect: false });

export default socket;