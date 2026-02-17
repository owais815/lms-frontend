import { useEffect, useMemo, useState } from 'react';
import { addParent, getAllStudents, signup } from '../../../api/auth';
import { toast } from 'react-toastify';

const AddParent = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [contact, setcontact] = useState('');
  const [address, setaddress] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await getAllStudents();
        const studentsData = studentsResponse.data.students || [];
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let obj = {
      address,
      contact,
      email,
      firstName,
      lastName,
      password,
      username,
      studentId:selectedStudent
    };
    try {
      // console.log('obj', obj);
      const response = await addParent(obj);
      // console.log('Student added:', response.data);

      toast.success('Parent added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      clearFields();
      props.handleClose();
    } catch (error) {
      console.error('add student failed:', error);
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

  const clearFields = () =>{
    setfirstName('');
    setlastName('');
    setcontact('');
    setaddress('');
    setUsername('');
    setEmail('');
    setPassword('');
  }
  const studentOptions = useMemo(
    () =>
      students.map((student) => (
        <option key={student.id} value={student.id.toString()}>
          {`${student.firstName} ${student.lastName}`}
        </option>
      )),
    [students],
  );

  return (
    <div>
      <div className=" inset-0 h-full  ">
        <div className="relative   p-5   globalCardStyle mt-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Student
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                >
                  <option value="">Select a student</option>
                  {studentOptions}
                </select>
              </label>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-col-12 gap-4">
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
                  onChange={(text: any) => {
                    setfirstName(text.target.value);
                  }}
                  id="firstName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:bg-slate-800"
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
                    onChange={(text: any) => {
                      setlastName(text.target.value);
                    }}
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
                  onChange={(text: any) => {
                    setPassword(text.target.value);
                  }}
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none   block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800 "
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
                  onChange={(text: any) => {
                    setcontact(text.target.value);
                  }}
                  id="contact"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                  placeholder="Contact"
                  required
                />
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
                  onChange={(text: any) => {
                    setEmail(text.target.value);
                  }}
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none   block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <input
                type="text"
                name={address}
                onChange={(text: any) => {
                  setaddress(text.target.value);
                }}
                id="address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                placeholder="Address"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddParent;
