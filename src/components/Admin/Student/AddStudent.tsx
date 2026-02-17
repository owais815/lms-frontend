import { useEffect, useState } from 'react';
import { getPlans, signup } from '../../../api/auth';
import { toast } from 'react-toastify';

const AddStudent = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [contact, setcontact] = useState('');
  const [address, setaddress] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isChecked, setIsChecked] = useState<any>(false);
  const [amount, setamount] = useState('');

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [flexibleHours, setFlexibleHours] = useState('');
  const [suitableHours, setSuitableHours] = useState('');
  const [nameForTeacher, setnameForTeacher] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);
  const fetchPlans = async () => {
    try {
      const response = await getPlans();
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error('Please select a plan!');
      return;
    }
    let obj = {
      address,
      contact,
      email,
      firstName,
      lastName,
      password,
      username,
      planId: selectedPlan,
      amount,
      countryName: country,
      state,
      city,
      timeZone,
      flexibleHours,
      suitableHours,
      nameForTeacher
    };
    try {
      // console.log('obj', obj);
      const response = await signup(obj);
      // console.log('Student added:', response.data);

      toast.success('Student added  successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      clearFields();
      props.fetchStudents();
      handleClose();
    } catch (error) {
      console.error('add student failed:', error);
      toast.error('username already exist!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const clearFields = () => {
    setfirstName('');
    setlastName('');
    setcontact('');
    setaddress('');
    setUsername('');
    setEmail('');
    setPassword('');
    setSelectedPlan('');
  };
  return (
    <div>
      <div className={`${isOpen ? 'hidden' : ''} flex justify-end mb-1.5`}>
        <button
          onClick={handleOpen}
          className="bg-blue-500 hover:bg-blue-700  text-white py-1 px-4   rounded"
        >
          Add Student
        </button>
      </div>
      {isOpen && (
        <div className=" inset-0 h-full  ">
          <div className="relative   p-5   globalCardStyle mt-6">
            <div className="flex">
              <h3 className="text-lg font-bold mb-4 text-center">
                Student Information
              </h3>

              <button
                onClick={handleClose}
                type="button"
                className="absolute  top-3 right-2.5 text-gray-400 bg-transparent  hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  dark:hover:text-white"
                data-modal-hide="editUserModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
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
                    onChange={(text: any) => {
                      setfirstName(text.target.value);
                    }}
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:bg-slate-800"
                    placeholder="First Name"
                    
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
                      
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="nameForTeacher"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name For Teacher
                  </label>
                  <input
                    type="text"
                    name={nameForTeacher}
                    onChange={(text: any) => {
                      setnameForTeacher(text.target.value);
                    }}
                    id="nameForTeacher"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:bg-slate-800"
                    placeholder="First Name"
                    
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
                />
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-col-12 gap-4">
                <div className="mb-5">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Country Name
                  </label>
                  <input
                    type="text"
                    name={country}
                    onChange={(text: any) => {
                      setCountry(text.target.value);
                    }}
                    id="country"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Country Name"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="state"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    State Name
                  </label>
                  <input
                    type="text"
                    name={state}
                    onChange={(text: any) => {
                      setState(text.target.value);
                    }}
                    id="state"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="State Name"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="city"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    City Name
                  </label>
                  <input
                    type="text"
                    name={city}
                    onChange={(text: any) => {
                      setCity(text.target.value);
                    }}
                    id="city"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="City Name"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-col-12 gap-4">
                <div className="mb-5">
                  <label
                    htmlFor="timeZone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Time Zone
                  </label>
                  <input
                    type="text"
                    name={timeZone}
                    onChange={(text: any) => {
                      setTimeZone(text.target.value);
                    }}
                    id="timeZone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Time Zone"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="timeZone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Flexible Hours
                  </label>
                  <input
                    type="time"
                    name={flexibleHours}
                    onChange={(text: any) => {
                      setFlexibleHours(text.target.value);
                    }}
                    id="timeZone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Flexible Hours"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="timeZone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Suitable Hours
                  </label>
                  <input
                    type="time"
                    name={suitableHours}
                    onChange={(text: any) => {
                      setSuitableHours(text.target.value);
                    }}
                    id="timeZone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Suitable Hours"
                  />
                </div>
              </div>

              {/* Assign Plan too */}
              <div className="mb-5">
                <label
                  htmlFor="plan"
                  className="block text-sm font-medium text-gray-700"
                >
                  Plan
                </label>
                <select
                  id="plan"
                  className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedPlan}
                  onChange={(e) => {
                    setSelectedPlan(e.target.value);
                  }}
                >
                  <option value="">Select Plan</option>
                  {plans.map((plan: any) => (
                    <option key={plan.id} value={plan.id}>
                      {plan?.name}
                      {'($'}
                      {plan?.price} {')'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPlan && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={isChecked}
                    onChange={() => {
                      setIsChecked(!isChecked);
                    }}
                  />
                  <label
                    htmlFor="checkbox"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    {'If amount is other then mentioned in plan then add here'}
                  </label>
                </div>
              )}
              {isChecked && (
                <div className="mb-5">
                  <label
                    htmlFor="amount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    name={amount}
                    onChange={(text: any) => {
                      setamount(text.target.value);
                    }}
                    id="amount"
                    placeholder="Please enter amount here."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                  />
                </div>
              )}

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
      )}
    </div>
  );
};

export default AddStudent;
