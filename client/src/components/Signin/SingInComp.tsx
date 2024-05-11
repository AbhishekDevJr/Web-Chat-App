'use client';

import { Form, Input } from 'antd'
import React from 'react'
import './signin.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function SingInComp() {
    const router = useRouter();
    const [form] = Form.useForm();

    const userAuthApi = async (reqBody: any) => {
        try {
            const userAuth = await fetch('http://localhost:5000/user/signin', {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
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
                setTimeout(() => router.push('/userdashboard'), 3000);
            }
            else {
                toast.error(`${userAuthParsed?.msg}`, {
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

    const onFinish = (val: any) => {
        console.log('SignIn------>', val);
        userAuthApi(val);
    }

    const onFinishFailed = (val: any) => {

    }

    return (
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
                                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
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
    )
}

export default SingInComp