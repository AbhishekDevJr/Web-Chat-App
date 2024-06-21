import { io } from 'socket.io-client';

const URL = 'https://exclusive-messenger.up.railway.app';
const socket = io(URL, { autoConnect: false });

export default socket;