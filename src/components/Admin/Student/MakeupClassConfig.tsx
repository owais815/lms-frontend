import { useState } from 'react';
import { MakeupClassView } from '../../Student/StudentCourses/MakeupClassView';
import { MakeUpClass } from '../../Student/StudentCourses/MakeupClass';
import { ScheduleClass } from '../ScheduleClasses/ScheduleClass';
import { toast, ToastContainer } from 'react-toastify';
import { addMakeupClass, addUpcomingClass } from '../../../api/auth';
import { changeEventActions } from '../../../redux/Slices/changeEvent';
import { useDispatch } from 'react-redux';

export const MakeUpClassConfig = () => {
  const [openMakeupModel, setOpenMakeupModel] = useState(false);
  const dispatch = useDispatch();
  const onHandleClassCreation = async (obj: any) => {
    debugger;
    const { meetingLink, ...rest } = obj;
    let classObj = { ...rest, reason: 'makeup', status: 'Approved' };
    try {
      await addMakeupClass(classObj);
      const isScheduled = await scheduleClass(obj);

      if (isScheduled) {
        toast.success('Class scheduled successfully');
        setOpenMakeupModel(false);
        dispatch(changeEventActions.setMakeupTrigger());
      } else {
        toast.error(
          'Class could not be scheduled. Please check the meeting details.',
        );
      }
    } catch (err) {
      console.error('Error scheduling class:', err);
      toast.error('Failed to schedule class');
    }
  };

  const scheduleClass = async (classData: any): Promise<boolean> => {
    try {
      await addUpcomingClass(classData);
      toast.success('Class scheduled successfully!');
      // console.log('Class scheduled:', classData);
      return true; // Return true when scheduling is successful
    } catch (err) {
      console.error('Error scheduling class:', err);
      toast.error('Failed to schedule class');
      return false; // Return false if scheduling fails
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mt-10">
        <MakeupClassView
          openMakeupModel={() => {
            setOpenMakeupModel(true);
          }}
        />
      </div>

      {openMakeupModel && (
        <ScheduleClass
          isMakeUp={openMakeupModel}
          onClassCreated={(obj: any) => onHandleClassCreation(obj)}
          onCloseModel={() => {
            setOpenMakeupModel(false);
          }}
        />
      )}
    </>
  );
};
