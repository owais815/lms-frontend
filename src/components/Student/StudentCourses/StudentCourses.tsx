import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {  getCourseByStdId, getResourcesByStudentAndCourse, getStudentUpcomingClasses, markAttendance, toggleBookmark } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import ResourceModal from '../../Admin/ResourceUpload/ResourceModal';
import { FaBook, FaClock, FaChalkboardTeacher, FaCalendarAlt, FaFileAlt, FaEye, FaVideo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BookmarkedResource from './IsBookmarked';
import { MakeUpClass } from './MakeupClass';
import { MakeupClassView } from './MakeupClassView';
import CourseCardCarousel from '../../Generic/UpcomingCourseCarousal';
import axios, { MEETING_URL } from '../../../api/axios';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';
import FullScreenModal from '../../Generic/MeetingFrame';
import SurveyPopup from '../PopupServey/SurveyPopup';
import WeeklyContentTabs from './WeeklyContent';
import { EmptyTemplate } from '../../Generic/EmptyTemplate';
import { StudentUpcomingClasses } from './StudentUpcomingClasses';
// import OnlineStatus from '../../Generic/OnlineStatus';


interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

interface Resource {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

interface Course {
  id: number;
  courseName: string;
  duration: string;
  description: string;
  teacherId: number;
  studentId: number;
  createdAt: string;
  updatedAt: string;
  Teacher: Teacher;
}

export interface ClassInfo {
  id: number;
  date: string;
  time: string;
  meetingLink: string;
  courseDetailsId: number;
  studentId: number;
  courseName?: string;
  teacher?: {
    firstName: string;
    lastName: string;
  };
}


export const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalResource, setModalResource] = useState<Resource | null>(null);
  const [bookmarkIconToggle, setBookMarkToggle] = useState<boolean>(false);
  const [openMakeupModel,setOpenMakeupModel] = useState(false);
  const userId = useSelector((state: any) => state.auth.userId);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        const coursesResponse = await getCourseByStdId(userId);

        if (coursesResponse.data && Array.isArray(coursesResponse.data.course)) {
          setCourses(coursesResponse.data.course);
          if (coursesResponse.data.course.length > 0) {
            setSelectedCourse(coursesResponse.data.course[0]);
          }
        } else {
          setCourses([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const fetchResources = async (courseId: number) => {
    try {
      const response = await getResourcesByStudentAndCourse(userId, courseId.toString());
      if (response.data && Array.isArray(response.data)) {
        setResources(response.data);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      // toast.error('Failed to fetch resources');
      setResources([]);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchResources(selectedCourse.id);
    }
  }, [selectedCourse]);

  const toggleBookMark = async (resource:any)=>{
    try {
      let obj ={
        studentId:resource?.studentId,
        courseId: resource?.courseId,
        url: resource?.filePath,
        resourceId: resource?.id
      }
      const response:any = await toggleBookmark(obj);
      setResources(prevResources => 
        prevResources.map(r => 
          r.id === resource.id ? { ...r, isBookmarked: response.isBookmarked } : r
        )
      );
      return response;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      // toast.error('Failed to add bookmark');
      setBookMarkToggle(false);
    }

  }

  
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500 text-center text-xl mt-10">Error: {error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="mx-auto p-2 bg-gray-100 min-h-screen dark:bg-black ">
        <div className="md:flex md:justify-between lg:flex lg:justify-between grid grid-cols-1 p-3">
          <div className="globalCardStyle md:w-8/12 md:h-1/3 lg:w-8/12 lg:h-1/3 mb-6">
            <h1 className="ch  pb-4 mt-2 text-center">
              My Courses
            </h1>
            {courses?.length > 0 ? (
               <div className="flex border-b">
               {courses.map((course: any) => (
                 <button
                   key={course.id}
                   className={`flex-1 py-4 px-6 text-center font-semibold transition-colors duration-200 ${
                     selectedCourse?.id === course.id
                       ? 'bg-blue-500 text-white'
                       : 'text-gray-700 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedCourse(course)}
                 >
                   {course?.Course?.courseName}
                 </button>
               ))}
             </div>
            ):(
              <EmptyTemplate
                heading={""}
                description={"You're not enrolled in any course yet."}
              />
            )}
           

            {selectedCourse && (
              <div className="p-6 text-black dark:text-white">
                <div className="flex justify-between">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FaBook className="mr-2 text-blue-500" />
                    {selectedCourse?.Course?.courseName}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <p className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-blue-500" />
                    <strong>Duration:</strong> {selectedCourse.Course?.duration}{' '}
                    Months
                  </p>
                  <p
                    onClick={() => {
                      navigate(
                        `/mycourses/teacherprofile/${selectedCourse?.Teacher?.id}`,
                      );
                    }}
                    className="flex items-center text-gray-600 cursor-pointer "
                  >
                    <FaChalkboardTeacher className="mr-2 text-blue-500" />
                    <div className="gap-2 flex items-center ">
                      <strong>Teacher:</strong>
                    
                      <GetUserImageAndName 
                        imageUrl={selectedCourse?.Teacher?.imageUrl}
                        firstName={selectedCourse?.Teacher?.firstName}
                        lastName={selectedCourse?.Teacher?.lastName}
                        userId={selectedCourse?.Teacher?.id}
                        userType={"teacher"}
                      />
                    </div>
                  </p>
                </div>
                <p className="mb-4 text-gray-600 flex items-start">
                  <FaFileAlt className="mr-2 mt-1 text-blue-500" />
                  <span>
                    <strong>Description:</strong>{' '}
                    {selectedCourse.Course?.description}
                  </span>
                </p>
                <div className="md:flex md:justify-between lg:flex lg:justify-between grid grid-cols-1 gap-2 ">
                  <p className="text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    <strong>Started At:</strong>{' '}
                    {new Date(selectedCourse.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => {
                      setOpenMakeupModel(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-sm transition-colors duration-200"
                  >
                    Request Makeup Class
                  </button>
                </div>
                <details className="group mt-8">
                  <summary className="font-semibold text-blue-600 flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-black border-t border-gray-200 rounded-t-lg">
                    <span className="flex items-center">
                      <FaFileAlt className="mr-2" />
                      Lecture Resources
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="currentColor"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </span>
                  </summary>
                  <div className="p-4 bg-gray-50 dark:bg-black border-t border-gray-200 rounded-b-lg">
                    {resources.length > 0 ? (
                      resources.map((resource: any) => (
                        <div
                          key={resource.id}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="flex items-center text-gray-700">
                            <FaFileAlt className="mr-2" />
                            {resource.fileName}
                          </span>
                          <div className="flex">
                            <button
                              // onClick={() => {
                              //   toggleBookMark(resource);
                              // }}
                              className="px-3 py-1 rounded text-sm  transition-colors flex items-center"
                            >
                              <BookmarkedResource
                                key={resource.id}
                                resource={resource}
                                onToggleBookmark={toggleBookMark}
                              />
                            </button>

                            <button
                              onClick={() => {
                                setModalResource(resource);
                                setShowModal(true);
                              }}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors duration-300 flex items-center"
                            >
                              <FaEye className="mr-1" /> View
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No resources available for this course
                      </p>
                    )}
                  </div>
                  <div className="pt-2 dark:bg-black bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  <WeeklyContentTabs courseDetailId={selectedCourse?.id} />
                  </div>
                </details>
              </div>
            )}
          </div>
          <div className="w-96 h-1/2">
            <div className="mb-6 globalCardStyle   h-1/2 overflow-hidden ">
              <h2 className=" p-4  dark:bg-black dark:text-white ch gh">
                Upcoming Classes
              </h2>
                <StudentUpcomingClasses 
                  userId={userId}
                />
            </div>

            <MakeupClassView studentId={userId} />
          </div>
        </div>
        {showModal && modalResource && (
          <ResourceModal
            resource={modalResource}
            onClose={() => setShowModal(false)}
          />
        )}

        {openMakeupModel && (
          <MakeUpClass
            onClose={() => {
              setOpenMakeupModel(false);
            }}
            teacherId={selectedCourse?.Teacher?.id}
            courseDetailsId={selectedCourse?.id}
            studentId={userId}
          />
        )}
        <CourseCardCarousel />
      </div>
      
    </>
  );
};