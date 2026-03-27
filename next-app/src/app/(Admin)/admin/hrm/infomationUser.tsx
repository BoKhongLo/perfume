import React, { useEffect, useState } from 'react';
import { Button, Descriptions, message } from 'antd';
import type { DescriptionsProps } from 'antd';
import { Select } from 'antd';
import { getAllUserName, getUserById, makeRequestApi } from '@/lib/api'
import { useSession } from "next-auth/react";
import { UserType } from '@/types';
import { useAppDispatch } from '@/app/redux/hooks';
import { UpdateUserEditId } from '@/app/redux/features/userData';
import dayjs from 'dayjs';

interface AppProps {
    changeTab: (tabKey: string) => void;
}

const App: React.FC<AppProps> = ({ changeTab }) => {

    const { data: session } = useSession();
    const [userSearch, setUserSearch] = useState<{ id: string, name: string }[]>([])
    const [items, setItems] = useState<DescriptionsProps['items']>([])
    const [userCurrent, setUserCurrent] = useState('')

    const dispatch = useAppDispatch();

    const fetchData = async () => {
        try {
            const users: { username: string, secretKey: string }[] = await makeRequestApi(getAllUserName, null, session?.refresh_token, session?.access_token)
            return users;
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    const fetchUser = async (id: string) => {
        if (session?.access_token) {
            try {
                const user: UserType = await makeRequestApi(getUserById, id, session?.refresh_token, session?.access_token)
                return user;
            } catch (error) {
                console.error('Error fetching user by ID: ', error);
            }
        }
    }

    useEffect(() => {
        if (session) {
            fetchData()
                .then(data => {
                    console.log(data)
                    setUserSearch(data?.map(e => ({ id: e.secretKey, name: e.username })) || [])
                })
        }
    }, [session]);

    const getFormattedDate = (date: Date | dayjs.Dayjs | undefined): string => {
        if (!date) return "no information";
        if (dayjs.isDayjs(date)) {
            return date.toDate().toUTCString();
        }
        if (date instanceof Date) {
            return date.toUTCString();
        }
        return "no information";
    };
    
    const onChange = (value: string, option: any) => {
        fetchUser(option.key as string)
            .then(data => {
                setUserCurrent(data?.secretKey || '')
                setItems([
                    {
                        key: '1',
                        label: 'UserName',
                        children: data?.username || "no infomation",
                    },
                    {
                        key: '2',
                        label: 'Telephone',
                        children: data?.details?.phoneNumber || "no infomation",
                    },
                    {
                        key: '3',
                        label: 'Gender',
                        children: data?.details?.gender || "no infomation",
                    },
                    {
                        key: '4',
                        label: 'Created_at',
                        span: 2,
                        children: data?.created_at ? new Date(data?.created_at).toUTCString() : "no infomation",
                    },
                    {
                        key: '7',
                        label: 'Birthday',
                        children: getFormattedDate(data?.details?.birthday),
                    },
                    {
                        key: '5',
                        label: 'Address',
                        span: 2,
                        children: data?.details?.address || "no infomation",
                    },
                    {
                        key: '6',
                        label: 'Role',
                        children: data?.role && data.role.length > 0
                            ? data.role.join(', ')
                            : "No information",
                    },
                    {
                        key: '8',
                        label: 'FirstName',
                        children: data?.details?.firstName || "no infomation",
                    },
                    {
                        key: '9',
                        label: 'LastName',
                        children: data?.details?.lastName || "no infomation",
                    },
                ])
            })
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    const handlerUpdate = () => {
        if (userCurrent == '') {
            message.error("No user selected!")
        }
        dispatch(UpdateUserEditId(userCurrent))
        changeTab('3')
    }

    return (
        <div className="m-8">
            <Select
                showSearch
                placeholder="Select a person"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={userSearch.map(e => ({
                    value: e.name,
                    lable: e.id,
                    key: e.id,
                }))}
            />
            <Button
                type="primary"
                className='ml-3'
                onClick={() => handlerUpdate()}
                disabled={userCurrent == ''}
            >
                Update User
            </Button>
            <Descriptions title="User Info" layout="vertical" items={items} className="my-8" />

        </div>
    )
}
export default App;