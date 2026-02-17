import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCourseByTeacherId } from '../../api/auth';
import { Card } from '../Generic/Card';
import { EmptyTemplate } from '../Generic/EmptyTemplate';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Course {
  id: number;
  courseName: string;
  duration: string;
  description: string;
  teacherId: number;
  studentId: number;
  createdAt: string;
  updatedAt: string;
  Student: Student;
}

export const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await getCourseByTeacherId(userId);
        // console.log('API response:', response.data);
        if (response.data && Array.isArray(response.data.course)) {
          setCourses(response.data.course);
        } else {
          setCourses([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='containerr mt-6'>
        <h2 className="MainHeadings mb-5">
       My Assigned Courses
      </h2>
   

      <div className="grid grid-cols- sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {courses.length > 0 ? (
           <>
           {courses.map((course:any) => (
           //   <div key={course.id} className=" border globalCardStyle text-black dark:text-white p-6 rounded-lg shadow-lg hover:shadow-sm hover:shadow-blue-400 dark:bg-transparent transition-shadow duration-300">
           //     <h5 className='text-xl font-bold uppercase text-center mb-2 '>{course?.Course?.courseName}</h5>
           //  <hr className='mb-2 border-blue-500' />
          
           //  <p className="text-sm mb-2 ">Student Name: <b> {course.Student.firstName} {course.Student.lastName}</b></p>
   
           //     <p className="text-sm mb-2">Duration: <b> {course?.Course?.duration} Months</b></p>
               
               
           //     <p className="text-sm mb-2">Started Date: <b>{new Date(course?.Course?.createdAt).toLocaleDateString()}</b></p>
           //   </div>
           <Card 
             course={course}
           />
           ))}
           </>
        ):(
          <>
          <div></div>
          <div className='globalCardStyle containerr mt-6'>
          <EmptyTemplate
            heading={"No courses found"}
            description={"No courses found"}
          />
          </div>
          </>
        )}
       
      </div>
    </div>
  );
}
