import React, { useState } from 'react'
import SearchIcon from '../Icons/SearchIcon';
interface TeachingLog {
    date: string;
    subject: string;
    class: string;
    startTime: string;
    endTime: string;
    duration: string;
    notes: string;
  }
export const TeachingHourLog = () => {

    const [logs, setLogs] = useState<TeachingLog[]>([
        { date: '2023-05-22', subject: 'Advanced Algebra', class: 'Mathematics 101', startTime: '09:00 AM', endTime: '10:30 AM', duration: '1.5 hours', notes: 'Quadratic Equations and Applications' },
        { date: '2023-05-22', subject: 'Calculus I', class: 'Mathematics 201', startTime: '11:00 AM', endTime: '12:30 PM', duration: '1.5 hours', notes: 'Limits and Continuity' },
        { date: '2023-05-23', subject: 'Statistics', class: 'Mathematics 301', startTime: '02:00 PM', endTime: '03:30 PM', duration: '1.5 hours', notes: 'Probability Distributions' },
        { date: '2023-05-23', subject: 'Geometry', class: 'Mathematics 102', startTime: '09:00 AM', endTime: '10:30 AM', duration: '1.5 hours', notes: 'Triangles and Congruence' },
        { date: '2023-05-24', subject: 'Mathematical Modeling', class: 'Mathematics 401', startTime: '10:00 AM', endTime: '01:00 PM', duration: '3 hours', notes: 'Linear Programming and Optimization' },
      ]);
  return (
    <div className="p-6">
    <main>
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Teaching Hours Log</h2>
      <div className="flex space-x-4 mb-4">
        <select className="border p-2 rounded text-black  ">
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select className="border p-2 rounded text-black ">
          {[2023, 2022, 2021].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select className="border p-2 text-black  rounded">
          <option value="">All Subjects</option>
          {['Advanced Algebra', 'Calculus I', 'Statistics', 'Geometry', 'Mathematical Modeling'].map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        
        <div className="relative">
          <input
            type="text"
            className="block w-50 pl-10 pr-3 py-1 text-sm text-gray-900 rounded-lg bg-gray-50  text-black focus:outline-none border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-graydark dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
          <div className="absolute inset-y-0 left-0 flex mb-2 items-center justify-center pl-3 pointer-events-none">
            <SearchIcon />
          </div>
        </div>

      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-black dark:text-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Subject</th>
              <th className="border p-2 text-left">Class</th>
              <th className="border p-2 text-left">Start Time</th>
              <th className="border p-2 text-left">End Time</th>
              <th className="border p-2 text-left">Duration</th>
              <th className="border p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="border p-2">{log.date}</td>
                <td className="border p-2">{log.subject}</td>
                <td className="border p-2">{log.class}</td>
                <td className="border p-2">{log.startTime}</td>
                <td className="border p-2">{log.endTime}</td>
                <td className="border p-2">{log.duration}</td>
                <td className="border p-2">{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-blue-500 rounded-lg p-4 shadow-lg mt-4 flex text-white justify-between">
        <div className="text-center">
          <h3 className="text-2xl font-bold ">9</h3>
          <p>Total Hours</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold ">5</h3>
          <p>Classes Taught</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold ">5</h3>
          <p>Subjects Covered</p>
        </div>
      </div>
    </main>
  </div>
  )
}
