import React, { useState } from 'react';
import { CoursesComponent } from './CoursesComponent';
import { LecturesComponent } from './LecturesComponent';
import { AssignmentsComponent } from './AssignmentsComponent';
import { QuizComponent } from './QuizComponent';
import { ProgressComponent } from './ProgressComponent';
import { ProfileComponent } from './ProfileComponent';
import { PaymentComponent } from './PaymentComponent';
import { AttendanceComponent } from './AttendanceComponent';


interface Tab {
  id: string;
  label: string;
}

interface TabContent {
  [key: string]: React.ReactNode;
}





export const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const tabs: Tab[] = [
    // { id: 'courses', label: 'Courses' },
    // { id: 'lectures', label: 'Lectures' },
    // { id: 'assignments', label: 'Assignments' },
    // { id: 'quiz', label: 'Quiz' },
    // { id: 'progress', label: 'Progress' },
    // { id: 'attendance', label: 'Attendance' },
    // { id: 'paymentHistory', label: 'Payment History' },
    { id: 'profile', label: 'Profile' },
  ];

  const tabContent: TabContent = {
    // courses: <CoursesComponent />,
    // lectures: <LecturesComponent /> ,
    // assignments: <AssignmentsComponent />,
    // quiz: <QuizComponent />,
    // progress: <ProgressComponent />,
    // attendance: <AttendanceComponent />,
    // paymentHistory:<PaymentComponent />,
   profile:<ProfileComponent />
  
  };

  return (
      <div className="containerr mx-auto ">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center justify-evenly">
            {tabs.map((tab) => (
              <li key={tab.id} className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${
                activeTab === tab.id ? '' : 'hidden'
              } p-4 rounded-lg bg-gray-50 dark:bg-black dark:bg-gray-800`}
              role="tabpanel"
              aria-labelledby={`${tab.id}-tab`}
            >
              {tabContent[tab.id]}
            </div>
          ))}
        </div>
      </div>
    
  );
};
