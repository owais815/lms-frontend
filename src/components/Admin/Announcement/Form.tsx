import { useEffect, useState } from 'react';
import { getAllStudents, getAllTeachers, submitAnnouncements } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import { ViewAnnouncement } from './View';

const AnnouncementForm = ({ onSubmit }: any) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [type, setType] = useState('general');
  const [daysToLive, setDaysToLive] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (event: any) => {
    const value: number = event.target.value;
    setSelectedUsers((prev: any) => {
      if (prev.includes(value)) {
        return prev.filter((user: any) => user !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const handleSubmit = async(e: any) => {
    e.preventDefault();
    let obj ={
      title,
      message:content,
      scheduledTime,
      type,
      userIds:selectedUsers,
      userType:selectedOption,
      daysToLive:daysToLive
    }
    const response = await submitAnnouncements(obj);
    if(response){
        toast.success("Announcement created successfully");
        clearFields();
    }
  };
  const clearFields = () => {
    setTitle('');
    setContent('');
    setScheduledTime('');
    setType('general');
    setSelectedUsers([]);
    setSelectedOption('');
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedOption]);
  const fetchUsers = async () => {
    setUsers([]);
    setSelectedUsers([]);
    if (selectedOption === 'student') {
      const response = await getAllStudents();
      setUsers(response.data.students);
    } else if (selectedOption === 'teacher') {
      const response = await getAllTeachers();
      setUsers(response.data.teachers);
    }
  };


  return (
    <>
    <ToastContainer />
    <div
      className="p-4 bg-white dark:bg-black shadow-md rounded-lg mt-6 mx-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Create Announcement</h2>
    
        <div className="flex items-center gap-8 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="student"
              checked={selectedOption === 'student'}
              onChange={handleOptionChange}
              className="form-radio dark:bg-black text-blue-600"
            />
            <span className="ml-2">Student</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="teacher"
              checked={selectedOption === 'teacher'}
              onChange={handleOptionChange}
              className="form-radio dark:bg-black text-blue-600"
            />
            <span className="ml-2">Teacher</span>
          </label>
        </div>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full dark:bg-black px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
        required
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Content
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full dark:bg-black px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
        required
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Scheduled Time
      </label>
      <input
        type="datetime-local"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        className="w-full dark:bg-black px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
      />
       <label className="block mb-2 text-sm font-medium text-gray-700">
        Expiration Date?
      </label>
      <input
         type="date"
        value={daysToLive}
        onChange={(e) => setDaysToLive(e.target.value)}
        className="dark:bg-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
        required
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Type
      </label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="dark:bg-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
      >
        <option value="class">Class</option>
        <option value="assessment">Assessment</option>
        <option value="payment">Payment</option>
        <option value="general">General</option>
      </select>

      {/* Recipients */}
      <div className="relative mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Select Users:</label>
        <button
          onClick={toggleDropdown}
          className="w-full border border-gray-300 rounded-md p-2 text-left focus:outline-none focus:ring focus:ring-blue-500"
        >
          {selectedUsers.length > 0
            ? `${selectedUsers.length} users selected`
            : 'Select users'}
        </button>

        {isOpen && (
          <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
            {users.map((user: any, index) => (
              <label
                key={index}
                className="flex items-center p-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  value={user.id}
                  checked={selectedUsers.includes(user.id.toString())}
                  onChange={handleCheckboxChange}
                  className="form-checkbox text-blue-600 mr-2 dark:bg-black"
                />
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className='flex justify-end'>
      <button
        type="button"
        onClick={handleSubmit}
        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Create Announcement
      </button>
      </div>
    </div>

    <ViewAnnouncement />
    </>
  );
};

export default AnnouncementForm;
