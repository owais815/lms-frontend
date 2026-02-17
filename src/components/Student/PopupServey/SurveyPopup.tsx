import  { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { submitSurvey } from '../../../api/auth';
const SurveyPopup = ({ classId, studentId, teacherId, onComplete }:any) => {
  const [ratings, setRatings] = useState<any>({
    classRating: 0,
    lessonRating: 0,
    teacherRating: 0
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Disable page refresh
    const handleBeforeUnload = (e:any) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Disable right click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, []);

  const handleRating = (type:any, value:any) => {
    setRatings((prev:any) => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async () => {
    if (Object.values(ratings).some(rating => rating === 0)) {
      alert('Please provide all ratings before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
    //   await axios.post('/api/survey/submit', {
    //     studentId,
    //     classId,
    //     teacherId,
    //     ...ratings,
    //     feedback
    //   });
    let obj ={
      studentId:studentId,
      classId:classId,
      teacherId:teacherId,
      ...ratings,
      feedback
    }
    const response:any = await submitSurvey(obj);
    if(response){
      onComplete();
    }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingComponent = ({ type, label }:any) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleRating(type, value)}
            className={`p-1 rounded-full transition-colors ${
              ratings[type] >= value 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <FaStar size={24} className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Class Feedback</h2>
        
        <RatingComponent 
          type="classRating" 
          label="How would you rate this class overall?" 
        />
        
        <RatingComponent 
          type="lessonRating" 
          label="How would you rate the lesson content?" 
        />
        
        <RatingComponent 
          type="teacherRating" 
          label="How would you rate your teacher's performance?" 
        />
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Share your thoughts..."
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

export default SurveyPopup;