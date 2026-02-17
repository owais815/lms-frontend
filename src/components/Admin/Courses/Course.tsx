import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  deleteCourse,
  updateCourse,
  getAllCourses,
  getAllStudents,
  getAllTeachers,
} from '../../../api/auth';
import { AddCourses } from './AddCourses';
import SearchIcon from '../../Icons/SearchIcon';
import { DeleteDialog } from './DeleteDialog';

import { CourseTable } from './CourseTable';
import { EditCourseDialog } from './EditDialog';
import { AssignCourse } from './AssignCourse';
import { useNavigate, useNavigation } from 'react-router-dom';
import { OpenModal } from '../../Generic/OpenModal';
import UploadWeeklyContent from '../../Generic/UploadWeeklyContent';

export default function Courses() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [courses, setCourses] = useState<any>([]);
  const [showWeeklyContent, setShowWeeklyContent] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [courseDetailId, setCourseDetailId] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteDialog = (courseId: string) => {
    setCourseToDeleteId(courseId);
    setDeleteDialogOpen(true);
  };

  // const filteredCourses = courses?.filter((course:any) => {
  //   const searchString = searchTerm.toLowerCase();
  //   return (
  //     course.courseName.toLowerCase().includes(searchString) ||
  //     course.description.toLowerCase().includes(searchString) ||
  //     course.duration.toLowerCase().includes(searchString)
  //   );
  // });

  const filteredCourses = () => {
    return courses?.filter((course: any) => {
      const searchString = searchTerm.toLowerCase();
      return (
        course?.Course?.courseName.toLowerCase().includes(searchString) ||
        course?.Course?.description.toLowerCase().includes(searchString) ||
        course?.Course?.duration.toLowerCase().includes(searchString)
      );
    });
  };

  const handleDeleteCourse = async () => {
    if (!courseToDeleteId) return;

    try {
      await deleteCourse(courseToDeleteId);
      toast.success('Course deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchCourses();
    } catch (error) {
      console.error('Delete course failed:', error);
      toast.error('Failed to delete course');
    } finally {
      setDeleteDialogOpen(false);
      setCourseToDeleteId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId || !currentCourse) return;

    const updatedCourseData: any = {
      courseName: currentCourse.courseName,
      duration: currentCourse.duration,
      description: currentCourse.description,
      teacherId: currentCourse.teacherId,
      studentId: currentCourse.studentId,
    };

    try {
      const response = await updateCourse(editingCourseId, updatedCourseData);
      // console.log('Course updated:', response.data);

      toast.success('Course updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchCourses();
      toggleModal(null);
    } catch (error) {
      console.error('Update course failed:', error);
      toast.error('Failed to update course');
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachers();
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();

      if (response.data !== null) {
        setCourses(response.data.course);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchTeachers();
  }, []);

  const toggleModal = (courseId: any) => {
    setModalVisible(!modalVisible);
    setEditingCourseId(courseId);

    if (courseId && courses?.find((x: any) => x.id === courseId)) {
      const course: any = courses?.filter((x: any) => x.id === courseId)[0];

      setCurrentCourse({
        courseName: course.courseName,
        duration: course.duration,
        description: course.description,
        teacherId: course.teacherId,
        studentId: course.studentId,
      });
    } else {
      setCurrentCourse(null);
    }
  };

  return (
    <div className='containerr mt-6'>
      <ToastContainer />
      <div className="md:flex lg:flex  md:flex-wrap lg:flex-wrap  justify-between items-center grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => {
            navigate('/addcourses/weeklycontent');
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
        >
          Add Weekly Content
        </button>
        <button
          onClick={() => {
            navigate('/addcourses/upcoming');
          }}
         className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
        >
          Add Upcoming Courses
        </button>

        <button
          onClick={() => {
            navigate('/addcourses/crud');
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
        >
          Add Course
        </button>

        <AssignCourse fetchCourses={fetchCourses} />
      </div>

      <div className=" globalCardStyle mt-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          <div className="pl-10 flex items-center justify-end flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 dark:bg-gray-900">
            <div className="relative pr-10">
              {/* <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <SearchIcon />
              </div> */}
              <input
                type="text"
                id="table-search-courses"
                className="sb"
                placeholder="Search courses"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          {courses?.length > 0 ? (
            <CourseTable
              courses={filteredCourses()}
              students={students}
              teachers={teachers}
              editModal={(id) => {
                toggleModal(id);
              }}
              openDeleteDialog={(id) => {
                openDeleteDialog(id);
              }}
            />
          ) : (
            <div className="text-center text-gray-500  py-10 font-semibold text-2xl dark:text-white ">
              No courses found
            </div>
          )}

          {modalVisible && (
            <EditCourseDialog
              toggleDialog={() => {
                setModalVisible(!modalVisible);
              }}
              handleUpdate={handleUpdate}
              currentCourse={currentCourse}
              setCurrentCourse={(e: any, key: any) => {
                setCurrentCourse((prev: any) => ({
                  ...prev!,
                  [key]: e.target.value,
                }));
              }}
            />
          )}

          {deleteDialogOpen && (
            <DeleteDialog
              itemType="course"
              handleDelete={handleDeleteCourse}
              closeDialog={() => setDeleteDialogOpen(false)}
            />
          )}

          {showWeeklyContent && (
            <OpenModal handleClose={() => setShowWeeklyContent(false)}>
              <UploadWeeklyContent courseDetailId={courseDetailId} />
            </OpenModal>
          )}
        </div>
      </div>
    </div>
  );
}
