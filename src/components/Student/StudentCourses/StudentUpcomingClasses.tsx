import React, { useCallback, useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClock,
  FaVideo,
} from 'react-icons/fa';
import { ClassInfo } from './StudentCourses';
import {
  getAttdenceStatus,
  getCourseByStdId,
  getStudentUpcomingClasses,
  markAttendance,
} from '../../../api/auth';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { MEETING_URL } from '../../../api/axios';
import SurveyPopup from '../PopupServey/SurveyPopup';
import FullScreenModal from '../../Generic/MeetingFrame';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';
import { formatDateForInput } from '../../Generic/FormatDate';

export const StudentUpcomingClasses = (props: any) => {
  const [meetingLink, setMeetingLink] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState('');
  const [classId, setClassId] = useState('');
  //   const { classes } = props;
  const { userId } = props;
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  const userType = useSelector((state: any) => state.auth.userType);
  const [showSurvey, setShowSurvey] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [attendanceStatuses, setAttendanceStatuses] = useState<any>({}); 

  const isJoinButtonEnabled = (classTime: string): boolean => {
    // Get current time (hours and minutes)
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Extract hours and minutes from classTime (format HH:MM)
    const [classHours, classMinutes] = classTime.split(':').map(Number);

    // Convert both times to "total minutes from midnight"
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const classTotalMinutes = classHours * 60 + classMinutes;

    // Calculate time difference in absolute minutes
    const timeDifferenceInMinutes = Math.abs(
      currentTotalMinutes - classTotalMinutes,
    );

    // Return true if within 30-minute window before or after class time
    return timeDifferenceInMinutes <= 30;
  };

  const getButtonText = (classDate: string, classTime: string) => {
    const now = new Date();
    const classDateTime = new Date(`${classDate}T${classTime}`);
    const timeDifference = classDateTime.getTime() - now.getTime();
    const isEnabled = isJoinButtonEnabled(classTime);
    if (timeDifference > 10 * 60 * 1000) {
      return 'Class Not Started';
    } else if (timeDifference > 0) {
      return 'Join Class Soon';
    } else if (isEnabled) {
      return 'Join Class';
    } else {
      return "Time's up";
    }
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);
    // Navigate to next class or dashboard
  };

  const handleJoinClass = async (classInfo: any) => {
    try {
      // Mark attendance
      console.log(formatDateForInput(new Date()));
      const response = await markAttendance({
        studentId: Number(userId),
        courseDetailsId: classInfo.courseDetailsId,
        date: formatDateForInput(new Date()),
        status: 'Present',
      });
      debugger;
      if (response.data?.recordUpdated) {
        toast.info('Attendance updated successfully');
        setIsFirstTime(false);
      } else {
        toast.success('Attendance marked successfully');
      }
      setClassId(classInfo.id);
      setTeacherId(classInfo.teacherId);
      // Set meeting link and open modal
      const fullMeetingLink = `${MEETING_URL}/${classInfo.meetingLink}`;
      setMeetingLink(fullMeetingLink);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error marking attendance:', error);
      // toast.error('Failed to mark attendance');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);


  // Function to fetch attendance status for each class
  const fetchAttendanceStatuses = async () => {
    try {
      const statusPromises = classes.map(async (classInfo) => {
        const response = await getAttdenceStatus({
          studentId: Number(userId),
          courseDetailsId: classInfo.courseDetailsId,
        });
        return { 
          courseDetailsId: classInfo.courseDetailsId, 
          status: response?.data?.status || 'unknown' 
        };
      });
      const statusResults = await Promise.all(statusPromises);

      // Create a lookup object to store attendance status by courseDetailsId
      const statusMap = statusResults.reduce((acc:any, item) => {
        acc[item.courseDetailsId] = item.status;
        return acc;
      }, {});
      setAttendanceStatuses(statusMap); // Update the state with attendance statuses
    } catch (error) {
      console.error('Error getting attendance status:', error);
    }
  };

  useEffect(() => {
    if (classes?.length > 0) {
      fetchAttendanceStatuses(); // Call API to get attendance status for all classes
    }
  }, [classes]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await getStudentUpcomingClasses(userId);
      const upcomingClasses = response.data.upcomingClasses;

      const classesWithDetails = await Promise.all(
        upcomingClasses.map(async (classInfo: any) => {
          const courseResponse = await getCourseByStdId(
            classInfo.studentId.toString(),
          );
          const course = courseResponse.data.course.find(
            (c: any) => c.id === classInfo.courseDetailsId,
          );
          return {
            ...classInfo,
            courseName: course ? course?.Course?.courseName : 'No Course',
            teacher: course ? course.Teacher : null,
          };
        }),
      );

      setClasses(classesWithDetails);
    } catch (err) {
      console.log('Failed to load upcoming classes');
    }
  }, [userId]);


  return (
    <div className="p-4 ">
      <ToastContainer />
      {classes?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {classes?.map((classInfo: any) => {
            const isEnabled = isJoinButtonEnabled(classInfo.time);
            const buttonText = getButtonText(classInfo.date, classInfo.time);
            const attendanceStatus = attendanceStatuses[classInfo.courseDetailsId] || 'Loading...';
            return (
              <div
                key={classInfo.id}
                className="bg-white p-4 rounded-lg shadow gap-4 flex flex-col"
              >
                <div className="">
                  <h3 className="font-semibold text-lg mb-2">
                    {classInfo?.courseName}
                  </h3>

                  {classInfo.teacher && (
                    <p className="text-sm text-gray-600 mb-1">
                      {/* <FaChalkboardTeacher className="inline mr-2" /> */}
                      {/* {`${classInfo.teacher.firstName} ${classInfo.teacher.lastName}`} */}
                      <GetUserImageAndName
                        firstName={classInfo?.teacher?.firstName}
                        lastName={classInfo?.teacher?.lastName}
                        userId={classInfo?.teacher?.id}
                        userType={'teacher'}
                        imageUrl={classInfo?.teacher?.imageUrl}
                        showType={false}
                      />
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <FaCalendarAlt className="inline mr-2" />
                  {new Date().toLocaleDateString()}
                </p>
                <div className='flex justify-between items-center mb-6'>
                <p className="text-sm text-gray-600 mb-2">
                  <FaClock className="inline mr-2" />
                  {new Date(`1970-01-01T${classInfo.time}`).toLocaleTimeString(
                    'en-US',
                    {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    },
                  )}
                </p>

                  {/* Show the attendance status */}
                  <p className="text-sm font-bold mt-2">
                Attendance Status: 
                <span className={`ml-2 text-white dark:text-black p-2 rounded ${attendanceStatus === 'present' ? 'bg-green-600' : 'bg-red-600'}`}>
                  {attendanceStatus === 'Loading...' ? 'Loading...' : attendanceStatus === 'present' ? 'Present' : 'Pending'}
                </span>
              </p>
              
              </div>
                {userType == 'student' && (
                  <button
                    onClick={() => {
                      handleJoinClass(classInfo);
                    }}
                    className={`${
                      isEnabled
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-green-400 cursor-not-allowed'
                    } text-white px-4 py-2 rounded transition-colors duration-300 flex items-center justify-center w-full`}
                    disabled={!isEnabled}
                  >
                    <FaVideo className="mr-2" />
                    {buttonText}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">No upcoming classes scheduled</p>
      )}

      {showSurvey && isFirstTime && (
        <SurveyPopup
          classId={classId}
          studentId={userId}
          teacherId={teacherId}
          onComplete={handleSurveyComplete}
        />
      )}
      <FullScreenModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowSurvey(true);
        }}
        meetingLink={meetingLink}
      />
    </div>
  );
};
