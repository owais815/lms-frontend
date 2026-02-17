import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteStudent, update, updateStudentPassword } from '../../../api/auth';
import { getAllStudents } from '../../../api/auth';
import AddStudent from './AddStudent';
import SearchIcon from '../../Icons/SearchIcon';
import { DeleteDialog } from './DeleteDialog';
import { EditDialog } from './EditDialog';
import { StudentTable } from './StudentTable';
import { set } from 'lodash';
import { OpenModal } from '../../Generic/OpenModal';
import { ChangePassword } from '../../Generic/ChangePassword';

export default function Students() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(
    null,
  );
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [passModalVisible, setPassModalVisible] = useState(false);
  const [stdId,setStdId] = useState('');


  // ------ search input
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteDialog = (studentId: string) => {
    setStudentToDeleteId(studentId);
    setDeleteDialogOpen(true);
  };

  // ----------search function

  const filteredStudents = students.filter((student) => {
    const searchString = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchString) ||
      student.lastName.toLowerCase().includes(searchString) ||
      student.email.toLowerCase().includes(searchString) ||
      student.username.toLowerCase().includes(searchString) ||
      student.contact.toLowerCase().includes(searchString) ||
      student.status.toLowerCase().includes(searchString) ||
      student?.address?.toLowerCase().includes(searchString)
    );
  });

  const handleDeleteStudent = async () => {
    if (!studentToDeleteId) return;

    try {
      await deleteStudent(studentToDeleteId);
      toast.success('Student deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchStudents();
    } catch (error) {
      console.error('Delete student failed:', error);
      toast.error('Failed to delete student');
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDeleteId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId || !currentStudent) return;

    const updatedStudentData = {
      firstName: currentStudent.firstName,
      lastName: currentStudent.lastName,
      contact: currentStudent.contact,
      address: currentStudent.address,
      countryName:currentStudent.country,
      state:currentStudent.state,
      city:currentStudent.city,
      timeZone:currentStudent.timeZone,
      flexibleHours:currentStudent.flexibleHours,
      suitableHours:currentStudent.suitableHours
    };
    // console.log('updatedStudentData', editingStudentId);
    try {
      const response = await update(editingStudentId, updatedStudentData);
      // console.log('Student updated:', response.data);

      toast.success('Student updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchStudents();
      toggleModal(null);
    } catch (error) {
      console.error('Update student failed:', error);
      toast.error('Failed to update student');
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();

      if (typeof response.data === 'object' && response.data !== null) {
        setStudents(response.data.students);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  const toggleModal = (studentId: any) => {
    setModalVisible(!modalVisible);
    setEditingStudentId(studentId);

    if (studentId && students.find((x) => x.id === studentId)) {
      const student = students.filter((x: any) => x.id === studentId)[0];

      setCurrentStudent({
        firstName: student.firstName,
        lastName: student.lastName,
        contact: student.contact,
        address: student.address,
        username:student.username,
        email:student.email,
        country:student.country,
        state:student.state,
        city:student.city,
        timeZone:student.timeZone,
        flexibleHours:student.flexibleHours,
        suitableHours:student.suitableHours

      });
    } else {
      setCurrentStudent(null);
    }
  };

  const handleChangePassword = async(password:any) =>{
      try{
        let obj ={
          username:stdId,
          password
        }
        console.log('obj',obj);
          const response = await updateStudentPassword(obj);
          if(response.data){
              toast.success("Password updated successfully");
              setPassModalVisible(false);
          }
      }catch(error){
        toast.error("Failed to update password");
      }
  }

  return (
    <div className='containerr'>
      <ToastContainer />
      <div>
        <AddStudent fetchStudents={fetchStudents} />
      </div>

      {/* --------Table---------- */}

      <div className=" globalCardStyle  mt-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          {/* Search Box */}
          <div className="pl-10 flex items-center justify-end flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 dark:bg-gray-900">
            <div className="relative pr-10 gap-4">
              {/* <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-2 pointer-events-none">
                <SearchIcon />
              </div> */}
              <input
                type="text"
                id="table-search-users"
                className="sb ml-2 "
                placeholder="Search students"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <StudentTable
            students={filteredStudents}
            editModal={(id: any) => {
              toggleModal(id);
            }}
            openDeleteDialog={(id: any) => {
              openDeleteDialog(id);
            }}
            passwordModal ={(id: any) => {
              setStdId(id);
              setPassModalVisible(true);
            }}
          />

        {passModalVisible && (
            <OpenModal 
              title={"Change Password"}
              handleClose={() => {
                setPassModalVisible(false);
              }}
            >
              <ChangePassword handleUpdate={(password:any)=>{
               handleChangePassword(password);
                setPassModalVisible(false);
              }} />
          </OpenModal>
        )}


          {/* Modal */}
          {modalVisible && (
            <EditDialog
              toggleDialog={() => {
                setModalVisible(!modalVisible);
              }}
              handleUpdate={handleUpdate}
              currentStudent={currentStudent}
              setCurrentStudent={(e: any, key: any) => {
                setCurrentStudent((prev:any) => ({
                  ...prev!,
                  [key]: e.target.value,
                }));
              }}
            />
          )}


          {/* del dilogbox */}

          {deleteDialogOpen && (
            <DeleteDialog
            handleDelete={handleDeleteStudent}
              closeDialog={() => {
                setDeleteDialogOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
