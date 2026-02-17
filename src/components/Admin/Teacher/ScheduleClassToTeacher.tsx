import React, { useState, useEffect } from 'react';
import CrossIcon from '../../Icons/CrossIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addUpcomingClass,
  getAllTeachers,
  getAllStudents,
  getCourseByStdId,
  getAssignedStudents,
  getMeetingLink,
} from '../../../api/auth';
import { Loader } from '../../Loader';

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
};

type Course = {
  id: number;
  courseName: string;
};

export const ScheduleClassToTeacher = ({ teacherId }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await getAllStudents();
        const studentsData = studentsResponse.data.students || [];
        setAllStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      if (teacherId) {
        try {
          const response = await getAssignedStudents(
            teacherId.toString(),
          );
          const assignedStudentsData = response.data.students || [];
          setAssignedStudents(assignedStudentsData);
        } catch (error) {
          console.error('Error fetching assigned students:', error);
          setError('Failed to fetch assigned students');
        }
      } else {
        setAssignedStudents([]);
      }
    };

    fetchAssignedStudents();
  }, [selectedTeacher]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (selectedStudent) {
        try {
          const coursesResponse = await getCourseByStdId(
            selectedStudent.id.toString(),
          );
          const coursesData = coursesResponse.data.course || [];
          setCourses(coursesData);
        } catch (error) {
          console.error('Error fetching courses:', error);
          setError('Failed to fetch courses');
        }
      } else {
        setCourses([]);
      }
    };

    fetchCourses();
  }, [selectedStudent]);

  
  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStudentId = parseInt(event.target.value, 10);
    const selectedStudent = assignedStudents.find(
      (student) => student.id === selectedStudentId,
    );
    setSelectedStudent(selectedStudent || null);
    setSelectedCourse(null);
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourseId = parseInt(event.target.value, 10);
    const selectedCourse = courses.find(
      (course) => course.id === selectedCourseId,
    );
    setSelectedCourse(selectedCourse || null);
    meetingLinkToUpdate();
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleMeetingLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMeetingLink(event.target.value);
  };
const meetingLinkToUpdate = async () => {

  if (
    !selectedStudent ||
    !selectedCourse 
  ) {
    return;
  }
  const classData = {
    teacherId: teacherId.toString(),
    studentId: selectedStudent.id.toString(),
    courseDetailsId: selectedCourse.id.toString()
  };
    try {
      const response = await getMeetingLink(classData);
      if(response.data){
        setMeetingLink(response.data?.meetingLink);
      }else{
        setMeetingLink('');
      }
    } catch (err) {
      setMeetingLink('');
      console.error('Error scheduling class:', err);
    } 
};
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !selectedStudent ||
      !selectedCourse ||
      !selectedDate ||
      !selectedTime ||
      !meetingLink
    ) {
      toast.error('Please fill in all the fields');
      return;
    }

    setLoading(true);
    setError(null);

    const classData:any = {
      teacherId: teacherId.toString(),
      studentId: selectedStudent.id.toString(),
      courseId: selectedCourse.id.toString(),
      date: selectedDate,
      time: selectedTime,
      meetingLink: meetingLink,
    };

    try {
      await addUpcomingClass(classData);
      toast.success('Class scheduled successfully!');
      // console.log('Class scheduled:', classData);
      setIsOpen(false);
    } catch (err) {
      console.error('Error scheduling class:', err);
      toast.error('Failed to schedule class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mt-10  globalCardStyle p-4 containerr">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold mb-4">Schedule Class</h3>
      </div>
      <form className="text-left text-black" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="student"
            className="block text-sm font-medium text-gray-700"
          >
            Student
          </label>
          <select
            id="student"
            className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedStudent?.id || ''}
            onChange={handleStudentChange}
            disabled={!teacherId}
          >
            <option value="">Select Student</option>
            {assignedStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {`${student.firstName} ${student.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700"
          >
            Course
          </label>
          <select
            id="course"
            className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedCourse?.id || ''}
            onChange={handleCourseChange}
            disabled={!teacherId}
          >
            <option value="">Select Course</option>
            {courses.map((course:any) => (
              <option key={course.id} value={course?.Course?.id || course.id}>
                {course?.Course?.courseName || course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            className="mt-1 dark:bg-black block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Time
          </label>
          <input
            id="time"
            type="time"
            className="mt-1 dark:bg-black  block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedTime}
            onChange={handleTimeChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="meetingLink"
            className="block text-sm font-medium text-gray-700"
          >
            Meeting Link
          </label>
          <input
            id="meetingLink"
            type="text"
            className="dark:bg-black  mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={meetingLink}
            onChange={handleMeetingLinkChange}
            placeholder="https://example.com/meeting"
          />
        </div>
<div className='flex justify-end'>
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
          disabled={loading}
        >
          {loading ? <Loader /> : 'Schedule'}
        </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};
