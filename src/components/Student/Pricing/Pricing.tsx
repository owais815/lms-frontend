import { useEffect, useState } from 'react';
import { changePlan, getPlans, getStudentPlan } from '../../../api/auth';
import { useSelector } from 'react-redux';
import React from 'react';
import { ConfirmationDialog } from '../../Generic/ConfirmationDialog';
import { toast, ToastContainer } from 'react-toastify';
import StudentPaymentHistory from './StudentPaymentHistory';

export const Pricing = () => {
  const [selectedPackage, setSelectedPackage] = useState<any>('');
  const [plans, setPlans] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [planId, setPlanId] = useState('');

  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    fetchPlans();
    fetchStudentPlan();
  }, []);
  const fetchPlans = async () => {
    try {
      const response = await getPlans();
      console.log(response.data.plans);
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchStudentPlan = async () => {
    try {
      const response = await getStudentPlan(userId);
      console.log('student plan is:::', response.data);
      setSelectedPackage(response.data?.plan);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handlePlanChange = async () => {
    let obj = {
      studentId: userId,
      newPlanId: planId,
    };
    try {
      const response = await changePlan(obj);
      if (response.data) {
        if (response.data?.planStatus == 'already') {
          toast.warn('You already have this plan.');
        } else if (response.data?.planStatus == 'pending') {
          toast.info('You already have a pending plan change request.');
        } else {
          toast.success('Your request for plan change is submitted.');
        }
        setDialog(false);
      }
    } catch (error) {
      console.error('Error changing plans:', error);
    }
  };

  return (
    <div className="w-full  px-10">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {plans.length > 0 &&
          plans.map((val: any) => {
            return (
              <div
                className={`bg-white dark:bg-slate-900 hover:scale-110 rounded-lg shadow-md p-6 flex flex-col flex-1 hover:shadow-2xl ${
                  selectedPackage?.id === val?.id
                    ? 'border-2 border-blue-600'
                    : ''
                }`}
              >
                <h3 className="text-xl dark:text-slate-50 font-semibold mb-4">
                  {val?.name}
                </h3>
                <p className="text-gray-600 mb-4">{val?.description}</p>
                <p className="text-4xl font-bold mb-6">
                  ${val?.price}
                  <span className="text-xl font-normal text-gray-600">
                    /month
                  </span>
                </p>
                <ul className="mb-6 flex-grow">
                  {val?.features?.map((feature: any) => (
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
                  onClick={() => {
                    setPlanId(val?.id);
                    setDialog(true);
                  }}
                  className={` ${
                    selectedPackage?.id === val?.id
                      ? 'bg-zinc-400'
                      : 'hover:bg-blue-700'
                  } bg-blue-600 text-white rounded-md py-2 px-4  transition duration-300`}
                  disabled={selectedPackage?.id === val?.id}
                >
                  {selectedPackage?.id === val?.id
                    ? 'Your Package'
                    : 'Choose Plan'}
                </button>
              </div>
            );
          })}
      </div>
      <div className="mt-10">
        <StudentPaymentHistory studentId={userId} />
      </div>

      {dialog && (
        <ConfirmationDialog
          title="Change Plan"
          message="Are you sure you want to change to this plan?"
          handleConfirm={handlePlanChange}
          confirmText="Change"
          closeDialog={() => {
            setDialog(false);
          }}
          bgColor={'bg-green-600'}
        />
      )}
    </div>
  );
};
