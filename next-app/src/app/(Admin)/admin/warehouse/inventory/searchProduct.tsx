import React, { useState, useRef, useEffect } from 'react';
import type { TableColumnsType, TableProps } from 'antd';
import { Button, Space, Table, Input, message, Popconfirm } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { getAllProduct, deleteProductById, makeRequestApi, exportOrdersToCSV } from '@/lib/api'
import { ProductData, SearchProductDto } from '@/lib/dtos/product'
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { DeleteProduct, UpdateListProduct, UpdateProductEdit, UpdateProductEditId } from '@/app/redux/features/iventoryData';
import { ProductFormType } from '@/types';
import { saveAs } from 'file-saver';
import { useSession } from 'next-auth/react';
import ExportProductModal from '@/components/Export/Product';
type OnChange = NonNullable<TableProps<ProductFormType>['onChange']>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;


type DataIndex = keyof ProductFormType;

type searchProductprops = {
    setUpdateKey: (a : number) => void,
    changeTab: (a: string) => void
}

const App: React.FC<searchProductprops> = ({ setUpdateKey, changeTab }) => {
    const [filteredInfo, setFilteredInfo] = useState<Filters>({});
    const [sortedInfo, setSortedInfo] = useState<Sorts>({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const data = useAppSelector((state) => state.InventoryData.listProduct)
    const dispatch = useAppDispatch()

    const handlerDeleteProduct = async (record: ProductFormType) => {
        try {
            const dataReturn = await makeRequestApi(deleteProductById, Number(record.id), session?.refresh_token, session?.access_token);
            if (dataReturn && dataReturn.message == 'Product successfully soft deleted') {
                deleteCell(record)
                message.success('Delete product successfully.');
            }
            else {
                message.error('Failed to delete.');

            }
        } catch (error) {
            message.error('Failed to delete.');
        }
    }

    useEffect(() => {
        const fetchAndSetData = async () => {
            const products = (await getAllProduct()).data;
            if (products) {

                dispatch(UpdateListProduct(products))
            }
        };

        fetchAndSetData();
    }, [dispatch]);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const deleteCell = (cell: ProductFormType) => {
        dispatch(DeleteProduct(cell))
    }

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const handleChange: OnChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter as Sorts);
    };

    const clearFilters = () => {
        setFilteredInfo({});
    };

    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ProductFormType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]!
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: TableColumnsType<ProductFormType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            width: 50,
            fixed: true
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name?.includes(value as string)!,
            sorter: (a, b) => a.name?.length! - b.name?.length!,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Buy Count',
            dataIndex: 'buyCount',
            width: 100,
            key: 'buyCount',
            sorter: (a, b) => a.buyCount! - b.buyCount!,
            sortOrder: sortedInfo.columnKey === 'buyCount' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            width: 150,
            key: 'created_at',
            sorter: (a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime(),
            sortOrder: sortedInfo.columnKey === 'created_at' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Updated At',
            width: 150,
            dataIndex: 'updated_at',
            key: 'updated_at',
            sorter: (a, b) => new Date(a.updated_at!).getTime() - new Date(b.updated_at!).getTime(),
            sortOrder: sortedInfo.columnKey === 'updated_at' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Display Cost',
            width: 100,
            dataIndex: 'displayCost',
            key: 'displayCost',
            sorter: (a, b) => a.displayCost! - b.displayCost!,
            sortOrder: sortedInfo.columnKey === 'displayCost' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Origin Cost',
            width: 100,
            dataIndex: 'originCost',
            key: 'originCost',
            sorter: (a, b) => parseFloat(a.originCost!) - parseFloat(b.originCost!),
            sortOrder: sortedInfo.columnKey === 'originCost' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Stock Quantity',
            width: 100,
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            sorter: (a, b) => a.stockQuantity! - b.stockQuantity!,
            sortOrder: sortedInfo.columnKey === 'stockQuantity' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Brand',
            width: 200,
            dataIndex: 'brand',
            key: 'brand',
            filters: Array.from(new Set(data.map(item => item.brand)
                .filter(Boolean))).map(brand => ({
                    text: brand!,
                    value: brand!
                })),
            filteredValue: filteredInfo.brand || null,
            onFilter: (value, record) => record.brand?.includes(value as string)!,
            ellipsis: true,
        },
        {
            title: 'Concentration',
            width: 150,
            dataIndex: 'concentration',
            key: 'concentration',
            filters: Array.from(new Set(data.map(item => item.concentration)
                .filter(Boolean))).map(concentration => ({
                    text: concentration!,
                    value: concentration!
                })),
            sortOrder: sortedInfo.columnKey === 'concentration' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Fragrance Notes',
            width: 200,
            dataIndex: 'fragranceNotes',
            filters: Array.from(new Set(data.map(item => item.fragranceNotes)
                .filter(Boolean))).map(fragranceNotes => ({
                    text: fragranceNotes!,
                    value: fragranceNotes!
                })),
            key: 'fragranceNotes',
            ellipsis: true,
        },
        {
            title: 'Longevity',
            width: 150,
            dataIndex: 'longevity',
            key: 'longevity',
            filters: Array.from(new Set(data.map(item => item.longevity)
                .filter(Boolean))).map(longevity => ({
                    text: longevity!,
                    value: longevity!
                })),
            sortOrder: sortedInfo.columnKey === 'longevity' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Sex',
            width: 100,
            dataIndex: 'sex',
            key: 'sex',
            filters: Array.from(new Set(data.map(item => item.sex)
                .filter(Boolean))).map(sex => ({
                    text: sex!,
                    value: sex!
                })),
            filteredValue: filteredInfo.sex || null,
            onFilter: (value, record) => record.sex?.includes(value as string)!,
            ellipsis: true,
        },
        {
            title: 'Sillage',
            dataIndex: 'sillage',
            width: 150,
            key: 'sillage',
            filters: Array.from(new Set(data.map(item => item.sillage)
                .filter(Boolean))).map(sillage => ({
                    text: sillage!,
                    value: sillage!
                })),
            sortOrder: sortedInfo.columnKey === 'sillage' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            width: 150,
            key: 'size',
            sorter: (a, b) => parseFloat(a.size!) - parseFloat(b.size!),
            sortOrder: sortedInfo.columnKey === 'size' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '',
            width: 50,
            dataIndex: 'update',
            key: 'update',
            fixed: 'right' as 'right',
            render: (_, record) => (
                <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                        dispatch(
                            UpdateProductEditId(Number(record.id))
                        )
                        dispatch(UpdateProductEdit(null))
                        setUpdateKey(Number(record.id));
                        changeTab('4')
                    }}
                />
            ),
        },
        {
            title: '',
            width: 50,
            dataIndex: 'delete',
            key: 'delete',
            fixed: 'right' as 'right',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this product?"
                    onConfirm={() => {
                        handlerDeleteProduct(record);
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            ),
        }
        
    ];
    const { data: session } = useSession();
    const [modalVisible, setModalVisible] = useState(false);

    const showModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };


    return (
        <div className="w-full mt-2">
            <Button data-theme="light" className="btn btn-primary mx-8" onClick={showModal}>Export to CSV</Button>
            <Table columns={columns} className="mx-8 my-4" dataSource={data} onChange={handleChange} scroll={{ x: 1300 }} />
            <ExportProductModal visible={modalVisible} onCancel={handleCancel} />
        </div>
    );
};

export default App;
