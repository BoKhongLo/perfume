import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Space, InputNumber, DatePicker, Switch, message } from 'antd';
import { UpdateUserDto } from '@/lib/dtos/user';
import { UserType } from '@/types';
import { getUserById, makeRequestApi, updateUser } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { UpdateUserEdit, UpdateUserEditId } from '@/app/redux/features/userData';
const { Option } = Select;

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
};

type FieldType = {
    userId: string;
    isDisplay?: boolean;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string[];
    phoneNumber?: string;
    birthday?: Date;
    address?: string;
    gender?: string;
};

interface AppProps {
    changeTab: (tabKey: string) => void;
}

const App: React.FC<AppProps> = ({ changeTab }) => {
    const [form] = Form.useForm();
    const { data: session } = useSession()
    const dataEditId = useAppSelector((state) => state.UserData.userEditId);
    const dataEdit = useAppSelector((state) => state.UserData.userEdit);
    const dispatch = useAppDispatch();
    console.log(dataEditId)
    useEffect(() => {
        const fetchData = async () => {
            if (dataEditId) { 
                const data : UserType = await makeRequestApi(getUserById, dataEditId, session?.refresh_token, session?.access_token)
                if (data) {
                    dispatch(UpdateUserEdit(data));
                }
            }
        };
        fetchData();
    }, [dataEditId, dispatch]);

    if (!dataEdit && dataEditId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <h1 className="text-3xl font-bold">Loading Data ...</h1>
            </div>
        );
    }

    if (!dataEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold">Không có dữ liệu để chỉnh sửa</h1>
            </div>
        );
    }

    const onFinish = async (values: any) => {
        try {
            const dto: UpdateUserDto = {
                email: values.email,
                username: values.username || '',
                password: values.password || 'admin',
                firstName: values?.details?.firstName || '',
                lastName: values?.details?.lastName || '',
                role: values.role,
                phoneNumber: values?.details?.phoneNumber.toString() || '',
                birthday: new Date(values?.details?.birthday || new Date()),
                address: values?.details?.address,
                gender: values?.details?.gender,
                isDisplay: values.isDisplay,
                userId: values.secretKey
            }
   
            const responseData: UserType = await makeRequestApi(updateUser, dto, session?.refresh_token, session?.access_token)
            if (responseData) {
                message.success('Update user successfully.');
                changeTab('2')
                dispatch(UpdateUserEdit(null))
                dispatch(UpdateUserEditId(null))
            }
            else {
                message.error('Failed to update user.');
            }
        } catch (error) {
            message.error('Failed to update user.');
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form
            {...layout}
            form={form}
            name="update-user"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={dataEdit}
        >
            <div className='m-8'>

                <div className="section-header">
                    <div className='font-bold text-xl pb-4'>Authentication:</div>
                </div>

                <Form.Item<UserType>
                    name="secretKey"
                    label="User ID"
                    rules={[{ required: true, message: 'User ID is required!' }]}
                >
                    <Input disabled />
                </Form.Item>


                <Form.Item<UserType>
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<UserType>
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<UserType>
                    name="isDisplay"
                    label="Display"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item<UserType>
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

                <Form.Item<UserType>
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<UserType>
                    name={['details', "firstName"]}
                    label="First Name"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<UserType>
                    name={['details', "lastName"]}
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<UserType>
                    name={['details', "address"]}
                    label="Address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<UserType>
                    name={['details', "phoneNumber"]}
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item<UserType>
                    name={['details', "gender"]}
                    label="Gender"
                    rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                    <Select>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                    </Select>
                </Form.Item>

                <Form.Item<UserType>
                    name={['details', "birthday"]}
                    label="Birthday"
                    rules={[{ required: true, message: 'Please select your birthday!' }]}
                >
                    <DatePicker />
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
