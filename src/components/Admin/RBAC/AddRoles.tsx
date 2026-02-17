import React, { useEffect, useState } from 'react';
import { createRole, getRoles, updateRole } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import { TableComponent } from '../../Generic/TableComponent';

const AddRole = () => {
  const [roleName, setRoleName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState<any>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    getAllRoles();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isEditMode) {
      try {
        await updateRole({ role: roleName }, roleId);
        toast.success('Role updated successfully!');
        clearFields();
        getAllRoles();
      } catch (error) {
        console.error('Error creating role:', error);
        toast.error('Failed to update role.');
        clearFields();
      }
    } else {
      try {
        await createRole({ role: roleName });
        toast.success('Role created successfully!');
        clearFields();
        getAllRoles();
      } catch (error) {
        console.error('Error creating role:', error);
        toast.error('Failed to create role.');
        clearFields();
      }
    }
  };
  const getAllRoles = async () => {
    try {
      const response = await getRoles();
      debugger;
      if (response.data.role) {
        setRoles(response.data.role);
      }
    } catch (e) {}
  };

  const clearFields = () => {
    setRoleName('');
    setIsEditMode(false);
    setRoleId('');
  };
  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Add Role</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditMode ? 'Update' : 'Add'} Role
        </button>
      </form>
      {/* Table Section */}
      {/* table  */}
      <div className='mt-6'>
      <TableComponent
        headings={['Role Name', 'Action']}
        tableData={roles}
        dataKeys={['role']}
        editModal={(id: any) => {
          setRoleId(id);
          //    toggleModal(id);
          let name = roles.find((x: any) => x.id === id)?.role;
          setRoleName(name);
          setIsEditMode(true);
        }}
        openDeleteDialog={(id: any) => {
          //    openDeleteDialog(id);
        }}
      />
      </div>
    </div>
  );
};

export default AddRole;
