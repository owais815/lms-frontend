import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { formatDate } from './FormatDate';
import { GetUserImageAndName } from './GetUserImageAndName';
import UploadWeeklyContent from './UploadWeeklyContent';
import { useState } from 'react';
import { OpenModal } from './OpenModal';

export const Card = (props: any) => {
  const { course,showUCB } = props;
  const [showWeeklyContent,setShowWeeklyContent] = useState(false);
  const userType = useSelector((state:any) => state.auth.userType);
  return (
    <div  className={userType=='student' ? 'p-4' : 'globalCardStyle  p-4  '}>
      <img
        src={
          course?.Course?.imageUrl
            ? `${axios.defaults.baseURL}/${course?.Course?.imageUrl}`
            : '../../src/images/dummyupcoming.jpg'
        }
        alt={course?.Course?.courseName}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {course?.Course?.courseName}
          </h2>
          <p className="text-sm text-gray-900 dark:text-white font-semibold">
            {course?.Course?.duration} months
          </p>
        </div>
        {course?.Course?.Teacher && (
          <div className="mt-2 flex gap-2 items-center ">
          <p className="text-sm text-gray-600 dark:text-white">Trainer: </p>
          <GetUserImageAndName 
            userId={course?.Teacher?.id}
            userType={"teacher"}
            firstName={course?.Teacher?.firstName}
            lastName={course?.Teacher?.lastName}
            imageUrl={course?.Teacher?.imageUrl}
          />
        </div>
        )}
        {course?.Student && (
          <div className="mt-2 flex gap-2 items-center ">
          <p className="text-sm text-gray-600 dark:text-white">Student: </p>
          <GetUserImageAndName 
            userId={course?.Student?.id}
            userType={"teacher"}
            firstName={course?.Student?.nameForTeacher}
            lastName={""}
            imageUrl={course?.Student?.profileImg}
          />
        </div>
        )}
        
        {course?.startingFrom && (
          <div className="flex mt-2 gap-2">
            <p className="text-sm text-gray-600  dark:text-white">
              Starting From:{' '}
            </p>

            <p className="text-sm text-gray-600 dark:text-white ">
              {formatDate(course?.startingFrom)}
            </p>
          </div>
        )}

        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <p
              title={course?.Course?.description}
              className="flex items-center text-gray-500 dark:text-white text-sm"
            >
              {' "'}
              {course?.Course?.description &&
              course.Course?.description.length > 40
                ? course?.Course?.description.slice(0, 40) + '...'
                : course?.Course?.description}
              {'"'}
            </p>
          </div>
        </div>
        {showUCB && (userType === "teacher" || userType === "admin") && (
          <div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4" 
            onClick={() => {
              setShowWeeklyContent(true);
          }}>
            Upload Weekly Content
          </button>
        </div>
        )}
        
      </div>
      {showWeeklyContent && (
        <OpenModal 
         handleClose={() => setShowWeeklyContent(false)}
        >
        <UploadWeeklyContent courseDetailId={course?.id} />
        </OpenModal>
      )
        
      }
    </div>
  );
};
