import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getStudentQuizzes,
  startQuizAttempt,
  getQuizWithQuestion,
  submitQuizAttempt,
  checkIfStudentHasAttemptedQuiz,
} from '../../../api/auth';
import { Loader } from '../../Loader';
import { toast, ToastContainer } from 'react-toastify';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';
import { EmptyTemplate } from '../../Generic/EmptyTemplate';

interface Quiz {
  id: number;
  title: string;
  instructions: string;
  duration: number;
  passingScore: number;
  createdAt: string;
  CourseDetails: {
    id: number;
    courseName: string;
    teacherId: number;
  };
  Teacher: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
}

interface QuizDetails {
  id: number;
  title: string;
  instructions: string;
  duration: number;
  passingScore: number;
  Questions: Question[];
}

const StudentQuiz: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizDetails | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const [quizScores, setQuizScores] = useState<{ [key: number]: number }>({});

  const studentId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getStudentQuizzes(studentId);
        setQuizzes(response.data);
        console.log(response.data)
        
        const completed = new Set<number>();
        const scores: { [key: number]: number } = {};
        
        for (const quiz of response.data) {
          try {
            const attemptResponse = await checkIfStudentHasAttemptedQuiz(studentId, quiz.id.toString());
            // console.log(`Attempt response for quiz ${quiz.id}:`, attemptResponse.data);
            
            if (attemptResponse.data.hasAttempted) {
              completed.add(quiz.id);
              if (attemptResponse.data.attempt && attemptResponse.data.attempt.score !== null) {
                scores[quiz.id] = parseFloat(attemptResponse.data.attempt.score.toFixed(2));
              }
            }
          } catch (error) {
            console.error(`Error checking attempt for quiz ${quiz.id}:`, error);
          }
        }
        
        setCompletedQuizzes(completed);
        setQuizScores(scores);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [studentId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleStartQuiz = async (quizId: number) => {
    try {
      const startResponse = await startQuizAttempt({
        quizId: quizId.toString(),
        studentId,
      });

      if (startResponse.data.error) {
        alert(startResponse.data.error);
        // console.log('Existing attempt:', startResponse.data.data);
        return;
      }

      setAttemptId(startResponse.data.id);
      const response = await getQuizWithQuestion(quizId.toString());
      setCurrentQuiz(response.data);
      setTimeLeft(response.data.duration * 60);
      setShowQuizModal(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.Questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // console.log('Submitting quiz...', attemptId, answers);
    if (attemptId && currentQuiz) {
      try {
        const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
          if (Array.isArray(answer)) {
            return answer.join(', ');
          }
          return answer;
        });

        const response = await submitQuizAttempt(attemptId, {
          answers: formattedAnswers,
          endTime: timeLeft,
        });
        // console.log('response Quiz Attempt :::', response);

        setCompletedQuizzes((prev) => new Set(prev).add(currentQuiz.id));
        const score = parseFloat(response.data.score.toFixed(2));
        setQuizScores((prev) => ({ ...prev, [currentQuiz.id]: score }));

        const isPassed = score >= currentQuiz.passingScore;
        const message = isPassed
          ? `Congratulations! You have passed the exam with a score of ${score}%.`
          : `Sorry, you have failed the test. Your score is ${score}%.`;

        toast(message, {
          type: isPassed ? 'success' : 'error',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error('Error submitting quiz:', error);
        toast('Error submitting quiz. Please try again.', {
          type: 'error',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
    setShowQuizModal(false);
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(null);
    setAttemptId(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (quizzes.length === 0) {
    return (
      
      <div className="containerr mx-auto mt-6 px-4 py-8 globalCardStyle py-4 px-3">
       <EmptyTemplate
        heading={"No Quizzes Available"}
        description={"Chill and wait for the instructor to start a quiz."}
       />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="MainHeadings  mb-6">
        Available Quizzes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz:any) => (
          <div
            key={quiz.id}
            className="globalCardStyle py-4 px-3"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Course:</span> {quiz?.CourseDetails?.Course?.courseName}
              </p>
              <div className="text-gray-600 mb-2 flex items-center gap-2">
                {/* <span className="font-semibold">Instructor:</span>  */}
                  <GetUserImageAndName 
                    imageUrl={quiz?.Teacher?.imageUrl}
                    firstName={quiz.Teacher.firstName} 
                    lastName={quiz?.Teacher?.lastName}
                    userId={quiz?.Teacher?.id}
                    userType={"teacher"}
                  />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Quiz title:</span> {quiz.title}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Instructions:</span> {quiz.instructions}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Passing Score:</span> {quiz.passingScore}%
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Duration:</span> {quiz.duration} minutes
              </p>

              {quizScores[quiz.id] !== undefined && (
                  <p className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Your Score:</span> {quizScores[quiz.id]}%
                  </p>
                )}
            </div>
            
            {completedQuizzes.has(quiz.id) ? (
              <div className="mt-4">
               
                <p className=" text-sm text-gray-700 text-green-600">
                    <span className="font-semibold ">Status:</span> Quiz Completed
                  </p>
              
              
              </div>
            ) : (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => handleStartQuiz(quiz.id)}
              >
                Start Quiz
              </button>
            )}
          </div>
        ))}
      </div>

      {showQuizModal && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{currentQuiz.title}</h2>
              <div className="text-xl font-bold">
                Time left: {timeLeft !== null ? formatTime(timeLeft) : 'N/A'}
              </div>
            </div>

            <h3 className="text-xl mb-4">
              {currentQuiz.Questions[currentQuestionIndex].question}
            </h3>
            {currentQuiz.Questions[currentQuestionIndex].type === 'multiple_choice' && (
              <div>
                {currentQuiz.Questions[currentQuestionIndex].options?.map((option, index) => (
                  <label key={index} className="block mb-2">
                    <input
                      type="radio"
                      name={`question-${currentQuiz.Questions[currentQuestionIndex].id}`}
                      value={option}
                      checked={answers[currentQuiz.Questions[currentQuestionIndex].id] === option}
                      onChange={() => handleAnswerChange(currentQuiz.Questions[currentQuestionIndex].id, option)}
                    />{' '}
                    {option}
                  </label>
                ))}
              </div>
            )}
            {currentQuiz.Questions[currentQuestionIndex].type === 'true_false' && (
              <div>
                <label className="block mb-2">
                  <input
                    type="radio"
                    name={`question-${currentQuiz.Questions[currentQuestionIndex].id}`}
                    value="true"
                    checked={answers[currentQuiz.Questions[currentQuestionIndex].id] === 'true'}
                    onChange={() => handleAnswerChange(currentQuiz.Questions[currentQuestionIndex].id, 'true')}
                  />{' '}
                  True
                </label>
                <label className="block mb-2">
                  <input
                    type="radio"
                    name={`question-${currentQuiz.Questions[currentQuestionIndex].id}`}
                    value="false"
                    checked={answers[currentQuiz.Questions[currentQuestionIndex].id] === 'false'}
                    onChange={() => handleAnswerChange(currentQuiz.Questions[currentQuestionIndex].id, 'false')}
                  />{' '}
                  False
                </label>
              </div>
            )}
            {currentQuiz.Questions[currentQuestionIndex].type === 'short_answer' && (
              <textarea
                className="w-full p-2 border rounded"
                value={(answers[currentQuiz.Questions[currentQuestionIndex].id] as string) || ''}
                onChange={(e) => handleAnswerChange(currentQuiz.Questions[currentQuestionIndex].id, e.target.value)}
                placeholder="Enter your answer here"
              />
            )}
            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              {currentQuestionIndex < currentQuiz.Questions.length - 1 ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;