import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteParent, getAllParents,  updateParent, updateParentPassword,  } from '../../../api/auth';

import { EditDialog } from './EditDialog';
import { StudentTable } from './StudentTable';
import { OpenModal } from '../../Generic/OpenModal';
import { ChangePassword } from '../../Generic/ChangePassword';
import AddParent from './AddParent';
import { ConfirmationDialog } from '../../Generic/ConfirmationDialog';

export default function Parents() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parentToDeleteId, setParentToDeleteId] = useState<string | null>(
    null,
  );
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [currentParent, setCurrentParent] = useState<{
    firstName: string;
    lastName: string;
    contact: string;
    address: string;
  } | null>(null);
  const [parents, setParents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [passModalVisible, setPassModalVisible] = useState(false);
  const [parentId,setParentId] = useState('');
  const [showAddParent,setShowAddParent] = useState(false);


  // ------ search input
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteDialog = (studentId: string) => {
    setParentToDeleteId(studentId);
    setDeleteDialogOpen(true);
  };

 

  const handleDeleteStudent = async () => {
    if (!parentToDeleteId) return;

    try {
      await deleteParent(parentToDeleteId);
      toast.success('Parent deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchParents();
    } catch (error) {
      console.error('Delete parent failed:', error);
      toast.error('Failed to delete parent record');
    } finally {
      setDeleteDialogOpen(false);
      setParentToDeleteId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParentId || !currentParent) return;

    const updatedParentData = {
      firstName: currentParent.firstName,
      lastName: currentParent.lastName,
      contact: currentParent.contact,
      address: currentParent.address,
    };
    // console.log('updatedParentData', editingParentId);
    try {
      const response = await updateParent(editingParentId, updatedParentData);
      // console.log('Student updated:', response.data);

      toast.success('Parent updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchParents();
      toggleModal(null);
    } catch (error) {
      console.error('Update student failed:', error);
    }
  };
  const fetchParents = async () => {
    try {
      const response = await getAllParents();
      debugger;
      if (typeof response.data === 'object' && response.data !== null) {
        setParents(response.data.parents);
      } else {
        setParents([]);
      }
    } catch (error) {
      console.error('Error fetching parents:', error);
      setParents([]);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);
  const toggleModal = (parentId: any) => {
    setModalVisible(!modalVisible);
    setEditingParentId(parentId);

    if (parentId && parents.find((x) => x.id === parentId)) {
      const parent = parents.filter((x: any) => x.id === parentId)[0];

      setCurrentParent({
        firstName: parent.firstName,
        lastName: parent.lastName,
        contact: parent.contact,
        address: parent.address,
      });
    } else {
      setCurrentParent(null);
    }
  };

  const handleChangePassword = async(password:any) =>{
      try{
        let obj ={
          username:parentId,
          password
        }
        console.log('obj',obj);
          const response = await updateParentPassword(obj);
          if(response.data){
              toast.success("Password updated successfully");
              setPassModalVisible(false);
          }
      }catch(error){
        toast.error("Failed to update password");
      }
  }
 // ----------search function

 const filteredParents = parents.filter((parent) => {
  const searchString = searchTerm.toLowerCase();
  return (
    parent.firstName.toLowerCase().includes(searchString) ||
    parent.lastName.toLowerCase().includes(searchString) ||
    parent.email.toLowerCase().includes(searchString) ||
    parent.username.toLowerCase().includes(searchString) ||
    parent.contact.toLowerCase().includes(searchString) ||
    parent.status.toLowerCase().includes(searchString) ||
    parent?.address?.toLowerCase().includes(searchString)
  );
});
  return (
    <div className='containerr'>
      <ToastContainer />
      <div>
        {/* <AddStudent fetchParents={fetchParents} /> */}
        <div className={`flex justify-end mb-1.5`}>
        <button
          onClick={()=>{setShowAddParent(true)}}
          className="bg-blue-500 hover:bg-blue-700  text-white py-1 px-4   rounded"
        >
          Add Parent
        </button>
      </div>
      </div>
      {
        showAddParent && (
          <OpenModal title="Add Parent"
          handleClose={()=>{setShowAddParent(false)}}

          >

            <AddParent handleClose={()=>{setShowAddParent(false);fetchParents()}} 
             
            />

          </OpenModal>
        )
      }

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
                placeholder="Search parents"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <StudentTable
            students={filteredParents}
            editModal={(id: any) => {
              toggleModal(id);
            }}
            openDeleteDialog={(id: any) => {

              openDeleteDialog(id);
            }}
            passwordModal ={(id: any) => {
              setParentId(id);
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
              currentParent={currentParent}
              setCurrentParent={(e: any, key: any) => {
                setCurrentParent((prev) => ({
                  ...prev!,
                  [key]: e.target.value,
                }));
              }}
            />
          )}


          {/* del dilogbox */}

          {deleteDialogOpen && (
            <ConfirmationDialog 
            title={"Delete Parent"}
            message={"Are you sure, you want to delete this parent?"}
            confirmText={"Delete"}
            handleConfirm={handleDeleteStudent}
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
