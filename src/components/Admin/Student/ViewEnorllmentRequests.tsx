import { useEffect, useState } from 'react';
import {
  assignCourse,
  getCourseByStdAndCourseId,
  getEnrolledCoursesWithCourseId,
} from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';

export const ViewEnorllmentRequests = (props: any) => {
  const { courseId, teacherId } = props;
  const [requests, setRequests] = useState<any>([]);
  const [approvedStudents, setApprovedStudents] = useState<any>({});
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getEnrolledCoursesWithCourseId(courseId);
      if (response.data) {
        setRequests(response.data);
      }
    } catch (error) {}
  };
  const onHandleApprove = async (studentId: any) => {
    try {
      let obj = {
        studentId,
        courseId,
        teacherId,
      };
      
      const response = await assignCourse(obj);
      if (response.data) {
        checkApprovalStatus();
      }
    } catch (error:any) {
      console.error('Error approving student', error);
      if(error?.response?.status==409){
        toast.error('Student Already Assigned', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
      }else{
        toast.error('Error approving student');
      }
    }
  };
  const checkApprovalStatus = async () => {
    try {
    if(requests.length > 0){
        const studentIds = requests.map((request:any) => request.Student?.id); 
      
        const response = await getCourseByStdAndCourseId(studentIds, courseId);  
        
        if (response.data.approvedStudents) {
          const approvedMap = response.data.approvedStudents.reduce((acc:any, studentId:any) => {
            acc[studentId] = true; // Mark each student as approved
            return acc;
          }, {});
         
          setApprovedStudents(approvedMap); // Update state with approved students
        }
    }
    } catch (error) {
      console.error('Error checking approval status', error);
    }
  };

  useEffect(() => {
    checkApprovalStatus(); 
  }, [requests]);
  return (
    <>
    <ToastContainer />
      {/* design card with requests student name, address, contact 7 & approve button */}
      {requests.length > 0 ? (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-3">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Enrollment Requests
            </h5>
          </div>
          <div className="p-3">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Approve
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request: any) => (
                  <tr
                    key={request._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">
                      {request?.Student?.firstName} {request?.Student?.lastName}
                    </td>
                    <td className="px-6 py-4">{request?.Student?.email}</td>
                    <td className="px-6 py-4">{request.Student?.address}</td>
                    <td className="px-6 py-4">{request.Student?.contact}</td>
                    <td className="px-6 py-4">
                      <button
                         disabled={approvedStudents[request?.Student?.id]}
                        type="button"
                        className={`text-white ${approvedStudents[request?.Student?.id] ? 'cursor-not-allowed bg-blue-300 hover:bg-blue-300' : 'cursor-pointer bg-blue-700 hover:bg-blue-800'}  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                        onClick={() => {
                          // Handle approve button click
                          onHandleApprove(request.Student.id);
                        }}
                      >
                        {approvedStudents[request.Student.id] ? 'Approved' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        //    no requests found
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-3">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              No Requests Found
            </h5>
          </div>
        </div>
      )}
    </>
  );
};
