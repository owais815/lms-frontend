import  { useCallback, useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import {
  getCourseByStdId,
  getNextFourHourClasses,
} from '../../../api/auth';
import {  ToastContainer } from 'react-toastify';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';

export const UpcomingClassesNextHours = () => {
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await getNextFourHourClasses();
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
      debugger;
    } catch (err) {
      console.log('Failed to load upcoming classes');
    }
  }, []);


  return (
    <div className="p-4 ">
          <h2 className="MainHeadings mb-6">Upcoming Classes <span className='text-sm'>(next 4 hours)</span></h2>

      <ToastContainer />
      {classes?.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {classes?.map((classInfo: any) => {
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
                    <p className="text-sm text-gray-600 mb-2">
                      {/* <FaChalkboardTeacher className="inline mr-2" /> */}
                      {/* {`${classInfo.teacher.firstName} ${classInfo.teacher.lastName}`} */}
                      <GetUserImageAndName
                        firstName={classInfo?.teacher?.firstName}
                        lastName={classInfo?.teacher?.lastName}
                        userId={classInfo?.teacher?.id}
                        userType={'teacher'}
                        imageUrl={classInfo?.teacher?.imageUrl}
                        showType={true}
                      />
                    </p>
                  )}

{classInfo?.Student && (
                    <p className="text-sm text-gray-600 mb-1">
                      {/* <FaChalkboardTeacher className="inline mr-2" /> */}
                      {/* {`${classInfo.teacher.firstName} ${classInfo.teacher.lastName}`} */}
                      <GetUserImageAndName
                        firstName={classInfo?.Student?.firstName}
                        lastName={classInfo?.Student?.lastName}
                        userId={classInfo?.Student?.id}
                        userType={'student'}
                        imageUrl={classInfo?.Student?.profileImg}
                        showType={true}
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
              </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">No upcoming classes scheduled</p>
      )}
    </div>
  );
};
