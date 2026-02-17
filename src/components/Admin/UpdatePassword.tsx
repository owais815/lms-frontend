import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import { updateadmin } from '../../api/auth';
import { toast } from 'react-toastify';

const UpdatePassword = () => {
  const adminId = useSelector((state: any) => state.auth.userId);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // try {
    //   const response = await updateadmin(adminId, { username, password });
    //   toast.success('Username and password updated successfully!');
    //   // Clear the form fields
    //   setUsername('');
    //   setPassword('');
    // } catch (error) {
    //   toast.error('Failed to update. Please try again.');
    //   console.error('Error updating admin:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
        Update Admin Credentials
      </h3>
      <form className="space-y-6" onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
              placeholder="Enter new username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
              placeholder="Enter new password"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          {loading ? (
            <div className="w-full flex justify-center">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save changes
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
