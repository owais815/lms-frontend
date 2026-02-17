import { useEffect, useMemo, useState } from "react";
import { createAdmin, deleteAdmin, getAllAdminUsers, getRoles, updateAdmin } from "../../../api/auth";
import { TableComponent } from "../../Generic/TableComponent";
import { toast, ToastContainer } from "react-toastify";
import { DeleteDialog } from "../Student/DeleteDialog";

export const AddUser = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [roles,setRoles] = useState([]);
  const [users,setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId,setUserId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(()=>{
    fetchRole();
    fetchUsers();
  },[]);
  const fetchRole= async () => {
      try {
        const rolesResponse = await getRoles();
        debugger;
        setRoles(rolesResponse.data.role);
      } catch (error) {
        console.error('Error fetching roles and rights:', error);
      }
    };
    const fetchUsers= async () => {
      try {
        const response = await getAllAdminUsers();
        debugger;
        if(response.data){
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching roles and rights:', error);
      }
    };
    
  const handleSubmit = async() => {
    let obj ={
      name,
      username,
      password,
      role:selectedRole
    }
    if(isEditMode){
      try {
        const response = await updateAdmin(obj,userId);
        if(response.data){
          fetchUsers();
          clearFields();
          toast.success("User updated successfully");
        }
        
      } catch (error) {
        toast.error("Error updating User");
  
        console.error('Error updating User', error);
      }
    }else{
      try {
        const response = await createAdmin(obj);
        if(response.data){
          fetchUsers();
          clearFields();
          toast.success("User created successfully");
        }
        
      } catch (error) {
        toast.error("Error creating User");
  
        console.error('Error creating User', error);
      }
    }
    
  };

  const onEditUser = (id:any) =>{
    const user:any = users.find((user: any) => user.id === id);
    if(user){
      debugger;
      setIsEditMode(true);
      setName(user.name);
      setUsername(user.username);
      setPassword(user.password);
      setSelectedRole(user.roleId);
    }
   
  }

  const handleDeleteUser = async () => {
      if (!userId) return;
  
      try {
        await deleteAdmin(userId);
        toast.success('User deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchUsers();
        clearFields();
      } catch (error) {
        console.error('Delete user failed:', error);
        toast.error('Failed to delete user');
        clearFields();
      } finally {
        setDeleteDialogOpen(false);
        clearFields();
       
      }
    };

  const clearFields = () =>{
    setName('');
    setUsername('');
    setPassword('');
    setSelectedRole('');
    setIsEditMode(false);
    setUserId('');
    setDeleteDialogOpen(false);
  }
  return (
    <div>
      <ToastContainer />
      <div className=" inset-0 h-full  ">
        <div className="relative   p-5   globalCardStyle mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-col-12 gap-4">
              <div className="mb-5">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(text: any) => {
                    setName(text.target.value);
                  }}
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:bg-slate-800"
                  placeholder="Enter Name"
                  required
                />
              </div>

              <div>
                <div className="mb-5">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(text: any) => {
                      setUsername(text.target.value);
                    }}
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block focus:ring-blue-500 focus:border-blue-500 focus:outline-none  w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(text: any) => {
                    setPassword(text.target.value);
                  }}
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none   block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800 "
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>


            <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select a role</option>
            {roles.map((role:any) => (
              <option key={role.id} value={role.id}>
                {role?.role}
              </option>
            ))}
          </select>
        </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isEditMode ? 'Update' : 'Add'}
              </button>
            </div>
        </div>
      </div>
      <div className='mt-6'>
            <TableComponent
              headings={['Name','Username','Role', 'Action']}
              tableData={users}
              dataKeys={['name','username','Role.role']}
              editModal={(id: any) => {
                setUserId(id);
                onEditUser(id);
              }}
              openDeleteDialog={(id: any) => {
                   setUserId(id);
                   setDeleteDialogOpen(true);
              }}
            />
            </div>
            {deleteDialogOpen && (
                    <DeleteDialog
                      itemType="user"
                      handleDelete={handleDeleteUser}
                      closeDialog={() => setDeleteDialogOpen(false)}
                    />
                  )}
    </div>
  );
};
