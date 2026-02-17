import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import {
  getTeacherById,
  uploadProfileImage,
  getProfileImage,
  getCounts,
  updateteacher,
  updateTeacherPassword,
} from '../../../api/auth';
import { MailIcon } from '../../Icons/MailIcon';
import { CnicIcon } from '../../Icons/CnicIcon';
import { ContactIcon } from '../../Icons/ContactIcon';
import Qualification from './Qualification';

import axios from '../../../api/axios';
import { Loader } from '../../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { GetUserImage } from '../../Generic/GetUserImage';
import StudentFeedback from '../StudentFeedback';
import { OpenModal } from '../../Generic/OpenModal';
import { toast } from 'react-toastify';
import { EditDialog } from '../../Admin/Teacher/EditDialog';
import { ChangePassword } from '../../Generic/ChangePassword';
import { ScheduleClass } from '../../Admin/ScheduleClasses/ScheduleClass';

interface TeacherData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cnic: string;
  contact: string;
  address: string;
  studentCount: number;
  courseCount: number;
  feedbackCount: number;
}
interface CountsData {
  students: number;
  totalFeedback: number;
  totalQualifications: number;
  totalSpecializations: number;
}
interface Tab {
  id: string;
  label: string;
}

interface TabContent {
  [key: string]: React.ReactNode;
}

