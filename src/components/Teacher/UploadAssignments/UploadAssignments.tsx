import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllStudents,
  getCourseByStdId,

  createAssignment,
} from '../../../api/auth';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Course {
  id: number;
  courseName: string;
}

interface Assignment {
  id: number;
  fileName: string;
  studentName: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
}

const UploadAssignment: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState<any>(0);
  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchCourses(selectedStudent);
    } else {
      setCourses([]);
      setSelectedCourse('');
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      if (response.data && response.data.students) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  const fetchCourses = async (studentId: string) => {
    try {
      const response = await getCourseByStdId(studentId);
      if (response.data && Array.isArray(response.data.course)) {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

const handleAssign = async () => {
  if (
    !selectedStudent ||
    !selectedCourse ||
    !file ||
    !title ||
    !description ||
    !dueDate ||
    !maxScore
  ) {
    toast.error('Please fill in all fields and select a file');
    return;
  }

  setIsLoading(true);
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('courseDetailsId', selectedCourse);
    formData.append('teacherId', userId);
    formData.append('maxScore', maxScore);
    formData.append('studentId', selectedStudent);
    formData.append('file', file);
  
    // // console.log("form data is:::",formData);

    const response = await createAssignment(formData);
    // console.log('Assignment creation response:', response);

    if (response.data) {
      const newAssignment: Assignment = {
        id: response.data.id,
        fileName: file.name,
        studentName:
          students.find((s) => s.id.toString() === selectedStudent)
            ?.firstName || '',
        courseName:
          courses.find((c) => c.id.toString() === selectedCourse)?.courseName ||
          '',
        title: title,
        description: description,
        dueDate: dueDate,
      };
      setAssignments([...assignments, newAssignment]);
      toast.success('Assignment uploaded successfully');
      resetForm();
    }
  } catch (error) {
    console.error('Error creating assignment:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    toast.error('Failed to create assignment');
  } finally {
    setIsLoading(false);
  }
};

  const resetForm = () => {
    setSelectedStudent('');
    setSelectedCourse('');
    setFile(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setMaxScore(0);
    // Reset the file input
    const fileInput = document.getElementById(
      'upload-file'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  const handlePreview = (assignment: Assignment) => {
    // Implement preview logic here
    // console.log('Previewing assignment:', assignment);
  };

  const handleAddMarks = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  return (
    <div className="p-6  globalCardStyle text-black dark:text-white containerr mt-6 ">
      {/* <h2 className="ch mb-4">Upload Assignment</h2> */}

      <div className="grid md:grid-cols-2 lg:grid-cols-2  grid-cols-1 gap-4 mb-4 dark:text-black mt-4">
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id.toString()}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Course</option>
          {courses.map((course:any) => (
            <option key={course.id} value={course.id.toString()}>
              {course?.Course?.courseName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-cols-1 gap-4 mb-4 ">
        <div className="mb-4 ">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="assignmentTitle"
          >
            Assignment Title:
          </label>
          <input
            className="bg-gray-50 dark:bg-black dark:text-black border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="assignmentTitle"
            placeholder='Enter Assignment Title'
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dueDate"
          >
            Due Date:
          </label>
          <input
            className="bg-gray-50 dark:bg-black border dark:text-white border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="dueDate"
            type="date"
            placeholder='Enter Due Date'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>


        <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="maxScore"
        >
          Max Score:
        </label>
        <input
          className="bg-gray-50 dark:bg-black border dark:text-white border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="maxScore"
          type="number"
          value={maxScore}
          onChange={(e) => setMaxScore(Number(e.target.value))}
        />
      </div>


      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="assignmentDescription"
        >
          Assignment Description:
        </label>
        <textarea
          className="bg-gray-50 dark:bg-black border dark:text-black border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="assignmentDescription"
          rows={2}
          placeholder='Enter Assignment Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 ">


        
        <div className="space-y-2 ">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="upload-file"
          >
            Upload File
          </label>
          <div className="relative">
            <input
              type="file"
              id="upload-file"
              onChange={handleFileChange}
              className="flex h-10 bg-white dark:bg-black dark:text-black w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex justify-end">
              <button
                disabled={isLoading}
                onClick={handleAssign}
                className="mt-5 text-sm rounded-sm bg-primary py-2 px-4 font-medium text-gray hover:bg-opacity-90"
              >
                {isLoading ? 'Uploading...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Uploaded Assignments</h3>
        {assignments.map((assignment) => (
          <div key={assignment.id} className="border p-4 mb-4 rounded">
            <p>Title: {assignment.title}</p>
            <p>Description: {assignment.description}</p>
            <p>Due Date: {assignment.dueDate}</p>
            <p>File: {assignment.fileName}</p>
            <p>Student: {assignment.studentName}</p>
            <p>Course: {assignment.courseName}</p>
            <div className="mt-2">
              <button
                onClick={() => handlePreview(assignment)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Preview
              </button>
              <button
                onClick={() => handleAddMarks(assignment)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Marks & Feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h3 className="text-xl font-semibold mb-4">Add Marks & Feedback</h3>
            <p>Assignment: {selectedAssignment.fileName}</p>
            <p>Student: {selectedAssignment.studentName}</p>
            <input
              type="number"
              placeholder="Marks"
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Feedback"
              className="border p-2 rounded mb-2 w-full"
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Implement save logic here
                  setShowModal(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}

      <ToastContainer />
    </div>
  );
};

export default UploadAssignment;
