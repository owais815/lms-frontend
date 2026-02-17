import { useSelector } from 'react-redux';
import {
  deleteRequest,
  getAllRequests,
  getRequestByUser,
  updateRequest,
} from '../../api/auth';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash } from 'react-icons/fa6';
import { ConfirmationDialog } from './ConfirmationDialog';
import { GetUserImageAndName } from './GetUserImageAndName';

export const SupportCard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [responses, setResponses] = useState<any>({});
  const [id, setId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userId = useSelector((state: any) => state.auth.userId);
  const userType = useSelector((state: any) => state.auth.userType);
  const supportAdded = useSelector((state: any) => state.changeEvent.supportSubmitted);



  const fetchRequests = async () => {
    try {
      const response = await getRequestByUser(userId, userType);
      if (response.data) {
        setRequests(response.data);
        setFilteredRequests(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllRequests = async () => {
    try {
      const response = await getAllRequests();
      if (response.data) {
        setRequests(response.data);
        setFilteredRequests(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId && userType) {
      userType === 'admin' ? fetchAllRequests() : fetchRequests();
    }
  }, [userId, userType,supportAdded]);

  const handleAdminResponse = async (id: any) => {
    const { status, response } = responses[id] || {};
    try {
      const responsee = await updateRequest(id, {
        responseFromAdmin: response,
        status,
      });
      if (responsee.data) {
        toast.success('Response updated successfully');
        setResponses((prev: any) => ({
          ...prev,
          [id]: { status: 'pending', response: '' },
        })); // Clear specific response fields
        fetchAllRequests();
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleInputChange = (id: any, field: any, value: any) => {
    setResponses((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handlePriorityChange = (val: any) => {
    setFilteredRequests(
      val !== 'all'
        ? requests.filter((x: any) => x.priority === val)
        : requests,
    );
  };

  const handleStatusChange = (val: any) => {
    setFilteredRequests(
      val !== 'all' ? requests.filter((x: any) => x.status === val) : requests,
    );
  };

  const handleDelete = async () => {
    try {
      const response = await deleteRequest(id);
      if (response.data) {
        toast.success('Request deleted successfully');
        fetchAllRequests();
        setShowModal(false);
        setId(null);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };
  return (
    <div>
      <ToastContainer />
      {userType === 'admin' && (
        <div className="flex justify-end gap-4 items-center mx-6">
          <select
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="px-4 py-2 mb-4 w-32 border rounded-lg focus:outline-none focus:ring"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="normal">Normal</option>
          </select>

          <select
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 w-32 mb-4 border rounded-lg focus:outline-none focus:ring"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}

      <div className="pb-4">
        <div className="mt-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request: any) => (
              <div
                key={request._id}
                className="globalCardStyle mx-6 px-4 py-6 mb-4"
              >
                <div className="mb-4 flex justify-between">
                  <div>
                    <div className='mb-4'> 
                    <GetUserImageAndName
                      userType={request?.userType}
                      userId={request?.userId}
                      imageUrl={
                        request?.teacher
                          ? request?.teacher?.imageUrl
                          : request?.student?.profileImg
                      }
                      firstName={
                        request?.teacher
                          ? request?.teacher?.firstName
                          : request?.student?.firstName
                      }
                      lastName={
                        request?.teacher
                          ? request?.teacher?.lastName
                          : request?.student?.lastName
                      }
                      showType={true}
                    />
                   </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.title}
                      </p>
                      <p
                        className={`text-sm w-18 h-6 rounded-2xl flex items-center justify-center text-white dark:text-white ${
                          request?.priority === 'high'
                            ? 'bg-red-500'
                            : request?.priority === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-indigo-500'
                        }`}
                      >
                        {request?.priority?.toUpperCase()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      "{request.problem}"
                    </p>
                    {request?.responseFromAdmin && (
                      <>
                        <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">
                          Admin Response:
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          "{request.responseFromAdmin}"
                        </p>
                      </>
                    )}
                  </div>

                  <p
                    className={`text-md w-24 h-8 rounded flex items-center justify-center text-white dark:text-white ${
                      request?.status === 'pending'
                        ? 'bg-yellow-500'
                        : request?.status === 'resolved'
                        ? 'bg-green-500'
                        : 'bg-red-800'
                    }`}
                  >
                    {request?.status?.toUpperCase()}
                  </p>
                </div>

                {userType === 'admin' && (
                  <div className="mt-4 border-2 border-zinc-400 p-4 rounded-2xl">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={responses[request.id]?.status || 'pending'}
                      onChange={(e) =>
                        handleInputChange(request.id, 'status', e.target.value)
                      }
                      className="dark:bg-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Please Respond to the support request
                    </label>
                    <input
                      type="text"
                      value={responses[request.id]?.response || ''}
                      onChange={(e) =>
                        handleInputChange(
                          request.id,
                          'response',
                          e.target.value,
                        )
                      }
                      className="dark:bg-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                        onClick={() => {
                          setId(request.id);
                          setShowModal(true);
                        }}
                      >
                        {' '}
                        <FaTrash className="text-white" />{' '}
                      </button>
                      <button
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        onClick={() => handleAdminResponse(request.id)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="globalCardStyle text-lg font-bold text-center py-10 text-gray-900 dark:text-white">
              No support requests found.
            </p>
          )}
        </div>
      </div>
      {showModal && (
        <ConfirmationDialog
          title="Delete Request"
          message="Are you sure you want to delete this request?"
          handleConfirm={handleDelete}
          closeDialog={() => {
            setShowModal(false);
          }}
          confirmText="Delete"
        />
      )}
    </div>
  );
};
