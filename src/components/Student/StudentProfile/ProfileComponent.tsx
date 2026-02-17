import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  getStudentById, getStudentProfileImage, update, updateStudentPassword, uploadStudentProfileImage } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import { AssignedTeachers } from '../MyTeachers/Teacher';
import axios from '../../../api/axios';
import defaultImage from '/images/avatar.png';
import { changeEventActions } from '../../../redux/Slices/changeEvent';
import { ProfileComponentGeneric } from '../../Generic/ProfileComponent';
import { OpenModal } from '../../Generic/OpenModal';
import { ChangePassword } from '../../Generic/ChangePassword';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  contact: string;
  address: string;
  email: string;
  dateOfBirth: string | null;
  guardian: string | null;
  emergencyContact: string | null;
  username: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const ProfileComponent = () => {
  const [profileImage, setProfileImage] = useState<string>('');

  const userId = useSelector((state: any) => state.auth.userId);
  const dispatch = useDispatch();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Student>>({});
  const [passModalVisible, setPassModalVisible] = useState(false);


  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getStudentById(userId);
        // console.log('API response:', response.data);
        if (response.data && response.data.student) {
          setStudent(response.data.student);
          setEditedData(response.data.student);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
        setLoading(false);
      }
    };

    fetchStudent();
    fetchProfileImage();
  }, [userId]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setProfileImage(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    debugger;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', userId);
      
      try {
        const response = await uploadStudentProfileImage(formData);
        
        if (response.data && response.data.imageUrl) {
          setProfileImage(response.data.imageUrl);
          dispatch(changeEventActions.setDpTrigger())
        }
      } catch (error) {
        toast.error('Error uploading profile image, Please try again in a moment.');
        console.error('Error uploading profile image:', error);
      } 
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await getStudentProfileImage(userId);
      if (response.data && response.data.imageUrl) {
        setProfileImage(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (student) {
        const updateData = {
          firstName: editedData.firstName || '',
          lastName: editedData.lastName || '',
          contact: editedData.contact || '',
          address: editedData.address || '',
          email: editedData.email || '',
          dateOfBirth: editedData.dateOfBirth || '',
          guardian: editedData.guardian || '',
          emergencyContact: editedData.emergencyContact || '',
        };
        await update(student.id.toString(), updateData);
        setStudent(prevStudent => ({ ...prevStudent, ...updateData } as Student));
        closeModal();
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating student data:', err);
      setError('Failed to update student data');
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = async (password: any) => {
    try {
      let obj = {
        username: student?.username,
        password,
      };
      console.log('obj', obj);
      const response = await updateStudentPassword(obj);
      if (response.data) {
        toast.success('Password updated successfully');
        setPassModalVisible(false);
      }
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>No student data found</div>;

  return (
    <>
  
      <div className="mx-auto p-6 globalCardStyle">
        <div className="md:flex md:items-center lg:flex lg:items-center grid grid-col-1 gap-4 mb-6">
          <div className='flex items-center'>
          <div className="relative group">
            <img
              className="w-24 h-24 rounded-full mr-4 cursor-pointer"
              src={profileImage ? `${axios.defaults.baseURL}/${profileImage}` : defaultImage}
              alt="Profile"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-blue-500  bg-opacity-90 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:bg-blue-500 dark:bg-opacity-80">
              <svg
                onClick={triggerFileInput}
                className="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg"
              className="hidden"
            />
          </div>
          

          <div>
            <h3 className="text-xl text-graydark dark:text-slate-50 font-bold text-gray-800">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-graydark dark:text-slate-50">{student.email}</p>
            <p className="text-graydark dark:text-slate-50">
              Student ID: {student.id}
            </p>
          </div>
          </div>
          <div className="ml-auto">
            <p className="text-graydark dark:text-slate-50">
              Date of Birth: {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
            
            </p>
            <p className="text-graydark dark:text-slate-50">
              Guardian/Parent: {student.guardian || 'Not provided'}
            </p>
            <p className="text-graydark dark:text-slate-50">
              Emergency contact: {student.emergencyContact || 'Not provided'}
            </p>
            <p className="text-graydark dark:text-slate-50">
              Address: {student.address || 'Not provided'}
            </p>
          </div>
      </div>

        <div className="mt-6 md:flex md:justify-end lg:flex lg:justify-end grid grid-cols-1 gap-6">
        {/* <button
            onClick={()=>{setPassModalVisible(true)}}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Change Password
          </button> */}
          <button
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      </div>
      <AssignedTeachers />
      <div>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full mt-20 "
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md  bg-white grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-stone-950 text-sm font-bold mb-2"
                  htmlFor="gaurd"
                >
                  First Name
                </label>
                <input
                  className="shadow appearance-none border rounded text-stone-950 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={editedData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-stone-950 text-sm font-bold mb-2"
                  htmlFor="gaurd"
                >
                  Last Name
                </label>
                <input
                  className="shadow appearance-none border rounded text-stone-950 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={editedData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-stone-950 text-sm font-bold mb-2"
                  htmlFor="gaurd"
                >
                  Contact
                </label>
                <input
                  className="shadow appearance-none border rounded text-stone-950 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="contact"
                  type="text"
                  name="contact"
                  value={editedData.contact}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-stone-950 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  className="shadow appearance-none border rounded text-stone-950 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  name="address"
                  value={editedData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-stone-950 text-sm font-bold mb-2"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <input
                  className="shadow appearance-none text-stone-950 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={editedData.dateOfBirth || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-stone-950 text-sm font-bold mb-2"
                  htmlFor="gaurd"
                >
                  Guardian/Parent
                </label>
                <input
                  className="shadow appearance-none border rounded text-stone-950 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="guardian"
                  type="text"
                  name="guardian"
                  value={editedData.guardian || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-stone-950  text-sm font-bold mb-2"
                  htmlFor="emergencycontact"
                >
                  Emergency Contact
                </label>
                <input
                  className="shadow appearance-none border rounded w-full  text-stone-950 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="emergencyContact"
                  type="text"
                  name="emergencyContact"
                  value={editedData.emergencyContact || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center justify-between"></div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
             
                onClick={handleSubmit}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <ToastContainer />

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
      </div>
    </>
  );
};
