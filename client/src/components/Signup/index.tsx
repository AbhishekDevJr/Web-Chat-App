'use client';

import { Button, Form, Input } from 'antd';
import React from 'react';
import './signup.scss';

function SignUpComp() {

    const onFinish = () => {

    }

    const onFinishFailed = () => {

    }

    return (
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
                // form={form}
                >

                    <h1 className='text-[#ffffff] text-[40px]'>Create a new account</h1>

                    <div className='group-input-names'>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a valid First Name!',
                                    pattern: /^[A-Za-z]+$/
                                },
                            ]}
                            key='firstname'
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a valid Last Name!',
                                    pattern: /^[A-Za-z]+$/
                                },
                            ]}
                            key='lastName'
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div className='group-input-email'>
                        <Form.Item
                            label="Emai"
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
                            <Button type="primary" htmlType="submit">
                                SIGN UP
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default SignUpComp;