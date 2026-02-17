import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  deleteTeacher,
  getAllTeachers,
  updateteacher,
  updateTeacherPassword,
} from '../../../api/auth';
import { AddTeacher } from './AddTeacher';
import { DeleteDialog } from './DeleteDialog';
import { EditDialog } from './EditDialog';
import { TeacherTable } from './TeacherTable';
import SearchIcon from '../../Icons/SearchIcon';
import { OpenModal } from '../../Generic/OpenModal';
import { ChangePassword } from '../../Generic/ChangePassword';
export default function Teachers() {
  // --------------------Teacher Details------------------
  const [openModal, setOpenModal] = useState<string | null>(null);

  const [passModalVisible, setPassModalVisible] = useState(false);
  const [teacherUsername, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersResponse = await getAllTeachers();
        const teachersData = teachersResponse.data.teachers || [];
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch teachers');
      }
    };

    fetchData();
  }, []);
  const handleCloseModals = () => {
    setOpenModal(null);
  };
  // ----------------------------------

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDeleteId, setteacherToDeleteId] = useState<string | null>(
    null,
  );
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const [currentTeacher, setCurrentTeacher] = useState<{
    firstName: string;
    lastName: string;
    contact: string;
  } | null>(null);

  const [teachers, setTeachers] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // ---------Seacrch Teacher---------

  const openDeleteDialog = (teacherId: string) => {
    setteacherToDeleteId(teacherId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTeacher = async () => {
    if (!teacherToDeleteId) return;

    try {
      await deleteTeacher(teacherToDeleteId);
      toast.success('Teacher deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to delete teacher');
    } finally {
      setDeleteDialogOpen(false);
      setteacherToDeleteId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacherId || !currentTeacher) return;

    const updatedTeachersData = {
      firstName: currentTeacher.firstName,
      lastName: currentTeacher.lastName,
      contact: currentTeacher.contact,
    };
    // console.log('Teacher', editingTeacherId);
    try {
      const response = await updateteacher(
        editingTeacherId,
        updatedTeachersData,
      );
      // console.log('Teacher updated:', response.data);

      toast.success('teacher updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      fetchTeachers();
      toggleModal(null);
    } catch (error) {
      console.error('Update teacher failed:', error);
      toast.error('Failed to update teacher');
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachers();
      // console.log('Response data:', response.data);
      if (typeof response.data === 'object' && response.data !== null) {
        setTeachers(response.data.teachers);
      } else {
        console.error('Teachers data is not an object:', response.data);
        setTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
      setTeachers([]);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const toggleModal = (teacherId: any) => {
    setModalVisible(!modalVisible);
    setEditingTeacherId(teacherId);
    if (teacherId && teachers.find((x) => x.id === teacherId)) {
      const teacher = teachers.filter((x: any) => x.id === teacherId)[0];

      setCurrentTeacher({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        contact: teacher.contact,
      });
    } else {
      setCurrentTeacher(null);
    }
  };

  const handleChangePassword = async (password: any) => {
    try {
      let obj = {
        username: teacherUsername,
        password,
      };
      console.log('obj', obj);
      const response = await updateTeacherPassword(obj);
      if (response.data) {
        toast.success('Password updated successfully');
        setPassModalVisible(false);
      }
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  return (
    <div className="containerr">
      <ToastContainer />

      <div className="flex justify-end">
        <AddTeacher
          fetchTeachers={fetchTeachers}
          onModalOpen={() => setOpenModal('addTeacher')}
          onModalClose={handleCloseModals}
        />
      </div>

      {/* ---------table-------- */}

      <div className="globalCardStyle mt-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          {/* Search Box */}
          <div className="pl-10 flex items-center justify-end flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 dark:bg-gray-900">
            <div className="relative pr-10">
              {/* <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <SearchIcon />
              </div> */}
              <input
                type="text"
                id="table-search-users"
                className="sb"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search teachers..."
              />
            </div>
          </div>

          <TeacherTable
            teachers={filteredTeachers}
            editModal={toggleModal}
            openDeleteDialog={openDeleteDialog}
            passwordModal={(id: any) => {
              setUsername(id);
              setPassModalVisible(true);
            }}
          />

          {/* Modal */}
          {modalVisible && (
            <EditDialog
              toggleDialog={() => {
                setModalVisible(!modalVisible);
              }}
              handleUpdate={handleUpdate}
              currentTeacher={currentTeacher}
              setCurrentTeacher={(e: any, key: any) => {
                setCurrentTeacher((prev) => ({
                  ...prev!,
                  [key]: e.target.value,
                }));
              }}
             
            />
          )}
          {passModalVisible && (
            <OpenModal
              title={'Change Password'}
              handleClose={() => {
                setPassModalVisible(false);
              }}
            >
              <ChangePassword
                handleUpdate={(password: any) => {
                  handleChangePassword(password);
                  setPassModalVisible(false);
                }}
              />
            </OpenModal>
          )}
          {/* del dilogbox */}

          {deleteDialogOpen && (
            <DeleteDialog
              handleDeleteTeacher={handleDeleteTeacher}
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
