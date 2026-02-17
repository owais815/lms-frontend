import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getCourseByStdId, getUpcomingClasses, deleteUpcomingClass } from '../../api/auth';
import { ScheduleClass } from '../Admin/ScheduleClasses/ScheduleClass';
import { FaSearch } from 'react-icons/fa';
import { StudentIcon } from '../Icons/StudentIcon';
import { toast } from 'react-toastify';
import { Loader } from '../Loader';
import CrossIcon from '../Icons/CrossIcon';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { GetUserImageAndName } from '../Generic/GetUserImageAndName';
import FullScreenModal from '../Generic/MeetingFrame';
import { MEETING_URL } from '../../api/axios';

interface ClassInfo {
  id: number;
  date: string;
  time: string;
  teacherId: number;
  studentId: number;
  meetingLink: string;
  courseDetailsId: number;
  Student: {
    firstName: string;
    lastName: string;
  };
  courseName?: string;
}

export const UpcomingClasses = (props:any) => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const teacherId = useSelector((state: any) => state.auth.userId);
  const classScheduled = useSelector((state: any) => state.changeEvent.classScheduled);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [teachId,setTeachId] = useState('');
  const userType = useSelector((state:any) => state.auth.userType);

  useEffect(()=>{
    if(props?.teacherId){
      console.log("getting prop....");
      setTeachId(props?.teacherId);
    }else{
      console.log("without prop....");
      setTeachId(teacherId);
    }
  },[props?.teacherId,teacherId]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await getUpcomingClasses(Number(teachId));
     
      const upcomingClasses = response.data.upcomingClasses;
      const classesWithCourseNames = await Promise.all(
        upcomingClasses.map(async (classInfo: ClassInfo) => {
          const courseResponse = await getCourseByStdId(classInfo?.studentId.toString());
          
          const course = courseResponse?.data?.course.find((c: any) => c.id === classInfo?.courseDetailsId);
          return {
            ...classInfo,
            courseName: course ? course?.courseName : 'No Course',
          };
        })
      );
      setClasses(classesWithCourseNames);
      setFilteredClasses(classesWithCourseNames);
    } catch (err) {
      setError('Failed to load upcoming classes');
      toast.error('Failed to load upcoming classes');
    }
  }, [teachId,classScheduled]);

  useEffect(() => {
    if(teachId){
      fetchClasses();
    }
  }, [teachId]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    const lowercasedTerm = term.toLowerCase();
    const filtered = classes.filter((classInfo:any) => 
      classInfo?.CourseDetail?.Course?.courseName?.toLowerCase().includes(lowercasedTerm) ||
      classInfo.Student?.firstName?.toLowerCase().includes(lowercasedTerm) ||
      classInfo.Student?.lastName?.toLowerCase().includes(lowercasedTerm) ||
      new Date(classInfo.date).toLocaleDateString().toLowerCase().includes(lowercasedTerm)
    );
    setFilteredClasses(filtered);
  }, [classes]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleJoinClass = (meetingLinkk: string) => {
    const fullMeetingLink = `${MEETING_URL}/${meetingLinkk}`;
    setMeetingLink(fullMeetingLink);
    setIsModalOpen(true);
  };

  const isJoinButtonEnabled = (classTime: string,classDate:string) => {
    const classDateTime = new Date(`${classDate}T${classTime}`);
    
    // Get current time
    const currentTime = new Date();
    
    // Calculate time difference in minutes
    const timeDifferenceInMinutes = Math.abs(currentTime.getTime() - classDateTime.getTime()) / (1000 * 60);
    
    // Return true if within 30 minutes window before or after class time
    return timeDifferenceInMinutes <= 30;
  };

  const handleCancelMeeting = (meetingId: number) => {
    setSelectedMeetingId(meetingId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedMeetingId) {
      setIsLoading(true);
      try {
        await deleteUpcomingClass(selectedMeetingId.toString());
        setClasses(classes.filter(c => c.id !== selectedMeetingId));
        setFilteredClasses(filteredClasses.filter(c => c.id !== selectedMeetingId));
        toast.success('Meeting cancelled successfully');
      } catch (err) {
        console.error('Error cancelling meeting:', err);
        toast.error('Failed to cancel meeting');
      } finally {
        setIsLoading(false);
        setShowDeleteDialog(false);
        setSelectedMeetingId(null);
      }
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 containerr">
      <main>
          {!props?.teacherId && 
        <div className="flex justify-end mb-4">
          <ScheduleClass hideTeacherDropdown={true} teacherId={teacherId} />
        </div>
        }
        <div className="flex items-center justify-between space-x-4 mb-6">
          <h1 className="ch">
            Upcoming Classes
          </h1>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 dark:bg-black pl-10 pr-4 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      
        {filteredClasses.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredClasses.map((classInfo:any) => {
             const isEnabled = isJoinButtonEnabled(classInfo.time,classInfo.date);
             return (
               <div
                 key={classInfo.id}
                 className="globalCardStyle  p-6 rounded  px-4 py-6"
               >
                 <div className="flex items-center justify-between">
                   <p className="sub text-sm">
                     {new Date().toLocaleDateString('default', {
                       weekday: 'short',
                       year: 'numeric',
                       month: 'short',
                       day: 'numeric',
                     })}
                   </p>
                   <p className="text-black font-bold dark:text-white">
                     {classInfo?.CourseDetail?.Course?.courseName}
                   </p>
                   <p className="sub text-sm">
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
                 <hr className="my-2" />
                 <div className="flex items-center mt-4">
                   {/* <StudentIcon /> */}
                   <h3 className="text-black text-xl font-bold ml-2 dark:text-white">
                   
                     <GetUserImageAndName 
                     userId={classInfo.Student.id}
                     firstName={classInfo.Student.firstName}
                     lastName={classInfo.Student.lastName}
                     userType={"student"}
                     imageUrl={classInfo.Student?.profileImg}
                     />
                   </h3>
                 </div>
                 <div className="flex justify-between p-4 mt-4">
                   <button
                     onClick={() => handleJoinClass(classInfo.meetingLink)}
                     className={`${
                       isEnabled
                         ? 'bg-blue-500 hover:bg-blue-600'
                         : 'bg-blue-400 opacity-70 cursor-not-allowed'
                     } text-white px-2 py-1 rounded transition-colors duration-300`}
                     disabled={!isEnabled}
                   >
                     {isEnabled ? 'Join Class' : 'Class Not Started'}
                   </button>
                     {userType=='admin' && 
                   <button   className="text-sm border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-300"  onClick={() => handleCancelMeeting(classInfo.id)}>
 
                     Delete Schedule
                   </button>
                   }
                 </div>
               </div>
             );
           })}
         </div>
        ):(
          <div>
            <p className='text-center text-gray-500 dark:text-white text-lg mb-4 font-bold'> No classes found.</p>
          </div>
        )}
       
      </main>

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <CrossIcon />
            </button>
            <h2 className="text-lg mb-4 text-black">Confirm Cancellation</h2>
            <p className="mb-4">Are you sure you want to cancel this meeting?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : 'Yes, Cancel It'}
              </button>
            </div>
          </div>
        </div>
      )}

<FullScreenModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        meetingLink={meetingLink} 
      />
    </div>
  );
};