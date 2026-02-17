import React, { useEffect, useState } from 'react';
import {
  enrollStudentsInUpcomingCourse,
  getAllUpcomingCoursesTable,
  getStudentEnrolledCourses,
} from '../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import { ConfirmationDialog } from './ConfirmationDialog';
import { formatDate } from './FormatDate';
import { Card } from './Card';
import { OpenModal } from './OpenModal';
import { EnrollmentRequests } from '../Admin/Student/EnrollmentRequest';
import { ViewEnorllmentRequests } from '../Admin/Student/ViewEnorllmentRequests';
import { useNavigate } from 'react-router-dom';
import { EmptyTemplate } from './EmptyTemplate';

const CourseCard = () => {
  const [upcomingCourses, setUpcomingCourses] = useState<any>([]);
  const [enrolledStds, setEnrolledStds] = useState<any>([]);

  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [requestModal, setRequestModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  
  const userId = useSelector((state: any) => state.auth.userId);
  const userType = useSelector((state: any) => state.auth.userType);
  const navigate = useNavigate();


  useEffect(() => {
    fetchUpcomingCourses();
    getEnrolledStudents();
  }, []);
  const fetchUpcomingCourses = async () => {
    try {
      const response = await getAllUpcomingCoursesTable();

      if (response.data) {
        // console.log('upcoming courses:', response.data);
        setUpcomingCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      // setCourses([]);
    }
  };

  const enrollStudent = async () => {
    userId;
    try {
      let obj = {
        studentId: userId,
        courseId: selectedCourse,
      };
      const response = await enrollStudentsInUpcomingCourse(obj);

      if (response.data) {
        setConfirmationDialog(false);
        getEnrolledStudents();
        toast.success('Course enrolled successfully');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      // setCourses([]);
    }
  };

  const getEnrolledStudents = async () => {
    try {
      const response = await getStudentEnrolledCourses(userId);
      // console.log('enrolled stds are:::', response.data);
      if (response.data) {
        setEnrolledStds(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const isStdEnrolled = (courseId: string) => {
    if (enrolledStds.length > 0) {
      return enrolledStds.some((std: any) => std.courseId === courseId);
    }
  };
  return (
    <>
    {upcomingCourses?.length > 0 ? (
     <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 p-6 " style={{ height: '23rem' }}>
     {upcomingCourses.map((course: any) => (
       <div
         className="globalCardStyle p-4 flex flex-col overflow-hidden h-96"
       
       >
         <Card course={course}  />
       {userType === 'student' && (
            <div className="flex justify-end" style={{marginTop:'auto'}}>
            {isStdEnrolled(course?.Course.id) ? (
              <button
                disabled
               
                className="bg-blue-300 text-white text-sm font-semibold  px-1 rounded"
              >
                Enrolled
              </button>
            ) : (
              <button
                onClick={() => {
                  setConfirmationDialog(true);
                  setSelectedCourse(course?.Course?.id);
                }}
               
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold  px-1 rounded"
              >
                Enroll Now
              </button>
            )}
          </div>
       )}
        
        {userType=="admin" && 
           // View Requests button
           <div className="flex justify-end" style={{marginTop:'auto'}}>
               {course?.Teacher?.id ? 
             <button
               onClick={() => {
                 setRequestModal(true);
                 setSelectedCourse(course?.Course?.id);
                 setSelectedTeacher(course?.Teacher?.id);

               }}
               className="bg-indigo-500 hover:bg-indigo-700 text-white text-sm font-semibold rounded" style={{padding:'0.3rem'}}
             >
               View Requests
             </button>
             :
             <button
               onClick={() => {
                   navigate('/addcourses/upcoming');
               }}
               className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded" style={{padding:'0.3rem'}}
             >
               Assign teacher first
             </button>
             }
           </div>
        }
       </div>
     ))}


{requestModal && (
   <OpenModal title="" handleClose={() => setRequestModal(false)}>
       {/* This is where you pass content dynamically */}
       <ViewEnorllmentRequests courseId={selectedCourse} teacherId={selectedTeacher} />
      
   </OpenModal>
)}
     {confirmationDialog && (
       <ConfirmationDialog
         title="Enroll in Course"
         message="Are you sure you want to enroll in this course?"
         handleConfirm={enrollStudent}
         closeDialog={() => setConfirmationDialog(false)}
         confirmText="Enroll"
         bgColor="bg-green-500 hover:bg-green-700"
       />
     )}
   </div>
    ):(
      <EmptyTemplate heading="No Enrollement" description="No upcoming courses or enrollments found" />
    )
    }
    </>
  );
};

export default CourseCard;
