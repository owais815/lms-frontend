import React, { useState, useMemo } from 'react';
import { DeleteIcon } from '../../Icons/DeleteIcon';
import { EditIcon } from '../../Icons/EditIcon';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordFill, RiLockPasswordLine } from 'react-icons/ri';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  contact: string;
  address: string;
  createdAt: Date;
  status: string;
}

interface StudentTableProps {
  students: Student[];
  editModal: (id: string) => void;
  passwordModal?: (id: string) => void;
  openDeleteDialog: (id: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  editModal,
  passwordModal,
  openDeleteDialog,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Memoizing the current students list
  const currentStudents = useMemo(() => {
    return students.slice(indexOfFirstItem, indexOfLastItem);
  }, [students, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(students.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (studentId:string) =>{
    navigate('/student/' + studentId + '/progress');
  }

  return (
    <div className=" relative  overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full  text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
        <thead className="tah ">
          <tr >
            <th scope="col" className="px-6 py-3">First Name</th>
            <th scope="col" className="px-6 py-3">Last Name</th>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Contact</th>
            <th scope="col" className="px-6 py-3">Enrollment Date</th>
            <th scope="col" className="px-6 py-3">Address</th>
            <th scope="col" className="px-6 py-3">Country</th>
            <th scope="col" className="px-6 py-3">City</th>
            <th scope="col" className="px-6 py-3">State</th>
            <th scope="col" className="px-6 py-3">Flexible Hours</th>
            <th scope="col" className="px-6 py-3">Name For Teacher</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((student:any,index) => (
              <tr
                key={student.id}
                onClick={() => handleRowClick(student.id)}
                className={`${index%2===0 ? 'bg-white' :' bg-gray-50'}  text-gray-700 tr`}
              >
                <td className="px-6 py-4">{student.firstName}</td>
                <td className="px-6 py-4">{student.lastName}</td>
                <td className="px-6 py-4">{student.username}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{student.contact}</td>
                <td className="px-6 py-4">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4" title={student?.address}>
                  {student?.address?.length > 20
                    ? `${student?.address?.slice(0, 20)}...`
                    : student?.address}
                </td>
                <td className="px-6 py-4">{student?.country}</td>
                <td className="px-6 py-4">{student?.city}</td>
                <td className="px-6 py-4">{student?.state}</td>
                <td className="px-6 py-4">{student?.flexibleHours}</td>
                <td className="px-6 py-4">{student?.nameForTeacher}</td>


                <td className="">
                  
                <button
                    title='Change Password'
                    onClick={(e) => {passwordModal && passwordModal(student?.username);e.stopPropagation();  }}
                    className="font-medium text-black dark:text-blue-500 hover:underline mr-2"
                  >
                    <RiLockPasswordLine size={20} />  
                  </button>
                  <button
                    title='Edit'
                    onClick={(e) => {editModal(student.id);e.stopPropagation();  }}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                  >
                    <EditIcon />  
                  </button>
                  <button
                    title='Delete'
                    onClick={(e) => {openDeleteDialog(student.id);e.stopPropagation();  }}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center">
                No student data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, students.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {students.length}
          </span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === 1
                  ? 'dark:bg-gray-600 dark:border-gray-600'
                  : ''
              }`}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                  currentPage === index + 1
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-black dark:hover:bg-gray-600 dark:hover:border-gray-600'
                    : ''
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === totalPages
                  ? 'dark:bg-gray-600 dark:border-gray-600'
                  : ''
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
