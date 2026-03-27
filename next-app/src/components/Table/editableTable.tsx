import React, { useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Divider } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { useSession } from 'next-auth/react';
import { TempWareHouseType } from '@/types';
import { DeleteTempWarehouser, TempWarehouse, UpdateTempWarehouser } from '@/app/redux/features/tempWarehouse';



interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: TempWareHouseType;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const App: React.FC = () => {
    const [form] = Form.useForm();
    // const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: TempWareHouseType) => record.key === editingKey;

    const edit = (record: TempWareHouseType) => {
        form.setFieldsValue({ name: '', count: '', summary: '', ...record });
        setEditingKey(record.key ? record.key : '');
    };
    
    const data = useAppSelector((state) => state.TempWarehouse.value)
    const dispatch = useAppDispatch()
    const { data: session } = useSession()

    const deleteCell = (cell: TempWareHouseType) => {
        dispatch(DeleteTempWarehouser(cell))
    }

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as TempWareHouseType;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                dispatch(UpdateTempWarehouser(newData));
                setEditingKey('');
            } else {
                newData.push(row);
                dispatch(UpdateTempWarehouser(newData));
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '10%',
            fixed: true,
            editable: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '50%',
            editable: true,
        },
        {
            title: 'Count',
            dataIndex: 'count',
            width: '15%',
            editable: true,
            inputType: 'number',
        },
        {
            title: 'Summary',
            dataIndex: 'summary',
            width: '15%',
            editable: true,
            inputType: 'number',
        },
        {
            title: 'Updated At',
            dataIndex: 'update_at',
            width: '30%',
            editable: false,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right' as 'right',
            render: (_: any, record: TempWareHouseType) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key ? record.key : '')} style={{ marginInlineEnd: 8 }}>
                            Save
                        </Typography.Link>
                        <Typography.Link onClick={cancel} style={{ marginInlineEnd: 8 }}>
                            Cancel
                        </Typography.Link>
                    </span>
                ) : (
                    <div>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Divider type="vertical" />
                        <Typography.Link onClick={() => deleteCell(record)}>
                            Delete
                        </Typography.Link>
                    </div>
                );
            },
        },
    ];

    const mergedColumns: TableProps<TempWareHouseType>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: TempWareHouseType) => ({
                record,
                inputType: col.dataIndex === 'count' || col.dataIndex === 'summary' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
                scroll={{ x: 1600 }}
            />
        </Form>
    );
};

export default App;
