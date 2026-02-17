import React, { useState, useEffect } from 'react';
import { approvePlanRequest, getAllPlanChangeRequests } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';

const PlanChangeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch plan change requests from the backend
    useEffect(() => {
        fetchRequests();
    }, []);
    const fetchRequests = async () => {
      
         try {
                    const response = await getAllPlanChangeRequests();
                    console.log("student plan is:::",response.data);
                    setRequests(response.data?.requests);
                } catch (error) {
                    console.error('Error fetching plans:', error);
                }
    };
    // Approve a plan change request
    const handleApprove = async (requestId:any) => {
        try {
            const response = await approvePlanRequest(requestId);
            if(response.data){
                fetchRequests();
            }
            toast.success('Request approved successfully!');
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    // Reject a plan change request
    const handleReject = async (requestId:any) => {

        try {
            const response = await approvePlanRequest(requestId);
            if(response.data){
                fetchRequests();
            }
            toast.success('Request rejected successfully!');
        } catch (error) {
            console.error('Error fetching plans:', error);
        }

     
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-6">Plan Change Requests</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="py-3 px-6">Student Name</th>
                        <th className="py-3 px-6">Current Plan</th>
                        <th className="py-3 px-6">Requested Plan</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests?.map((req:any) => (
                        <tr key={req.id} className="border-b hover:bg-gray-100">
                            <td className="py-3 px-6">{req?.Student?.firstName}{" "}{req?.Student?.lastName}</td>
                            <td className="py-3 px-6">{req?.CurrentPlan.name}</td>
                            <td className="py-3 px-6">{req?.RequestedPlan.name}</td>
                            <td
                                className={`py-3 px-6 ${
                                    req?.status === 'pending'
                                        ? 'text-yellow-500'
                                        : req.status === 'approved'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {req?.status}
                            </td>
                            <td className="py-3 px-6">
                                {req.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(req.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                                {req.status !== 'pending' && <span>-</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlanChangeRequests;
