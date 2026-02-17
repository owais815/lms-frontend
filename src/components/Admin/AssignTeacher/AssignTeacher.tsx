import React, { useState, useEffect, useMemo } from 'react';
import { getAllStudents, getAllTeachers, assignTeacher } from '../../../api/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trasnsation } from './Trasnsation';

// Define types
type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
};

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
};

const AssignTeacher = (props:any) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const teachersResponse = await getAllTeachers();
        const studentsResponse = await getAllStudents();

        // Extract the arrays from the nested structure
        const teachersData = teachersResponse.data.teachers || [];
        const studentsData = studentsResponse.data.students || [];

        setTeachers(teachersData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((selectedTeacher || props?.teacherId) && selectedStudent) {
      setIsOpen(true);
    }
  };

  const confirmAssignment = async () => {
    try {
      await assignTeacher({
        teacherId: props?.teacherId ? props?.teacherId : selectedTeacher,
        studentId: selectedStudent
      });
      toast.success('Teacher assigned successfully!');
      setSelectedTeacher('');
      setSelectedStudent('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error assigning teacher:', error);
      toast.error('Failed to assign teacher. Teacher already assigned.');
    }
  };


  const getTeacherName = useMemo(() => (id: string) => {
    const teacher = teachers.find(t => t.id.toString() === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
  }, [teachers]);

  const getStudentName = useMemo(() => (id: string) => {
    const student = students.find(s => s.id.toString() === id);
    return student ? `${student.firstName} ${student.lastName}` : '';
  }, [students]);

  const teacherOptions = useMemo(() => (
    teachers.map(teacher => (
      <option key={teacher.id} value={teacher.id.toString()}>
        {`${teacher.firstName} ${teacher.lastName}`}
      </option>
    ))
  ), [teachers]);

  const studentOptions = useMemo(() => (
    students.map(student => (
      <option key={student.id} value={student.id.toString()}>
        {`${student.firstName} ${student.lastName}`}
      </option>
    ))
  ), [students]);


  if (error) return <div>Error: {error}</div>;

  return (
    <div className="globalCardStyle p-4 mt-6 containerr">

      <h1 className="ch">Assign Teacher to Student</h1>
      
      <form onSubmit={handleSubmit} className="my-6">
        {props?.teacherId ? <> </> : 
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Teacher:
            <select 
              value={selectedTeacher} 
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
            >
              <option value="">Select a teacher</option>
              {teacherOptions}
            </select>
          </label>
        </div>
        }
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Student:
            <select 
              value={selectedStudent} 
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
            >
              <option value="">Select a student</option>
              {studentOptions}
            </select>
          </label>
        </div>
        
        <button type="submit" className="bg-blue-500 w-full mt-3 text-white px-4 py-2 rounded">
          Assign
        </button>
      </form>

      <Trasnsation 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        getTeacherName={getTeacherName}
        getStudentName={getStudentName}
        selectedTeacher={selectedTeacher}
        selectedStudent={selectedStudent}
        confirmAssignment={confirmAssignment}
      />

      <ToastContainer />
    </div>
  );
};

export default AssignTeacher;
