import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Students from '../components/Admin/Student/Students';

import PageTitle from '../components/PageTitle';
import DefaultLayout from '../layout/DefaultLayout';
import Errorpage from '../pages/Authentication/Errorpage';
import Forgetpass from '../pages/Authentication/Forgetpass';

import SignUp from '../pages/Authentication/SignUp';
import AssignTeacher from '../components/Admin/AssignTeacher/AssignTeacher';
import { JoinMeeting } from '../components/Admin/JoinMeeting/JoinMeeting';

import { StudentProfile } from '../components/Student/StudentProfile/StudentProfile';
import { AdminLogin } from '../pages/AdminLogin';
import { Mystudent } from '../components/Teacher/Mystudent';
import { UpcomingClasses } from '../components/Teacher/UpcomingClasses';
import { TeachingHourLog } from '../components/Teacher/TeachingHourLog';
import Courses from '../components/Admin/Courses/Course';
import { MyCourses } from '../components/Teacher/MyCourses';
import StudentFeedback from '../components/Teacher/StudentFeedback';
import Dashboard from '../components/Teacher/TeacherDashboard/Dashboard';
import { AdminDashborad } from '../components/Admin/AdminDashboard/AdminDashborad';
import { Reports } from '../components/Admin/Reports/Reports';
import UploadResource from '../components/Admin/ResourceUpload/UploadResource';
import QuizAssesment from '../components/Teacher/Quiz/QuizAssesment';
import { CoursesComponent } from '../components/Student/StudentProfile/CoursesComponent';
import StudentDashboard from '../components/Student/StudentDashboard';
import TeacherProfile from '../components/Teacher/TeacherProfile/TeacherProfile';

import Teachers from '../components/Admin/Teacher/Teachers';
import TeacherDetails from '../components/Admin/TeachersDetails/TeacherDetails';
import Feedback from '../components/Student/StudentFeedback/StudentFeedback';
import { ScheduleClass } from '../components/Admin/ScheduleClasses/ScheduleClass';
import StudentQuiz from '../components/Student/StudentQuiz/StudentQuiz';
import { AssignmentsComponent } from '../components/Student/StudentProfile/AssignmentsComponent';
import UploadAssignment from '../components/Teacher/UploadAssignments/UploadAssignments';
import { SubmittedAssignments } from '../components/Teacher/UploadAssignments/SubmittedAssignments';
import { AllAssignments } from '../components/Teacher/UploadAssignments/AllAssignments';
import PaymentForm from '../components/Student/StudentPayment/PaymentForm';
import FaqComponent from '../components/Student/FaqComponent/FaqComponent';
import { AttendanceComponent } from '../components/Student/StudentProfile/AttendanceComponent';
import { StudentCourses } from '../components/Student/StudentCourses/StudentCourses';
import UpdatePassword from '../components/Admin/UpdatePassword';
import SignIn from '../pages/Authentication/SignIn';
import Game from '../components/Student/Game/Game';
import Breadcrumbs from '../components/BreadCrumbs';
import { TeacherDetailsPage } from '../components/Teacher/TeacherDetailsPage';
import GiveFeedbackAdmin from '../components/Admin/Student/GiveFeedback';
import { MyBookmarks } from '../components/Student/MyBookmarks/MyBookmarks';
import { Pricing } from '../components/Student/Pricing/Pricing';
import { MakeUpClassConfig } from '../components/Admin/Student/MakeupClassConfig';
import { AddCourses } from '../components/Admin/Courses/AddCourses';
import { AddUpcomingCourses } from '../components/Admin/Courses/AddUpcomingCourses';
import { EnrollmentRequests } from '../components/Admin/Student/EnrollmentRequest';
import { Library } from '../components/Student/Library/Library';
import { WriteBlog } from '../components/Generic/WriteBlog';
import { ShowBlog } from '../components/Generic/ShowBlog';
import { ShowBlogDetails } from '../components/Generic/ShowBlogDetails';
import { AddWeeklyContent } from '../components/Admin/Courses/AddWeeklyContent';
import AnnouncementForm from '../components/Admin/Announcement/Form';
import { SupportRequest } from '../components/Generic/SupportRequest';
import { ManageRequests } from '../components/Admin/SupportSystem/ManageRequest';
import { ProfileComponent } from '../components/Admin/Profile/Profile';
import { Chat } from '../components/Generic/Chat';
import { UserChats } from '../components/Admin/Chats/UserChats';
import Parents from '../components/Admin/Student/Parents';
import { Parent } from '../components/Parent/Parent';
import { ParentProfileComponent } from '../components/Parent/ParentProfileComponent';
import { GetFeedbacks } from '../components/Student/StudentFeedback/GetFeedbacks';
import AdminPlanManagement from '../components/Admin/PlanManagement/AdminPlanManagement';
import PlanChangeRequests from '../components/Admin/PlanManagement/PlanChangeRequests';
import AddMonthlyFee from '../components/Admin/PlanManagement/AddMonthlyFee';
import { RBAC } from '../components/Admin/RBAC';

