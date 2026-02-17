import React, { useEffect, useState } from 'react';
import { getAllStudents, getAllTeachers, getCourses, assignCourse, assignTeacher } from '../../../api/auth';
import { toast } from 'react-toastify';
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
export const AssignCourse = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<any>('');

  const [courseName, setcourseName] = useState('');
  const [duration, setduration] = useState('');
  const [description, setdescription] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
     
        const teachersResponse = await getAllTeachers();
        const studentsResponse = await getAllStudents();
        const courseResponse = await getCourses();

        // Extract the arrays from the nested structure
        const teachersData = teachersResponse.data.teachers || [];
        const studentsData = studentsResponse.data.students || [];
        const coursesData = courseResponse.data.courses || [];
        setCourses(coursesData);
        setTeachers(teachersData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {

      }
    };

    fetchData();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let obj = {
  courseId: selectedCourse,
  teacherId: selectedTeacher,
  studentId: selectedStudent
      
    };
    try {
      // console.log('obj', obj);
      const response = await assignCourse(obj);
      if(response){
        try {
          await assignTeacher({
            teacherId: selectedTeacher,
            studentId: selectedStudent
          });
          toast.success('Teacher assigned successfully!');
          setSelectedTeacher('');
          setSelectedStudent('');
          setIsOpen(false);
        } catch (error) {
          console.error('Error assigning teacher:', error);
          toast.info('Teacher already assigned.');
        }
      }
      // console.log('Courses added:', response.data);

      toast.success('Courses added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      props.fetchCourses();
      handleClose();
    } catch (error) {
      console.error('add Course failed:', error);
      toast.error('Courses already exist!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <div>
      <div className={`${isOpen ? 'hidden' : ''} flex justify-end mb-1.5`}>
        <button
          onClick={handleOpen}
         className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
        >
          Assign Course
        </button>
       
      </div>

      {isOpen && (
        <div
        className="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500">
            <div className="relative bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full p-6 border">
            <div className="flex">
              <h3 className="text-lg font-bold mb-4 text-center">
                Course Information
              </h3>

              <button
                onClick={handleClose}
                type="button"
                className="absolute  top-3 right-2.5 text-gray-400 bg-transparent  hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  dark:hover:text-white"
                data-modal-hide="editUserModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 ">
              <div className="mb-5">
                  <label style={{textAlign:'left'}} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select Course:
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course:any) => (
                        <option key={course.id} value={course.id}>
                          {`${course.courseName} (${course.duration} months)`}
                        </option>
                      ))}
                    </select>
                 
                </div>
               
              </div>
              <div className="grid grid-cols-1 ">
              <div className="mb-5">
                  <label style={{textAlign:'left'}} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select Student:
                  </label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id.toString()}>
                          {`${student.firstName} ${student.lastName}`}
                        </option>
                      ))}
                    </select>
                </div>
                </div>

              <div className="grid grid-cols-1 ">
               

                <div className="mb-5">
                  <label style={{textAlign:'left'}} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select Teacher:
                    </label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    >
                      <option value="">Select a teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id.toString()}>
                          {`${teacher.firstName} ${teacher.lastName}`}
                        </option>
                      ))}
                    </select>
               
                </div>
              </div>

             

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
        </div>
      )}
    </div>
  );
};
