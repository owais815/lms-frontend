import React from 'react';

interface Quiz {
  id: number;
  title: string;
  subject: string;
  duration: string;
  totalQuestions: number;
  availableUntil: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  score?: number;
}

const quizzes: Quiz[] = [
  {
    id: 1,
    title: 'React Fundamentals',
    subject: 'Web Development',
    duration: '30 minutes',
    totalQuestions: 20,
    availableUntil: '2024-07-20',
    status: 'Not Started',
  },
  {
    id: 2,
    title: 'JavaScript ES6+ Features',
    subject: 'Programming',
    duration: '45 minutes',
    totalQuestions: 25,
    availableUntil: '2024-07-25',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'CSS Grid and Flexbox',
    subject: 'Web Design',
    duration: '40 minutes',
    totalQuestions: 30,
    availableUntil: '2024-07-18',
    status: 'Completed',
    score: 85,
  },
];

export const QuizComponent = () => {
  const getStatusColor = (status: Quiz['status']) => {
    switch (status) {
      case 'Not Started':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const getActionButton = (quiz: Quiz) => {
    switch (quiz.status) {
      case 'Not Started':
        return (
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
            Start Quiz
          </button>
        );
      case 'In Progress':
        return (
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
            Continue Quiz
          </button>
        );
      case 'Completed':
        return (
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
            Review Quiz
          </button>
        );
    }
  };

  return (
    <div className=" mx-auto p-6 bg-[url('../../src/images/logo/background.png')] shadow-lg rounded-lg dark:bg-transparent">
      <h2 className="text-2xl font-bold mb-6 text-graydark dark:text-slate-50">
        Available Quizzes
      </h2>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-graydark dark:text-slate-50">
                  {quiz.title}
                </h3>
                <p className="text-sm text-graydark dark:text-slate-50 mt-1">
                  Subject: {quiz.subject}
                </p>
                <p className="text-sm text-graydark dark:text-slate-50">
                  Duration: {quiz.duration}
                </p>
                <p className="text-sm text-graydark dark:text-slate-50">
                  Questions: {quiz.totalQuestions}
                </p>
                <p className="text-sm text-graydark dark:text-slate-50">
                  Available until:{' '}
                  {new Date(quiz.availableUntil).toLocaleDateString()}
                </p>
                {quiz.score !== undefined && (
                  <p className="text-sm font-semibold text-green-600 mt-2">
                    Score: {quiz.score}%
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  quiz.status,
                )}`}
              >
                {quiz.status}
              </span>
            </div>
            <div className="mt-4 flex justify-end">{getActionButton(quiz)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
