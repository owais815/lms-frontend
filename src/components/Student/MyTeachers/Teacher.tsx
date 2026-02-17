import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAssignedStudents, getAssignedTeachers } from '../../../api/auth';
import axios from '../../../api/axios';
import { Link, useNavigate } from 'react-router-dom';





const Card = (props:any) => {
    const navigate = useNavigate();
  return (
    <div onClick={()=>{navigate(`/studentprofile/teacherprofile/${props.id}`) }} className="  max-w-sm roverflow-hidden  globalCardStyle p-6 cursor-pointer ">
      <div className="flex items-center mb-4">
       {props.imageUrl ? 
        <img 
        className="w-14 h-14 rounded-full mr-4" 
        src={`${axios.defaults.baseURL}/${props.imageUrl}`} 
        alt={`${props.username}`}
      />

      :
      <img 
      className="w-14 h-14 rounded-full mr-4" 
      src="https://bootdey.com/img/Content/avatar/avatar1.png" 
      alt={`https://bootdey.com/img/Content/avatar/avatar1.png`} 
    />
    }
       
        <div>
          <h2 className="text-xl font-bold">{`${props.firstName} ${props?.lastName}`}</h2>
          <p className="text-gray-600">{props.contact}</p>
          <p className="text-gray-600">{props.email}</p>
          <p className="text-gray-600">{props.cnic}</p>
          {/* <p className="text-gray-600">ID: {id}</p> */}
        </div>
      </div>
    </div>
  );
};

export const AssignedTeachers: React.FC<any> = ({ searchTerm }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    fetchAssignedTeachers();
  }, [userId]);

  const fetchAssignedTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await getAssignedTeachers(userId);
      // console.log("fetched response is::",response);
      if (response.data && response.data.teachers) {
        setTeachers(response.data.teachers);
      }
    } catch (error) {
      console.error('Error fetching enrolled teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return <div>Loading enrolled teachers...</div>;
  }

  return (
    <div className=" mt-10">
        <h1 className="MainHeadings mb-6">
        Teachers Overview
      </h1>
      <div className='md:flex md:items-center md:justify-start lg:flex lg:items-center lg:justify-start grid grid-cols-1 gap-4'>
      {teachers.map((teacher) => (
        <Card key={teacher.id} {...teacher} />
      ))}
      </div>
    </div>
  );
};