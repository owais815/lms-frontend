import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import {
  getAllStudents,
  getAnnouncement,
  getAssessmentScore,
  getCourseByStdId,
  getLeaderboard,
  getStudentDashboardData,
  getStudentUpcomingClasses,
  shareProgressToSocial,
} from '../../api/auth';
import GetAdminFeedback from './StudentFeedback/GetAdminFeedback';
import { toPng } from 'html-to-image';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import ShareProgress from '../Generic/SocialMediaShare';
import { base64toBlob } from '../Generic/base64toBlob';
import { OpenModal } from '../Generic/OpenModal';
import OnlineStatus from '../Generic/ListOfOnlineUsers';
import { useParams } from 'react-router-dom';
import { EmptyTemplate } from '../Generic/EmptyTemplate';
import CourseCardCarousel from '../Generic/UpcomingCourseCarousal';
import { StudentUpcomingClasses } from './StudentCourses/StudentUpcomingClasses';
import { ClassInfo } from './StudentCourses/StudentCourses';
import { GetStudentPackage } from './Pricing/GetStudentPackage';

ChartJS.register(ArcElement, Tooltip, Legend);

interface LeaderboardEntry {
  studentId: number;
  totalScore: number;
  studentName?: string; // Add this line
}

interface CourseCompletion {
  courseId: number;
  courseName: string;
  completion: number;
}

interface DashboardData {
  studentId: string;
  courseCompletion: CourseCompletion[];
}

interface AssessmentScores {
  assignments: { score: number; maxScore: number };
  participation: { score: number; maxScore: number };
  quizes: { score: number; maxScore: number };
}

interface AssessmentData {
  assessmentScores: AssessmentScores;
  badges: string[];
}

const StudentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null,
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const screenshotRef = useRef(null);
  const badgescreenshotRef = useRef(null);
  const chartscreenshotRef = useRef(null);
  const leadherboardscreenshotRef = useRef(null);
  const [userId, setUserId] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [showShare, setShowShare] = useState(false);
  const { studentId } = useParams();
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  const userIdd = useSelector((state: any) => state.auth.userId);
  useEffect(() => {
    if (studentId) {
      setUserId(studentId);
    } else {
      setUserId(userIdd);
    }
  }, [userIdd, studentId]);

  const getAnnouncements = async () => {
    try {
      let obj = {
        userId: userId,
        userType: 'student',
      };
      const response = await getAnnouncement(obj);

      if (response.data?.announcements?.length > 0) {
        setAnnouncements(response.data.announcements);
      }
    } catch (err) {}
  };

  // const clearCookie = (name: string) => {
  //   document.cookie = `${name}=; Max-Age=-99999999;`;
  // };
  useEffect(() => {
    // clearCookie('banner');
    const fetchLeaderboardWithNames = async () => {
      setLoading(true);
      try {
        const [
          dashboardResponse,
          assessmentResponse,
          leaderboardResponse,
          studentsResponse,
        ] = await Promise.all([
          getStudentDashboardData(userId),
          getAssessmentScore(userId),
          getLeaderboard(userId),
          getAllStudents(),
        ]);

        const studentMap = new Map(
          studentsResponse.data.students.map((student: any) => [
            student.id,
            `${student.firstName} ${student.lastName}`,
          ]),
        );

        const leaderboardWithNames = leaderboardResponse.data.leaderboard.map(
          (entry: LeaderboardEntry) => ({
            ...entry,
            studentName: studentMap.get(entry.studentId) || 'Unknown',
          }),
        );

        setDashboardData(dashboardResponse.data);
        setAssessmentData(assessmentResponse.data);
        setLeaderboard(leaderboardWithNames);
      } catch (error) {
        console.error('Error fetching data:', error);
        // toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardWithNames();
  }, [userId]);

  useEffect(() => {
    getAnnouncements();
  }, []);
  const pieChartData = {
    labels:
      dashboardData?.courseCompletion.map((course) => course.courseName) || [],
    datasets: [
      {
        data:
          dashboardData?.courseCompletion.map((course) => course.completion) ||
          [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const badgeIcons: { [key: string]: string } = {
    problem_solver: '🧠',
    fast_learner: '🚀',
    team_player: '🤝',
    top_performer: '🏆',
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const captureAndShare = (ref: any) => {
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        setImageUrl(dataUrl);
        uploadImageToServer(dataUrl);
      })
      .catch((err) => {
        console.error('Screenshot capture failed', err);
      });
  };

  const uploadImageToServer = async (base64Image: any) => {
    try {
      const blob = base64toBlob(base64Image);
      const formData = new FormData();
      formData.append('file', blob, 'progress.png');
      const response = await shareProgressToSocial(formData);

      if (response.data) {
        console.log('Image uploaded:', response.data.url);
        setImageUrl(response.data.url);
        setShowShare(true);
      }
    } catch (error) {}
  };

  return (
    <>
      <ToastContainer />
      <div style={{ display: 'none' }}>
        {announcements.length > 0 &&
          announcements.map((val: any) => {
            return toast.info(val?.message, {
              hideProgressBar: false,
              closeOnClick: true,
              autoClose: false,
              theme: 'colored',
            });
          })}
      </div>
      <div className='pt-6'>
        <GetStudentPackage studentId={userId} />
      </div>
      {/* {!(dashboardData?.courseCompletion && dashboardData?.courseCompletion.length > 0)  &&( */}
      {!studentId && <CourseCardCarousel />}
      {/* )} */}
      
      <div className="mb-6 mt-6 globalCardStyle containerr  h-1/2 overflow-hidden ">
        <h2 className="ch p-4 gh">Upcoming Classes</h2>
        <StudentUpcomingClasses userId={userId} />
      </div>
     
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-black dark:text-white">
        <div className="globalCardStyle">
          {dashboardData?.courseCompletion &&
          dashboardData?.courseCompletion.length > 0 ? (
            <div ref={chartscreenshotRef} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="ch mb-4">Course Completion</h3>
                <button
                  onClick={() => {
                    captureAndShare(screenshotRef);
                  }}
                >
                  {' '}
                  <FaRegShareFromSquare size={20} />{' '}
                </button>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full max-w-[200px]">
                  <Pie data={pieChartData} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="bg-gray-100 dark:bg-black rounded-lg p-4 flex flex-col items-center gap-2">
                    <div className="text-4xl text-blue-500 font-bold">
                      {(dashboardData?.courseCompletion &&
                        (
                          dashboardData.courseCompletion.reduce(
                            (acc, course) => acc + course.completion,
                            0,
                          ) / (dashboardData.courseCompletion.length || 1)
                        ).toFixed(2)) ||
                        0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      Overall Completion
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-black rounded-lg p-4 flex flex-col items-center gap-2">
                    <div className="text-4xl text-blue-500 font-bold">
                      {
                        dashboardData?.courseCompletion.filter(
                          (course) => course.completion === 100,
                        ).length
                      }
                      /{dashboardData?.courseCompletion.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Courses Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // show empty message, tell user to wait untill you progressed with our system
            <EmptyTemplate
              heading={'No course to show'}
              description={'You are not yet enrolled in any course.'}
            />
          )}
        </div>
        <div ref={screenshotRef} className="globalCardStyle">
          {assessmentData?.assessmentScores ? (
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="ch mb-4">Assessment Scores</h3>
                <button
                  onClick={() => {
                    captureAndShare(screenshotRef);
                  }}
                >
                  {' '}
                  <FaRegShareFromSquare size={20} />{' '}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-black ">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-white">
                        Assessment
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-white">
                        Score %
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-white">
                        Max Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentData && (
                      <>
                        <tr className="border-b">
                          <td className="px-4 py-2">Assignments</td>
                          <td className="px-4 py-2">
                            {assessmentData?.assessmentScores?.assignments?.score.toFixed(
                              2,
                            )}
                            %
                          </td>
                          <td className="px-4 py-2">
                            {
                              assessmentData?.assessmentScores?.assignments
                                ?.maxScore
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Participation</td>
                          <td className="px-4 py-2">
                            {assessmentData?.assessmentScores?.participation?.score?.toFixed(
                              2,
                            )}
                            %
                          </td>
                          <td className="px-4 py-2">
                            {
                              assessmentData?.assessmentScores?.participation
                                ?.maxScore
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Quizzes</td>
                          <td className="px-4 py-2">
                            {assessmentData?.assessmentScores?.quizes?.score?.toFixed(
                              2,
                            )}
                            %
                          </td>
                          <td className="px-4 py-2">
                            {assessmentData?.assessmentScores?.quizes?.maxScore}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyTemplate
              heading={'No assessments to show'}
              description={'You have not taken any assessment yet.'}
            />
          )}
        </div>
      </main>

      <div
        ref={badgescreenshotRef}
        className="flex flex-col md:flex-row gap-6 p-6 "
      >
        <div className="w-full md:w-1/2  p-6  globalCardStyle">
          <div className="flex justify-between items-center">
            <h2 className="ch mb-4">Your Badges</h2>
            <button
              onClick={() => {
                captureAndShare(badgescreenshotRef);
              }}
            >
              {' '}
              <FaRegShareFromSquare size={20} />{' '}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badgeIcons &&
              Object.keys(badgeIcons).map((badge, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center dark:bg-black bg-gray-100 rounded-lg p-4 ${
                    assessmentData?.badges.includes(badge)
                      ? 'opacity-100'
                      : 'opacity-50'
                  }`}
                >
                  <span className="text-4xl mb-2">{badgeIcons[badge]}</span>
                  <span className="text-sm text-center font-medium">
                    {badge.replace('_', ' ')}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div
          ref={leadherboardscreenshotRef}
          className="w-full max-h-60 md:w-1/2 globalCardStyle p-6"
        >
          {leaderboard.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="ch mb-4">Leaderboard</h2>
                <button
                  onClick={() => {
                    captureAndShare(leadherboardscreenshotRef);
                  }}
                >
                  {' '}
                  <FaRegShareFromSquare size={20} />{' '}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-black">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={index}
                        className={
                          entry.studentId.toString() === userId
                            ? 'bg-blue-500 text-white'
                            : ''
                        }
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && index + 1}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {entry.studentName}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {entry.totalScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <EmptyTemplate
              heading={'No leaderboard to show'}
              description={'You have not taken any assessment yet.'}
            />
          )}
        </div>
      </div>
      <div className="mx-7">
        <GetAdminFeedback userId={userId} captureAndShare={captureAndShare} />
      </div>
      <div>
        <OnlineStatus />
      </div>
      {imageUrl && showShare && (
        <OpenModal
          title="Share you progress"
          handleClose={() => setShowShare(false)}
        >
          <ShareProgress shareUrl={imageUrl} />
        </OpenModal>
      )}
    </>
  );
};

export default StudentDashboard;
