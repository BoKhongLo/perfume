import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { OrderType } from '@/types';
import { makeRequestApi, getAllOrder, updateOrder, exportOrdersToCSV } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { UpdateListOrder, UpdateOneOrder } from '@/app/redux/features/orderData';
import Pagination from '@/components/Pagination/basic';
import { message } from 'antd';
import { SearchOrderDto, UpdateOrderDto } from '@/lib/dtos/order';
import { saveAs } from 'file-saver';
import ExportOrderModal from '@/components/Export/Order';

const App: React.FC = () => {
    const data = useAppSelector((state) => state.OrderData.listOrder);

    const { data: session } = useSession();
    const dispatch = useAppDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [idCur, setIdCur] = useState<number>(-1);
    const [statusCur, setStatusCur] = useState<string>('');
    const [isPaidCur, setIsPaidCur] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [searchFilterType, setSearchFilterType] = useState<string>('email');
    
    // Filtering states
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [filterIsPaid, setFilterIsPaid] = useState<boolean | null>(null);

    // Sorting states
    const [sortField, setSortField] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handlerUpdateData = (type: string, value: any) => {
        if (type === 'id') {
            setIdCur(value);
        } else if (type === 'isPaid') {
            setIsPaidCur(value);
        } else if (type === 'status') {
            setStatusCur(value);
        }
    };

    const handlerOpenModel = (data: OrderType) => {
        const model = document.getElementById('my_modal_3') as HTMLDialogElement | null;
        if (model) {
            setIdCur(data.id);
            setIsPaidCur(data.isPaid);
            setStatusCur(data.status || '');
            model.showModal();
        }
    };

    const handlerCloseModel = () => {
        const model = document.getElementById('my_modal_3') as HTMLDialogElement | null;
        if (model) {
            model.close();
        }
    };

    const handlerSubmit = async () => {
        try {
            const dto: UpdateOrderDto = {
                orderId: idCur,
                status: statusCur,
                isPaid: isPaidCur,
            };
            const response: OrderType = await makeRequestApi(updateOrder, dto, session?.refresh_token, session?.access_token);

            if (response) {
                dispatch(UpdateOneOrder(response));
                handlerCloseModel();
                setIdCur(-1);
                setIsPaidCur(false);
                setStatusCur('');
                message.success("Update Order successfully!");
            }
        } catch {
            message.error("Update Order fail!");
        }
    };

    useEffect(() => {
        const fetchAndSetData = async () => {
            const response: OrderType[] = (await makeRequestApi(getAllOrder, null, session?.refresh_token, session?.access_token)).data;
            if (response) {
                dispatch(UpdateListOrder(response));
            }
        };

        fetchAndSetData();
    }, [dispatch]);


    const filteredData = data
    .filter(order => {
        const searchField = searchFilterType.toLowerCase();
        const searchValue = searchTerm.toLowerCase();

        const matchesSearch = searchField === 'email'
            ? order.customerInfo.email.toLowerCase().includes(searchValue)
            : searchField === 'phonenumber'
            ? order.customerInfo.phoneNumber.includes(searchValue)
            : searchField === 'firstname'
            ? order.customerInfo.firstName.toLowerCase().includes(searchValue)
            : searchField === 'lastname'
            ? order.customerInfo.lastName.toLowerCase().includes(searchValue)
            : true;

        const matchesStatus = filterStatus ? order.status === filterStatus : true;
        const matchesIsPaid = filterIsPaid !== null ? order.isPaid === filterIsPaid : true;

        return matchesSearch && matchesStatus && matchesIsPaid;
    })
    .sort((a, b) => {

        const fieldA = a[sortField as keyof OrderType];
        const fieldB = b[sortField as keyof OrderType];

        if (fieldA === undefined || fieldB === undefined) {
            return 0;
        }

        if (sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
        } else {
            return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
        }
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showExportModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSort = (field: string) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
    };

    return (
        <div data-theme="light">


            <div className="flex space-x-2 m-4">
                <select  aria-label="Status" className="select select-bordered" value={filterStatus || ''} onChange={(e) => setFilterStatus(e.target.value || null)}>
                    <option value="">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="done">Done</option>
                </select>
                
                <select aria-label="Payments" className="select select-bordered" value={filterIsPaid !== null ? String(filterIsPaid) : ''} onChange={(e) => setFilterIsPaid(e.target.value === 'true' ? true : e.target.value === 'false' ? false : null)}>
                    <option value="">All Payments</option>
                    <option value="true">Paid</option>
                    <option value="false">Unpaid</option>
                </select>

                <select aria-label="Information" className="select select-bordered" value={searchFilterType} onChange={(e) => setSearchFilterType(e.target.value)}>
                    <option value="email">Email</option>
                    <option value="phoneNumber">Phone Number</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                </select>

                <input
                    type="text"
                    placeholder={`Search by ${searchFilterType.charAt(0).toUpperCase() + searchFilterType.slice(1)}`}
                    className="input input-bordered"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" onClick={showExportModal}>Export to CSV</button>
            </div>

            <div className="overflow-x-auto p-4">
                <table className="table table-xs w-full">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                            <th onClick={() => handleSort('id')}>ID</th>
                            <th onClick={() => handleSort('created_at')}>Created At</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th onClick={() => handleSort('totalAmount')}>Total Amount</th>
                            <th onClick={() => handleSort('isPaid')}>Is Paid</th>
                            <th onClick={() => handleSort('status')}>Status</th>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>{order.orderProducts.map(op => op.product.name).join(', ')}</td>
                                <td>{order.orderProducts.reduce((total, op) => total + op.quantity, 0)}</td>
                                <td>{order.totalAmount}</td>
                                <td>{order.isPaid ? 'Yes' : 'No'}</td>
                                <td>{order.status}</td>
                                <td>{order.customerInfo.lastName}</td>
                                <td>{order.customerInfo.firstName}</td>
                                <td>{order.customerInfo.phoneNumber}</td>
                                <td>{order.customerInfo.email}</td>
                                <td>{order.deliveryInfo.address}</td>
                                <td>
                                    <button className="btn btn-ghost" onClick={() => handlerOpenModel(order)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredData.length / pageSize)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Edit Order</h3>
                    <div className="py-4">
                        <label className="block">Order ID</label>
                        <input
                            type="number"
                            name="orderId"
                            value={idCur}
                            disabled
                            className="input input-bordered"
                        />
                    </div>
                    <div className="py-4">
                        <label className="block">Status</label>
                        <select
                            name="status"
                            value={statusCur}
                            onChange={(e) => handlerUpdateData('status', e.target.value)}
                            className="select select-bordered"
                        >
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div className="py-4">
                        <label className="block">Is Paid</label>
                        <input
                            type="checkbox"
                            name="isPaid"
                            checked={isPaidCur}
                            onChange={(e) => handlerUpdateData('isPaid', e.target.checked)}
                            className="checkbox"
                        />
                    </div>

                    <div className="modal-action">
                        <button type="submit" className="btn" onClick={async () => await handlerSubmit()}>Save</button>
                        <button type="button" className="btn btn-ghost" onClick={() => handlerCloseModel()}>Cancel</button>
                    </div>
                </div>
            </dialog>

            <ExportOrderModal visible={isModalVisible} onCancel={handleCancel} />
        </div>
    );
};

export default App;
