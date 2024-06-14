'use client';
import Link from "next/link";
import { useLayoutEffect, useState, useEffect } from "react";
import { addSvg, fakeRequestData, notificationSvg, searchSvg } from "@/helpers/constants";
import { Input, Modal, Popover } from "antd";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { capitalize, isEmpty } from 'lodash';
import { jwtDecode } from 'jwt-decode'; // For JWT parsing
import Cookies from 'js-cookie';
import io from 'socket.io-client';

export default function LoggedInLayout({
    children
}: {
    children: React.ReactNode
}) {
    const bgColors = ['bg-[#153448]', 'bg-[#0C0C0C]', 'bg-[#430A5D]', 'bg-[#5F5D9C]', 'bg-[#114232]', 'bg-[#35374B]'];
    const [chatSelection, setChatSelection] = useState('chat');
    const [addFriendModal, setIsAddFriend] = useState(false);
    const [addFriendString, setAddFriendString] = useState('');
    const router = useRouter();
    const [addFriendResult, setAddFriendResult] = useState<any>(null);
    const [friendRequestData, setFriendRequestData] = useState<any>([]);
    const [currUserData, setCurrUserData] = useState<any>({});
    const socket = io('http://localhost:5000', { autoConnect: false });
    const [userMessage, setUserMessage] = useState('');
    const [roomId, setRoomId] = useState('');
    const [userFriendList, setUserFriendList] = useState(JSON.parse(localStorage.getItem('friendList') || "[]"));


    const generateRoomId = (userId1: any, userId2: any) => {
        const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
        return `${id1}_${id2}`;
    };


    const signOutApi = async () => {
        try {
            const logOut = await fetch('http://localhost:5000/user/signout', {
                method: 'POST',
                // body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const logOutParsed = await logOut.json();

            if (logOutParsed?.title === 'Logged Out') {
                toast.success(`${logOutParsed?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                localStorage.removeItem('friendList');
                setTimeout(() => router.push('/signin'), 1000);
            }
            else {
                toast.error(`${logOutParsed?.msg}`, {
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

        } catch (err: any) {
            toast.error(`${err?.message}`, {
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
    }

    const profileContent = (
        <div className="flex flex-col gap-[10px] min-w-[200px]">
            <p className="text-[18px] font-[600]">{`${capitalize(currUserData.firstName)} ${capitalize(currUserData.lastName)}`}</p>
            <p className="text-[16px] font-[600]">{`${currUserData.username}`}</p>
            <button onClick={() => signOutApi()} type="submit" className='text-[#F5F5F5] font-[600] px-[25px] py-[10px] rounded-[5px] bg-[#18181B]'>
                SIGN OUT
            </button>
        </div>
    );

    const notificationContent = (
        <div className="min-w-[400px]">
            <div className="flex items-center justify-between p-[10px] border-b-[2px] border-[#E5E1DA] mb-[20px]">
                <p className="text-[18px] text-[#09090B] cursor-pointer border-b-[2px] border-[#09090B]">Notifications</p>
                <p className="text-[#808080] text-[18px] cursor-pointer">Mark all as read</p>
            </div>
            <ul className="flex flex-col gap-[10px]">
                {!isEmpty(friendRequestData) ? friendRequestData.map((item: any, index: any) =>
                    <li key={index} className="flex items-center justify-between gap-[10px]">
                        <span className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`}>{item.firstName[0]?.toUpperCase()}{item.lastName[0]?.toUpperCase()}</span>
                        <span className="text-[16px]"><span className="font-[600]">{capitalize(item.firstName)} {capitalize(item.lastName)}</span>{` sent you a friend request.`}</span>
                        <div className="flex gap-[10px]">
                            <button onClick={() => handleAcceptFriendReq(item)} type="submit" className='text-[#6366F1] text-[16px] font-[500] px-[15px] py-[5px] rounded-[5px] outline outline-[2px] outline-[#6366F1] hover:bg-[#6366F1] hover:text-[#F5F7F9] duration-300 hover:duration-300'>
                                Accept
                            </button>
                            <button onClick={() => handleRejectFriendReq(item)} type="submit" className='text-[#E72929] text-[16px] font-[500] px-[15px] py-[5px] rounded-[5px] outline outline-[2px] outline-[#E72929] hover:bg-[#E72929] hover:text-[#F5F7F9] duration-300 hover:duration-300'>
                                Decline
                            </button>
                        </div>
                    </li>)
                    :
                    <p className="text-[#09090B] font-[500] text-[16px] text-center">No New Notifications</p>
                }

            </ul>
        </div>
    );

    const acceptFriendReqApi = async (username: String) => {
        try {
            const friendReqAcceptRes = await fetch('http://localhost:5000/user/requests/accept', {
                method: 'POST',
                body: JSON.stringify({ sender: username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const friendReqAcceptResJson = await friendReqAcceptRes.json();

            if (friendReqAcceptResJson?.title === 'Friend Request Accepted') {
                toast.success(`${friendReqAcceptResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setFriendRequestData(friendReqAcceptResJson?.pendingRequestData);
                setUserFriendList(friendReqAcceptResJson?.friendList);
                localStorage.setItem('friendList', JSON.stringify(friendReqAcceptResJson?.friendList));
            }
            else {
                toast.error(`${friendReqAcceptResJson?.msg}`, {
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

        } catch (err: any) {
            toast.error(`${err?.message}`, {
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
    }

    const rejectFriendReqApi = async (username: String) => {
        try {
            const friendReqAcceptRes = await fetch('http://localhost:5000/user/requests/reject', {
                method: 'POST',
                body: JSON.stringify({ sender: username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const friendReqAcceptResJson = await friendReqAcceptRes.json();

            if (friendReqAcceptResJson?.title === 'Friend Request Rejected') {
                toast.success(`${friendReqAcceptResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setFriendRequestData(friendReqAcceptResJson?.pendingRequestData);
            }
            else {
                toast.error(`${friendReqAcceptResJson?.msg}`, {
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

        } catch (err: any) {
            toast.error(`${err?.message}`, {
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
    }

    const handleAcceptFriendReq = (item: any) => {
        acceptFriendReqApi(item?.email);
    }

    const handleRejectFriendReq = (item: any) => {
        rejectFriendReqApi(item?.email);
    }

    const handleAddFriendSearch = () => {
        searchFriendApi(addFriendString);
    }

    const cookieCheckerApi = async () => {
        const cookieCheck = await fetch('http://localhost:5000', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include',
        });

        const cookieCheckParse = cookieCheck.json();
    }

    const searchFriendApi = async (username: String) => {
        try {
            const searchFrndRes = await fetch('http://localhost:5000/user/search', {
                method: 'POST',
                body: JSON.stringify({ username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            const searchFrndResJson = await searchFrndRes.json();

            if (searchFrndResJson.title === `User Found`) {
                toast.success(`${searchFrndResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });

                setAddFriendResult(searchFrndResJson);
            }
            else {
                toast.error(`${searchFrndResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setAddFriendResult(null);
            }
        }
        catch (err: any) {
            toast.error(`${err?.message}`, {
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
    }

    const addFriendApi = async (username: String) => {
        try {
            const addFriendRes = await fetch('http://localhost:5000/user/requests', {
                method: 'POST',
                body: JSON.stringify({ username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const addFriendResJson = await addFriendRes.json();

            if (addFriendResJson?.title === 'Friend Request Sent' || addFriendResJson?.title === 'Request Already Exists') {
                toast.success(`${addFriendResJson?.msg}`, {
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
            else {
                toast.error(`${addFriendResJson?.msg}`, {
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
        }
        catch (err: any) {
            toast.error(`${err?.message}`, {
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
    }

    const getNotificationDataApi = async () => {
        try {
            const notificationData = await fetch('http://localhost:5000/user/notifications', {
                method: 'GET',
                // body: JSON.stringify({ username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const notificationDataJson = await notificationData.json();
            if (['Request User Data', 'No Friend Requests Found'].includes(notificationDataJson?.title)) {
                setFriendRequestData(notificationDataJson?.data);
            }
            else {
                toast.error(`${notificationDataJson?.msg}`, {
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

        } catch (err: any) {
            toast.error(`${err?.message}`, {
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

    const addFriendRequest = (request: String) => {
        addFriendApi(request);
    }

    const getNotificationData = () => {
        getNotificationDataApi();
    }

    useLayoutEffect(() => {
        cookieCheckerApi();
        getCurrentUserInfo();
    }, []);

    const handleStartPrivateChat = () => {
        const roomId = generateRoomId(`663f9302c46e01c24e77c70b`, `663e6dca105bb5869bb7afeb`);
        setRoomId(roomId);
        socket.emit('joinRoom', roomId);
    };

    const handleUserChatRedirect = (e: any, index: number) => {
        e.preventDefault();
        const senderUserId = currUserData?._id;
        const recieverUserId = userFriendList[index]?._id;
        if (senderUserId && recieverUserId) {
            const roomId = generateRoomId(senderUserId, recieverUserId);
            socket.emit('joinRoom', roomId);
            router.push(`/chats/${roomId}`);
        }
    }

    console.log('RoomId------------>', userFriendList, currUserData);

    return (
        <div className='container-user-layout flex flex-col min-h-[100vh] border-solid bg-[white]'>
            <header className='flex items-center justify-between px-[20px] py-[10px] outline outline-[#E5E1DA] outline-[1px]'>
                <div className='site-logo'>
                    <Link href='/' className="text-[28px] text-[#6366F1] font-[600] tracking-tighter whitespace-nowrap">Exclusive <span className='text-[#09090B]'>Messenger</span></Link>
                </div>

                <div className='site-search flex items-center justify-center gap-[10px]'>
                    <Input className='border-[2px] py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px]' type='text' placeholder="Search Something..." />
                    <span className="ml-[-50px] z-[10]">
                        {searchSvg}
                    </span>
                </div>

                <div className='site-user-info flex items-center justify-center gap-[10px]'>
                    <Popover content={notificationContent} title="" trigger="click" className="cursor-pointer">
                        <span onClick={() => getNotificationData()}>
                            {notificationSvg}
                        </span>
                    </Popover>

                    <Popover content={profileContent} title="" trigger="click">
                        <span className='min-w-[40px] min-h-[40px] bg-[#6366F1] rounded-[100px] flex items-center justify-center text-[#F5F7F9] cursor-pointer'>{currUserData?.firstName && capitalize(currUserData?.firstName[0])}</span>
                    </Popover>
                </div>
            </header>

            <div className='container-childred flex justify-between grow-[1]'>
                <div className='container-sidebar basis-[15%] outline outline-[#E5E1DA] outline-[1px] p-[10px]'>

                    <div className='chat-type-toggle flex items-center gap-[5px] justify-center mb-[10px]'>
                        <div className='custom-toggle px-[2px] py-[4px] bg-[#f0f0f1] rounded-[5px] flex items-center gap-[5px]'>
                            <span className={`${chatSelection === 'chat' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chat')}>Chats</span>
                            <span className={`${chatSelection === 'chatai' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chatai')}>AI Chats</span>
                        </div>
                    </div>

                    <div className="friend-add">
                        <ul className='flex justify-start gap-[5px]'>
                            {!isEmpty(userFriendList) && userFriendList.map((item: any, index: any) => <li className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`} key={index}>{capitalize(item.firstName[0])}</li>)}

                            <li onClick={() => setIsAddFriend(true)} className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] cursor-pointer outline outline-[#6366F1] outline-[1px] hover:outline-[3px]`}>{addSvg}</li>
                        </ul>
                    </div>

                    <div className="friend-list py-[30px]">
                        <ul className="flex flex-col gap-[10px]">
                            {!isEmpty(userFriendList) && userFriendList.map((item: any, index: any) =>
                                <div onClick={(e) => handleUserChatRedirect(e, index)} key={index}>
                                    <li key={index} className="flex items-center justify-between cursor-pointer border-b-[1px] border-[#E5E1DA] pb-[10px]">
                                        <span className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`}>{capitalize(item.firstName[0])}</span>

                                        <div className='flex flex-col justify-center mr-[auto] ml-[10px]'>
                                            <p className='text-[14px] font-[600]'>{`${capitalize(item.firstName)} ${capitalize(item.lastName)}`}</p>
                                            <p className='text-[14px] font-[500]'>{`Hey, I have something to tell...`}</p>
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className="text-[12px] font-[500]">2:34 PM</span>
                                            <span className="text-[12px] font-[500] flex items-center justify-center max-w-[20px] min-h-[20px] rounded-[200px] bg-[#6366F1] text-[#F5F7F9] text-center">1</span>
                                        </div>
                                    </li>
                                </div>)}
                        </ul>
                    </div>
                </div>

                <div className='container-main-section flex-1'>
                    {children}
                </div>
            </div>
            <Modal title="" open={addFriendModal} footer={null} onCancel={() => {
                setIsAddFriend(false);
                setAddFriendString('');
                setAddFriendResult(null);
            }} centered>
                <div className='add-friend-modal flex flex-col gap-[10px]'>
                    <p className='text-[22px]'>Search Friend using Username or Email.</p>
                    <Input onChange={(e) => setAddFriendString(e.target.value)} value={addFriendString} onPressEnter={handleAddFriendSearch} className='border-[2px] py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px]' type='text' placeholder="Search Friend..." />
                    <button onClick={handleAddFriendSearch} type="submit" className='text-[#6366F1] text-[16px] font-[500] px-[25px] py-[10px] rounded-[5px] outline outline-[2px] outline-[#6366F1] hover:bg-[#6366F1] hover:text-[#F5F7F9] mx-[auto] tracking-[1px] duration-300 hover:duration-300'>
                        SEARCH
                    </button>

                    <div className=''>
                        {addFriendResult ?
                            <div className='flex justify-start gap-[15px] items-center mt-[20px]'>
                                <span className='min-w-[40px] min-h-[40px] max-w-[40px] bg-[#6366F1] rounded-[100px] flex items-center justify-center text-[#F5F7F9] cursor-pointer'>{addFriendResult.firstName[0].toUpperCase()}{addFriendResult.lastName[0].toUpperCase()}</span>
                                <span className="text-[16px]"><span className="font-[500] text-[20px]">{capitalize(addFriendResult.firstName)} {capitalize(addFriendResult.lastName)}</span></span>
                                <button onClick={() => addFriendRequest(addFriendResult?.username)} type="submit" className='text-[#6366F1] text-[16px] font-[500] px-[20px] py-[10px] rounded-[5px] outline outline-[2px] outline-[#6366F1] hover:bg-[#6366F1] hover:text-[#F5F7F9] ml-[auto] duration-300 hover:duration-300'>
                                    ADD FRIEND
                                </button>
                            </div>
                            :
                            <p className='text-[18px] text-center'>
                                No User Found
                            </p>
                        }
                    </div>
                </div>
            </Modal>
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
        </div>
    );
}