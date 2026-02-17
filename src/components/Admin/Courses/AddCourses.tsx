import React, { useEffect, useState } from 'react';
import {
  getAllStudents,
  getAllTeachers,
  getAllCoursesCrud,
  deleteCourse,
  updateCourse,
  addCourseCrud,
  updateCourseCrud,
  deleteCourseCrud,
} from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import { CourseTable } from './CourseTable';
import SearchIcon from '../../Icons/SearchIcon';
import { EditCourseDialog } from './EditDialog';
import { DeleteDialog } from './DeleteDialog';
import { CourseTableCrud } from './CourseTableCrud';
export const AddCourses = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseName, setcourseName] = useState('');
  const [duration, setduration] = useState('');
  const [description, setdescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<any>([]);
  const [isChecked, setIsChecked] = useState<any>(false);
  const [currentCourse, setCurrentCourse] = useState<{
    courseName: string;
    duration: string;
    description: string;
    imageUrl:File;
  } | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState<string | null>(null);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteDialog = (courseId: string) => {
    setCourseToDeleteId(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDeleteId) return;

    try {
      await deleteCourseCrud(courseToDeleteId);
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
  
    const formData = new FormData();
    formData.append('courseName', currentCourse.courseName);
    formData.append('duration', currentCourse.duration);
    formData.append('description', currentCourse.description);
    if (image) {  
      formData.append('file', image); 
    }
    try {
      const response = await updateCourseCrud(editingCourseId, formData);
      // // console.log('Course updated:', response.data);

      toast.success('Course updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchCourses();
      clearFields();
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
        const studentsResponse = await getAllStudents();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // let obj = {
    //   courseName,
    //   duration,
    //   description,
    //   isComing:isChecked,
    //   imageUrl: image,
    // };
    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('duration', duration);
    formData.append('description', description);
    formData.append('isComing', isChecked);
    if (image) {  
      formData.append('file', image); 
    }


    try {
      // // console.log('obj', obj);
      const response = await addCourseCrud(formData);
      // // console.log('Courses added:', response.data);
      if(response){
        fetchCourses();
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

  const clearFields = () =>[
    setcourseName(''),
    setduration(''),
    setdescription(''),
    setImage(null),
  ]
  const fetchCourses = async () => {
    try {
      const response = await getAllCoursesCrud();

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

  // const filteredCourses =courses.length > 0 && courses.filter((course) => {
  //   const searchString = searchTerm.toLowerCase();
  //   return (
  //     course.courseName.toLowerCase().includes(searchString) ||
  //     course.description.toLowerCase().includes(searchString) ||
  //     course.duration.toLowerCase().includes(searchString)
  //   );
  // });

  const toggleModal = (courseId: any) => {
    setModalVisible(!modalVisible);
    setEditingCourseId(courseId);

    if (courseId && courses.find((x:any) => x.id === courseId)) {
      const course:any = courses.filter((x: any) => x.id === courseId)[0];

      setCurrentCourse({
        courseName: course.courseName,
        duration: course.duration,
        description: course.description,
        imageUrl : course?.imageUrl
      });
    } else {
      setCurrentCourse(null);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

 

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    let file:any;
    if(e.target.files){
       file = e.target.files[0];
    }

    if (file) {
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        setImage(file);
        // const objectUrl:any = URL.createObjectURL(file);
        // setPreview(objectUrl);
      } else {
        setImage(null);
        alert('Please select a valid image file.');
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className=" inset-0 h-full  mt-4 ">
        <div className="relative   p-5   globalCardStyle containerr">
          <div className="flex">
            <h3 className="text-lg font-bold mb-4 text-center">
              Course Information
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setcourseName(e.target.value)}
                  id="courseName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:bg-slate-800"
                  placeholder="Course Name"
                  required
                />
              </div>

              <div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setduration(e.target.value)}
                    id="duration"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none  dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                    placeholder="Duration"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                placeholder="Description"
                required
              />
            </div>
            <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="image">
        Upload Course Image
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      {/* {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-50 h-40 object-stretch rounded-t-lg"
          />
        </div>
      )} */}
            </div>

           <div className="flex items-center">
      <input
        type="checkbox"
        id="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="checkbox" className="ml-2 text-sm font-medium text-gray-900">
        {isChecked ? 'Is Upcoming' : 'Is Upcoming'}
      </label>
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
      {/* {(courses.length > 0) && (
        <div className="flex pr-10 justify-end">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            id="table-search-courses"
            className="block  p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search courses"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      )} */}

      {courses.length > 0 && (
        <CourseTableCrud
          courses={courses}
          editModal={(id) => {
            toggleModal(id);
          }}
          openDeleteDialog={(id) => {
            openDeleteDialog(id);
          }}
        />
      )}
      {modalVisible && (
        <EditCourseDialog
          toggleDialog={() => {
            setModalVisible(!modalVisible);
          }}
          handleUpdate={handleUpdate}
          currentCourse={currentCourse}
          setCurrentCourse={(e: any, key: any) => {
            setCurrentCourse((prev) => ({
              ...prev!,
              [key]: e.target.value,
            }));
          }}
          handleImageChange={handleImageChange}
        />
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
