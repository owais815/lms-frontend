import React, { useState, useEffect } from 'react';
import { getRoles, getRightsByRole, assignRightsToRole } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';

let rightsTabs = [
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

const AssignRightsToRole = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedRights, setSelectedRights] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchRights(selectedRole);
    }
  }, [selectedRole]);

  const fetchRoles = async () => {
    try {
      const rolesResponse = await getRoles();
      setRoles(rolesResponse.data.role);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchRights = async (roleId: string) => {
    try {
      const rightsResponse = await getRightsByRole(roleId);
      const assignedRights = rightsResponse.data.map((r: any) => r.rights);
      setSelectedRights(assignedRights);
    } catch (error) {
      console.error('Error fetching assigned rights:', error);
    }
  };

  const handleRightChange = (val: string, checked: boolean) => {
    setSelectedRights((prevRights) =>
      checked ? [...prevRights, val] : prevRights.filter((r) => r !== val)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignRightsToRole(selectedRole, selectedRights);
      toast.success('Rights assigned successfully!');
    } catch (error) {
      console.error('Error assigning rights:', error);
      toast.error('Failed to assign rights.');
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Assign Rights to Role</h2>
      <form onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role}
              </option>
            ))}
          </select>
        </div>

        {/* Rights Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Rights</label>
          {rightsTabs.map((right) => (
            <div key={right.val} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={right.val}
                checked={selectedRights.includes(right.val)}
                onChange={(e) => handleRightChange(right.val, e.target.checked)}
                className="mr-2"
              />
              <span>{right.name}</span>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Assign Rights
        </button>
      </form>
    </div>
  );
};

export default AssignRightsToRole;
