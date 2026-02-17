import React, { useState } from 'react';
import { deleteQuestion, getQuizWithQuestion } from '../../../api/auth';
import CrossIcon from '../../Icons/CrossIcon';
import { DeleteIcon } from '../../Icons/DeleteIcon';
import { toast } from 'react-toastify';

interface Question {
  id: number;
  quizId: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options: string[] | null;
  correctAnswer: string;
  createdAt: string;
  updatedAt: string;
}
interface PreviewQuizProps {
  savedQuizId: string;
  questionCount: number;
}
interface QuizDetails {
  id: number;
  title: string;
  instructions: string;
  duration: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
  quizId: number | null;
  Questions: Question[];
}

const PreviewQuiz: React.FC<PreviewQuizProps> = ({ savedQuizId,  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  const previewQuiz = async (quizId: string) => {
    setLoading(true);
    try {
      const response = await getQuizWithQuestion(quizId);
      setQuizDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (questionToDelete !== null) {
      try {
        // console.log('Deleting question:', questionToDelete);
        await deleteQuestion(questionToDelete.toString());
        toast.success('Question deleted successfully!');

        if (quizDetails) {
          const updatedQuestions = quizDetails.Questions.filter(
            (q) => q.id !== questionToDelete
          );
          setQuizDetails({ ...quizDetails, Questions: updatedQuestions });
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error('Failed to delete question. Please try again.');
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const confirmDeleteQuestion = (questionId: number) => {
    setQuestionToDelete(questionId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <button
        onClick={() => previewQuiz(savedQuizId)}
        className="bg-blue-500 text-white px-2 py-2 text-sm  rounded-md hover:bg-blue-600 transition-colors"
      >
        {loading ? 'Loading...' : 'Preview Quiz'}
      </button>

      {isModalOpen && quizDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {quizDetails.title}
                </h2>
               
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <CrossIcon />
                </button>
              </div>

              {quizDetails.Questions.length > 0 ? (
                quizDetails.Questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-gray-100 rounded-lg p-4 mb-4 shadow"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-lg mb-2">
                        Question {index + 1}
                      </h4>
                      <button
                        onClick={() => confirmDeleteQuestion(question.id)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                    <p className="mb-2">
                      <strong>Type:</strong>{' '}
                      {question.type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="mb-2">
                      <strong>Question:</strong> {question.question}
                    </p>
                    {question.type === 'multiple_choice' &&
                      question.options && (
                        <div className="mb-2">
                          <strong>Options:</strong>
                          <ul className="list-disc list-inside pl-4">
                            {question.options.map((option, optionIndex) => (
                              <li key={optionIndex}>{option}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    <p>
                      <strong>Correct Answer:</strong> {question.correctAnswer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No questions available for this quiz.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete this question?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewQuiz;
