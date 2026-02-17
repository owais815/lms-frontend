import React, { useState, useMemo } from 'react';
import { DeleteIcon } from '../../Icons/DeleteIcon';
import { EditIcon } from '../../Icons/EditIcon';

interface Course {
  id: string;
  courseName: string;
  duration: string;
  description: string;
  teacherId: string;
  studentId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface CourseTableProps {
  courses: Course[];
  students?: User[];
  teachers?: User[];
  editModal: (id: string) => void;
  openDeleteDialog: (id: string) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({ courses, students, teachers, editModal, openDeleteDialog }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Memoize the paginated courses
  const currentCourses = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return courses?.slice(indexOfFirstItem, indexOfLastItem);
  }, [courses, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => Math.ceil(courses?.length / itemsPerPage), [courses?.length, itemsPerPage]);

  // Memoize the getFullName function
  const getFullName = useMemo(() => (id: string, users: User[]) => {
    // console.log("users::::",users,id,courses)
    const user = users.find((user:any) => user.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Memoize pagination buttons
  const paginationButtons = useMemo(() => (
    [...Array(totalPages)].map((_, index) => (
      <li key={index}>
        <button
          onClick={() => handlePageChange(index + 1)}
          className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
            currentPage === index + 1 ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-black dark:hover:bg-gray-600 dark:hover:border-gray-600' : ''
          }`}
        >
          {index + 1}
        </button>
      </li>
    ))
  ), [totalPages, currentPage]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="tah">
          <tr>
            <th scope="col" className="px-6 py-3">Course Name</th>
            <th scope="col" className="px-6 py-3">Duration</th>  
           {(teachers && students) && (
            <>
            <th scope="col" className="px-6 py-3">Teacher Name</th>
            <th scope="col" className="px-6 py-3">Student Name</th>
            </>
           )}
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.length > 0 ? (
            currentCourses.map((course:any,index) => (
              <tr key={course.id} className={`${index%2===0 ? 'bg-white' :' bg-gray-50'}  text-gray-700 tr`}>
                <td className="px-6 py-4">{course?.Course?.courseName}</td>
                <td className="px-6 py-4">{course?.Course?.duration} months</td>
               {(teachers && students) && (
                <>
                <td className="px-6 py-4">{getFullName(course.teacherId, teachers)}</td>
                <td className="px-6 py-4">{getFullName(course.studentId, students)}</td>
                </>
              )
              }
                <td className="px-6 py-4" title={course?.Course?.description}>
                  {course?.Course?.description?.length > 20 ? `${course?.Course?.description.slice(0, 20)}...` : course?.Course?.description}
                </td>
                <td className="px-6 py-4">
                  {/* <button onClick={() => editModal(course.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2">
                    <EditIcon />
                  </button> */}
                  <button onClick={() => openDeleteDialog(course.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center">No course data available</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, courses.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{courses.length}</span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === 1 ? 'dark:bg-gray-600 dark:border-gray-600' : ''
              }`}
            >
              Previous
            </button>
          </li>
          {paginationButtons}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === totalPages ? 'dark:bg-gray-600 dark:border-gray-600' : ''
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
