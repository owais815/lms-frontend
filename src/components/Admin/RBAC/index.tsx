import { useState } from 'react';
import { AddUser } from './AddUser';
import AddRole from './AddRoles';
import AssignRightsToRole from './AssignRightsToRoles';
import AddRights from './AddRights';


export const RBAC = () => {
  const [activeTab, setActiveTab] = useState('own');
  const [mainTab, setMainTab] = useState('addUser');
  const [activeTab1, setActiveTab1] = useState('dataentry');

  // const [tableData, setTableData] = useState(data);

  const handleSubmit = () => {};
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black containerr">
      {/* <h3 className="text-2xl font-bold">Weaving/Circular Loom Department </h3> */}
      
      <div className=" flex justify-around bg-white text-white py-4 mx-8 rounded-lg mt-6">
      <button
          className={`px-4 text-zinc-600 py-2 ${
            mainTab === 'addUser'
              ? 'border-b-8 rounded-b-xl border-blue-500'
              : ''
          }`}
          onClick={() => setMainTab('addUser')}
        >
          Add New Users <span className='text-sm'>(Administration)</span>
        </button>

        <button
          className={`px-4 text-zinc-600 py-2 ${
            mainTab === 'roles'
              ? 'border-b-8 rounded-b-xl border-blue-500'
              : ''
          }`}
          onClick={() => setMainTab('roles')}
        >
          Add Roles
        </button>
       
        <button
          className={`px-4 text-zinc-600 py-2 ${
            mainTab === 'artr'
              ? 'border-b-8 rounded-b-xl border-blue-500'
              : ''
          }`}
          onClick={() => setMainTab('artr')}
        >
          Assign Rights To Roles
        </button>
      </div>

      {mainTab=='addUser' && <AddUser />}
      {mainTab=='roles' && <AddRole />}
      {mainTab=='artr' && <AssignRightsToRole />}




      {/* {mainTab=='roles' && activeTab == 'outside' && <OutsideDepartment />}
      {mainTab=='roles' && activeTab == 'own' && <InsideDepartment />}
      {mainTab=='addUser' && activeTab1 == 'dataentry' && <DataEntry />}
      {mainTab=='addUser' && activeTab1 == 'extrawork' && <ExtraWorkOnLoom />} */}


    </div>
  );
};
