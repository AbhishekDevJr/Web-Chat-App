'use client';

import { fakeRequestData } from "@/helpers/constants";
import { useEffect, useState } from "react";

export default function ChatUser({ params }: { params: any }) {
    console.log('params------->', params.chat);
    const [currUser, setCurrUser] = useState<any>({});

    const getCurrUser = () => {
        const user = fakeRequestData.find((item) => item.userId === params.chat);
        if (user?.username) {
            setCurrUser(user);
        }
        else {
            setCurrUser({});
        }
    }

    useEffect(() => {
        getCurrUser();
    }, []);

    return (
        <>
            {currUser?.username ?
                <div className='container-chat'>
                    {/* {params.chat.toUpperCase()} User Chat Route */}
                    <div className='header-chat flex justify-end items-center outline outline-[cyan] outline-[1px] py-[5px] px-[20px]'>
                        <div className=''>
                            <p>{`${currUser.firstName} ${currUser.lastName}`}</p>
                            <p>{`${currUser.username}`}</p>
                        </div>

                        <span className="">{currUser.firstName[0]}</span>
                    </div>

                    <div className='body-chat'>

                    </div>
                </div>
                :
                <h1>No Such User Found!</h1>
            }
        </>
    );
}