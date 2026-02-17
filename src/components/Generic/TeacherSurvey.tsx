import  { useEffect, useState } from 'react';
import { 
  Star, 
  Users, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getAllTeachers, getDistribution, getStats, getSurveyFeedback, getTrend } from '../../api/auth';
import { useSelector } from 'react-redux';
import { GetUserImageAndName } from './GetUserImageAndName';

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, description }:any) => (
  <div className=" globalCardStyle p-6 ">
    <div className="flex items-center justify-between">
      <div>
        <p className="ch mb-1">{title}</p>
        <h3 className="standout">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
  </div>
);

// Rating Distribution Component
const RatingDistribution = ({ ratings }:any) => (
  <div className="bg-white p-6 rounded-lg globalCardStyle shadow">
    <h3 className="ch mb-4">Rating Distribution</h3>
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((rating:any) => {
        const count = ratings && ratings[rating] || 0;
        const percentage = count && (count / Object.values(ratings).reduce((a, b) => a + b, 0) * 100).toFixed(1);
        
        return (
          <div key={rating} className="flex items-center gap-2">
            <div className="flex items-center w-16">
              {rating} <Star className="w-4 h-4 text-yellow-400 ml-1 inline" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-4">
              <div 
                className="bg-blue-500 rounded-full h-4"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="w-16 text-sm text-gray-600">{percentage}%</div>
          </div>
        );
      })}
    </div>
  </div>
);

// Main Dashboard Component
const SurveyDashboard = ({ isAdmin,teachId }:any) => {
    const [loading, setLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [distribution, setDistribution] = useState(null);
    const [trend, setTrend] = useState<any>(null);
    const [feedback, setFeedback] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [teacherId,setTeacherId] = useState('');

    const userId = useSelector((state:any) => state.auth.userId);

    useEffect(() => {
      if(teachId){
        setTeacherId(teachId);
      }else{
        setTeacherId(userId);
      }
    },[userId,teachId]);
    // Fetch all dashboard data
    const fetchDashboardData = async (teacherId = '') => {
      setLoading(true);
      try {
        const [statsRes, distributionRes, trendRes, feedbackRes] = await Promise.all([
        //   axios.get('/api/dashboard/stats', { params: { teacherId } }),
          getStats(teacherId),
          getDistribution(teacherId),
          getTrend(teacherId),
          getSurveyFeedback(teacherId,page, 5),
        ]);
  
        setStats(statsRes.data.data);
        setDistribution(distributionRes.data.data);
        setTrend(trendRes.data.data);
        setFeedback(feedbackRes.data.data);
        console.log("feedback",feedbackRes.data.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // You might want to add error handling UI here
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch teachers list for admin
    const [teachers, setTeachers] = useState([]);
    const fetchTeachers = async () => {
      try {
        const response = await getAllTeachers();
        setTeachers(response.data.teachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
  
    useEffect(() => {
      if (isAdmin) {
        fetchTeachers();
      }
    }, [isAdmin]);
  
    useEffect(() => {
      if(isAdmin){
        fetchDashboardData(selectedTeacher);
      }else{
        fetchDashboardData(teacherId);
      }
    }, [selectedTeacher, page,teacherId]);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      );
    }
  
    return (
      <div className=" pt-6 space-y-4">
        {/* Header with Teacher Selection max-w-7xl */}
        <div className="flex justify-between items-center">
          <h2 className="MainHeadings">Survey Dashboard</h2>
          {isAdmin && (
            <select 
              className="border p-2 rounded globalCardStyle"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">All Teachers</option>
              {teachers.map((teacher:any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {" "}{teacher.lastName}
                </option>
              ))}
            </select>
          )}
        </div>
  
        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Average Rating"
            value={stats?.averageRating}
            icon={Star}
            description={`${stats?.ratingTrend > 0 ? '+' : ''}${stats?.ratingTrend} vs last month`}
          />
          <StatsCard
            title="Total Responses"
            value={stats?.totalResponses}
            icon={MessageSquare}
            description="Last 30 days"
          />
          <StatsCard
            title="Response Rate"
            value={`${stats?.responseRate}%`}
            icon={Users}
            description="Of total students"
          />
          <StatsCard
            title="Classes Rated"
            value={stats?.classesRated}
            icon={Calendar}
            description="This month"
          />
        </div>
  
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white globalCardStyle p-6 rounded-lg shadow">
            <h3 className="ch mb-4">Rating Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleString('default', { month: 'short' });
                    }}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <RatingDistribution ratings={distribution} />
        </div>
  
        {/* Feedback List with Pagination */}
        <div className="bg-white globalCardStyle p-6 rounded-lg shadow">
          <h3 className="ch mb-4">Recent feedback from students</h3>
          <div className="space-y-4">
            {feedback?.feedback.map((item:any) => (
              <FeedbackItem key={item.id} feedback={item} />
            ))}
          </div>
          
        
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {feedback?.pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(feedback?.pagination.pages, p + 1))}
              disabled={page === feedback?.pagination.pages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Feedback Item Component
  const FeedbackItem = ({ feedback }:any) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              {/* <span className="font-medium">{feedback?.Student?.firstName} {" "} {feedback?.Student?.lastName}</span> */}
              <GetUserImageAndName 
            userId={feedback?.Student?.id}
            userType={"student"}
            firstName={feedback?.Student?.firstName}
            lastName={feedback?.Student?.lastName}
            imageUrl={feedback?.Student?.profileImg}
          />
              <span className="text-sm text-gray-500">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round((
                      feedback.classRating + 
                      feedback.teacherRating + 
                      feedback.lessonRating
                    ) / 3) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
        {expanded && feedback.feedback && (
          <div className='flex justify-between'>
            
          <p className="mt-2 text-gray-600">{feedback.feedback}</p>
          <GetUserImageAndName 
            userId={feedback?.Teacher?.id}
            userType={"teacher"}
            firstName={feedback?.Teacher?.firstName}
            lastName={feedback?.Teacher?.lastName}
            imageUrl={feedback?.Teacher?.imageUrl}
            showType={true}
          />
          </div>
        )}
      </div>
    );
  };
  
  export default SurveyDashboard;
