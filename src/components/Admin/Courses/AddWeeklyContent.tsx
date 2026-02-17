import { useEffect, useState } from 'react';
import { Card } from '../../Generic/Card';
import { getUniqueCourses } from '../../../api/auth';
import Loader from '../../../common/Loader';
import WeeklyContentTabs from '../../Student/StudentCourses/WeeklyContent';
import {  FaEye } from 'react-icons/fa';
import * as _ from 'lodash';
import { OpenModal } from '../../Generic/OpenModal';

export const AddWeeklyContent = (props: any) => {
  const { course } = props;
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getUniqueCourses();
      if (response.data && Array.isArray(response.data.course)) {
       let uniqueData = _.uniqBy(response.data.course, 'courseId');
        setCourses(uniqueData);
      } else {
        setCourses([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="grid grid-cols- sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            className="p-4 flex globalCardStyle flex-col overflow-hidden"
            key={course.id}
          >
            <Card course={course} showUCB={true} />
            <button
              onClick={() => {
                setShowContent(!showContent);
                setId(course?.id);
              }}
              className="flex justify-center gap-4 items-center bg-indigo-600 text-white mx-4 py-2 rounded-lg mt-2 hover:bg-indigo-500"
            >
                <FaEye size={20} />
              <p>View Content</p> 
              
            </button>
            {(showContent && course?.id == id) && (
               <OpenModal handleClose={() => setShowContent(false)} title="Weekly Content"> 
              <div className="pt-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <WeeklyContentTabs courseDetailId={course?.id} />
              </div>
              </OpenModal>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
