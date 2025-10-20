'use client';

import { Form, Input, Spin } from 'antd'
import React, { useState } from 'react'
import './signin.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function SingInComp() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const userAuthApi = async (reqBody: any) => {
        try {
            setIsLoading(true);
            const userAuth = await fetch(`${process.env.NEXT_PUBLIC_BACK_PROD_URL}/authentication/login`, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Token ${JSON.parse(localStorage.getItem("auth_token") || '{}')}`
                },
                credentials: 'include',
            });

            const userAuthParsed = await userAuth.json();

            if (userAuthParsed?.title === 'Authentication Successful') {
                toast.success(`${userAuthParsed?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                form.resetFields();
                setIsLoading(false);
                localStorage.setItem('auth_token', JSON.stringify(userAuthParsed?.token));
                localStorage.setItem('friendList', JSON.stringify(userAuthParsed?.friendList));
                localStorage.setItem('userinfo', JSON.stringify(userAuthParsed?.currentUser));
                setTimeout(() => router.push('/userdashboard'), 1000);
            }
            else {
                if (!(typeof (userAuthParsed?.msg) === "object")) {
                    toast.success(`${userAuthParsed?.msg}`, {
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
                    const errorMsg = Object.keys(userAuthParsed?.msg).reduce(((prev, curr) => prev + userAuthParsed?.msg[curr]), '')
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
                setIsLoading(false);
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
            setIsLoading(false);
        }
    }

    const onFinish = (val: any) => {
        userAuthApi(val);
    }

    const onFinishFailed = (val: any) => {

    }

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
            <Spin tip="Fetching..." size="large" fullscreen={false} spinning={isLoading}>
                <div className=''>
                    <div className={`container-signin`}>
                        <Form
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            requiredMark={false}
                        // form={form}
                        >

                            <h1 className='text-[#ffffff] text-[40px] text-center mb-[20px]'>Sign In to your Account</h1>

                            <div className='group-signin-inputs'>
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input a valid Username!',
                                            pattern: /^[A-Za-z]+$/
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input a valid Passcode!',
                                            pattern: /^[ A-Za-z0-9_@./#&+-]*$/
                                        },
                                    ]}
                                >
                                    <Input.Password className='input-passwords' />
                                </Form.Item>
                            </div>

                            <div className='group-btn'>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <button type="submit" className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#18181B] min-w-[220px]'>
                                        SIGN IN
                                    </button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
            </Spin>
        </>
    )
}

export default SingInComp