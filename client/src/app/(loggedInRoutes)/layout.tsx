'use client';
import { useEffect, useLayoutEffect, useState } from "react";
import { addSvg, notificationSvg, searchSvg } from "@/helpers/constants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { capitalize } from 'lodash';
import { jwtDecode } from 'jwt-decode'; // For JWT parsing
import Cookies from 'js-cookie';

import LoginHeader from "../../components/LoginHeader/LoginHeader";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Spin } from "antd";

export default function LoggedInLayout({
    children
}: {
    children: React.ReactNode
}) {
    const bgColors = ['bg-[#153448]', 'bg-[#0C0C0C]', 'bg-[#430A5D]', 'bg-[#5F5D9C]', 'bg-[#114232]', 'bg-[#35374B]'];


    const router = useRouter();
    const [friendRequestData, setFriendRequestData] = useState<any>([]);
    const [currUserData, setCurrUserData] = useState<any>({});
    const [userFriendList, setUserFriendList] = useState(JSON.parse("[]"));
    const [notiLoading, setNotiLoading] = useState(false);
    const [exitLoading, setExitLoading] = useState(false);

    const profileContent = (
        <div className="flex flex-col gap-[10px] min-w-[200px]">
            <p className="text-[18px] font-[600]">{`${capitalize(currUserData.firstName)} ${capitalize(currUserData.lastName)}`}</p>
            <p className="text-[16px] font-[600]">{`${currUserData.username}`}</p>
            <button onClick={() => signOutApi()} type="submit" className='text-[#F5F5F5] font-[600] px-[25px] py-[10px] rounded-[5px] bg-[#18181B]'>
                SIGN OUT
            </button>
        </div>
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserFriendList(JSON.parse(localStorage.getItem('friendList') || "[]"));
        }
    }, []);

    const signOutApi = async () => {
        try {
            setExitLoading(true);
            const logOut = await fetch('https://exclusive-messenger-server.up.railway.app/user/signout', {
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
                setExitLoading(false);
                setTimeout(() => router.push('/signin'), 1000);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(logOutParsed?.title)) {
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
                localStorage.removeItem('friendList');
                setExitLoading(false);
                setTimeout(() => router.push('/signin'), 2000);
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
                setExitLoading(false);
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
            setExitLoading(false);
        }
    }

    const acceptFriendReqApi = async (username: String) => {
        try {
            setNotiLoading(true);
            const friendReqAcceptRes = await fetch('https://exclusive-messenger-server.up.railway.app/user/requests/accept', {
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
                setNotiLoading(false);
                localStorage.setItem('friendList', JSON.stringify(friendReqAcceptResJson?.friendList));
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(friendReqAcceptResJson?.title)) {
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
                localStorage.removeItem('friendList');
                setNotiLoading(false);
                setTimeout(() => router.push('/signin'), 2000);
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
                setNotiLoading(false);
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
            setNotiLoading(false);
        }
    }

    const rejectFriendReqApi = async (username: String) => {
        try {
            setNotiLoading(true);
            const friendReqAcceptRes = await fetch('https://exclusive-messenger-server.up.railway.app/user/requests/reject', {
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
                setNotiLoading(false);
                setFriendRequestData(friendReqAcceptResJson?.pendingRequestData);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(friendReqAcceptResJson?.title)) {
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
                setNotiLoading(false);
                localStorage.removeItem('friendList');
                setTimeout(() => router.push('/signin'), 2000);
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
                setNotiLoading(false);
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
            setNotiLoading(false);
        }
    }

    const handleAcceptFriendReq = (item: any) => {
        acceptFriendReqApi(item?.email);
    }

    const handleRejectFriendReq = (item: any) => {
        rejectFriendReqApi(item?.email);
    }

    const cookieCheckerApi = async () => {
        const cookieCheck = await fetch('https://exclusive-messenger-server.up.railway.app/', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include',
        });

        const cookieCheckParse = cookieCheck.json();
    }

    const getNotificationDataApi = async () => {
        try {
            setNotiLoading(true);
            const notificationData = await fetch('https://exclusive-messenger-server.up.railway.app/user/notifications', {
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
                setNotiLoading(false);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(notificationDataJson?.title)) {
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
                localStorage.removeItem('friendList');
                setNotiLoading(false);
                setTimeout(() => router.push('/signin'), 2000);
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
                setNotiLoading(false);
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
            setNotiLoading(false);
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

    const getNotificationData = () => {
        getNotificationDataApi();
    }

    useLayoutEffect(() => {
        cookieCheckerApi();
        getCurrentUserInfo();
    }, []);

    return (
        <>
            <Spin tip="Fetching..." size="large" fullscreen={false} spinning={exitLoading}>
                <div className='container-user-layout flex flex-col min-h-[100vh] border-solid bg-[white]'>
                    <LoginHeader
                        searchSvg={searchSvg}
                        friendRequestData={friendRequestData}
                        bgColors={bgColors}
                        handleAcceptFriendReq={handleAcceptFriendReq}
                        handleRejectFriendReq={handleRejectFriendReq}
                        getNotificationData={getNotificationData}
                        notificationSvg={notificationSvg}
                        profileContent={profileContent}
                        currUserData={currUserData}
                        notiLoading={notiLoading}
                    />

                    <div className='container-childred flex justify-between grow-[1]'>
                        <Sidebar
                            userFriendList={userFriendList}
                            bgColors={bgColors}
                            addSvg={addSvg}
                            currUserData={currUserData}
                        />

                        <div className='container-main-section flex-1'>
                            {children}
                        </div>
                    </div>
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
            </Spin>
        </>
    );
}