const renderStudentRoutes = () => (
  <>
    <Route
      path="/dashboard"
      element={
        <>
          <PageTitle title="Dashboard" />
          <StudentDashboard />
        </>
      }
    />

    <Route
      path="/courses"
      element={
        <>
          <PageTitle title="Courses" />
          <CoursesComponent />
        </>
      }
    />
    <Route
      path="/mycourses"
      element={
        <>
          <PageTitle title="Courses" />
          <StudentCourses />
        </>
      }
    />

    <Route
      path="/studentquiz"
      element={
        <>
          <PageTitle title="Quiz" />
          <StudentQuiz />
        </>
      }
    />

    <Route
      path="/assignments"
      element={
        <>
          <PageTitle title="Assignments" />
          <AssignmentsComponent />
        </>
      }
    />

    <Route
      path="/studentprofile"
      element={
        <>
          <PageTitle title="Profile" />
          <StudentProfile />
        </>
      }
    />

    <Route
      path="/upcomingclasses"
      element={
        <>
          <PageTitle title="Upcoming Classes" />
          <UpcomingClasses />
        </>
      }
    />

    <Route
      path="/joinmeeting"
      element={
        <>
          <PageTitle title="Join meeting" />
          <JoinMeeting />
        </>
      }
    />

    <Route
      path="/feedback"
      element={
        <>
          <PageTitle title="Feedback" />
          <Feedback />
        </>
      }
    />

    <Route
      path="/feedbacks"
      element={
        <>
          <PageTitle title="Feedback" />
          <GetFeedbacks />
        </>
      }
    />

    <Route
      path="/faq"
      element={
        <>
          <PageTitle title="FAQ's" />
          <FaqComponent />
        </>
      }
    />

    <Route
      path="/Attendance"
      element={
        <>
          <PageTitle title="Attendance" />
          <AttendanceComponent />
        </>
      }
    />

    <Route
      path="/payment"
      element={
        <>
          <PageTitle title="Payment" />
          <PaymentForm />
        </>
      }
    />

    <Route
      path="/bookmarks"
      element={
        <>
          <PageTitle title="My Bookmark" />
          <MyBookmarks />
        </>
      }
    />
    <Route
      path="/studentprofile/teacherprofile/:tId"
      element={
        <>
          <PageTitle title="Teacher Profile" />
          <TeacherProfile />
        </>
      }
    />
    <Route
      path="/mycourses/teacherprofile/:tId"
      element={
        <>
          <PageTitle title="Teacher Profile" />
          <TeacherProfile />
        </>
      }
    />
    <Route
      path="/myplan"
      element={
        <>
          <PageTitle title="My Plan" />
          <Pricing />
        </>
      }
    />
    <Route
      path="/playgame"
      element={
        <>
          <PageTitle title="Play Game" />
          <Game />
        </>
      }
    />
    <Route
      path="/library"
      element={
        <>
          <PageTitle title="Library" />
          <Library />
        </>
      }
    />
    <Route
      path="/blogs"
      element={
        <>
          <PageTitle title="Blogs" />
          <ShowBlog />
        </>
      }
    />
    <Route
      path="/blogs/detail/:id"
      element={
        <>
          <PageTitle title="Blog Details" />
          <ShowBlogDetails />
        </>
      }
    />
    <Route
      path="/support"
      element={
        <>
          <PageTitle title="Support System" />
          <SupportRequest />
        </>
      }
    />
    <Route
      path="/chat"
      element={
        <>
          <PageTitle title="Chats" />
          <Chat />
        </>
      }
    />
    <Route
      path="/userChat"
      element={
        <>
          <PageTitle title="Chats" />
          <UserChats />
        </>
      }
    />

    <Route
      path="/userChat/:usersId/:usersType"
      element={
        <>
          <PageTitle title="Chats" />
          <UserChats />
        </>
      }
    />

    <Route
      path="/teacher/:tId/progress"
      element={
        <>
          <PageTitle title="Teacher Progress" />
          <Dashboard />
        </>
      }
    />

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);
const renderTeacherRoutes = () => (
  <>
    <Route
      path="/teacherdashboard"
      element={
        <>
          <PageTitle title="Dashboard" />
          <Dashboard />
        </>
      }
    />
    <Route
      path="/userChat"
      element={
        <>
          <PageTitle title="Chats" />
          <UserChats />
        </>
      }
    />
    <Route
      path="/userChat/:usersId/:usersType"
      element={
        <>
          <PageTitle title="Chats" />
          <UserChats />
        </>
      }
    />
    <Route
      path="/mystudents"
      element={
        <>
          <PageTitle title="Students" />
          <Mystudent />
        </>
      }
    />
    <Route
      path="/mystudents/:studentId/progress"
      element={
        <>
          <PageTitle title="Student Progress" />
          <StudentDashboard />
        </>
      }
    />

    <Route
      path="/mycourses"
      element={
        <>
          <PageTitle title="Courses" />
          <MyCourses />
        </>
      }
    />
    <Route
      path="/uploadresource"
      element={
        <>
          <PageTitle title="Upload Resource " />
          <UploadResource />
        </>
      }
    />

    <Route
      path="/uploadassignment"
      element={
        <>
          <PageTitle title="Upload Assignment " />
          <UploadAssignment />
        </>
      }
    />

    <Route
      path="/submittedassignment"
      element={
        <>
          <PageTitle title=" Submitted Assignments " />
          <SubmittedAssignments />
        </>
      }
    />

    <Route
      path="/allassignment"
      element={
        <>
          <PageTitle title=" Assignments " />
          <AllAssignments />
        </>
      }
    />

    <Route
      path="/quiz"
      element={
        <>
          <PageTitle title="Quiz " />
          <QuizAssesment />
        </>
      }
    />

    <Route
      path="/upcomingclasses"
      element={
        <>
          <PageTitle title="Upcoming Classes" />
          <UpcomingClasses />
        </>
      }
    />

    <Route
      path="/hourlog"
      element={
        <>
          <PageTitle title="Teaching Hour Log" />
          <TeachingHourLog />
        </>
      }
    />
    <Route
      path="/scheduleclass"
      element={
        <>
          <PageTitle title="Schedule Class" />
          <ScheduleClass />
        </>
      }
    />

    <Route
      path="/teacherprofile"
      element={
        <>
          <PageTitle title="Teacher Profile" />
          <TeacherProfile />
        </>
      }
    />

    <Route
      path="/studentfeedback"
      element={
        <>
          <PageTitle title="Student Feedback" />
          <StudentFeedback />
        </>
      }
    />

    <Route
      path="/joinmeeting"
      element={
        <>
          <PageTitle title="Join meeting" />
          <JoinMeeting />
        </>
      }
    />
    <Route
      path="/blogs"
      element={
        <>
          <PageTitle title="Blogs" />
          <ShowBlog />
        </>
      }
    />
    <Route
      path="/blogs/detail/:id"
      element={
        <>
          <PageTitle title="Blog Details" />
          <ShowBlogDetails />
        </>
      }
    />
    <Route
      path="/writeblog"
      element={
        <>
          <PageTitle title="Write Blog" />
          <WriteBlog />
        </>
      }
    />
    <Route
      path="/support"
      element={
        <>
          <PageTitle title="Support System" />
          <SupportRequest />
        </>
      }
    />
    <Route
      path="/chat"
      element={
        <>
          <PageTitle title="Chats" />
          <Chat />
        </>
      }
    />
    <Route
      path="/giveFeedback"
      element={
        <>
          <PageTitle title="Feedback" />
          <GiveFeedbackAdmin />
        </>
      }
    />
    <Route path="*" element={<Navigate to="/teacherdashboard" replace />} />
  </>
);
const renderAdminRoutes = () => (
  <>
  <Route
      path="/admindashboard"
      element={
        <>
          <PageTitle title="Dashboard" />
          <AdminDashborad />
        </>
      }
    />
    <Route
      path="/adminsettings"
      element={
        <>
          <PageTitle title="Settings" />
          <UpdatePassword />
        </>
      }
    />
    

    <Route
      path="/student"
      element={
        <>
          <PageTitle title="Add student" />
          <Students />
        </>
      }
    />



    <Route
      path="/parent"
      element={
        <>
          <PageTitle title="Parents Management" />
          <Parents />
        </>
      }
    />
    <Route
      path="/student/:studentId/progress"
      element={
        <>
          <PageTitle title="Student Progress" />
          <StudentDashboard />
        </>
      }
    />
    <Route
      path="/teacher/:tId/progress"
      element={
        <>
          <PageTitle title="Teacher Progress" />
          <Dashboard />
        </>
      }
    />
    <Route
      path="/teacher/:tId/teacherDetailsPage/progress"
      element={
        <>
          <PageTitle title="Teacher Progress" />
          <Dashboard />
        </>
      }
    />
    <Route
      path="/teacher/:studentId/studentProgress"
      element={
        <>
          <PageTitle title="Student Progress" />
          <StudentDashboard />
        </>
      }
    />
    <Route
      path="/teacher"
      element={
        <>
          <PageTitle title="Teacher Details" />
          <Teachers />
        </>
      }
    />
    <Route
      path="/teacher/:teacherId/teacherDetailsPage"
      element={
        <>
          <PageTitle title="Teacher Details" />
          <TeacherDetailsPage />
        </>
      }
    />
    <Route
      path="/teacherdetails"
      element={
        <>
          <PageTitle title="Teacher Details" />
          <TeacherDetails />
        </>
      }
    />

    <Route
      path="/assignteacher"
      element={
        <>
          <PageTitle title="Assign Teacher" />
          <AssignTeacher />
        </>
      }
    />
    <Route
      path="/joinmeeting"
      element={
        <>
          <PageTitle title="Join meeting" />
          <JoinMeeting />
        </>
      }
    />

    <Route
      path="/addcourses"
      element={
        <>
          <PageTitle title="Courses" />
          <Courses />
        </>
      }
    />
    <Route
      path="/addcourses/crud"
      element={
        <>
          <PageTitle title="Courses" />
          <AddCourses />
        </>
      }
    />

    <Route
      path="/enrollmentRequests"
      element={
        <>
          <PageTitle title="Courses" />
          <EnrollmentRequests />
        </>
      }
    />

    <Route
      path="/addcourses/upcoming"
      element={
        <>
          <PageTitle title="Upcoming Courses" />
          <AddUpcomingCourses />
        </>
      }
    />
    <Route
      path="/addcourses/weeklycontent"
      element={
        <>
          <PageTitle title="Weekly Content" />
          <AddWeeklyContent />
        </>
      }
    />

    <Route
      path="/uploadresource"
      element={
        <>
          <PageTitle title="Upload Resource " />
          <UploadResource />
        </>
      }
    />

    <Route
      path="/reports"
      element={
        <>
          <PageTitle title="Reports" />
          <Reports />
        </>
      }
    />

    <Route
      path="/scheduleclass"
      element={
        <>
          <PageTitle title="Schedule Class" />
          <ScheduleClass />
        </>
      }
    />

    <Route
      path="/giveFeedback"
      element={
        <>
          <PageTitle title="Feedback" />
          <GiveFeedbackAdmin />
        </>
      }
    />

    <Route
      path="/makeupclassconfig"
      element={
        <>
          <PageTitle title="Feedback" />
          <MakeUpClassConfig />
        </>
      }
    />

    <Route
      path="/writeblog"
      element={
        <>
          <PageTitle title="Feedback" />
          <WriteBlog />
        </>
      }
    />

    <Route
      path="/blogs"
      element={
        <>
          <PageTitle title="Blogs" />
          <ShowBlog />
        </>
      }
    />
    <Route
      path="/blogs/detail/:id"
      element={
        <>
          <PageTitle title="Blog Details" />
          <ShowBlogDetails />
        </>
      }
    />

    <Route
      path="/announcements"
      element={
        <>
          <PageTitle title="Anouncements" />
          <AnnouncementForm />
        </>
      }
    />

    <Route
      path="/support"
      element={
        <>
          <PageTitle title="Support System" />
          <ManageRequests />
        </>
      }
    />
    <Route
      path="/adminprofile"
      element={
        <>
          <PageTitle title="Profile" />
          <ProfileComponent />
        </>
      }
    />
    <Route
      path="/chat"
      element={
        <>
          <PageTitle title="Chats" />
          <Chat />
        </>
      }
    />
    <Route
      path="/userChat"
      element={
        <>
          <PageTitle title="Chats" />
          <UserChats />
        </>
      }
    />
    <Route
      path="/userChat/:usersId/:usersType"
      element={
        <>
          <PageTitle title="Chats" />
          <UserChats />
        </>
      }
    />

<Route
      path="/planmanagement"
      element={
        <>
          <PageTitle title="Plan Management" />
          <AdminPlanManagement />
        </>
      }
    />
    <Route
      path="/planrequests"
      element={
        <>
          <PageTitle title="Plan Management" />
          <PlanChangeRequests />
        </>
      }
    />
     <Route
      path="/addFee"
      element={
        <>
          <PageTitle title="Plan Management" />
          <AddMonthlyFee />
        </>
      }
    />
      <Route
      path="/rbac"
      element={
        <>
          <PageTitle title="RBAC" />
          <RBAC />
        </>
      }
    />
    {/* Add other admin routes here */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);

const renderParentRoutes = () => (
  <>
    <Route
      path="/parentDashboard"
      element={
        <>
          <PageTitle title="Student Progress" />
          <Parent />
        </>
      }
    />

    <Route
      path="/student/:studentId"
      element={
        <>
          <PageTitle title="Student Progress" />
          <StudentDashboard />
        </>
      }
    />

    <Route
      path="/userChat"
      element={
        <>
          <PageTitle title="Chats" />
          <UserChats />
        </>
      }
    />

    <Route
      path="/parentprofile"
      element={
        <>
          <PageTitle title="Profile" />
          <ParentProfileComponent />
        </>
      }
    />
  </>
);

const MainRouting = () => {
  const { pathname } = useLocation();
  const isLoggedIn = useSelector((state: any) => state.auth.isAuthenticated);
  const userType = useSelector((state: any) => state.auth.userType);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isLoggedIn) {
    return (
      <DefaultLayout>
        {userType != 'parent' && <Breadcrumbs />}
        <Routes>
          {userType === 'student' && renderStudentRoutes()}

          {userType === 'teacher' && renderTeacherRoutes()}

          {userType === 'admin' && renderAdminRoutes()}

          {userType === 'parent' && renderParentRoutes()}
        </Routes>
      </DefaultLayout>
    );
  }

  // Routes for non-authenticated users
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/error" element={<Errorpage />} />
      <Route path="/auth/forgetpass" element={<Forgetpass />} />
      <Route path="/lmsadmin" element={<AdminLogin />} />
    </Routes>
  );
};

export default MainRouting;
