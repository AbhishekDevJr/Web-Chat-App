'use client';
import { useEffect, useLayoutEffect, useState } from "react";
import { addSvg, notificationSvg, searchSvg } from "@/helpers/constants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { capitalize } from 'lodash';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const profileContent = (
        <div className="flex flex-col gap-[10px] min-w-[200px]">
            <p className="text-[18px] font-[600]">{`${capitalize(currUserData.first_name)} ${capitalize(currUserData.last_name)}`}</p>
            <p className="text-[16px] font-[600]">{`${currUserData.username}`}</p>
            <button onClick={() => signOutApi()} type="submit" className='text-[#F5F5F5] font-[600] px-[25px] py-[10px] rounded-[5px] bg-[#18181B]'>
                SIGN OUT
            </button>
        </div>
    );

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('friendList') !== 'undefined') {
            setUserFriendList(JSON.parse(localStorage.getItem('friendList') || "[]"));
        }
    }, []);

    const signOutApi = async () => {
        try {
            setExitLoading(true);
            const logOut = await fetch(`${process.env.NEXT_PUBLIC_BACK_PROD_URL}/authentication/logout`, {
                method: 'POST',
                // body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Token ${JSON.parse(localStorage.getItem("auth_token") || '{}')}`
                },
                credentials: 'include',
            });

            const logOutParsed = await logOut.json();

            if (['Logged Out', 'Auth Token does not Exists.', 'Multiple Token data found for current Token Key.'].some((str) => str === logOutParsed?.title)) {
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
                localStorage.clear();
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
                localStorage.clear();
                setExitLoading(false);
                setTimeout(() => router.push('/signin'), 2000);
            }
            else {
                if (!(typeof (logOutParsed?.msg) === "object")) {
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
                }
                else {
                    const errorMsg = Object.keys(logOutParsed?.msg).reduce(((prev, curr) => prev + logOutParsed?.msg[curr]), '')
                    toast.success(`${errorMsg}`, {
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
                localStorage.clear();
                setExitLoading(false);
                setTimeout(() => router.push('/signin'), 1000);
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
            const friendReqAcceptRes = await fetch(`${process.env.NEXT_PUBLIC_BACK_PROD_URL}/friends/accept-friend-req`, {
                method: 'POST',
                body: JSON.stringify({ username: username, request_action: 'accept' }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Token ${JSON.parse(localStorage.getItem("auth_token") || '{}')}`
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
                if (!(typeof (friendReqAcceptResJson?.msg) === "object")) {
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
                }
                else {
                    const errorMsg = Object.keys(friendReqAcceptResJson?.msg).reduce(((prev, curr) => prev + friendReqAcceptResJson?.msg[curr]), '')
                    toast.success(`${errorMsg}`, {
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
            const friendReqAcceptRes = await fetch(`${process.env.NEXT_PUBLIC_BACK_PROD_URL}/friends/accept-friend-req`, {
                method: 'POST',
                body: JSON.stringify({ username: username, request_action: 'reject' }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Token ${JSON.parse(localStorage.getItem("auth_token") || '{}')}`
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
                if (!(typeof (friendReqAcceptResJson?.msg) === "object")) {
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
                }
                else {
                    const errorMsg = Object.keys(friendReqAcceptResJson?.msg).reduce(((prev, curr) => prev + friendReqAcceptResJson?.msg[curr]), '')
                    toast.success(`${errorMsg}`, {
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
        acceptFriendReqApi(item?.username);
    }

    const handleRejectFriendReq = (item: any) => {
        rejectFriendReqApi(item?.username);
    }

    const getNotificationDataApi = async () => {
        try {
            setNotiLoading(true);
            const notificationData = await fetch(`${process.env.NEXT_PUBLIC_BACK_PROD_URL}/friends/get-friend-requests`, {
                method: 'GET',
                // body: JSON.stringify({ username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Token ${JSON.parse(localStorage.getItem("auth_token") || '{}')}`
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
                if (!(typeof (notificationDataJson?.msg) === "object")) {
                    toast.success(`${notificationDataJson?.msg}`, {
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
                    const errorMsg = Object.keys(notificationDataJson?.msg).reduce(((prev, curr) => prev + notificationDataJson?.msg[curr]), '')
                    toast.success(`${errorMsg}`, {
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
        const userinfo = localStorage.getItem('userinfo');

        if (userinfo) {
            try {
                setCurrUserData(JSON.parse(userinfo));
            } catch (err) {
                console.error('Error Parsing User JSON Data------->', err);
            }
        }
    }

    const getNotificationData = () => {
        getNotificationDataApi();
    }

    useLayoutEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            router.push('/signin');
            return;
        }
        else {
            setIsAuthenticated(true);
        }

        getCurrentUserInfo();
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" tip="Checking authentication..." />
            </div>
        );
    }

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