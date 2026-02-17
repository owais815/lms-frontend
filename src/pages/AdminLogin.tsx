import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signinadmin } from '../api/auth';
import { authActions } from '../redux/Slices/AuthSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from '../components/Loader';

export const AdminLogin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signinadmin({ username: username.toLowerCase(), password });

      // console.log('Signin successful:', response.data);
      
      dispatch(authActions.login());
      dispatch(authActions.setToken(response.data.token));
      dispatch(authActions.setUserId(response.data.userId));
      debugger;
      dispatch(authActions.setUserRole(response.data.role));
      
      dispatch(authActions.setUserType('admin'));
      
      navigate('/admindashboard');
      
    } catch (error) {
      console.error('Admin signin failed:', error);
      toast.error('Sign in failed. Invalid username or password.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="text-stone-800 flex items-center justify-evenly bg-blue-400 h-screen opacity-95">
        <div>
          <div>
            <div>
              <h1 className='text-white text-xl'>Welcome Admin</h1>
              <h2 className="mt-6 text-white text-center text-3xl font-extrabold">
                Sign in to your account
              </h2>
              <form className="mt-8 space-y-6" onSubmit={handleSignin}>
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input
                      id="username"
                      name="username"
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? <Loader /> : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
