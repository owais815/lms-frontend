import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {   getStudentById, getStudentProfileImage, update, updateAdminPassword, uploadStudentProfileImage } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import axios from '../../../api/axios';
import defaultImage from '/images/avatar.png';
import { changeEventActions } from '../../../redux/Slices/changeEvent';
import { OpenModal } from '../../Generic/OpenModal';
import { ChangePassword } from '../../Generic/ChangePassword';
import { set } from 'lodash';

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

  const userId = useSelector((state: any) => state.auth.userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [res,setResponse] = useState<any>([]);

  const getAdminDetails = async() =>{
    try {
    //  const response = await getAdminsDetail(userId);
    //  if(response.data){
    //     setResponse(response.data.admin);
    //  }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(userId){
      getAdminDetails();
    }
  },[userId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleUpdatePassword = async(password:any) => {
    try {
      let obj = {
        username:'admin',
        password,
      };
      console.log('obj', obj);
      const response = await updateAdminPassword(obj);
      if (response.data) {
        toast.success('Password updated successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to update password');
    }
  }
  return (
    <>
    <ToastContainer />
      <div className="mx-auto p-6 globalCardStyle containerr mt-6">
        <div className="flex items-center mb-6">
          
          <div className="relative group">
            <img
              className="w-24 h-24 rounded-full mr-4 cursor-pointer"
              src={defaultImage}
              alt="Profile"
            />
          </div>
          

          <div>
            <h3 className="text-xl text-graydark dark:text-slate-50 font-bold text-gray-800">
              {res?.name}
            </h3>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
           Change Password
          </button>
        </div>
      </div>
     {isModalOpen && (
      
            <OpenModal
              title={'Change Password'}
              handleClose={() => {
                setIsModalOpen(false);
              }}
            >
              <ChangePassword
                handleUpdate={(password: any) => {
                  handleUpdatePassword(password);
                  setIsModalOpen(false);
                }}
              />
            </OpenModal>
          )}
    </>
  );
};
