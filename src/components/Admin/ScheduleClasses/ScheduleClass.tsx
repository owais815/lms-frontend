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
  getCourseByStdAndTeacherId,
  getMeetingLink,
} from '../../../api/auth';
import { Loader } from '../../Loader';
import { UpcomingClasses } from '../../Teacher/UpcomingClasses';
import { changeEventActions } from '../../../redux/Slices/changeEvent';
import { useDispatch } from 'react-redux';
import FullScreenModal from '../../Generic/MeetingFrame';

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

type ScheduleClassProps = {
  hideTeacherDropdown?: boolean;
  teacherId?: number;
  isMakeUp?: boolean;
  onClassCreated?: (obj: any) => void;
  onCloseModel?: () => void;
};

export const ScheduleClass: React.FC<ScheduleClassProps> = ({
  hideTeacherDropdown = false,
  teacherId,
  isMakeUp = false,
  onClassCreated,
  onCloseModel,
}) => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getmeetingLink,setGetMeetingLink] = useState<string>('');
  


  const dispatch = useDispatch();
  const effectiveTeacherId = hideTeacherDropdown
    ? teacherId
    : selectedTeacher?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hideTeacherDropdown) {
          const teachersResponse = await getAllTeachers();
          const teachersData = teachersResponse.data.teachers || [];
          setTeachers(teachersData);
        }
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
  }, [hideTeacherDropdown]);

  useEffect(() => {
    if (hideTeacherDropdown && teacherId) {
      setSelectedTeacher({ id: teacherId } as Teacher);
    }
  }, [hideTeacherDropdown, teacherId]);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      if (selectedTeacher) {
        try {
          const response = await getAssignedStudents(
            selectedTeacher.id.toString(),
          );
          const assignedStudentsData = response.data.students || [];

          setAssignedStudents(assignedStudentsData);
        } catch (error) {
          console.error('Error fetching assigned students:', error);
          setError('Failed to fetch assigned students');
          setAssignedStudents([]);
        }
      } else {
        setAssignedStudents([]);
      }
    };

    fetchAssignedStudents();
  }, [selectedTeacher]);

  useEffect(() => {
    fetchCourses();
  }, [selectedStudent]);

  const fetchCourses = async () => {
    if (selectedStudent) {
      try {
        const coursesResponse = await getCourseByStdAndTeacherId(
          selectedStudent.id,
          selectedTeacher?.id,
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
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    clearFields();
    if (onCloseModel) {
      onCloseModel();
    }
  };

  const clearFields = () =>{
    setSelectedCourse(null);
    setMeetingLink('');
  }
  const handleTeacherChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedTeacherId = parseInt(event.target.value, 10);
    const selectedTeacher = teachers.find(
      (teacher) => teacher.id === selectedTeacherId,
    );
    setSelectedTeacher(selectedTeacher || null);
    setSelectedStudent(null);
    setSelectedCourse(null);
  };

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
    meetingLinkToUpdate(selectedCourse || null);
    setSelectedCourse(selectedCourse || null);
    
  };

  // const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedDate(event.target.value);
  // };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };
  const handleMeetingLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMeetingLink(event.target.value);
  };
//getMeetingLink

const meetingLinkToUpdate = async (selectedCourse:any) => {
  if (
    !effectiveTeacherId ||
    !selectedStudent ||
    !selectedCourse 
  ) {
    return;
  }
  const classData = {
    teacherId: effectiveTeacherId.toString(),
    studentId: selectedStudent.id.toString(),
    courseDetailsId: selectedCourse.id.toString()
  };
    try {
      const response = await getMeetingLink(classData);
      if(response.data){
        setMeetingLink(response.data?.meetingData?.meetingLink);
        setSelectedTime(response.data?.meetingData?.time);
      }
    } catch (err) {
      setMeetingLink('');
      console.error('Error scheduling class:', err);
    } 
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !effectiveTeacherId ||
      !selectedStudent ||
      !selectedCourse ||
      !selectedTime ||
      !meetingLink
    ) {
      toast.error('Please fill in all the fields');
      return;
    }

    setLoading(true);
    setError(null);

    const classData = {
      teacherId: effectiveTeacherId.toString(),
      studentId: selectedStudent.id.toString(),
      courseDetailsId: selectedCourse.id.toString(),
      date: selectedDate ? selectedDate : new Date().toISOString().split('T')[0],
      time: selectedTime,
      meetingLink: meetingLink,
    };
    if (isMakeUp) {
      if (onClassCreated) {
        onClassCreated(classData);
      }
    } else {
      try {
        await addUpcomingClass(classData);
        toast.success('Class scheduled successfully!');
        dispatch(changeEventActions.setScheduledTrigger());
        setIsOpen(false);
        clearFields();
      } catch (err) {
        console.error('Error scheduling class:', err);
        toast.error('Failed to schedule class');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGetLink = () => {
    setIsModalOpen(true);
    const fullMeetingLink = `https://lmsapi.duckdns.org`;
    setGetMeetingLink(fullMeetingLink);
  };

  return (
    <>
      <ToastContainer />
      <div>
        {!isMakeUp && (
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            onClick={handleOpenModal}
          >
            Schedule Class
          </button>
        )}

        {(isMakeUp || isOpen) && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 flex items-center justify-center bg-gray-500">
                <div className="relative sm:max-w-lg sm:w-full p-6 globalCardStyle border border-1 border-zinc-300">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <CrossIcon />
                  </button>
                  <h3
                    className="text-lg font-bold text-black leading-6 mb-4"
                    id="modal-title"
                  >
                    Schedule Class
                  </h3>
                  <form
                    className="text-left text-black"
                    onSubmit={handleSubmit}
                  >
                    {!hideTeacherDropdown && (
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
                          value={selectedTeacher?.id || ''}
                          onChange={handleTeacherChange}
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {`${teacher.firstName} ${teacher.lastName}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
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
                        disabled={!selectedTeacher}
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
                        disabled={!selectedStudent}
                      >
                        <option value="">Select Course</option>
                        {courses.map((course: any) => (
                          <option key={course.id} value={course.id}>
                            {course?.Course?.courseName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isMakeUp && 
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
                        className="mt-1 block w-full dark:bg-black pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                    </div>
                  }
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
                        className="mt-1 dark:bg-black block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={selectedTime}
                        onChange={handleTimeChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="meetingLink"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Meeting Link{' '}
                        <button
                          className="text-blue-500 hover:text-blue-700 underline cursor-pointer ml-2 text-sm font-medium "
                          onClick={() => {
                            handleGetLink();
                          }}
                          type="button"
                        >
                          (Open Meeting here to copy code)
                        </button>
                      </label>
                      <input
                        id="meetingLink"
                        type="text"
                        className="mt-1 dark:bg-black block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={meetingLink}
                        onChange={handleMeetingLinkChange}
                        placeholder="copy code from meeting tool(only code)"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                        disabled={loading}
                      >
                        {loading ? <Loader /> : 'Schedule'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {!teacherId && (
          <div className="mt-4">
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
                value={selectedTeacher?.id || ''}
                onChange={handleTeacherChange}
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            {selectedTeacher && selectedTeacher?.id && !teacherId && (
              <UpcomingClasses teacherId={selectedTeacher?.id} />
            )}
           
          </div>
        )}
      </div>
      <FullScreenModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              meetingLink={getmeetingLink}
            />
    </>
  );
};
