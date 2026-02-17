import React, { useEffect, useState } from 'react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SurveyDashboard from '../../Generic/TeacherSurvey';
import {
  getRecentStudents,
  getTotalRevenue,
  getTotalStudents,
  getTotalTeachers,
} from '../../../api/auth';
import { AllInfoCard } from './AllInfoCard';
import { DollarSign, GraduationCap, User, UserCog } from 'lucide-react';
import { UpcomingClassesNextHours } from '../Student/UpcomingClassesNextHours';
import FreeTime from '../Teacher/FreeTime';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
);
export const AdminDashborad = () => {
  const [revenue, settotalRevenue] = useState(0);
  const [students, setStudents] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [recent, setRecentStudents] = useState(0);

  const fetchTotalRevenue = async () => {
    try {
      const response = await getTotalRevenue();

      if (response.data) {
        settotalRevenue(response.data.totalRevenue);
      }
    } catch (err) {}
  };
  const fetchTotalStudents = async () => {
    try {
      const response = await getTotalStudents();

      if (response.data) {
        setStudents(response.data.totalStudents);
      }
    } catch (err) {}
  };

  const fetchTotalTeachers = async () => {
    try {
      const response = await getTotalTeachers();

      if (response.data) {
        setTeachers(response.data.totalTeachers);
      }
    } catch (err) {}
  };

  const fetchRecentStudents = async () => {
    try {
      const response = await getRecentStudents();

      if (response.data) {
        setRecentStudents(response.data.totalRecentStudents);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchTotalRevenue();
    fetchTotalStudents();
    fetchTotalTeachers();
    fetchRecentStudents();
  }, []);

  return (
    <div className="mx-4">
      <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <AllInfoCard
          title="Active Students"
          value={students}
          description="Students enrolled and active"
          icon={<User />}
        />
        <AllInfoCard
          title="Active Teachers"
          value={teachers}
          description="Teachers active and teaching"
          icon={<GraduationCap />}
        />
        <AllInfoCard
          title="New Enrollments"
          value={recent}
          description="New students enrolled in last 30 days"
          icon={<UserCog />}
        />
        <AllInfoCard
          title="Revenue Overview"
          value={`$ ${revenue}`}
          description="Revenue generated in this year"
          icon={<DollarSign />}
        />
      </div>
      <div>
        <UpcomingClassesNextHours />
      </div>
      <div>
        <FreeTime />
      </div>
      <SurveyDashboard isAdmin={true} />
    </div>
  );
};
