
import { useEffect, useState } from 'react';
import { changePlan, getPlans, getStudentPlan } from '../../../api/auth';
import { useSelector } from 'react-redux';
import { ConfirmationDialog } from '../../Generic/ConfirmationDialog';
import { toast, ToastContainer } from 'react-toastify';

export const GetStudentPackage = ({studentId}:any) => {
  const [selectedPackage, setSelectedPackage] = useState<any>('');
    const [dialog,setDialog] = useState(false);
    const [planId,setPlanId] = useState('');

  useEffect(() => {
        fetchStudentPlan();
    }, []);
   

    const fetchStudentPlan = async () => {
        try {
            const response = await getStudentPlan(studentId);
            console.log("student plan is:::",response.data);
            setSelectedPackage(response.data?.plan);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };
    

  return (
    <div className="w-full  px-10">
      <div className="flex flex-col lg:flex-row gap-8">
            
            {selectedPackage &&  
                    <div
                    className={`bg-white dark:bg-slate-900  rounded-lg shadow-md p-6 flex flex-col flex-1 hover:shadow-2xl border-2 border-blue-600`}
                  >
                    <h2 className='text-2xl font-bold mb-4 text-center dark:text-slate-50' >Current Plan</h2>
                    <h3 className="text-xl dark:text-slate-50 font-semibold mb-4">
                      {selectedPackage?.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                     {selectedPackage?.description}
                    </p>
                    <p className="text-4xl font-bold mb-6">
                      ${selectedPackage?.price}<span className="text-xl font-normal text-gray-600">/month</span>
                    </p>
                    <ul className="mb-6 flex-grow">
                        {selectedPackage?.features?.map((feature: any) => (
                            <li className="flex items-center mb-2">
                            <svg
                              className="w-5 h-5 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      
                    </ul>
                    <button
                     
                      className={` ${true ? 'bg-zinc-400' : 'hover:bg-blue-700'} bg-blue-600 text-white rounded-md py-2 px-4  transition duration-300`}
                      disabled={true }
                    >
                    { 'Student Package'}  
                    </button>
                  </div>
               
              
            }
      </div>
      
    </div>
  );
};
