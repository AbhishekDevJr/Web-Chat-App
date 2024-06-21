'use client';

import { sendSvg } from "@/helpers/constants";
import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // For JWT parsing
import Cookies from 'js-cookie';
import { isEmpty } from "lodash";

export default function ChatUser({ params }: { params: any }) {
    // const [currUser, setCurrUser] = useState<any>({});

    const socket = io('https://exclusive-messenger.up.railway.app', { autoConnect: true });
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [currUserData, setCurrUserData] = useState<any>({});
    const chatBoxRef = useRef<any>(null);
    const [isTyping, setIsTyping] = useState<Boolean>(false);
    const [typingMessage, setTypingMessage] = useState('');
    const [senderUserObj, setSenderUserObj] = useState<any>({});


    const generateRoomId = (userId1: any, userId2: any) => {
        // Example: combine user IDs in alphabetical order to avoid duplicates
        const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
        return `${id1}_${id2}`;
    };

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    const handleSendMessage = () => {
        socket.emit('sendMessage', { userMessageData: { message: userMessage, userInfo: currUserData }, roomId: params?.chat });
        setUserMessage('');
    };

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { roomId: params?.chat, currUserData });
        }

        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {
            setIsTyping(false);
            if (!isTyping) {
                socket.emit('stopTyping', { roomId: params?.chat, currUserData });
            }
        }, 2000);

        // clearTimeout(typingTimeout);
    }

    let typingTimeout: any;

    const handleMsgInputChange = (val: any) => {
        setUserMessage(val);
        handleTyping();
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
        getCurrentUserInfo();
    }, []);

    useEffect(() => {

        socket.emit('joinRoom', params?.chat);

        socket.on('connection', () => {
            console.log('Connected to Socket.IO server!');
        });

        socket.on('typing', (data) => {
            setSenderUserObj(data?.currUserData);
            setTypingMessage(`${data?.currUserData?.firstName} is typing...`);
        });

        socket.on('stopTyping', (data) => {
            setSenderUserObj(data?.currUserData);
            setTypingMessage('');
        });

        socket.on('receiveMessage', (messageData: any) => {
            messages.push(messageData); // Add received message to the state
            setMessages(messages.filter((item: any, index: any) => index % 2 !== 0)); // Update the state with the new message
        });

        // return () => {
        //     socket.disconnect();
        //     socket.off('receiveMessage');
        // };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <>
            {currUserData?.username ?
                <div className='container-chat flex flex-col min-h-[100%]'>
                    {/* {params.chat.toUpperCase()} User Chat Route */}
                    <div className='header-chat border-b-[1px] border-[#E5E1DA] flex justify-end items-center gap-[5px] py-[5px] px-[20px] flex-none'>
                        <div className=''>
                            <p className="text-[#09090B] font-[600] text-left">{`${currUserData.firstName} ${currUserData.lastName}`}</p>
                            <p className="text-[#09090B] text-[14px]">{`${currUserData.username}`}</p>
                        </div>

                        <span className="min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{currUserData?.firstName[0]}</span>
                    </div>

                    <div ref={chatBoxRef} className='body-chat flex-1 flex-grow p-[20px] flex flex-col items-center max-h-[85vh] justify-between overflow-y-auto relative'>

                        {messages.length ?
                            <ul className="min-w-[100%]">
                                {!isEmpty(messages) && messages.map((item: any, index: any) =>
                                    <li key={index} className={`flex items-center gap-[5px] ${item?.userMessageData?.userInfo?.username === messages[index + 1]?.userMessageData?.userInfo?.username ? 'mb-[30px]' : ''} ${item?.userMessageData?.userInfo?.username !== currUserData?.username ? 'justify-start' : 'justify-end'} ${index !== 0 ? 'mt-[-20px]' : ''}`}>
                                        {item?.userMessageData?.userInfo?.username !== currUserData?.username ?
                                            <>
                                                <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{item?.userMessageData?.userInfo?.firstName[0].toUpperCase()}</span>
                                                <div className="text-[#09090B] font-[600]">
                                                    <span className="text-[#09090B] text-[14px]">{item?.userMessageData?.userInfo?.firstName}</span>
                                                    <p className="bg-[#e2e2e2] p-[15px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] max-w-[400px]">{item?.userMessageData?.message}</p>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="text-[white] font-[600] flex flex-col justify-end">
                                                    <span className="text-[#09090B] text-[14px] ml-[auto]">{item?.userMessageData?.userInfo?.firstName}</span>
                                                    <p className="bg-[#6366F1] p-[15px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-[20px] max-w-[400px]">{item?.userMessageData?.message}</p>
                                                </div>

                                                <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#153448] cursor-pointer">{item?.userMessageData?.userInfo?.firstName[0].toUpperCase()}</span>
                                            </>
                                        }
                                    </li>
                                )}
                            </ul>
                            :
                            <>
                                <video autoPlay muted loop className="max-h-[70%] min-w-[70%] object-contain absolute top-[50px]">
                                    <source src="/assets/mails.mp4" type="video/mp4" />
                                </video>
                                {/* <p className="absolute">Send a message to start the Conversation</p> */}
                            </>
                        }

                        {typingMessage && senderUserObj?._id !== currUserData?._id && <p className="absolute bottom-[100px]">{`${typingMessage}`}</p>}

                        <div className="flex items-center min-w-[50%] fixed bottom-[20px]">
                            <Input value={userMessage} className='py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px] border-[2px]' type='text' placeholder="Say Something..." onChange={(e: any) => handleMsgInputChange(e.target.value)} onPressEnter={sendUserMessage} />
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