import { useSelector } from "react-redux";
import GetAdminFeedback from "./GetAdminFeedback"
import { getTeacherFeedbacks } from "../../../api/auth";
import React, { useEffect, useState } from "react";


export const GetFeedbacks = () => {
  const userId = useSelector((state:any) => state.auth.userId);
  const [teacherFeedbacks, setTeacherFeedbacks] = useState<any[]>([]);

  useEffect(()=>{
    fetchTeachersFeedback();
  },[]);
  const fetchTeachersFeedback = async () => {
      try {
        const response = await getTeacherFeedbacks(userId);
        console.log("teacher feedbacks are:::",response.data);
        setTeacherFeedbacks(response.data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      }
    };
    
    return(
        <>
        <div className="containerr">
            {/* Admin Feedbacks */}
            <div>
            <h2 className="mt-8 underline text-2xl font-bold mb-6 text-graydark dark:text-slate-50">Admin Feedbacks</h2>
        <GetAdminFeedback userId={userId} />
        </div>

        {/* Teacher Feedbacks */}
        {teacherFeedbacks.length > 0 && 
        <div>
            <h2 className="mt-8 underline text-2xl font-bold mb-6 text-graydark dark:text-slate-50">Teacher Feedbacks</h2>
        <GetAdminFeedback teacherFeedbacks={teacherFeedbacks} userId={userId} />
        </div>
        }
        </div>
        </>
    )
}