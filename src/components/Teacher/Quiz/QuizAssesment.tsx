import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createQuiz, getQuizzesByTeacher, addQuestionToQuiz, deleteQuiz, getQuizWithQuestion, assignCourseAndStudentToQuiz,  getCourseByStdId, getAllStudents } from '../../../api/auth';
import { Loader } from '../../Loader';
import CrossIcon from '../../Icons/CrossIcon';
import PreviewQuiz from './PreviewQuiz';
import { DeleteIcon } from '../../Icons/DeleteIcon';

interface Quiz {
  title: string;
  instructions: string;
  duration: number;
  passingScore: number;
}

interface SavedQuiz extends Quiz {
  id: number;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Course {
  id: number;
  courseName: string;
}


const QuizAssessment: React.FC = () => {


// quiz assignC

const [showAssignModal, setShowAssignModal] = useState(false);
const [selectedStudent, setSelectedStudent] = useState<string>('');
const [selectedCourse, setSelectedCourse] = useState<string>('');
const [students, setStudents] = useState<Student[]>([]);
const [courses, setCourses] = useState<Course[]>([]);
const [quizToAssign, setQuizToAssign] = useState<number | null>(null);





  const [quizQuestionCounts, setQuizQuestionCounts] = useState<{ [key: number]: number }>({});
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    instructions: '',
    duration: 0,
    passingScore: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  // Question form state
  const [questionType, setQuestionType] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  


  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);

  const teacherId = useSelector((state: any) => state.auth.userId);



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
  
  const handleAssignClick = (quizId: number) => {
    setQuizToAssign(quizId);
    setShowAssignModal(true);
  };
  
  const handleAssign = async () => {
    if (!quizToAssign || !selectedStudent || !selectedCourse) {
      toast.error('Please select a student and a course');
      return;
    }
  
    try {
      await assignCourseAndStudentToQuiz({
        quizId: quizToAssign.toString(),
        courseDetailsId: selectedCourse,
        studentId: selectedStudent,
      });
      // console.log("quizid:",quizToAssign,"courseid:",selectedCourse,"studentid:",selectedStudent)
      toast.success('Quiz assigned successfully');
      
      setShowAssignModal(false);
      resetAssignForm();
    } catch (error) {
      console.error('Error assigning quiz:', error);
      toast.error('Failed to assign quiz');
    }
  };
  
