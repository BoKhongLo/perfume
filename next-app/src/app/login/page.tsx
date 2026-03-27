"use client";
import React, { useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Col } from 'antd';

const App: React.FC = (props: any) => {
    const router = useRouter();
    const [form] = Form.useForm();



    const onSubmit = async (values: { email: string; password: string }) => {
        const { email, password } = values;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (!res?.error) {
            console.log(res)
            router.push(props.searchParams.callbackUrl ?? "/admin");
        } else {
            toast.error("Email hoặc mật khẩu không chính xác!");
        }
    };

    return (
        <div className="bg-white flex h-screen w-screen flex-col justify-center">
            <div className="font-sans text-gray-900 antialiased">
                <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3]">

                    <div>
                        <a href="/">
                            <h2 className="font-bold text-3xl">PERFUMEDK <span className="bg-[#f84525] text-white px-2 rounded-md">ADMIN</span></h2>
                        </a>
                    </div>

                    <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                        <Form
                            form={form}
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onSubmit}
                            style={{ maxWidth: 360, margin: "auto" }}
                        >
                            <div className="py-8">
                                <center>
                                    <span className="text-2xl font-semibold">Đăng Nhập</span>
                                </center>
                            </div>

                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input prefix={<LockOutlined />} type="password" placeholder="Mật khẩu" />
                            </Form.Item>

                            <Form.Item>
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>Ghi nhớ</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <a href="#">Quên mật khẩu?</a>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item>
                                <Button block type="primary" htmlType="submit">
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
