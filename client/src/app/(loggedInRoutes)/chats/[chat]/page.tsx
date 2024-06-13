'use client';

import { fakeChat, fakeRequestData, sendSvg } from "@/helpers/constants";
import { Input } from "antd";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // For JWT parsing
import Cookies from 'js-cookie';

export default function ChatUser({ params }: { params: any }) {
    const [currUser, setCurrUser] = useState<any>({});

    const socket = io('http://localhost:5000', { autoConnect: true });
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [currUserData, setCurrUserData] = useState<any>({});


    const generateRoomId = (userId1: any, userId2: any) => {
        // Example: combine user IDs in alphabetical order to avoid duplicates
        const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
        return `${id1}_${id2}`;
    };

    const handleSendMessage = () => {
        console.log('Send msg-------------------->');
        socket.emit('sendMessage', { userMessageData: { message: userMessage, userInfo: currUserData }, roomId: `663e6dca105bb5869bb7afeb_663f9302c46e01c24e77c70b` });
        setUserMessage('');
    };

    const getCurrUser = () => {
        const user = fakeRequestData.find((item) => item.userId === params.chat);
        if (user?.username) {
            setCurrUser(user);
        }
        else {
            setCurrUser({});
        }
    }

    const getCurrentUserInfo = () => {
        const userinfo = Cookies.get('userinfo');

        if (userinfo) {
            try {
                const decoded = jwtDecode(userinfo);
                setCurrUserData(decoded);
            } catch (err) {
                console.error('Error Decoding JWT Token------->', err);
            }
        }
    }

    const sendUserMessage = () => {
        handleSendMessage()
    }

    useEffect(() => {
        // console.log('Connect Effect 2----------------->');
        getCurrUser();
        getCurrentUserInfo();
    }, []);

    useEffect(() => {
        // console.log('Connect Effect----------------->', socket);

        socket.emit('joinRoom', `663e6dca105bb5869bb7afeb_663f9302c46e01c24e77c70b`);

        socket.on('connection', () => {
            console.log('Connected to Socket.IO server!');
        });

        socket.on('receiveMessage', (messageData: any) => {
            console.log('Messages Received---------------------------->', messageData);
            messages.push(messageData); // Add received message to the state
            setMessages([...messages]); // Update the state with the new message
        });

        // return () => {
        //     socket.disconnect();
        //     socket.off('receiveMessage');
        // };
    }, []);

    // console.log(`Message User---------->`, params, messages);

    return (
        <>
            {currUser?.username ?
                <div className='container-chat flex flex-col min-h-[100%]'>
                    {/* {params.chat.toUpperCase()} User Chat Route */}
                    <div className='header-chat border-b-[1px] border-[#E5E1DA] flex justify-end items-center gap-[5px] py-[5px] px-[20px] flex-none'>
                        <div className=''>
                            <p className="text-[#09090B] font-[600] text-left">{`${currUser.firstName} ${currUser.lastName}`}</p>
                            <p className="text-[#09090B] text-[14px]">{`${currUser.username}`}</p>
                        </div>

                        <span className="min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{currUser.firstName[0]}</span>
                    </div>

                    <div className='body-chat flex-1 flex-grow p-[20px] flex flex-col items-center justify-between'>
                        <ul className="min-w-[100%]">
                            {fakeChat.map((item, index) =>
                                <li key={index} className={`flex items-center gap-[5px] ${index % 2 === 0 ? 'justify-start' : 'justify-end'} ${index !== 0 ? 'mt-[-20px]' : ''}`}>
                                    {index % 2 === 0 ?
                                        <>
                                            <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{currUser.firstName[0].toUpperCase()}</span>
                                            <div className="text-[#09090B] font-[600]">
                                                <span className="text-[#09090B] text-[14px]">{currUser.firstName}</span>
                                                <p className="bg-[#e2e2e2] p-[15px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] max-w-[400px]">{item.msg}</p>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="text-[white] font-[600] flex flex-col justify-end">
                                                <span className="text-[#09090B] text-[14px] ml-[auto]">{'Abhishek'}</span>
                                                <p className="bg-[#6366F1] p-[15px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-[20px] max-w-[400px]">{item.msg}</p>
                                            </div>

                                            <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#153448] cursor-pointer">{`A`}</span>
                                        </>
                                    }
                                </li>
                            )}
                        </ul>

                        <div className="flex items-center min-w-[50%]">
                            <Input value={userMessage} className='py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px] border-[2px]' type='text' placeholder="Say Something..." onChange={(e: any) => setUserMessage(e.target.value)} onPressEnter={sendUserMessage} />
                            <span onClick={() => sendUserMessage()} className="ml-[-40px] z-[10] cursor-pointer">
                                {sendSvg}
                            </span>
                        </div>
                    </div>
                </div>
                :
                <h1>No Such User Found!</h1>
            }
        </>
    );
}