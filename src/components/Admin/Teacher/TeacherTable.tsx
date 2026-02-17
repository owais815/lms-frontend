import React, { useState, useMemo } from 'react';
import { DeleteIcon } from '../../Icons/DeleteIcon';
import { EditIcon } from '../../Icons/EditIcon';
import { DetailsIcon } from '../../Icons/DetailsIcon';
import Qualification from '../../Teacher/TeacherProfile/Qualification';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  contact: string;
  cnic: string;
  createdAt: Date;
  status: string;
}

interface TeacherTableProps {
  teachers: Teacher[];
  editModal: (id: string) => void;
  openDeleteDialog: (id: string) => void;
  passwordModal?: (id: string) => void;
  hideAddButtons?: boolean;
}

export const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  editModal,
  openDeleteDialog,
  passwordModal,
  hideAddButtons,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showQualification, setShowQualification] = useState<string | null>(null);
  const navigate = useNavigate();
  // Memoize currentTeachers to avoid recalculating on every render unless teachers or pagination changes
  const currentTeachers = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return teachers.slice(indexOfFirstItem, indexOfLastItem);
  }, [teachers, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => Math.ceil(teachers.length / itemsPerPage), [teachers.length, itemsPerPage]);

  const handleDetailsClick = (teacherId: string) => {
    setShowQualification(teacherId);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (teacherId:string) =>{
    navigate('/teacher/' + teacherId + '/teacherDetailsPage');
  }

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="tah">
          <tr>
            <th scope="col" className="p-4">First Name</th>
            <th scope="col" className="px-6 py-3">Last Name</th>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Contact</th>
            <th scope="col" className="px-6 py-3">CNIC</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentTeachers.length > 0 ? (
            currentTeachers.map((teacher,index) => (
              <tr
                onClick={() => handleRowClick(teacher.id)}
                key={teacher.id}
                className={`${index%2===0 ? 'bg-white' :' bg-gray-50'}  text-gray-700 tr`}
              >
                <td className="px-6 py-4">{teacher.firstName}</td>
                <td className="px-6 py-4">{teacher.lastName}</td>
                <td className="px-6 py-4">{teacher.username}</td>
                <td className="px-6 py-4">{teacher.email}</td>
                <td className="px-6 py-4">{teacher.contact}</td>
                <td className="px-6 py-4">{teacher.cnic}</td>
                <td className="px-6 py-4">
                <button
                    onClick={(e) => {passwordModal && passwordModal(teacher?.username);e.stopPropagation();  }}
                    className="font-medium text-black dark:text-blue-500 hover:underline mr-2"
                  >
                    <RiLockPasswordLine size={20} />  
                  </button>
                  
                  <button
                   onClick={(e) => {
                    e.stopPropagation();  // Prevents row click event
                    editModal(teacher.id);
                  }}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                  >
                    <EditIcon />
                  </button>
                  <button
                   onClick={(e) => {
                    e.stopPropagation();  // Prevents row click event
                    openDeleteDialog(teacher.id);
                  }}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    <DeleteIcon />
                  </button>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();  // Prevents row click event
                      handleDetailsClick(teacher.id);
                    }}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    <DetailsIcon />
                  </button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center">No teacher data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span>-
          <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, teachers.length)}</span> of
          <span className="font-semibold text-gray-900 dark:text-white"> {teachers.length}</span>
        </span>

        {/* Memoize pagination buttons */}
        {useMemo(() => (
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'dark:bg-gray-600 dark:border-gray-600' : ''}`}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-black dark:hover:bg-gray-600 dark:hover:border-gray-600' : ''}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-transparent hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages ? 'dark:bg-gray-600 dark:border-gray-600' : ''}`}
              >
                Next
              </button>
            </li>
          </ul>
        ), [currentPage, totalPages])}
      </nav>

      {currentTeachers.map((teacher) => (
        <div key={teacher.id}>
          {showQualification === teacher.id && (
            <Qualification teacherId={teacher.id} hideAddButtons={true} />
          )}
        </div>
      ))}
    </>
  );
};
