import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getStudentAttendance } from '../../../api/auth';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { EmptyTemplate } from '../../Generic/EmptyTemplate';

interface Attendance {
  id: number;
  date: string;
  status: 'Present' | 'Absent';
  courseId: number;
  CourseDetail: {
    courseName: string;
  };
}

export const AttendanceComponent: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await getStudentAttendance(userId.toString());
        if (response.data && Array.isArray(response.data.attendance)) {
          setAttendanceRecords(response.data.attendance);
        } else {
          setAttendanceRecords([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to fetch attendance data');
        toast.error('Failed to load attendance records');
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col globalCardStyle containerr mt-6 p-4">
    {attendanceRecords.length > 0 ? (
       <div className="overflow-x-auto">
       <table className="min-w-full table-auto">
         <thead className="bg-gray-200">
           <tr>
             <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider">
               Dated
             </th>
             <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider">
               Course Name
             </th>
             <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider">
               Status
             </th>
           </tr>
         </thead>
         <tbody>
           {attendanceRecords.length > 0 ? (
             attendanceRecords.map((record:any, index) => (
               <tr key={record.id} className={`text-graydark dark:text-slate-50 ${index % 2 === 0 ? 'e' : 'bg-gray-50'} dark:bg-transparent border-b`}>
                 <td className="py-4 px-6 text-sm whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                 <td className="py-4 px-6 text-sm whitespace-nowrap">{record.CourseDetail?.Course?.courseName}</td>
                 <td className={`py-4 px-6 text-sm font-bold whitespace-nowrap ${record.status === 'Present' ? 'text-green-400' : 'text-red-400'}`}>
                   {record.status}
                 </td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan={3} className="py-4 px-6 text-sm text-center text-gray-500">No attendance records found</td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
    ):(
      <EmptyTemplate
        heading="No attendance records found"
        description="You have not marked any attendance yet."
      />
    )}
     
    </div>
  );
};