import React, { useState, useEffect } from 'react';
import feedback from '../../../images/logo/feedback.svg';
import { addFeedback, getCourseByStdId } from '../../../api/auth';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [teachers, setTeachers] = useState<{ id: number; name: string }[]>([]);

  const userId = useSelector((state: any) => state.auth.userId);

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
  useEffect(() => {
    fetchCourses();
  }, [userId]);
  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTeacher || !rating || !feedbackText) {
      toast.info('Please fill out all the fields');
      return;
    }

    try {
      const response = await addFeedback({
        studentId: userId,
        teacherId: selectedTeacher,
        feedback: feedbackText,
        rating: rating,
      });
      // console.log('Feedback submitted:', response.data);
      setSelectedTeacher('');
      setRating(null);
      setFeedbackText('');
      toast.success(response.data.message);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error('Unable to Feedback Submitted successfully!');
    }
  };

  return (
    <div className='containerr mt-6'>
      <ToastContainer />
      <div className="globalCardStyle p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <img className="w-24 h-24" src={feedback} alt="feedback" />
          <h3 className="text-3xl font-bold text-center leading-tight">
            Provide Feedback
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Help us improve by sharing your feedback on your teacher.
          </p>
        </div>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Teacher</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select teacher
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id.toString()}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="feedback">
              Feedback
            </label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              id="feedback"
              placeholder="Share your thoughts on the teacher's performance..."
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>
          </div>
          <div className="space-y-2">
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
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
