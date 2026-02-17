import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import {
  getAnnouncement,
  getClassMetrics,
  getUpcomingClasses,
} from '../../../api/auth';
import StudentFeedback from '../StudentFeedback';
import SurveyDashboard from '../../Generic/TeacherSurvey';
import { toast, ToastContainer } from 'react-toastify';
import { UpcomingClasses } from '../UpcomingClasses';
import { EnrolledStudents } from '../TeacherProfile/EnrolledStudents';
import { useParams } from 'react-router-dom';

interface ClassInfo {
  id: number;
  date: string;
  time: string;
  teacherId: number;
  studentId: number;
  Student: {
    firstName: string;
    lastName: string;
  };
}

const Dashboard: React.FC = () => {
  const [totalClasses, setTotalClasses] = useState<number | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState([]);
  const [teacherId,setTeacherId] = useState('');
  const userId = useSelector((state: any) => state.auth.userId);
  const { tId } = useParams();

  useEffect(()=>{
    if(tId){
    setTeacherId(tId);
    console.log("in dashboard with tId",tId);
    }else{
      setTeacherId(userId);
    console.log("in dashboard with userId",userId);

    }
  },[userId,tId]);

  const getAnnouncements = async () => {
    try {
      let obj = {
        userId: teacherId,
        userType: 'teacher',
      };
      const response = await getAnnouncement(obj);
      if (response.data?.announcements?.length > 0) {
        setAnnouncements(response.data.announcements);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if(teacherId){
      getAnnouncements();
      fetchClassMetrics();
    fetchClasses();
    }
  }, [teacherId]);

  const fetchClassMetrics = async () => {
    try {
      const response = await getClassMetrics(teacherId);
      setTotalClasses(response.data.totalClasses);
      setAverageRating(parseFloat(response.data.averageRating));
    } catch (err) {
      console.error('Error fetching class metrics:', err);
      setError('Failed to fetch class metrics');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getUpcomingClasses(teacherId);
      setClasses(response.data.upcomingClasses);
      // console.log('Classes:', response.data.upcomingClasses);
    } catch (err) {
      console.error('Error fetching upcoming classes:', err);
      setError('Failed to load upcoming classes');
    }
  };


  return (
    <div className="containerr mt-6">
      <ToastContainer />
      <div style={{ display: 'none' }}>
        {announcements.length > 0 &&
          announcements.map((val: any) => {
            return toast.info(val?.message, {
              hideProgressBar: false,
              closeOnClick: true,
              autoClose: false,
              theme: 'colored',
            });
          })}
      </div>
        {teacherId &&
      <>
      <div className="rounded-lg p-6 pb-8 globalCardStyle shadow-xl transition-all duration-300 hover:shadow-md dark:text-gray-600">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="heading tracking-tight">Enrolled Students</h3>
        </div>
        <EnrolledStudents teachId={teacherId} />
      </div>
      <div className="bg-white dark:bg-black shadow-lg  rounded-lg ">
        <UpcomingClasses teacherId={teacherId} />
      </div>
      </>
      }
      <SurveyDashboard teachId={teacherId} isAdmin={false} />

      <div className="grid grid-cols-1  gap-8 pt-6 bg-gray-100 dark:bg-black items-start">
      {teacherId && <StudentFeedback teachId={teacherId} /> }

        <div className="rounded-lg  pb-8 globalCardStyle shadow-xl transition-all duration-300 hover:shadow-md dark:text-gray-600">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="heading tracking-tight">Class Metrics</h3>
          </div>
          <div className="p-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center globalCardStyle">
                <h3 className="text-4xl text-gray-600 font-bold">
                  {totalClasses ?? '—'}
                </h3>
                <p className="text-gray-600">Total Classes</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center globalCardStyle">
                <h3 className="text-4xl font-bold text-gray-600">
                  {averageRating !== null ? averageRating.toFixed(1) : '—'}
                </h3>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
            {classes.length > 0 && (
              <div>
                <h3 className="heading mb-2 ">Upcoming Classes</h3>
                <table className="w-full">
                  <thead className="border-b dark:text-gray-600 text-gray-600">
                    <tr>
                      <th className="p-4 text-left font-medium dark:text-gray-600 text-gray-600">
                        Date
                      </th>
                      <th className="p-4 text-left font-medium dark:text-gray-600 text-gray-600">
                        Time
                      </th>
                      <th className="p-4 text-left font-medium dark:text-gray-600 text-gray-600">
                        Students Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classInfo, index) => (
                      <tr
                        key={index}
                        className="border-b transition-colors dark:text-gray-600 text-gray-600"
                      >
                        <td className="p-4">
                          {new Date().toLocaleDateString(
                            'default',
                            {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </td>
                        <td className="p-4">
                          {new Date(
                            `1970-01-01T${classInfo.time}`,
                          ).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </td>
                        <td className="p-4">{`${classInfo.Student.firstName} ${classInfo.Student.lastName}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 p-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
