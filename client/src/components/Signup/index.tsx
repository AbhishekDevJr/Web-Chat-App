'use client';

import { Form, Input, Spin } from 'antd';
import React, { useState } from 'react';
import './signup.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function SignUpComp() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const userSubmitAPI = async (reqBody: any) => {
        try {
            setIsLoading(true);
            const userSubmit = await fetch(`${process.env.NEXT_PUBLIC_BACK_PROD_URL}/authentication/signup`, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Token ${Cookies.get('auth_token')}`
                }
            });

            const userSubmitParsed = await userSubmit.json();

            if (userSubmitParsed?.title === 'User Registered') {
                toast.success(`${userSubmitParsed?.msg}`, {
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
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
            }
            else {
                if (!(typeof(userSubmitParsed?.msg) === "object")) {
                    toast.success(`${userSubmitParsed?.msg}`, {
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
                    const errorMsg = Object.keys(userSubmitParsed?.msg).reduce(((prev, curr) => prev + userSubmitParsed?.msg[curr]), '')
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

        if (val.password === val.conPassword) {
            //Handle Validation
            userSubmitAPI(val);
        }
        else {
            toast.error('Password & Confirm Password should match', {
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

    const onFinishFailed = () => {

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
            <Spin tip="Fetching..." size="large" fullscreen={isLoading} spinning={isLoading}>
                <div className='comp-signup box-border px-[50px] py-[50px 0px]'>
                    <div className='flex justify-center text-[#ffffff] container-signup-form'>
                        <Form
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            requiredMark={false}
                            form={form}
                        >

                            <h1 className='text-[#ffffff] text-[40px] text-center mb-[20px]'>Create a new account</h1>

                            <div className='group-input-names'>
                                <Form.Item
                                    label="First Name"
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input a valid First Name!',
                                            pattern: /^[A-Za-z]+$/
                                        },
                                    ]}
                                    key='first_name'
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Last Name"
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input a valid Last Name!',
                                            pattern: /^[A-Za-z]+$/
                                        },
                                    ]}
                                    key='last_name'
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div className='group-input-email'>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input a valid Email Id!',
                                            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                                        },
                                    ]}
                                    key='email'
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div className='group-input-email'>
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input a valid Username Id!',
                                            pattern: /^[A-Za-z]+$/
                                        },
                                    ]}
                                    key='username'
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div className='group-input-password'>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Password!',
                                            pattern: /^[ A-Za-z0-9_@./#&+-]*$/
                                        },
                                    ]}
                                    key='password'
                                >
                                    <Input.Password className='input-passwords' />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm Password"
                                    name="conPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Password!',
                                            pattern: /^[ A-Za-z0-9_@./#&+-]*$/
                                        },
                                    ]}
                                    key='cPassword'
                                >
                                    <Input.Password className='input-passwords' />
                                </Form.Item>
                            </div>

                            <div className='group-input-btn'>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                    key='submit'
                                >
                                    <button className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#18181B] min-w-[220px]'>
                                        SIGN UP
                                    </button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
            </Spin>
        </>
    );
}

export default SignUpComp;