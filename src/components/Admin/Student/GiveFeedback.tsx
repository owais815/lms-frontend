import React, { useState, useEffect } from 'react';
import feedback from '../../../images/logo/feedback.svg';
import {
  addFeedback,
  getAllStudents,
  getAssignedStudents,
  getCourseByStdAndTeacherId,
  getCourseByStdId,
  giveFeedbackAdmin,
} from '../../../api/auth';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import GetAdminFeedback from '../../Student/StudentFeedback/GetAdminFeedback';

const areasToImprove = ['Reading', 'Writing', 'Speaking', 'Listening'];
const grades = [
  { value: 'A', label: 'A(90-100)' },
  { value: 'B', label: 'B(80-89)' },
  { value: 'C', label: 'C(70-79)' },
  { value: 'D', label: 'D(40-69)' },
  { value: 'F', label: 'F(0-39)' },
];

const GiveFeedbackAdmin: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedAreaToImprove, setSelectedAreaToImprove] =
    useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const [teachers, setTeachers] = useState<{ id: number; name: string }[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [showFeebacks, setShowFeebacks] = useState(false);

  const userId = useSelector((state: any) => state.auth.userId);
  const userType = useSelector((state: any) => state.auth.userType);

  const fetchCourses = async () => {
    try {
      const response = await getCourseByStdId(userId);
      if (response.data && Array.isArray(response.data.course)) {
        const uniqueTeachers = response.data.course.reduce(
          (acc: { id: number; name: string }[], course: any) => {
            if (
              course.Teacher &&
              !acc.some((t) => t.id === course.Teacher.id)
            ) {
              acc.push({
                id: course.Teacher.id,
                name: `${course.Teacher.firstName} ${course.Teacher.lastName}`,
              });
            }
            return acc;
          },
          [],
        );

        setTeachers(uniqueTeachers);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const studentsResponse = await getAllStudents();
      const studentsData = studentsResponse.data.students || [];
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  const fetchAssignedStudents = async () => {
    try {
      const response = await getAssignedStudents(userId);
      const assignedStudentsData = response.data.students || [];

      setStudents(assignedStudentsData);
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      // setError('Failed to fetch assigned students');
      setStudents([]);
    }
  };

  useEffect(() => {
    if (userType == 'teacher') {
      fetchAssignedStudents();
    } else {
      fetchStudents();
    }
    fetchCourses();
  }, [userId]);
  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedStudent || !selectedCourse || !feedbackText) {
      alert('Please fill all fields');
      return;
    }
    try {
      let feedbackObj = {
        studentId: selectedStudent,
        courseDetailsId: selectedCourse,
        progressInGrades: selectedGrade,
        areasToImprove: selectedAreaToImprove,
        feedback: feedbackText,
        teacherId: userType == 'teacher' ? userId : null,
      };
      debugger;
      const response = await giveFeedbackAdmin(feedbackObj);
      clearFields();
      toast.success(response.data.message);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error('Unable to submit Feedback!');
    }
  };
  const clearFields = () => {
    setFeedbackText('');
    setSelectedStudent('');
    setSelectedCourse('');
    setSelectedGrade('');
    setSelectedAreaToImprove('');
  };
  const fetchCoursesStd = async () => {
    if (!userId) {
      return;
    }

    try {
      const coursesResponse = await getCourseByStdId(selectedStudent);

      if (coursesResponse.data && Array.isArray(coursesResponse.data.course)) {
        setCourses(coursesResponse.data.course);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchCoursesForTeacher = async () => {
    if (selectedStudent) {
      try {
        const coursesResponse = await getCourseByStdAndTeacherId(
          selectedStudent,
          userId,
        );

        if (
          coursesResponse.data &&
          Array.isArray(coursesResponse.data.course)
        ) {
          setCourses(coursesResponse.data.course);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    } else {
      setCourses([]);
    }
  };

  useEffect(() => {
    if (userType == 'teacher') {
      fetchCoursesForTeacher();
    } else {
      fetchCoursesStd();
    }
  }, [selectedStudent]);
  return (
    <>
      <ToastContainer />
      <div className="globalCardStyle mt-6 containerr p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <img className="w-24 h-24" src={feedback} alt="feedback" />
          <h3 className="text-3xl font-bold text-center leading-tight">
            Provide Feedback
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Help Student to improve by sharing your feedback.
          </p>
        </div>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-gray-300 dark:bg-black dark:text-white dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Student
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id.toString()}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Select course */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Courses</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Course
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.Course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Areas to improve */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Areas to improve</label>
            <select
              value={selectedAreaToImprove}
              onChange={(e) => setSelectedAreaToImprove(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Option
              </option>
              {areasToImprove.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* Progress in grades */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Progress in grades</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Grade
              </option>
              {grades.map((val) => (
                <option key={val.value} value={val.value}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="feedback">
              Feedback
            </label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black text-gray-800  px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              id="feedback"
              placeholder="Share your thoughts on the performance..."
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>
          </div>
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl focus:outline-none ${
                    rating && star <= rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div> */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>

      <div>
        {userType !== 'teacher' && (
          <button
            onClick={() => {
              setShowFeebacks(!showFeebacks);
            }}
            className="mb-6 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors duration-300 flex items-center my-4 float-right"
          >
            <FaEye className="mr-1" /> View Feedbacks
          </button>
        )}
      </div>
      {showFeebacks && (
        <div className="mt-20 globalCardStyle">
          <GetAdminFeedback isAdmin={true} />
        </div>
      )}
    </>
  );
};

export default GiveFeedbackAdmin;
