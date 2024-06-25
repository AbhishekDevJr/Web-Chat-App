'use client';

import { Input, Modal, Spin } from 'antd';
import { capitalize, isEmpty } from 'lodash';
import React, { useLayoutEffect, useState } from 'react'
import io from 'socket.io-client';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Lottie from 'react-lottie';
import leftArrow from '../../Lottie/leftArrow.json';


function Sidebar({ userFriendList, bgColors, addSvg, currUserData }: { userFriendList: any, bgColors: any, addSvg: any, currUserData: any }) {
    const [chatSelection, setChatSelection] = useState('chat');
    const [addFriendModal, setIsAddFriend] = useState(false);
    const [addFriendString, setAddFriendString] = useState('');
    const socket = io('https://exclusive-messenger-server.up.railway.app/', { autoConnect: false });
    const router = useRouter();
    const [addFriendResult, setAddFriendResult] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const [friendModalLoading, setFriendModalLoading] = useState(false);


    const generateRoomId = (userId1: any, userId2: any) => {
        const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
        return `${id1}_${id2}`;
    };

    const checkSelectedUser = () => {
        const [id1, id2] = window.location.pathname.includes('_') ?
            (window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length - 1)).split('_')
            :
            [];


        if (currUserData?._id === id1) {
            return userFriendList.find((item: any) => item?._id.includes(id2));
        }
        else {
            return userFriendList.find((item: any) => item?._id.includes(id1));
        }
    }

    const handleUserChatRedirect = (e: any, index: number) => {
        e.preventDefault();
        const senderUserId = currUserData?._id;
        const recieverUserId = userFriendList[index]?._id;
        if (senderUserId && recieverUserId) {
            const roomId = generateRoomId(senderUserId, recieverUserId);
            setSelectedUser(userFriendList.find(((item: any) => item?._id.includes(recieverUserId))));
            socket.emit('joinRoom', roomId);
            router.push(`/chats/${roomId}`);
        }
        // setSelectedUser(checkSelectedUser());
    }

    const searchFriendApi = async (username: String) => {
        try {
            setFriendModalLoading(true);
            const searchFrndRes = await fetch('https://exclusive-messenger-server.up.railway.app/user/search', {
                method: 'POST',
                body: JSON.stringify({ username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
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
                setFriendModalLoading(false);
                setAddFriendResult(searchFrndResJson);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(searchFrndResJson?.title)) {
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
                localStorage.removeItem('friendList');
                setFriendModalLoading(false);
                setTimeout(() => router.push('/signin'), 2000);
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
                setFriendModalLoading(false);
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
            setFriendModalLoading(false);
        }
    }

    const addFriendApi = async (username: String) => {
        try {
            setFriendModalLoading(true);
            const addFriendRes = await fetch('https://exclusive-messenger-server.up.railway.app/user/requests', {
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
                setFriendModalLoading(false);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(addFriendResJson?.title)) {
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
                localStorage.removeItem('friendList');
                setFriendModalLoading(false);
                setTimeout(() => router.push('/signin'), 2000);
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
                setFriendModalLoading(false);
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
            setFriendModalLoading(false);
        }
    }

    const handleAddFriendSearch = () => {
        searchFriendApi(addFriendString);
    }

    const addFriendRequest = (request: String) => {
        addFriendApi(request);
    }

    useLayoutEffect(() => {
        setSelectedUser(checkSelectedUser());
    }, []);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: leftArrow,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (

        <>
            <div className='container-sidebar outline outline-[#E5E1DA] outline-[1px] p-[10px] min-w-[300px]'>

                <div className='chat-type-toggle flex items-center gap-[5px] justify-center mb-[10px]'>
                    <div className='custom-toggle px-[2px] py-[4px] bg-[#f0f0f1] rounded-[5px] flex items-center gap-[5px]'>
                        <span className={`${chatSelection === 'chat' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chat')}>Chats</span>
                        <span className={`${chatSelection === 'chatai' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chatai')}>AI Chats</span>
                    </div>
                </div>

                <div className="friend-add">
                    <ul className='flex justify-start gap-[5px]'>
                        {!isEmpty(userFriendList) && userFriendList.map((item: any, index: any) => <li className={`min-w-[40px] max-h-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`} key={index}>{capitalize(item.firstName[0])}</li>)}

                        <li onClick={() => setIsAddFriend(true)} className={`min-w-[40px] min-h-[40px] max-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] cursor-pointer outline outline-[#6366F1] outline-[1px] hover:outline-[3px]`}>{addSvg}</li>
                        {[0, 1].includes(userFriendList.length) && <li className='flex justify-center items-center'>
                            <Lottie
                                options={defaultOptions}
                                height={40}
                                width={80}
                            />
                            <span className='text-[#4B5563] text-[16px]'>Add Friend Here</span>
                        </li>}
                    </ul>
                </div>

                <div className="friend-list py-[30px]">
                    <ul className="flex flex-col">
                        {!isEmpty(userFriendList) && userFriendList.map((item: any, index: any) =>
                            <div className={selectedUser?._id === item?._id ? 'bg-[#6365f191] rounded-lg' : 'hover:outline hover:outline-[#6365f191] outline-[2px] rounded-lg'} onClick={(e) => handleUserChatRedirect(e, index)} key={index}>
                                <li key={index} className="flex items-center justify-between cursor-pointer border-b-[1px] border-[#E5E1DA] p-[5px] pb-[10px] pt-[10px]">
                                    <span className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`}>{capitalize(item.firstName[0])}</span>

                                    <div className='flex flex-col gap-[5px] justify-center mr-[auto] ml-[10px]'>
                                        <p className='text-[14px] font-[600]'>{`${capitalize(item.firstName)} ${capitalize(item.lastName)}`}</p>
                                        <p className='text-[14px] font-[500]'>{`Tap here to Chat!`}</p>
                                    </div>

                                    <div className='flex flex-col gap-[5px]'>
                                        <span className="text-[12px] font-[500]">2:34 PM</span>
                                        <span className="text-[12px] font-[500] flex items-center justify-center max-w-[20px] min-h-[20px] rounded-[200px] bg-[#6366F1] text-[#F5F7F9] text-center">1</span>
                                    </div>
                                </li>
                            </div>)}
                    </ul>
                </div>
            </div>

            <Modal title="" open={addFriendModal} footer={null} onCancel={() => {
                setIsAddFriend(false);
                setAddFriendString('');
                setAddFriendResult(null);
            }} centered>
                <>
                    <Spin tip="Fetching..." size="large" fullscreen={false} spinning={friendModalLoading}>
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
                    </Spin>
                </>
            </Modal>
        </>
    )
}

export default Sidebar;