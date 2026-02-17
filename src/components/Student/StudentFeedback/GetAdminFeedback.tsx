import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  deleteFeedback,
  getAdminFeedback,
  getAllFeedback,
  getFeedback,
  getTeacherFeedbacks,
} from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import { DeleteDialog } from '../../Admin/Student/DeleteDialog';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';

const GetAdminFeedback = (props: any) => {
  const [feedbackItems, setFeedbackItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number>(0);
  // const userId = useSelector((state: any) => state.auth.userId);
  const { userId } = props;
  const feedbackscreenshotRef = useRef(null);

  useEffect(() => {
    if(props?.teacherFeedbacks){
      debugger;
      setFeedbackItems(props?.teacherFeedbacks);
    }else{
      if (props?.isAdmin) {
        getAllFeedbacks();
      } else {
        fetchFeedback();
      }
    }
   
  }, [userId]);

  const fetchFeedback = async () => {
    try {
      const response = await getAdminFeedback(userId);
      setFeedbackItems(response.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to fetch feedback');
    }
  };

  
  //getAllFeedbacks 
  const getAllFeedbacks = async () => {
    try {
      const response = await getAllFeedback();
      console.log('All feedback data is:::', response.data);
      setFeedbackItems(response.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to fetch feedback');
    }
  };

  const onDeleteFeedback = async () => {
    try {
      const response = await deleteFeedback(selectedFeedbackId);
      if (response) {
        setFeedbackItems(
          feedbackItems.filter(
            (feedback) => feedback.id !== selectedFeedbackId,
          ),
        );
        setDeleteDialogOpen(false);
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback');
    }
  };

  const getGrade = (grade: string): { grade: string; color: string } => {
    switch (grade) {
      case 'A':
        return { grade: 'A (90-100)', color: 'bg-green-700' };
      case 'B':
        return { grade: 'B (80-89)', color: 'bg-emerald-800' };
      case 'C':
        return { grade: 'C (70-79)', color: 'bg-yellow-500' };
      case 'D':
        return { grade: 'D (40-69)', color: 'bg-red-700' };
      case 'F':
        return { grade: 'F (0-39)', color: 'bg-red-500' };
      default:
        return { grade: 'N/A', color: 'bg-gray-500' };
    }
  };

  return (
    <>
      <ToastContainer />
      {feedbackItems?.length > 0 && (
        <div ref={feedbackscreenshotRef} className="globalCardStyle my-8 ">
          <div className={props?.isAdmin ? '' : 'grid gap-8'}>
            <div className="md:col-span-2">
              {/* className="" */}
              <div className=" p-6  hover:shadow-lg">
                <div className="flex justify-between items-center">
                  <h2 className="ch dark:text-white mb-4">Recent Feedback</h2>
                  <button
                    onClick={() => {
                      props.captureAndShare(feedbackscreenshotRef);
                    }}
                  >
                    {' '}
                    <FaRegShareFromSquare size={20} />{' '}
                  </button>
                </div>
                {feedbackItems.map((item) => (
                  <div
                    key={'item.id'}
                    className="transform hover:-translate-y-2 dark:text-white rounded-lg p-4 mb-4 transition-all duration-300 shadow-lg hover:shadow-sm hover:shadow-blue-300"
                  >
                    <div className="md:flex lg:flex md:justify-between lg:justify-between grid grid-cols-2 items-center mb-2">
                      {/* <span className="font-medium text-black dark:text-white">{`test`}</span> */}
                      <div className="flex flex-col items-center">
                        <p className="font-2">Course </p>
                        <div className="bg-yellow-700 p-1 rounded ml-1 px-2">
                          <span className="text-white">
                            {item?.CourseDetail?.Course?.courseName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="font-2">Need improvement in </p>
                        <div className="bg-indigo-700 p-1 rounded ml-1 px-2">
                          <span className="text-white">
                            {item?.areasToImprove}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <p className="font-2">Grade </p>
                        <div
                          className={`${
                            getGrade(item?.progressInGrades).color
                          } p-1 rounded ml-1 px-2`}
                        >
                          <span className="text-white">
                            {getGrade(item?.progressInGrades).grade}{' '}
                          </span>
                        </div>
                      </div>
                      {props?.isAdmin && (
                        <div className="flex flex-col mt-8 items-center">
                          <button
                            onClick={() => {
                              setDeleteDialogOpen(true);
                              setSelectedFeedbackId(item?.id);
                            }}
                            className="bg-red-600 text-white px-4 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <div className='flex items-center justify-between gap-6'>
                    
                    <div className="text-gray-600 italic mb-2">
                      {item?.feedback}
                    </div>
                    {item?.Teacher && item?.teacherId &&  
                    <GetUserImageAndName 
                      firstName={item?.Teacher?.firstName}
                      lastName={item?.Teacher?.lastName}
                      imageUrl={item?.Teacher?.imageUrl}    
                      userId={item?.Teacher?.id}
                      userType={"teacher"}
                    />
                  }
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(item?.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteDialogOpen && (
        <DeleteDialog
          handleDelete={onDeleteFeedback}
          closeDialog={() => setDeleteDialogOpen(false)}
          name={'Feedback'}
        />
      )}
    </>
  );
};

export default GetAdminFeedback;
