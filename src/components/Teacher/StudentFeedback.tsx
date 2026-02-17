import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFeedback } from '../../api/auth';
import { GetUserImageAndName } from '../Generic/GetUserImageAndName';
import { EmptyTemplate } from '../Generic/EmptyTemplate';

interface FeedbackItem {
  id: number;
  studentId: number;
  teacherId: number;
  feedback: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  Student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}

const StudentFeedback = (props:any) => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [teacherId,setTeacherId] = useState('');
  const userId = useSelector((state: any) => state.auth.userId);
  const {teachId} = props; 

   useEffect(()=>{
      if(teachId){
        setTeacherId(teachId);
      }else{
        setTeacherId(userId);
      }
    },[teachId,userId]);

  useEffect(() => {
    if(teacherId){
      fetchFeedback();
    }
  }, [teacherId]);

  const fetchFeedback = async () => {
    try {
      const response = await getFeedback(teacherId);
      // console.log('API response data:', response.data);
      setFeedbackItems(response.data.feedbacks || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to fetch feedback');
    }
  };
  return (
    <div className=' mt-6'>
    {feedbackItems.length > 0 ? 
    <div className="  ">
      <div className="grid gap-8">
        <div className="md:col-span-2">
          <div className="globalCardStyle dark:text-white  rounded-lg shadow-md p-6 hover:shadow-lg">
            <h2 className="heading mb-4">Student Recent Feedback</h2>
            {feedbackItems.map((item:any) => (
              <div key={item.id} className="transform hover:-translate-y-2 dark:text-white rounded-lg p-4 mb-4 transition-all duration-300 hover:shadow-sm hover:shadow-blue-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-black dark:text-white">
                    {/* {`${item.Student.firstName} ${item.Student.lastName}`} */}
                    <GetUserImageAndName 
                      firstName={item.Student.firstName}
                      lastName={item.Student.lastName}
                      imageUrl={item.Student.profileImg}
                      userType={"student"}
                      userId={item?.Student?.id}
                    />
                    </span>
                  <div className="flex items-center">
                    {item.rating}
                    <span className="text-yellow-500 ml-1">★</span>
                  </div>
                </div>
                <div className="text-gray-600 italic mb-2">"{item.feedback}"</div>
                <div className="text-right text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    :(
      <div className='globalCardStyle containerr mt-6'>
      <EmptyTemplate
        heading={"No Feedback found"}
        description={"No feedback found yet."}
      />
      </div>
    )
    }
    </div>
  );
};

export default StudentFeedback;
