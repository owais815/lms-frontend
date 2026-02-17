import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllPayments } from '../../../api/auth';

const AdminPaymentHistory = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getAllPayments(); // Adjust endpoint as needed
                setPayments(response.data.payments);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Payment History</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Student Name</th>
                        <th className="border border-gray-300 px-4 py-2">Amount</th>
                        <th className="border border-gray-300 px-4 py-2">Purpose</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment:any) => (
                        <tr key={payment.id}>
                            <td className="border border-gray-300 px-4 py-2">
                                {`${payment?.Student.firstName} ${payment?.Student.lastName}`}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{payment?.amount}</td>
                            <td className="border border-gray-300 px-4 py-2">{payment?.purpose}</td>
                            <td className="border border-gray-300 px-4 py-2">{new Date(payment?.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPaymentHistory;
