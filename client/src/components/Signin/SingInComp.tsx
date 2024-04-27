'use client';

import { Form, Input } from 'antd'
import React from 'react'
import './signin.scss';

function SingInComp() {

    const onFinish = (val: any) => {

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
                // form={form}
                >

                    <h1>Sign In</h1>

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
                            <button type="submit">
                                SIGNIN
                            </button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default SingInComp