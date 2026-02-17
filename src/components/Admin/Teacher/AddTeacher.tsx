import { useState } from 'react';
import { signup, teachersignup } from '../../../api/auth';
import { toast } from 'react-toastify';

export const AddTeacher = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [contact, setcontact] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setcnic] = useState('');
  

  const handleOpen = () => {
    setIsOpen(true);
    props.onModalOpen('addTeacher');
  };

  const handleClose = () => {
    setIsOpen(false);
    props.onModalClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!contact || !email || !firstName || !lastName || !password || !username || !cnic){
      toast.error('Please fill all the fields!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return
    }
    let obj = { contact, email, firstName, lastName, password, username, cnic };
    try {
      // console.log('obj', obj);
      const response = await teachersignup(obj);
      // console.log('Teacher added:', response.data);

      toast.success('Teacher added  successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      props.fetchTeachers();
      handleClose();
    } catch (error) {
      console.error('add teacher failed:', error);

      toast.error('username or password already exist!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      <div className={`${isOpen ? 'hidden' : ''} ` } >
        <button
          onClick={handleOpen}
            className="bg-blue-500 hover:bg-blue-700  text-white py-1 px-4   rounded"
        >
          Add Teacher
        </button>
      </div>

      {isOpen && (
         <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
         <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold">
               Teacher Information
             </h3>
             <button
          onClick={handleClose}
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-col-12 gap-4">
                <div className="mb-5">
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div>
                  <div className="mb-5">
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name={lastName}
                      onChange={(e) => setlastName(e.target.value)}
                      id="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none  dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                      placeholder="Last Name"
                      required
                    />
                  </div>
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
                      name={username}
                      onChange={(e) => setUsername(e.target.value)}
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none  dark:placeholder-gray-400 dark:bg-slate-800"
                      placeholder="Username"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-col-12 gap-4">
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none  dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800 "
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="contact"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Contact
                  </label>
                  <input
                    type="text"
                    name={contact}
                    onChange={(e) => setcontact(e.target.value)}
                    id="contact"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none  dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Contact"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="cnic"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Cnic
                  </label>
                  <input
                    type="text"
                    name={cnic}
                    onChange={(e) => setcnic(e.target.value)}
                    id="cnic"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none  dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Cnic"
                    required
                  />
                </div>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none  dark:placeholder-gray-400 dark:bg-slate-800"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
