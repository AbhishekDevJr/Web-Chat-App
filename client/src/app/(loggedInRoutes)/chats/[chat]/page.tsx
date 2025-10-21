'use client';

import { sendSvg } from "@/helpers/constants";
import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { isEmpty } from "lodash";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ChatUser({ params }: { params: any }) {
    // const [currUser, setCurrUser] = useState<any>({});

    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [currUserData, setCurrUserData] = useState<any>({});
    const chatBoxRef = useRef<any>(null);
    const [isTyping, setIsTyping] = useState<Boolean>(false);
    const [typingMessage, setTypingMessage] = useState('');
    const [senderUserObj, setSenderUserObj] = useState<any>({});
    const [socket, setSocket] = useState<any>(null);


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
        if (userMessage) {
            sendMessage(userMessage);
        }
        setUserMessage('');
    };

    const handleTyping = () => {
        const message_payload = {
            message_type: 'user_type_start',
            message: 'Temp',
            sender: currUserData
        }
        if (!isTyping) {
            socket.send(JSON.stringify(message_payload));
        }

        typingTimeout = setTimeout(() => {
            message_payload.message_type = `user_type_stop`
            socket.send(JSON.stringify(message_payload));
        }, 2000);
    }

    let typingTimeout: any;

    const handleMsgInputChange = (val: any) => {
        setUserMessage(val);
        handleTyping();
    }

    const getCurrentUserInfo = () => {
        const userinfo = localStorage.getItem('userinfo') || '';

        if (userinfo) {
            try {
                setCurrUserData(JSON.parse(userinfo));
            } catch (err) {
                console.error('Error Decoding JWT Token------->', err);
            }
        }
    }

    const sendUserMessage = () => {
        handleSendMessage();
    }

    useEffect(() => {
        getCurrentUserInfo();
    }, []);

    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_PROTOCOL}://${process.env.NEXT_PUBLIC_WS_PROD_URL}/ws/chat/${params?.chat}?token=${JSON.parse(localStorage.getItem("auth_token") || '{}')}`);
        setSocket(ws);

        ws.onopen = (event) => {
            console.log("Client Logs: WebSocket Connection is Open for communication!");
        }

        ws.onerror = (event) => {
            console.log("Client Logs: WebSocket Connection Error", event);
        }

        ws.onclose = (event) => {
            console.log("Client Logs: WebSocket Connection Closed", event);
            toast.error(`Error while establishing Web-Socket Connnection.`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setSenderUserObj(data?.receiver);

            if (data?.Success) {
                console.log('Client Logs: WebSocket Message Connection Established');
            }
            else if (data?.message_type === `user_message`) {
                setMessages((prevMessages: any) => [...prevMessages, data]);
            }
            else if (data?.message_type === `user_type_start`) {
                setIsTyping(true);
            }
            else if (data?.message_type === `user_type_stop`) {
                setIsTyping(false);
            }
        }

        return () => {
            if (ws) {
                ws.onmessage = null;
            }
        }

    }, [params?.chat]);

    const sendMessage = (msg: String) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const messagePayload = {
                message_type: `user_message`,
                message: msg,
                sender: currUserData
            }
            socket.send(JSON.stringify(messagePayload));
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                // pauseOnHover
                theme="dark"
            // transition: Bounce
            />

            {currUserData?.username ?
                <div className='container-chat flex flex-col min-h-[100%]'>
                    {/* {params.chat.toUpperCase()} User Chat Route */}
                    <div className='header-chat border-b-[1px] border-[#E5E1DA] flex justify-end items-center gap-[5px] py-[5px] px-[20px] flex-none'>
                        <div className=''>
                            <p className="text-[#09090B] font-[600] text-left">{`${currUserData.first_name} ${currUserData.last_name}`}</p>
                            <p className="text-[#09090B] text-[14px]">{`${currUserData.username}`}</p>
                        </div>

                        <span className="min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{currUserData?.first_name[0]}</span>
                    </div>

                    <div ref={chatBoxRef} className='body-chat flex-1 flex-grow p-[20px] flex flex-col items-center max-h-[85vh] justify-between overflow-y-auto relative'>

                        {messages.length ?
                            <ul className="min-w-[100%]">
                                {!isEmpty(messages) && messages.map((item: any, index: any) =>
                                    <li key={index} className={`flex items-center gap-[5px] ${item?.sender?.userid === messages[index + 1]?.sender?.userid ? 'mb-[30px]' : ''} ${item?.sender?.userid !== currUserData?.userid ? 'justify-start' : 'justify-end'} ${index !== 0 ? 'mt-[-20px]' : ''}`}>
                                        {item?.sender?.userid !== currUserData?.userid ?
                                            <>
                                                <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{item?.sender?.first_name[0].toUpperCase()}</span>
                                                <div className="text-[#09090B] font-[600]">
                                                    <span className="text-[#09090B] text-[14px]">{item?.sender?.first_name}</span>
                                                    <p className="bg-[#e2e2e2] p-[15px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] max-w-[400px]">{item?.message}</p>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="text-[white] font-[600] flex flex-col justify-end">
                                                    <span className="text-[#09090B] text-[14px] ml-[auto]">{item?.sender?.first_name}</span>
                                                    <p className="bg-[#6366F1] p-[15px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-[20px] max-w-[400px]">{item?.message}</p>
                                                </div>

                                                <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#153448] cursor-pointer">{item?.sender?.first_name[0].toUpperCase()}</span>
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

                        {isTyping && senderUserObj?.userid !== currUserData?.userid && <p className="typing-dots absolute bottom-[100px] text-gray-500 italic text-m">{`${`${senderUserObj?.first_name} is typing...`}`}</p>}

                        <div className="flex items-center min-w-[50%] fixed bottom-[20px]">
                            <Input value={userMessage} className='py-[10px] px-[20px] pr-[40px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px] border-[2px]' type='text' placeholder="Say Something..." onChange={(e: any) => handleMsgInputChange(e.target.value)} onPressEnter={sendUserMessage} />
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