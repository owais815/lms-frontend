import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
import 'swiper/css'; // Import core Swiper styles
import 'swiper/css/navigation'; // Import Swiper navigation styles
import 'swiper/css/pagination'; // Import Swiper pagination styles
import './index.css';
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

// Register the modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

const CourseCardCarousel = () => {
  const [upcomingCourses, setUpcomingCourses] = useState<any>([]);
  const [enrolledStds, setEnrolledStds] = useState<any>([]);

  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const userId = useSelector((state: any) => state.auth.userId);
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
      // console.log("enrolled stds are:::",response.data);
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
      {upcomingCourses.length > 0 && (
        <div className="p-6 ">
          <h1 className="MainHeadings pb-4 mt-2 ">Upcoming Courses</h1>
          <ToastContainer />
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000, // 3 seconds delay between slides
              disableOnInteraction: false, // Autoplay will continue after user interaction
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
          >
            {upcomingCourses.map((course: any, index: any) => (
              <SwiperSlide key={index}>
                <div
                  className="p-4 flex globalCardStyle flex-col overflow-hidden"
                  style={{ height: '22rem' }}
                >
                  <Card course={course} />
                  <div className="flex justify-end">
                    {isStdEnrolled(course?.Course.id) ? (
                      <button
                        disabled
                        // style={{ bottom: 10, position: 'absolute' }}
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
                        // style={{ bottom: 10, position: 'absolute' }}
                        className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold  px-1 rounded"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
      )}
    </>
  );
};

export default CourseCardCarousel;
