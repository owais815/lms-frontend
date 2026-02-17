import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getCourseByStdId,
  getResourcesByStudentAndCourse,
} from '../../../api/auth';
import { toast } from 'react-toastify';
import ResourceList from '../../Admin/ResourceUpload/ResourceList';
import ResourceModal from '../../Admin/ResourceUpload/ResourceModal';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Resource {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
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
  Teacher: Teacher;
}

export const CoursesComponent = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalResource, setModalResource] = useState<Resource | null>(null);
  const [viewingResources, setViewingResources] = useState(false);

  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await getCourseByStdId(userId);
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

  const fetchResources = async (courseId: string) => {
    try {
      const response = await getResourcesByStudentAndCourse(userId, courseId);
      if (response.data && Array.isArray(response.data)) {
        setResources(response.data);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
      setResources([]);
    } finally {
      setViewingResources(true);
    }
  };

  return (
    <div className="bg-[url('../../src/images/logo/background.png')] p-6 rounded-lg shadow-lg hover:shadow-sm hover:shadow-blue-400 dark:bg-transparent transition-shadow duration-300">
      <h2 className="text-2xl text-graydark dark:text-slate-50 text-center font-bold mb-4">
        Enrolled Courses
      </h2>

      {courses.length > 0 ? (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead>
              <tr className="bg-gray-200 dark:bg-transparent border-b">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider"
                >
                  Course Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider"
                >
                  Duration
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider"
                >
                  Teacher Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider"
                >
                  Creation Date
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-graydark dark:text-slate-50 uppercase tracking-wider"
                >
                  Resources
                </th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="dark:bg-transparent border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-slate-50">
                    {course.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-slate-50">
                    {course.duration} Months
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-slate-50">
                    {course.Teacher
                      ? `${course.Teacher.firstName} ${course.Teacher.lastName}`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-slate-50">
                    {course.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-slate-50">
                    {course.createdAt.toLowerCase().substring(0, 10)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark dark:text-slate-50">
                    <button
                      onClick={() => {
                        setSelectedCourse(course.id.toString());
                        fetchResources(course.id.toString());
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      View Resources
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-graydark dark:text-slate-50">
          No courses found.
        </p>
      )}

      {viewingResources && (
        <div>
          {resources.length > 0 ? (
            <ResourceList
              resources={resources}
              onResourceClick={(resource) => {
                setModalResource(resource);
                setShowModal(true);
              }}
              onDeleteResource={() => {}} 
            />
          ) : (
            <div className="text-center text-gray-500 mt-4">
              No resources available for this course
            </div>
          )}
        </div>
      )}

      {showModal && modalResource && (
        <ResourceModal
          resource={modalResource}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
