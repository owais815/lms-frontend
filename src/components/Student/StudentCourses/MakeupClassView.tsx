import { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClock,
  FaUser,
  FaVideo,
} from 'react-icons/fa';
import {
  addUpcomingClass,
  cancelMakeup,
  getAllMakeUpClassesReq,
  getStdMakeUpClasses,
  updateMakeupClassStatus,
} from '../../../api/auth';
import { RiDeleteBinLine } from 'react-icons/ri';
import { HiStatusOnline } from 'react-icons/hi';
import { DeleteDialog } from '../../Admin/Student/DeleteDialog';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { changeEventActions } from '../../../redux/Slices/changeEvent';

export const MakeupClassView = (props: any) => {
  const [classes, setClasses] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [classId, setClassId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAdmin,setIsAdmin] = useState(false);
  const [adminReason,setAdminReason] = useState('');
  const [meetingLink, setMeetingLink] = useState<string>('');

  const changeEvent = useSelector(
    (state: any) => state.changeEvent.makeupcreated,
  );
 const dispatch = useDispatch();
  useEffect(() => {
    if (props.studentId) {
      fetchClasses();
    } else {
      setIsAdmin(true);
      fetchAllRequests();
    }
  }, [changeEvent]);

  const changeStatus = async(classInfo:any) =>{
    try {
      let obj = {
        status: selectedStatus,
        adminReason: adminReason
      };
      
      if (obj.status === 'Approved') {
        if (meetingLink) {
          const response: any = await updateMakeupClassStatus(obj, classId);
          if (response) {
            const isClassScheduled = await scheduleClass(classInfo);
            if (isClassScheduled) {
              toast.success('Class Status Updated Successfully');
              clearFields();
              dispatch(changeEventActions.setMakeupTrigger());
            } else {
              toast.error('Class could not be scheduled. Please check the meeting details.');
            }
          }
        } else {
          toast.info('Meeting link is required for approved status');
        }
      } else {
        const response: any = await updateMakeupClassStatus(obj, classId);
        if (response) {
          toast.success('Class Status Updated Successfully');
          clearFields();
          dispatch(changeEventActions.setMakeupTrigger());
        }
      }
     
    } catch (err) {
      console.error('Error getting class:', err);
    }
  }
  const handleDeleteRequest = async () => {
    try {
      const response: any = await cancelMakeup(classId);
      if (response) {
        toast.success('Class Cancelled Successfully');
        setShowDeleteDialog(false);
        dispatch(changeEventActions.setMakeupTrigger());
      }
    } catch (err) {
      console.error('Error getting class:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const response: any = await getStdMakeUpClasses(props.studentId);
      if (response.data) {
        // console.log("classinfo for upcommingis:::",response.data);
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error('Error getting class:', err);
      setClasses([]);
    }
  };

  const fetchAllRequests = async () => {
    try {
      const response: any = await getAllMakeUpClassesReq();
      if (response.data) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error('Error getting class:', err);
      setClasses([]);
    }
  };

  const getStatus = (status: string): { text: string; color: string } => {
    switch (status) {
      case 'Pending':
        return { text: 'Pending', color: 'bg-yellow-500' };
      case 'Approved':
        return { text: 'Approved', color: 'bg-green-800' };
      case 'Rejected':
        return { text: 'Rejected', color: 'bg-red-500' };
      default:
        return { text: 'N/A', color: 'bg-gray-500' };
    }
  };

const clearFields = () =>{
  setSelectedStatus('');
  setAdminReason('');
}

const scheduleClass = async (classInfo: any): Promise<boolean> => {
  const classData = {
    teacherId: classInfo.Teacher.id,
    studentId: classInfo.Student.id,
    courseDetailsId: classInfo.CourseDetail.id,
    date: classInfo.date,
    time: classInfo.time,
    meetingLink: meetingLink,
  };

  try {
    await addUpcomingClass(classData);
    toast.success('Class scheduled successfully!');
    return true; // Return true when scheduling is successful
  } catch (err) {
    console.error('Error scheduling class:', err);
    toast.error('Failed to schedule class');
    return false; // Return false when scheduling fails
  }
};


  return (
    <div className='flex flex-col w-96 '>
      {isAdmin && 
      <div className=''>
        <button onClick={()=>{props.openMakeupModel()}} className='float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 '>Schedule Makeup Class</button>
      </div>
      }
      {classes.length > 0 && (
        <div className={`${!isAdmin && 'w-96'} mb-6 globalCardStyle  overflow-hidden `}>
          <h2 className=" p-4  dark:bg-black dark:text-white ch gh">
            Status of Makeup Classes
          </h2>
          <div className="p-4 ">
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4  ">
                {classes.map((classInfo: any) => {
                  return (
                    <div
                      key={classInfo.id}
                      className="bg-white dark:bg-black p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg mb-2 ">
                          {classInfo?.CourseDetail?.Course?.courseName}
                        </h3>
                        {isAdmin &&
                        <h3
                          className="font-semibold text-lg mb-2"
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <FaUser
                            size={16}
                            className="inline mr-2 text-gray-600 h-full dark:text-white"
                          />
                          {classInfo?.Student?.firstName}{' '}
                          {classInfo?.Student?.lastName}
                        </h3>
                        }
                      </div>
                      <div
                        className={`${
                          getStatus(classInfo?.status).color
                        } flex rounded w-26 h-6 mb-1 `}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <HiStatusOnline className="inline mr-2 text-white h-full" />
                        <p className="text-sm text-white">
                          {' '}
                          {getStatus(classInfo.status)?.text}{' '}
                        </p>
                      </div>

                      {classInfo.Teacher && (
                        <>
                       <span className='text-sm text-gray-600 mb-1 font-semibold'>Teacher Name:</span>
                        <p className="text-sm text-gray-600 mb-1">
                          <FaChalkboardTeacher className="inline mr-2" />
                         
                          {`${classInfo?.Teacher?.firstName} ${classInfo?.Teacher?.lastName}`}
                        </p>
                        </>
                      )}
                     
                       <span className='text-sm text-gray-600 mb-1 font-semibold'>Expected date:</span>
                      <p className="text-sm text-gray-600 mb-1">
                        <FaCalendarAlt className="inline mr-2" />
                        {new Date(classInfo.date).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                       <span className='text-sm text-gray-600 mb-1 font-semibold'>Expected Time:</span>
                        <p className="text-sm text-gray-600 mb-2">
                          <FaClock className="inline mr-2" />
                          {new Date(
                            `1970-01-01T${classInfo.time}`,
                          ).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </p>
                        </div>
                        <div className='flex items-center gap-4'>
                        
                        {(classInfo.status === 'Pending' || isAdmin)&& (
                          <button
                          onClick={() => {
                            setShowDeleteDialog(true);
                            setClassId(classInfo.id);
                          }}
                          className={` bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300 flex items-center justify-center`}
                        >
                          <RiDeleteBinLine className="inline " />
                        </button>
                        )}
                        
                        </div>
                      </div>
                      <div>
                      {(isAdmin && classInfo?.reason) &&
                      <>
                      <span className='text-sm text-gray-600 mb-1 font-semibold'>Student Reason:</span>
                      <div className="text-gray-600 italic mb-2">"{classInfo?.reason}"</div>
                      </>
                    }

                      {(!isAdmin && classInfo?.adminReason) &&
                      <>
                      <span className='text-sm text-gray-600 mb-1 font-semibold'>Admin Comments:</span>
                      <div className="text-gray-600 italic mb-2">"{classInfo?.adminReason}"</div>
                      </>
                    }
                  
                      </div>
                      {isAdmin && classInfo.status === 'Pending' && (
                        <>

                        {/* dropdown tailwind */}
                       
                        <div className="w-48 mt-8">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Change Status
                          </label>
                          <select
                          value={selectedStatus} 
                          onChange={(e) => {setSelectedStatus(e.target.value);setClassId(classInfo.id);}}
                            id="small"
                            className="block w-full p-2 mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option selected>Choose a status</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </div>
                      
                        {/* end of dropdown */}
                       
                        <div className="space-y-1">
                        <label className="text-sm font-medium" htmlFor="feedback">
                          Reason/Note(optional)
                        </label>
                        <textarea
                          className="w-full min-h-[80px] rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          id="feedback"
                          placeholder="Please share reason/note with student if any."
                          rows={4}
                          value={adminReason}
                          onChange={(e) => setAdminReason(e.target.value)}
                        ></textarea>
                      </div>
                    {selectedStatus =='Approved' && (
                      <div className="mb-4">
                      <label
                        htmlFor="meetingLink"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Meeting Link
                      </label>
                      <input
                        id="meetingLink"
                        type="text"
                        className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="copy code from join meeting tab(only code)"
                      />
                    </div>
                    )}
                      

                      <button onClick={()=>{changeStatus(classInfo)}} className="float-right bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300">Save</button>
                      </>
                      )}
                      
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No makeup classe requested</p>
            )}
          </div>
        </div>
      )}
      {showDeleteDialog && (
        <DeleteDialog
          name={'makeup class'}
          handleDelete={handleDeleteRequest}
          closeDialog={() => {
            setShowDeleteDialog(false);
          }}
        />
      )}
    </div>
  );
};
