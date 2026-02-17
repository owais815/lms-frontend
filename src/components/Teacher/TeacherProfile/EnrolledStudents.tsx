import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAssignedStudents } from '../../../api/auth';
import { GetUserImage } from '../../Generic/GetUserImage';
import { useNavigate } from 'react-router-dom';
import { EmptyTemplate } from '../../Generic/EmptyTemplate';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  guardian: string | null;
  profileImg?:any;
  courses?:any;
}

interface EnrolledStudentsProps {
  onStudentsLoaded?: (count: number) => void;
  searchTerm?: string;
  teachId?:string;
}

const StudentCard: React.FC<any> = ({ id, firstName, lastName, guardian,profileImg,courses,nameForTeacher }) => {
  const navigate = useNavigate();
  const userType = useSelector((state: any) => state.auth.userType);
  
  const handleRowClick = (studentId:any) =>{
    if(userType=='admin'){
    navigate('/teacher/' + studentId + '/studentProgress');
    }else{
    navigate('/mystudents/' + studentId + '/progress');
    }
  }

  return (
    <div className="globalCardStyle w-64 overflow-hidden p-6 cursor-pointer" onClick={()=>{handleRowClick(id)}}>
      <div className="flex items-center mb-4 ">
        {/* <img 
          className="w-14 h-14 rounded-full mr-4" 
          src="https://bootdey.com/img/Content/avatar/avatar1.png" 
          alt={`${firstName} ${lastName}`} 
        /> */}
        <GetUserImage 
          userId={id}
          userType={"student"}
          imageUrl={profileImg ? profileImg :undefined}
          classes={'w-14 h-14 rounded-full mr-4'}
        />
        
        <div>
          <h2 className="text-xl font-bold">{nameForTeacher ? nameForTeacher : `${firstName } ${lastName}`} </h2>
          {guardian && (
          <p className="text-gray-600">Gaurdian Name: {guardian}</p>
        )}
          {courses && (
            <div className='mt-2'>
            {courses.map((course: any) => (
            <p className=" bg-blue-400 dark:bg-blue-800  mb-1 border-1 text-sm border-gray px-1  text-center rounded text-lg font-semibold text-white">{course.Course?.courseName} </p>
            ))}
            </div>
          )}
          {/* <p className="text-gray-600">ID: {id}</p> */}
        </div>
      </div>

      
      
      {/* <div className="mb-4">
        <p className="text-lg font-semibold">GPA: {gpa}</p>
        <p className="text-lg">Attendance: {attendance}%</p>
      </div> */}
      
      {/* <div className="flex justify-between text-center">
        <div>
          <p className="text-3xl font-bold text-blue-500">{avgGrade}</p>
          <p className="text-sm text-gray-600">Avg. Grade</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-500">{assignmentsDue}</p>
          <p className="text-sm text-gray-600">Assignments Due</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-500">{extracurriculars}</p>
          <p className="text-sm text-gray-600">Extracurriculars</p>
        </div>
      </div> */}
    </div>
  );
};

export const EnrolledStudents: React.FC<EnrolledStudentsProps> = ({ onStudentsLoaded, searchTerm, teachId }) => {
  const [students, setStudents] = useState<any>([]);
  const [userId,setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const userIdd = useSelector((state: any) => state.auth.userId);

    useEffect(() => {
      if (teachId) {
        setUserId(teachId);
      } else {
        setUserId(userIdd);
      }
    }, [userId, teachId]);

  useEffect(() => {
    fetchEnrolledStudents();
  }, [userId]);

  const fetchEnrolledStudents = async () => {
    try {
      setIsLoading(true);
      const response = await getAssignedStudents(userId);
      console.log("enrolled student:::",response.data);
      if (response.data && response.data.students) {
        setStudents(response.data.students);
        if(onStudentsLoaded){
          onStudentsLoaded(response.data.students.length);
        }
      }
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const filteredStudents = students.filter(student =>
  //   `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (isLoading) {
    return <div>Loading enrolled students...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {students.length > 0 ? (
        <>
        {students.map((student:any) => (
        <StudentCard key={student.id} {...student} />
      ))}
        </>
      ):(
        <>
        <div></div>
        <div className='globalCardStyle  containerr mt-6  '>
        <EmptyTemplate
        heading={"No enrolled students"}
        description={"No enrolled students found"}
        />
        </div>
        </>
      )}
      
    </div>
  );
};