  const resetAssignForm = () => {
    setSelectedStudent('');
    setSelectedCourse('');
    setQuizToAssign(null);
  };



  









  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizzesByTeacher(teacherId);
        setSavedQuizzes(response.data);
        
    
        const counts: { [key: number]: number } = {};
        for (const quiz of response.data) {
          const quizDetails = await getQuizWithQuestion(quiz.id.toString());
          counts[quiz.id] = quizDetails.data.Questions.length;
     
        }
        setQuizQuestionCounts(counts);
        fetchQuizzes();
    
      } catch (error) {
        // toast.error('Failed to load quizzes. Please try again.');
      }
    };
    fetchQuizzes();
  }, [teacherId]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };
  

  const handleSave = async () => {
    setLoading(true);
    if(!quiz.title || !quiz.instructions || !quiz.duration || !quiz.passingScore){
      toast.info('Please fill all the fields');
      setLoading(false);
      return
    }
    try {
      const response = await createQuiz({
        ...quiz,
        teacherId,
      });
      const newQuiz = { ...quiz, id: response.data.id };
      setSavedQuizzes([...savedQuizzes, newQuiz]);
      toast.success('Quiz saved successfully!');
      setQuiz({
        title: '',
        instructions: '',
        duration: 0,
        passingScore: 0,
      });
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (quizId: number) => {
    setSelectedQuizId(quizId);
    setShowQuestionModal(true);
    resetQuestionForm();

  };
  const handleSaveQuestion = async () => {
    if (selectedQuizId === null || !questionType) return;
    
    setLoading(true);
    try {
      const apiQuestionType = {
        'multipleChoice': 'multiple_choice',
        'trueFalse': 'true_false',
        'shortAnswer': 'short_answer'
      } as const;
  
      if (!(questionType in apiQuestionType)) {
        throw new Error('Invalid question type');
      }
  
      const questionData = {
        type: apiQuestionType[questionType as keyof typeof apiQuestionType],
        question,
        options: questionType === 'multipleChoice' ? options.filter(option => option !== '') : undefined,
        correctAnswer: questionType === 'true_false' ? correctAnswer === 'true' : correctAnswer,
      };
    // console.log("Questiondata:::",questionData);
  
    
      await addQuestionToQuiz(selectedQuizId.toString(), questionData);
      // console.log("question added:",questionData)
     
      toast.success('Question saved successfully!');
      // setShowQuestionModal(false);
      resetQuestionForm();
      
    } catch (error) {
      toast.error('Failed to save question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetQuestionForm = () => {
    setQuestionType(null);
    setQuestion('');
    setOptions(['', '']);
    setCorrectAnswer('');
    
  };

  const handleQuestionTypeSelect = (type: string) => {
    setQuestionType(type);
  };

  const handleQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCorrectAnswer(e.target.value);
  };

  const handleDeleteClick = (quizId: number) => {
    setQuizToDelete(quizId);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (quizToDelete === null) return;

    try {
      await deleteQuiz(quizToDelete.toString());
      toast.success('Quiz deleted successfully!');
      const updatedQuizzes = savedQuizzes.filter((quiz) => quiz.id !== quizToDelete);
      setSavedQuizzes(updatedQuizzes);
    } catch (error) {
      toast.error('Failed to delete quiz. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
      setQuizToDelete(null);
    }
  };
















  return (
    <div className="containerr mt-6 p-6 globalCardStyle ">
     
        <div className="flex justify-between ">
        <h1 className='font-bold text-2xl p-2'>Saved Quizzes</h1>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-blue-500  px-3 py-2 text-white"
          >
            Add Quiz
          </button>

       
        </div>
      
        <div className="mt-4 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedQuizzes.map((savedQuiz) => (
            <div key={savedQuiz.id} className=" globalCardStyle shadow-lg p-4">
              <div className='flex justify-between'>
              <h3 className="text-lg font-semibold mb-2 ">{savedQuiz.title}</h3>
              <button
                  onClick={() => handleDeleteClick(savedQuiz.id)}
                 
                >
                  <DeleteIcon />
                </button>
              
              </div>
              <p className="text-sm mb-2">{savedQuiz.instructions}</p>
              <p className="text-sm mb-2">Duration: {savedQuiz.duration} minutes</p>
              <p className="text-sm mb-4">Passing Score: {savedQuiz.passingScore}%</p>
              {quizQuestionCounts[savedQuiz.id] ? (
                <p className="text-sm mb-4">Total Question: {quizQuestionCounts[savedQuiz.id]}</p>
              ) : (
                <p className="text-sm mb-4">No question available</p>
              )}
              <div className='md:flex md:justify-between lg:flex lg:justify-between grid grid-col-1 gap-2'>
              <button
                onClick={() => handleAddQuestion(savedQuiz.id)}
                className="bg-green-500 px-2 py-2 text-white text-sm   rounded-md hover:bg-green-600 transition-colors"
              >
                Add Question
              </button>

              <button
                  onClick={() => handleAssignClick(savedQuiz.id)}
                  className="bg-yellow-500 px-2 py-2 text-white text-sm rounded-md hover:bg-yellow-600 transition-colors"
                >  
                  Assign Quiz
                </button>
           



              <PreviewQuiz 
            savedQuizId={savedQuiz.id.toString()} 
            questionCount={quizQuestionCounts[savedQuiz.id] || 0}
          />


              </div>
            </div>
          ))}
        </div>




        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center border bg-black bg-opacity-50">
            <div className="relative bg-white border p-4 rounded-md shadow-lg w-full max-w-lg">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 p-2"
              >
                <CrossIcon />
              </button>
              <h2 className="text-xl font-bold mb-4">Quiz Form</h2>
              <form className="space-y-4">
                {/* Quiz form fields */}
                {/* ... (unchanged) ... */}



                <div>
                  <label className="text-sm font-medium" htmlFor="title">
                    Quiz Title
                  </label>
                  <input
                    className="mt-1 block w-full dark:text-black rounded-md border border-blue-500 px-3 py-2"
                    id="title"
                    name="title"
                    placeholder="Enter quiz title"
                    value={quiz.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="instructions">
                    Instructions
                  </label>
                  <textarea
                    className="mt-1 block w-full dark:text-black rounded-md border border-blue-500 px-3 py-2"
                    id="instructions"
                    name="instructions"
                    placeholder="Enter quiz instructions"
                    value={quiz.instructions}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="duration">
                      Duration (minutes)
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border border-blue-500 px-3 py-2"
                      id="duration"
                      name="duration"
                      type="number"
                      placeholder="Enter duration"
                      value={quiz.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium"
                      htmlFor="passingScore"
                    >
                      Passing Score (%)
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border border-blue-500 px-3 py-2"
                      id="passingScore"
                      name="passingScore"
                      type="number"
                      placeholder="Enter passing score"
                      value={quiz.passingScore}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="relative rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
                    disabled={loading} 
                  >
                    {loading && <Loader />}
                    {!loading && 'Save Quiz'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showQuestionModal && selectedQuizId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white p-4 rounded-md shadow-lg w-full max-w-lg">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="absolute top-2 right-2 p-2"
              >
                <CrossIcon />
              </button>
              <h2 className="text-xl font-bold mb-4">Add Question</h2>
              {!questionType ? (
                <div className="space-y-2 relative">
                  <button
                    onClick={() => handleQuestionTypeSelect('multipleChoice')}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Add Multiple Choice
                  </button>
                  <button
                    onClick={() => handleQuestionTypeSelect('trueFalse')}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Add True/False
                  </button>
                  <button
                    onClick={() => handleQuestionTypeSelect('shortAnswer')}
                    className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Add Short Answer
                  </button>
                </div>
              ) : (
                <form className="space-y-4 relative">
                  <div>
                    <label className="text-sm font-medium" htmlFor="question">
                      Question
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      id="question"
                      value={question}
                      onChange={handleQuestionInputChange}
                      placeholder="Enter your question"
                    />
                  </div>

                  {questionType === 'multipleChoice' && (
                    <div>
                      <label className="text-sm font-medium">Options</label>
                      {options.map((option, index) => (
                        <input
                          key={index}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => setOptions([...options, ''])}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Add Option
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium" htmlFor="correctAnswer">
                      Correct Answer
                    </label>
                    {questionType === 'multipleChoice' ? (
                      <select
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        id="correctAnswer"
                        value={correctAnswer}
                        onChange={handleCorrectAnswerChange}
                      >
                        <option value="">Select correct answer</option>
                        {options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : questionType === 'trueFalse' ? (
                      <select
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        id="correctAnswer"
                        value={correctAnswer}
                        onChange={handleCorrectAnswerChange}
                      >
                        <option value="">Select correct answer</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <><p className='text-sm text-gray-500'>Only write keywords with comas that support the answer</p><input
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                              id="correctAnswer"
                              value={correctAnswer}
                              onChange={handleCorrectAnswerChange}
                              placeholder="Enter correct answer" /></>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveQuestion}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                      disabled={loading}
                    >
                      {loading ? <Loader /> : 'Save Question'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}


{showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-4">Are you sure you want to delete this quiz?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}









{showAssignModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-md shadow-lg w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Assign Quiz</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="student">
            Student
          </label>
           <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="flex h-10 dark:text-black w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {`${student.firstName} ${student.lastName}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="course">
            Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="flex h-10 dark:text-black w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedStudent}
          >
            <option value="">Select course</option>
            {courses.map((course:any) => (
              <option key={course.id} value={course.id}>
                {course?.Course?.courseName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowAssignModal(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"


          >
              {loading && <Loader />}
                    {!loading && 'Assign Quiz'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}




 

      <ToastContainer />
    </div>
  );
};

export default QuizAssessment;