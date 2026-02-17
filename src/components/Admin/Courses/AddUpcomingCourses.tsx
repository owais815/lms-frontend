import React, { useEffect, useState } from 'react';
import {
  getAllTeachers,
  addCourseCrud,
  updateCourseCrud,
  deleteCourseCrud,
  getAllCoursesUpcoming,
  addCourseUpcoming,
  getAllUpcomingCoursesTable,
  updateCourseUpcoming,
  deleteCourseUpcoming,
} from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import { EditCourseDialog } from './EditDialog';
import { DeleteDialog } from './DeleteDialog';
import { CourseTableCrud } from './CourseTableCrud';
import { EditIcon } from '../../Icons/EditIcon';
import { DeleteIcon } from '../../Icons/DeleteIcon';
import { TableComponent } from '../../Generic/TableComponent';
import CrossIcon from '../../Icons/CrossIcon';
import { formatDate, formatDateForInput } from '../../Generic/FormatDate';
export const AddUpcomingCourses = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseName, setcourseName] = useState('');
  const [duration, setduration] = useState('');
  const [description, setdescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<any>([]);
  const [currentCourse, setCurrentCourse] = useState<{
    teacherId: string;
    startingFrom: string;
  } | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>('');
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [teachers, setTeachers] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [upcomingCourses,setUpcomingCourses] = useState<any>([]);

  useEffect(()=>{
    fetchUpcomingCourses();
  },[]);

  const openDeleteDialog = (courseId: string) => {
    setCourseToDeleteId(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDeleteId) return;

    try {
      await deleteCourseUpcoming(courseToDeleteId);
      toast.success('Course deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchUpcomingCourses();
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

    const updatedCourseData = {
      teacherId: currentCourse.teacherId,
      startingFrom: currentCourse.startingFrom,
    };

    try {
      const response = await updateCourseUpcoming(
        editingCourseId,
        updatedCourseData,
      );

      toast.success('Course updated successfully!');
      fetchUpcomingCourses();
      toggleModal(null);
    } catch (error) {
      console.error('Update course failed:', error);
      toast.error('Failed to update course');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersResponse = await getAllTeachers();
        setTeachers(teachersResponse.data.teachers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let obj = {
      courseId:selectedCourse,
      teacherId: selectedTeacher ? selectedTeacher : null,
      startingFrom:selectedDate ? selectedDate : null,
      isStarted:false,
    };
    try {
      // // console.log('obj', obj);
      const response = await addCourseUpcoming(obj);
      // // console.log('Courses added:', response.data);
      if (response) {
        fetchUpcomingCourses();
        clearFields();
      }
      toast.success('Course added  successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      handleClose();
    } catch (error) {
      console.error('add Course failed:', error);
      toast.error('Courses already exist!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const clearFields = () => [
    setcourseName(''),
    setduration(''),
    setdescription(''),
    setSelectedCourse(''),
    setSelectedTeacher(''),
    setSelectedDate(''),
  ];
  const fetchCourses = async () => {
    try {
      const response = await getAllCoursesUpcoming();

      if (response.data) {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      setCourses([]);
    }
  };

  const fetchUpcomingCourses = async () => {
    try {
      const response = await getAllUpcomingCoursesTable();

      if (response.data) {
        // setCourses(response.data.courses);
        setUpcomingCourses(response.data);
      } 
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      // setCourses([]);
    }
  };
 

  const toggleModal = (courseId: any) => {
    setModalVisible(!modalVisible);
    setEditingCourseId(courseId);
    if (courseId && upcomingCourses.find((x: any) => x.id === courseId)) {
      const course: any = upcomingCourses.filter((x: any) => x.id === courseId)[0];

      setCurrentCourse({
        teacherId: course?.Teacher?.id,
        startingFrom: course?.startingFrom,
      });
    } else {
      setCurrentCourse(null);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div>
      <ToastContainer />
      <div className=" inset-0 h-full  mt-4 ">
        <div className="relative   p-5 globalCardStyle containerr">
          <div className="flex">
            <h3 className="text-lg font-bold mb-4 text-center">
              Course Information
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-5">
                <label
                  htmlFor="teacher"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course Name
                </label>
                <select
                  id="teacher"
                  className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedCourse?.id}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                  }}
                >
                  <option value="">Select Course</option>
                  {courses.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {`${course?.courseName} (${course?.duration} months)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="teacher"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teacher(Optional)
                </label>
                <select
                  id="teacher"
                  className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedTeacher?.id}
                  onChange={(e) => {
                    setSelectedTeacher(e.target.value);
                  }}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {`${teacher.firstName} ${teacher.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course Starting Date(Optional)
                </label>
                <input
                  id="date"
                  type="date"
                  className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* table  */}
                <TableComponent
                headings={["Course Name","Duration","Description","Teacher Name","Start Date","Action"]}
                tableData={upcomingCourses}
                dataKeys={["Course.courseName","Course.duration","Course.description","Teacher.firstName Teacher.lastName","startingFrom"]}
                editModal={(id:any) => {
                  toggleModal(id);
                }}
                openDeleteDialog={(id:any) => {
                  openDeleteDialog(id);
                }}
                />

      {modalVisible && (
        <>
        <div 
         id="editCourseModal"
         tabIndex={-1}
         aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full"
        >
           <div className="relative md:ml-67.5 lg:ml-67.5 ml-0 bg-white dark:bg-slate-800 w-full max-w-2xl max-h-full">
           <div className="relative rounded shadow dark:bg-gray-700">
           <button
            onClick={()=>{setModalVisible(!modalVisible);}}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="editCourseModal"
          >
            <CrossIcon />
            <span className="sr-only">Close modal</span>
          </button>

          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Edit Course
            </h3>
            <form
              className="space-y-6"
              onSubmit={handleUpdate}
            >
              <div className="mb-4">
                <label
                  htmlFor="teacher"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teacher
                </label>
                <select
                  id="teacher"
                  className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={currentCourse?.teacherId}
                  onChange={(e) => {
                    setCurrentCourse((prev:any) => ({
                      ...prev!,
                      teacherId: e.target.value,
                    }))
                  }}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {`${teacher.firstName} ${teacher.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course Starting Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={currentCourse?.startingFrom ? formatDateForInput(currentCourse.startingFrom) : ""}
                  onChange={(e) => {
                    setCurrentCourse((prev:any) => ({
                      ...prev!,
                      startingFrom: e.target.value,
                    }))
                  }}
                />
                </div>
                <div className="flex items-center justify-end">
              <button
                
                className="bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                update
              </button>
            </div>
                </form>
                </div>
              </div>
              </div>
              </div>
        </>
      )}

      {deleteDialogOpen && (
        <DeleteDialog
          itemType="course"
          handleDelete={handleDeleteCourse}
          closeDialog={() => setDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
};