const TeacherProfile = ({ teacherId }: any) => {
  const { tId } = useParams();
  const userId = useSelector((state: any) => state.auth.userId);

  const [profileImage, setProfileImage] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<string>('qualification');
  const tabs: Tab[] = [
    { id: 'qualification', label: 'Qualification & Specialization' },
    { id: 'feedback', label: 'Student Feebacks' },
  ];

  const [teacherData, setTeacherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [counts, setCounts] = useState<CountsData>({
    students: 0,
    totalFeedback: 0,
    totalSpecializations: 0,
    totalQualifications: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [currentTeacher, setCurrentTeacher] = useState<any>(null);
  const [passModalVisible, setPassModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tId) {
      setSelectedTeacherId(tId);
    } else if (teacherId) {
      setSelectedTeacherId(teacherId);
    } else if (userId) {
      setSelectedTeacherId(userId);
    }
  }, []);

  useEffect(() => {
    if (selectedTeacherId) {
      getTeacher();
      fetchCounts();
      fetchProfileImage();
    }
  }, [selectedTeacherId]);

  const getTeacher = async () => {
    try {
      setIsLoading(true);
      const response = await getTeacherById(selectedTeacherId);
      if (response.data && response.data.teacher) {
        setTeacherData(response.data.teacher);
        setEditedData(response.data.teacher);
      } else {
        console.error('Teacher data not found in the response');
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCounts = async () => {
    try {
      const response = await getCounts(selectedTeacherId);
      if (response.data) {
        setCounts(response.data);
        // console.log('Counts:', response.data);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await getProfileImage(selectedTeacherId);
      if (response.data && response.data.imageUrl) {
        setProfileImage(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('teacherId', selectedTeacherId);

      try {
        setIsImageLoading(true);
        const response = await uploadProfileImage(formData);
        if (response.data && response.data.imageUrl) {
          setProfileImage(response.data.imageUrl);
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherData?.id) return;

    const updatedTeachersData = {
      firstName: currentTeacher.firstName,
      lastName: currentTeacher.lastName,
      contact: currentTeacher.contact,
    };
    // console.log('Teacher', editingTeacherId);
    try {
      const response = await updateteacher(
        teacherData?.id,
        updatedTeachersData,
      );
      // console.log('Teacher updated:', response.data);

      toast.success('teacher updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // fetchTeachers();
      getTeacher();
      toggleModal(null);
    } catch (error) {
      console.error('Update teacher failed:', error);
      toast.error('Failed to update teacher');
    }
  };

  const toggleModal = (teacherId?: any) => {
    setIsModalOpen(!isModalOpen);
    setCurrentTeacher({
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      contact: teacherData.contact,
    });
  };
  const tabContent: TabContent = {
    qualification: (
      <Qualification
        teacherId={selectedTeacherId}
        hideAddButtons={tId ? true : false}
      />
    ),
    feedback: !teacherId ? <StudentFeedback /> : '',
  };

  const handleChangePassword = async (password: any) => {
    try {
      let obj = {
        username: teacherData?.username,
        password,
      };
      const response = await updateTeacherPassword(obj);
      if (response.data) {
        toast.success('Password updated successfully');
        setPassModalVisible(false);
      }
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const handleRowClick = (teacherrId:any) =>{
    navigate('/teacher/' + teacherrId + '/teacherDetailsPage/progress');
  }


  return (
    <div className="container mx-auto">
      <div className="globalCardStyle overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              {isImageLoading ? (
                <Loader />
              ) : (
                <div className="relative group">
                  {/* <img
                    className="w-32 h-32  rounded-full cursor-pointer"
                    src={`${axios.defaults.baseURL}/${profileImage}`}
                    alt="Profile"
                  /> */}
                  <GetUserImage
                    userId={selectedTeacherId}
                    userType={'teacher'}
                    imageUrl={profileImage}
                    classes={'w-32 h-32 rounded-full cursor-pointer'}
                  />
                  {!tId && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        onClick={triggerFileInput}
                        className="w-8 h-8 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <h5 className="text-2xl font-semibold uppercase mb-4">
              {isLoading ? (
                <Loader />
              ) : teacherData ? (
                `${teacherData.firstName} ${teacherData.lastName}`
              ) : (
                'No data available'
              )}
            </h5>

            <div className="flex flex-col md:flex-row lg:flex-row md:space-x-8 lg:space-x-12 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{counts.students}</p>
                <p className="text-gray-600">Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{counts.totalFeedback}</p>
                <p className="text-gray-600">Feedbacks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {counts.totalQualifications}
                </p>
                <p className="text-gray-600">Qualifications</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {counts.totalSpecializations}
                </p>
                <p className="text-gray-600">Specializations</p>
              </div>
            </div>

            <p className="text-gray-500 mb-6 md:flex lg:flex grid grid-cols-3 items-center gap-2">
              <MailIcon /> {teacherData?.email}
              <span className="md:mx-2 lg:mx-2 mx-0">|</span>
              <CnicIcon /> {teacherData?.cnic}
              <span className="md:mx-2 lg:mx-2 mx-0">|</span>
              <ContactIcon /> {teacherData?.contact}
            </p>

           
              <div className="flex items-center gap-6 mb-6">
              {/* {!tId && (     
                <button
                  onClick={() => {
                    setPassModalVisible(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Change Password
                </button>
)} */}
 {!tId && (
                <button
                  onClick={toggleModal}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                )}
                {(teacherId || tId) && 
                <button
                  onClick={()=>{handleRowClick(teacherData?.id)}}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  More about {teacherData?.firstName}
                </button>
              }
              {teacherId && !tId && 
              <ScheduleClass hideTeacherDropdown={true} teacherId={teacherId} />
}

              </div>
        
            {/* {tId && 
                 <button onClick={()=>{navigate(`/userChat/${tId}/${'teacher'}`)}} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Message</button>
            } */}
          </div>
          {/*  */}
          <>
            {!teacherId && (
              <div className="mb-4 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center justify-start">
                  {tabs.map((tab) => (
                    <li key={tab.id} className="me-2" role="presentation">
                      <button
                        className={`inline-block p-4 border-b-2 rounded-t-lg ${
                          activeTab === tab.id
                            ? 'text-blue-600 border-blue-600'
                            : 'hover:text-gray-600 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        role="tab"
                        aria-controls={tab.id}
                        aria-selected={activeTab === tab.id}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`${
                    activeTab === tab.id ? '' : 'hidden'
                  } p-4 rounded-lg bg-gray-50 dark:bg-black`}
                  role="tabpanel"
                  aria-labelledby={`${tab.id}-tab`}
                >
                  {tabContent[tab.id]}
                </div>
              ))}
            </div>
          </>
          {/* )} */}
        </div>
      </div>
      {passModalVisible && (
        <OpenModal
          title={'Change Password'}
          handleClose={() => {
            setPassModalVisible(false);
          }}
        >
          <ChangePassword
            handleUpdate={(password: any) => {
              handleChangePassword(password);
              setPassModalVisible(false);
            }}
          />
        </OpenModal>
      )}

      {isModalOpen && (
        <EditDialog
          toggleDialog={() => {
            setIsModalOpen(!isModalOpen);
          }}
          handleUpdate={handleUpdate}
          currentTeacher={currentTeacher}
          setCurrentTeacher={(e: any, key: any) => {
            setCurrentTeacher((prev: any) => ({
              ...prev!,
              [key]: e.target.value,
            }));
          }}
        />
      )}
    </div>
  );
};

export default TeacherProfile;
