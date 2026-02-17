import React, { useState } from 'react';

import SearchIcon from '../Icons/SearchIcon';
import { EnrolledStudents } from './TeacherProfile/EnrolledStudents';


export const Mystudent = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStudentsLoaded = (count: number) => {
    setTotalStudents(count);
  };
  return (
    <div className='containerr mt-6'>
    <div className='flex justify-between items-center mb-6'>
     <h1 className="MainHeadings mt-2">
         Students Overview
      </h1>
      <div className="relative  ">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" block w-50 pl-10 pr-3 py-1 text-sm text-gray-900 rounded-lg bg-gray-50 dark:text-balck focus:outline-none  border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-graydark dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search students..."
        />
      </div>
      </div>
     

      <div className="">
        <EnrolledStudents
          onStudentsLoaded={handleStudentsLoaded}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};
