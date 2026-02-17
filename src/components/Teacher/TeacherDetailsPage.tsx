import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AssignTeacher from '../Admin/AssignTeacher/AssignTeacher';
import { AddQualification } from '../Admin/Teacher/AddQualification';
import { AddSpecialization } from '../Admin/Teacher/AddSpecialization';
import TeacherProfile from './TeacherProfile/TeacherProfile';
import { UpcomingClasses } from './UpcomingClasses';


export const TeacherDetailsPage: React.FC<any> = () => {

  const navigate = useNavigate();
  const { teacherId } = useParams<{ teacherId: any }>();

  return (
    <>
    <div className='mt-6 containerr'>
      <TeacherProfile teacherId={teacherId} />
      </div>
      <div className="bg-white dark:bg-black shadow-lg containerr rounded-lg ">
        <UpcomingClasses teacherId={teacherId} />
      </div>
    <div>
      <AssignTeacher teacherId={teacherId} />
      </div>
      <div>
        <AddQualification teacherId={teacherId} />
      </div>
      <div>
        <AddSpecialization teacherId={teacherId} />
      </div>
     
    </>
  );
};
