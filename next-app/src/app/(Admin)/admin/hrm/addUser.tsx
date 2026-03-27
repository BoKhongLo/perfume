import React from 'react';
import { Button, Form, Input, Select, Space, InputNumber, DatePicker, message } from 'antd';
import { useAppDispatch } from '@/app/redux/hooks';
import { useSession } from 'next-auth/react';
import { CreateUserDto } from '@/lib/dtos/user';
import { UserType } from '@/types';
import { CreateUser, makeRequestApi } from '@/lib/api';

const { Option } = Select;

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
};

type FieldType = {
    email?: string,
    address?: string,
    firstName?: string,
    gender?: string,
    lastName?: string,
    password?: string,
    phoneNumber?: string,
    birthday?: Date;
    role?: string[],
    username?: string,

}

const App: React.FC = () => {
    const [form] = Form.useForm();

    const { data: session } = useSession()

    const onFinish = async (values: any) => {
        try {
            const dto: CreateUserDto = {
                email: values.email,
                username: values.username,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                role: values.role,
                phoneNumber: values.phoneNumber,
                birthday: new Date(values.birthday),
                address: values.address,
                gender: values.gender,
            }
            const responseData: UserType = await makeRequestApi(CreateUser, dto, session?.refresh_token, session?.access_token)
            if (responseData) {
                message.success('Create user successfully.');
            }
            else {
                message.error('Failed to create user.');
            }
        } catch (error) {
            console.error('Error updating warehouse:', error);
            message.error('Failed to create user.');
        }
    };

    const onReset = () => { form.resetFields(); };

    return (
        <Form
            {...layout}
            className="box-border w-full"
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            autoComplete="off"
        >
            <div className="m-8">

                <div className="section-header">
                    <div className='font-bold text-xl pb-4'>Authentication:</div>
                </div>

                <Form.Item<FieldType>
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                >
                    <Input />
                </Form.Item>


                <Form.Item<FieldType>
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select your role!' }]}
                >
                    <Select mode="multiple" placeholder="Select roles">
                        <Option value="ADMIN">Admin</Option>
                        <Option value="SALES">Sales</Option>
                        <Option value="WAREHOUSEMANAGER">Warehouse Manager</Option>
                    </Select>
                </Form.Item>

                <div className="section-header">
                    <div className='font-bold text-xl pb-4'>Thông tin cá nhân:</div>
                </div>

                <Form.Item<FieldType>
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>



                <Form.Item<FieldType>
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item<FieldType>
                    name="birthday"
                    label="Birthday"
                    rules={[{ required: true, message: 'Please select your birthday!' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item<FieldType>
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                    <Select>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16, style: { textAlign: 'right' } }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
            </div>
        </Form>
    );
};

export default App;