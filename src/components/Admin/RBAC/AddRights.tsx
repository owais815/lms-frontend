import React, { useState, useEffect } from 'react';
import { getRoles, getRights, assignRightsToRole, addRight } from '../../../api/auth';

let rights_tabs = [
  {name:'Dashboard',val:'dashboard'},
  {name:'Group Chat',val:'group_chat'},
  {name:'Chats',val:'chats'},
  {name:'Students',val:'students'},
  {name:'Teachers',val:'teachers'},
  {name:'Courses',val:'courses'},
  {name:'Assign Teacher',val:'assign_teacher'},
  {name:'Schedule Class',val:'schedule_class'},
  {name:'Upload Resources',val:'upload_resources'},
  {name:'Feedback',val:'feedback'},
  {name:'Makeup Class',val:'makeup_class'},
  {name:'Enrollments',val:'enrollments'},
  {name:'Student Plan',val:'student_plan'},
  {name:'Change Plan',val:'change_plan'},
  {name:'Fee Management',val:'fee_management'},
  {name:'Create Blog',val:'create_blog'},
  {name:'Blogs',val:'blogs'},
  {name:'Announcements',val:'announcements'},
  {name:'Support System',val:'support_system'},
  {name:'Parents',val:'parents'},
  {name:'RBAC',val:'rbac'}
];
const AddRights = () => {
  const [rights, setRights] = useState(rights_tabs);
  const [fetchedRights,setFetchedRights] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedRights, setSelectedRights] = useState<any>([]);

  useEffect(() => {
    fetchRights();
  }, []);

  const fetchRights = async () => {
    try {
      const rightsResponse = await getRights();
      //   debugger;
      setFetchedRights(rightsResponse.data);
    } catch (error) {
      console.error('Error fetching rights and rights:', error);
    }
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addRight(selectedTab);
      alert('Rights assigned successfully!');
    } catch (error) {
      console.error('Error assigning rights:', error);
      alert('Failed to assign rights.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Add Rights</h2>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Tab</label>
          <select
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select a tab</option>
            {rights.map((role: any) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div> */}
       
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Right
        </button>
      </form>

        <div className='grid grid-cols-3'>
            {rights.map((right: any) => (
                <p>{right.name}</p>
            ))}
        </div>
    </div>
  );
};

export default AddRights;
