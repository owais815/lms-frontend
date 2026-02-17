import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { addMakeupClass } from '../../../api/auth';
import { useDispatch } from 'react-redux';
import { changeEventActions } from '../../../redux/Slices/changeEvent';

export const MakeUpClass = (props: any) => {
  const handleClose = props.onClose;
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const dispatch = useDispatch();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = async() => {
    if(!selectedDate || !selectedTime || !reason){
        toast.warning('Please fill all the fields');
        return false;
    }
      let obj={
        reason:reason,
        date:selectedDate,
        time:selectedTime,
        studentId:props.studentId,
        courseDetailsId:props.courseDetailsId,
        teacherId:props.teacherId
      }
      try {
        await addMakeupClass(obj);
        toast.success('Request submitted successfully');
        handleClose();
        dispatch(changeEventActions.setMakeupTrigger());
      } catch (err) {
        console.error('Error scheduling class:', err);
        toast.error('Failed to schedule class');
      } 
  }

  return (
    <div>
        <ToastContainer />
      {/* {isOpen && ( */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Request a Makeup Class</h3>
              <button
                onClick={handleClose}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

              <div className="">
                
                <div className="mb-4">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedTime}
                    onChange={handleTimeChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="feedback">
                    Reason
                  </label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    id="feedback"
                    placeholder="Please share reason why you missed class"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="float-right flex items-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
           
          </div>
        </div>
      {/* )} */}
    </div>
  );
};
