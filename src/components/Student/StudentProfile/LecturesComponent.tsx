import React from 'react'

interface Lecture {
    id: number;
    topic: string;
    duration: string;
    teacher: string;
  }
  
  const lectures: Lecture[] = [
    { id: 1, topic: 'Introduction to React', duration: '1h 30m', teacher: 'Dr. Sarah Johnson' },
    { id: 2, topic: 'State Management in React', duration: '2h 00m', teacher: 'Prof. Michael Chen' },
    { id: 3, topic: 'React Hooks Deep Dive', duration: '1h 45m', teacher: 'Dr. Emily Rodriguez' },
    { id: 4, topic: 'Building Responsive UIs with Tailwind CSS', duration: '1h 15m', teacher: 'Prof. Alex Turner' },
    { id: 5, topic: 'Advanced TypeScript for React Developers', duration: '2h 30m', teacher: 'Dr. Lisa Patel' },
  ];
export const LecturesComponent = () => {
  return (
   

    <div className=" mx-auto p-6 bg-[url('../../src/images/logo/background.png')] shadow-lg rounded-lg dark:bg-transparent">
    <h2 className="text-2xl  font-bold mb-6 text-graydark dark:text-slate-50">Course Lectures</h2>
    <ul className="">
      {lectures.map((lecture) => (
        <li key={lecture.id} className="bg-gray-100 p-4 rounded-md hover:bg-gray-200 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-graydark dark:text-slate-50">{lecture.topic}</h3>
              <p className="text-sm text-graydark dark:text-slate-50 mt-1">Duration: {lecture.duration}</p>
              <p className="text-sm text-graydark dark:text-slate-50 mt-1">Teacher: {lecture.teacher}</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200 ml-4">
              Start Lecture
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>






  )
}
