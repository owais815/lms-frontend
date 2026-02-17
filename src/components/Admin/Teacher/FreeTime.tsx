import React, { useState, useEffect } from 'react';
import { getAllTeachers, getTeachersFreeTimeSlots } from '../../../api/auth';
import { FaClock } from 'react-icons/fa';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';

interface FreeSlot {
  start: string;
  end: string;
}

const FreeTime: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [freeSlots, setFreeSlots] = useState<{ [key: number]: FreeSlot[] }>({});
  const [selectedRange, setSelectedRange] = useState('evening');

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchFreeTimeSlots();
  }, [selectedTeacher, selectedRange]);

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachers();
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchFreeTimeSlots = async () => {
    try {
      const response = await getTeachersFreeTimeSlots(
        selectedTeacher,
        selectedRange,
      );
      setFreeSlots(response.data.freeSlots);
    } catch (error) {
      console.error('Error fetching free slots:', error);
    }
  };

  const getTeacherFirstName = (id:any) =>{
    let teacher = teachers.find((t:any) => t.id === Number(id));
    return teacher.firstName;
  }

  return (
    <div className="p-6 w-full bg-white dark:bg-black shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Teachers Free Time Slots</h2>
      <div className="flex items-center justify-between border-b-2">
        {/* Time Range Tabs */}
        <div className="flex space-x-4 mb-4">
          {['evening', 'morning'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 rounded ${
                selectedRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {range === 'morning' ? '5 AM - 5 PM' : '5 PM - 5 AM'}
            </button>
          ))}
        </div>

        {/* Teacher Dropdown */}
        <div className="mb-4">
          <select
            value={selectedTeacher || ''}
            onChange={(e) => setSelectedTeacher(Number(e.target.value) || null)}
            className="p-2 border rounded w-full"
          >
            <option value="">All Teachers</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher?.firstName} {teacher?.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Free Time Slots Display */}
      <div className=' gap-4 mt-2  bg-white dark:bg-black'>
      {Object.entries(freeSlots)
  .filter(([teacherId]) => teacherId !== 'null' && teacherId !== null) // Filter out invalid teacherIds
  .map(([teacherId, slots]) => {
    const teacher = teachers.find((t) => t.id === Number(teacherId));
    console.log("teacherId:", teacherId, "Type:", typeof teacherId);
    console.log("Found Teacher:", teacher);

    return (
      <div key={teacherId} className="mb-6 shadow-2xl rounded-2xl p-6" style={{ width: '100%', overflowY: 'scroll' }}>
        <h3 className="text-xl font-semibold text-gray-700">
          <GetUserImageAndName
            firstName={teacher?.firstName || 'Unknown'}
            lastName={teacher?.lastName || 'Teacher'}
            userId={teacherId}
            userType={'teacher'}
            imageUrl={teacher?.imageUrl || 'default-image-url'}
            showType={true}
          />
        </h3>
        <ul className="list-disc ml-6 mt-2 flex gap-4">
          {slots.length > 0 ? (
            slots.map((slot, index) => (
              <li key={index} className="text-gray-600 flex gap-2 items-center bg-blue-200 p-2 rounded-2xl">
                <p className="text-sm text-gray-600 mb-2">
                  <FaClock className="inline mr-2" />
                  {new Date(`1970-01-01T${slot.start}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </p>
                {'-'}
                <p className="text-sm text-gray-600 mb-2">
                  <FaClock className="inline mr-2" />
                  {new Date(`1970-01-01T${slot.end}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </p>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No free slots available</li>
          )}
        </ul>
      </div>
    );
  })}
      </div>
    </div>
  );
};

export default FreeTime;