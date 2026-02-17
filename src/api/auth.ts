// src/api/auth.ts
import axios from './axios';

export const signup = (userData: {
  address: string;
  contact: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  amount:any;
  planId:string;
}) => {
  return axios.put('/student/signup', userData);
};
export const signin = (credentials: { username: string; password: string }) => {
  return axios.post('/student/login', credentials);
};
export const signinTeacher = (credentials: {
  username: string;
  password: string;
}) => {
  return axios.post('/teacher/login', credentials);
};
export const signinadmin = (credentials: {
  username: string;
  password: string;
}) => {
  return axios.post('/admin/login', credentials);
};
// export const updateadmin = (
//   adminId: string,
//   adminData: { username: string; password: string; },
// ) => {
//   return axios.put(`/admin/update/${adminId}`, adminData);
// };
export const teachersignup = (userData: {
  cnic: string;
  contact: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}) => {
  return axios.put('/teacher/signup', userData);
};

export const getAllStudents = () => {
  return axios.get('/student/getAll');
};

export const getAllTeachers = () => {
  return axios.get('/teacher/teachers');
};

export const update = (
  studentId: string,
  studentData: {
    firstName: string;
    lastName: string;
    contact: string;
    address: string;
  },
) => {
  return axios.put(`/student/update/${studentId}`, studentData);
};

export const updateteacher = (
  teacherId: string,
  teacherData: { firstName: string; lastName: string; contact: string },
) => {
  return axios.put(`/teacher/update/${teacherId}`, teacherData);
};

export const deleteStudent = (studentId: string) => {
  return axios.delete(`/student/${studentId}`);
};

export const deleteTeacher = (teacherId: string) => {
  return axios.delete(`/teacher/${teacherId}`);
};

export const findstuent = (username: string) => {
  return axios.get(`student/getByUsername/${username}`);
};

export const assignTeacher = (assignmentData: {
  teacherId: string;
  studentId: string;
}) => {
  return axios.post('/admin/assignTeacher', assignmentData);
};

export const getStudentById = (studentId: string) => {
  return axios.get(`/student/getById/${studentId}`);
};

export const getTeacherById = (teacherId: string) => {
  return axios.get(`/teacher/getById/${teacherId}`);
};

export const getAssignedStudents = (teacherId: string) => {
  return axios.post('/teacher/getAssignedStudents', { teacherId });
};
export const getAssignedTeachers = (studentId: string) => {
  return axios.post('/teacher/getAssignedTeachers', { studentId });
};
// 
export const assignCourse = (courseData: {
  courseId:number;
  teacherId: string;
  studentId: string;
}) => {
  return axios.put('/course/assignCourse', courseData);
};

export const getAllCourses = () => {
  return axios.get('/course/getCourses');
};

export const deleteCourse = (courseId: string) => {
  return axios.delete(`/course/${courseId}`);
};

export const updateCourse = async (
  courseId: string,
  courseData: {
    courseName: string;
    duration: string;
    studentId?: string;
    teacherId?: string;
    description: string;
  },
) => {
  try {
    const response = await axios.put(`/course/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseByStdId = (stdId: any) => {
  return axios.get(`/course/getCourseByStdId/${stdId}`);
};

export const getCourseByStdAndTeacherId = (stdId: any,teacherId: any) => {
  return axios.get(`/course/getCourseByStdAndTeacherId/${stdId}/${teacherId}`);
};
export const getCourseByStdAndCourseId = (studentIds: any[], courseId: any) => {
  return axios.post('/course/getCourseByStdAndCourseId', { studentIds, courseId });
};

export const getCourseByTeacherId = (teacherId: string) => {
  return axios.get(`/course/getCourseByTeacherId/${teacherId}`);
};

export const uploadResource = (formData: FormData) => {
  return axios.post('/resource/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getResourcesByStudentAndCourse = (
  studentId: string,
  courseId: string,
) => {
  return axios.get(`/resource/student/${studentId}/course/${courseId}`);
};

export const getResourcesByStudent = (
  studentId: string,
) => {
  return axios.get(`/resource/student/${studentId}`);
};

export const deleteResource = (resourceId: string) => {
  return axios.delete(`/resource/${resourceId}`);
};

export const addQualification = (qualificationData: {
  degree: string;
  institution: string;
  teacherId: string;
  year: string;
}) => {
  return axios.post('/teacher/qualifications', qualificationData);
};

export const getQualification = (qualificationId: string) => {
  return axios.get(`/teacher/qualifications/${qualificationId}`);
};

export const updateQualification = (
  qualificationId: string,
  qualificationData: {
    degree: string;
    institution: string;
    teacherId: string;
    year: string;
  },
) => {
  return axios.put(
    `/teacher/qualifications/${qualificationId}`,
    qualificationData,
  );
};

export const deleteQualification = (qualificationId: string) => {
  return axios.delete(`/teacher/qualifications/${qualificationId}`);
};

export const addSpecialization = (specializationData: {
  name: string;
  description: string;
  teacherId: string;
}) => {
  return axios.post('/teacher/specializations', specializationData);
};

export const getSpecializations = (teacherId: string) => {
  return axios.get(`/teacher/specializations/${teacherId}`);
};


export const updateSpecializations = (
  specializationId: string,
  SpecializationsData: {
    name: string;
    description: string;
    teacherId: string;
  },
) => {
  return axios.put(
    `/teacher/specializations/${specializationId}`,
    SpecializationsData,
  );
};

export const deletespecializations = (specializationId: string) => {
  return axios.delete(`/teacher/specializations/${specializationId}`);
};

export const uploadProfileImage = (formData: FormData) => {
  return axios.post('/teacher/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};



export const getProfileImage = (teacherId: string) => {

  return axios.get(`/teacher/profileImage/${teacherId}`);
};


export const getCounts = (teacherId: string) => {
  return axios.get(`/teacher/getCountsForProfile/${teacherId}`);
};




export const addFeedback = (feedbackData: {
  studentId: string;
  teacherId: string;
  feedback: string;
  rating: number;
}) => {
  return axios.post('/teacher/feedback', feedbackData);
};


export const getFeedback = (teacherId: string) => {
  return axios.get(`/teacher/feedback/${teacherId}`);
};


// -----------------Classes----------------


export const addUpcomingClass = (classData: {
  studentId: string;
  date: string;
  time: string;
  teacherId: string;
  courseDetailsId: string;
  meetingLink: string;
}) => {
  return axios.post('/teacher/upcoming-classes', classData);
};

export const getMeetingLink = (classData: {
  studentId: string;
  teacherId: string;
  courseDetailsId: string;
}) => {
  return axios.post('/teacher/getMeetingLink', classData);
};


export const getUpcomingClasses = (teacherId: any) => {
  return axios.get(`/teacher/upcoming-classes/${teacherId}`);
};
export const getAllUpcomingClasses = () => {
  return axios.get(`/teacher/all-upcoming-classes`);
};

export const deleteUpcomingClass = (meetingId: string) => {
  return axios.delete(`/teacher/upcoming-classes/${meetingId}`);


};

export const getStudentUpcomingClasses = (studentId: string) => {
  return axios.get(`/student/upcoming-classes/${studentId}`);
};

export const getClassMetrics = (teacherId: string) => {
  return axios.get(`/teacher/class-metrics/${teacherId}`);
};



// ----------------------quiz---------------

export const createQuiz = (quizData: {
  title: string;
  instructions: string;
  duration: number;
  passingScore: number;
  teacherId: string;
}) => {
  return axios.post('/quiz/quizzes', quizData);
};


export const getQuizWithQuestion = (quizId: string) => {
  return axios.get(`/quiz/quizzes/${quizId}`);
};


export const getQuizzesByTeacher = (teacherId: string) => {
  return axios.get(`quiz/quizzesByTeacher/${teacherId}`);
};


export const addQuestionToQuiz = (
  quizId: string, 
  questionData: {
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    question: string;
    options?: string[];
    correctAnswer?: boolean | string;
  }
) => {
  return axios.post(`quiz/quizzes/${quizId}/questions`, questionData);
};


//quiz delete
export const deleteQuiz = (quizId: string) => {
  return axios.delete(`/quiz/quizzes/${quizId}`);
};



export const deleteQuestion = (questionId: string) => {
  return axios.delete(`/quiz/quizzes/questions/${questionId}`);
};



export const assignCourseAndStudentToQuiz = (data: {
  quizId: string;
  courseDetailsId: string;
  studentId: string;
}) => {
  return axios.put('/quiz/assign', data);
};


export const getStudentQuizzes = (studentId: string) => {
  return axios.get(`/quiz/student/${studentId}/quizzes`);
};



export const startQuizAttempt = (data: {
  quizId: string;
  studentId: string;
}) => {
  return axios.post('/quiz/quiz-attempts', data);
};


export const submitQuizAttempt = (attemptId: string, data: {
  answers: any[];
  endTime: any;
}) => {
  return axios.put(`/quiz/quiz-attempts/${attemptId}`, data);
};



export const checkIfStudentHasAttemptedQuiz = (studentId: string, quizId: string) => {
  return axios.get(`/quiz/student/${studentId}/quiz-attempts/${quizId}`);
};



// _________________Assignments________________





export const createAssignment = (formData: FormData) => {
  return axios.post('/assignment/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    
  });
};

export const submitAssignment = (submittedAssignmentId: string, file: File) => {
  const formData = new FormData();
  formData.append('submittedAssignmentId', submittedAssignmentId);
  formData.append('file', file);

  return axios.post('/assignment/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const gradeAssignment = (data: {
  submittedAssignmentId: string;
  score: number;
  feedback: string;
}) => {
  return axios.post('/assignment/grade', data);
};


export const getStudentAssignments = (studentId: string) => {
  return axios.get(`/assignment/student/${studentId}`);
};




export const getAllAssignmentsTeacher = (teacherId: string) => {
  return axios.get(`/assignment/allAssignments/${teacherId}`);
};

  export const getTeacherAssignments = (teacherId: string) => {
    return axios.get(`/assignment/teacher/${teacherId}`);
  };


export const deleteAssignmentFile = (assignmentId: string) => {
  return axios.delete(`/assignment/${assignmentId}`);
};


export const deleteSubmittedAssignmentFile = (submittedAssignmentId: string) => {
  return axios.delete(`/assignment/submittedAssignment/${submittedAssignmentId}`);
};

// --------------- Student Dashboard----------------------


export const getStudentDashboardData = (studentId: string) => {
  return axios.get(`/student/dashboard/${studentId}`);
};


export const getAssessmentScore = (studentId: string) => {
  return axios.get(`/student/dashboard/assess/${studentId}`);
};

export const getLeaderboard = (studentId: string) => {
  return axios.get(`/student/dashboard/leaderboard/${studentId}`);
};

// ---------------Attendance ------------
export const markAttendance = (attendanceData: {
  studentId: number;
  courseDetailsId: number;
  date: any;
  status: 'Present' | 'Absent';
}) => {
  return axios.post('/attendance/mark', attendanceData);
};

export const getAttdenceStatus = (attendanceData: {
  studentId: number;
  courseDetailsId: number;
}) => {
  return axios.post('/attendance/getStatus', attendanceData);
};

export const getStudentAttendance = (studentId: string) => {
  return axios.get(`/attendance/student/${studentId}`);
};


// admin feedback
export const giveFeedbackAdmin = (feedbackData: {
  studentId: any;
  feedback: any;
  areasToImprove?:any;
  progressInGrades?:any;
  courseDetailsId:any;
}) => {
  return axios.post('/adminFeedback/add', feedbackData);
};

export const getAdminFeedback = (studentId: string) => {
  return axios.get(`/adminFeedback/student/${studentId}`);
};
export const getTeacherFeedbacks = (studentId: string) => {
  return axios.get(`/adminFeedback/student/${studentId}/teacherFeedback`);
};
//teacherFeedback
export const getAllFeedback = () => {
  return axios.get(`/adminFeedback/getAllFeedbacks`);
};

export const deleteFeedback = (feedbackId:number) => {
  return axios.delete(`/adminFeedback/${feedbackId}`);
};
//bookmark 
export const toggleBookmark = (bookmarkData: {
  studentId: string;
  courseId: string;
  resourceId:string;
  url: string;
}) => {
  return axios.post('/bookmark/add', bookmarkData);
};

export const isBookmark = (
  studentId: string,
  resourceId: string,
) => {
  return axios.get(`/bookmark/isBookmarked/${studentId}/${resourceId}`);
};

export const getBookmark = (
  studentId: string
) => {
  return axios.get(`/bookmark/student/${studentId}`);
};

//make up class
export const addMakeupClass = (classData: {
  studentId: string;
  date: string;
  time: string;
  teacherId: string;
  courseDetailsId: string;
  reason: string;
  status?:string;
}) => {
  return axios.post('/makeupclass/schedule', classData);
};

export const getStdMakeUpClasses = (
  studentId: string
) => {
  return axios.get(`/makeupclass/getStatus/${studentId}`);
};

export const cancelMakeup = (classId:number) => {
  return axios.delete(`/makeupclass/${classId}`);
};

//admin updateStatus
export const getAllMakeUpClassesReq = (
) => {
  return axios.get(`/makeupclass/getAllStatus`);
};

export const updateMakeupClassStatus = (classData: {
  status: string;
  adminReason?: string;
},classId: number) => {
  return axios.put(`/makeupclass/updateStatus/${classId}`, classData);
};

export const getAllCoursesCrud = () => {
  return axios.get('/admin/getAllCourses');
};
export const addCourseCrud = (formData:FormData) => {
  return axios.post('/admin/addCourse', formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getAllCoursesUpcoming = () => {
  return axios.get('/admin/getAllCoursesUpcoming');
};

export const updateCourseCrud = async (
  courseId: string,
  formData: FormData
) => {
  try {
    const response = await axios.put(`/admin/updateCourse/${courseId}`, formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCourseCrud = (courseId: string) => {
  return axios.delete(`/admin/deleteCourse/${courseId}`);
};

export const getCourses = () => {
  return axios.get('/admin/getAllCourses');
};

export const addCourseUpcoming = (courseData: {
  teacherId?: string;
  studentId?: string;
  courseId: string;
  startingFrom?:any;
  isStarted:boolean;
}) => {
  return axios.post('/upcomingCourses/', courseData);
};

export const getAllUpcomingCoursesTable = () => {
  return axios.get('/upcomingCourses');
};

export const updateCourseUpcoming = async (
  id: string,
  courseData: {
    teacherId: string;
    studentId?: string;
    courseId?: string;
    startingFrom:string;
  },
) => {
  try {
    const response = await axios.put(`/upcomingCourses/${id}`, courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCourseUpcoming= (id: string) => {
  return axios.delete(`/upcomingCourses/${id}`);
};

export const enrollStudentsInUpcomingCourse = (courseData: {
  studentId?: string;
  courseId: string;
}) => {
  return axios.post('/upcomingCourses/enroll', courseData);
};

export const getStudentEnrolledCourses = (studentId:any) => {
  return axios.get(`/upcomingCourses/enrolledCourses/${studentId}`);
};
export const getEnrolledCoursesWithCourseId = (courseId:any) => {
  return axios.get(`/upcomingCourses/enrolledCoursesWithCourseId/${courseId}`);
};

export const shareProgressToSocial = (data:FormData) => {
  return axios.post('/resource/uploadProgress', data,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

//blog API'S
export const createBlog = (formData:FormData) => {
  return axios.post('/blog/add', formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getAllBlogs = () => {
  return axios.get('/blog/');
};

export const getBlogById = (id:any) => {
  return axios.get(`/blog/${id}`);
};

export const deleteBlog = (id:any) => {
  return axios.delete(`/blog/${id}`);
};

//upload student dp
export const uploadStudentProfileImage = (formData: FormData) => {
  return axios.post('/student/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getStudentProfileImage = (studentId: string) => {
  return axios.get(`/student/profileImage/${studentId}`);
};

export const submitSurvey = (surveyData: {
  studentId: string;
  classId: string;
  teacherId: string;
  classRating: number;
  lessonRating: number;
  teacherRating: number;
  feedback?: string;
}) => {
  return axios.post('/survey/submit', surveyData);
};

//survey dashboard API's 
export const getStats = (teacherId: any) => {
  return axios.get(`/survey/stats/${teacherId}`);
};

export const getDistribution = (teacherId: any) => {
  return axios.get(`/survey/distribution/${teacherId}`);
};
export const getTrend = (teacherId: any) => {
  return axios.get(`/survey/trend/${teacherId}`);
};
export const getSurveyFeedback = (teacherId: any,page:any,limit:any=10) => {
  if(teacherId !==''){
    return axios.get(`/survey/feedback/${teacherId}/${page}/${limit}`);
  }else{
    return axios.get(`/survey/feedback`);
  }
};

export const getWeeklyContent = (courseDetailId: any) => {
  return axios.get(`/weeklyContent/${courseDetailId}`);
};

export const uploadWeeklyContent = (formData: FormData) => {
  return axios.post('/weeklyContent/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getUniqueCourses = () => {
  return axios.get('/course/getUniqueCourses');
};

export const deleteWeeklyContent = (id:any) => {
  return axios.delete(`/weeklyContent/${id}`);
};

export const submitAnnouncements = (obj:any) => {
  return axios.post('/admin/announcement', obj);
}

export const getAllAnnouncements = () => {
  return axios.get('/admin/getAllAnnouncements');
}
export const deleteannouncement = (announcementId:any) => {
  return axios.delete(`/admin/deleteannouncement/${announcementId}`);
};
export const getAnnouncement = (obj:any) => {
  return axios.post('/admin/getAnnouncements',obj);
}

export const submitRequest = (obj:any) => {
  return axios.post('/support', obj);
}


export const getAllRequests = () => {
  return axios.get('/support');
}

export const getRequestByUser = (userId:any,userType:any) => {
  return axios.get(`/support/user/${userId}/${userType}`);
}

export const updateRequest = (id:any,obj:any) => {
  return axios.put(`/support/${id}`,obj);
}

export const deleteRequest = (id:any) => {
  return axios.delete(`/support/${id}`);
};

//update passwords
export const updateStudentPassword = (obj:any) => {
  return axios.post('/admin/changeStudentPassword', obj);
}

export const updateTeacherPassword = (obj:any) => {
  return axios.post('/admin/changeTeacherPassword', obj);
}

export const updateAdminPassword = (obj:any) => {
  return axios.post('/admin/changePassword', obj);
}

// export const getAdminsDetail = (adminId:any) => {
//   alert('adminId:::'+adminId)
//   return axios.get(`/admin/${adminId}`);
// }

export const getMessages = () => {
  return axios.get(`/chat/messages`);
}

export const getPrivateMessages = (userId:any,userType:any) => {
  return axios.get(`/chat/private-messages/${userId}/${userType}`);
}

export const getRecentChats = (userId:any,userType:any) => {
  return axios.get(`/chat/recent-chats/${userId}/${userType}`);
}

export const getAdminDetailsByUsername = (obj:any) => {
  return axios.post('/admin/getByUsername', obj);
}

//parent module

export const addParent = (userData: {
  address: string;
  contact: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  studentId:any;
}) => {
  return axios.put('/parent/signup', userData);
};

export const getAllParents = () => {
  return axios.get('/parent/getAll');
};

export const updateParent = (
  parentId: string,
  parentData: {
    firstName: string;
    lastName: string;
    contact: string;
    address: string;
  },
) => {
  return axios.put(`/parent/update/${parentId}`, parentData);
};

export const updateParentPassword = (obj:any) => {
  return axios.post('/admin/changeParentPassword', obj);
}

export const deleteParent = (parentId: string) => {
  return axios.delete(`/parent/${parentId}`);
};

export const signinParent = (credentials: {
  username: string;
  password: string;
}) => {
  return axios.post('/parent/login', credentials);
};

export const getParentById = (parentId:any) => {
  return axios.get(`/parent/getById/${parentId}`);
};

export const uploadParentProfileImage = (formData: FormData) => {
  return axios.post('/parent/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getParentProfileImage = (parentId: string) => {
  return axios.get(`/parent/profileImage/${parentId}`);
};

//Plan Management
export const addPlan = (formData:any) => {
  return axios.post('/plans/add', formData);
};

export const updatePlan = (
  planId: string,
  formData:any,
) => {
  return axios.put(`/plans/update/${planId}`, formData);
};

export const getPlans = () => {
  return axios.get(`/plans/all`);
};

export const deletePlan = (id: any) => {
  return axios.delete(`/plans/delete/${id}`);
};

export const getStudentPlan = (studentId:any) => {
  return axios.get(`/plans/students/${studentId}/plan`);
};

export const changePlan = (formData:any) => {
  return axios.post('/plans/plan-change-requests', formData);
};

export const getAllPlanChangeRequests = () => {
  return axios.get(`/planchange/requests`);
};

export const approvePlanRequest = (requestId:any) => {
  return axios.post(`/planchange/plan-change-requests/${requestId}/approve`);
};

export const rejectPlanRequest = (requestId:any) => {
  return axios.post(`/planchange/plan-change-requests/${requestId}/reject`);
};

export const addMonthlyFee = (data:any) => {
  return axios.post(`/payment/add-monthly-fee`,data);
};

export const getAllPayments = () => {
  return axios.get(`/payment/payments`);
};

export const getStudentPayment = (studentId:any) => {
  return axios.get(`/payment/student/${studentId}`);
};

export const getTotalRevenue = () => {
  return axios.get(`/payment/revenue/total`);
};

export const getTotalStudents = () => {
  return axios.get(`/student/count`);
};

export const getTotalTeachers = () => {
  return axios.get(`/teacher/count`);
};

export const getRecentStudents = () => {
  return axios.get(`/student/recentCount`);
};

//get next four hour classes
export const getNextFourHourClasses = () => {
  return axios.get(`/admin/getNextFourHoursClasses`);
};

//get free time slots
export const getTeachersFreeTimeSlots = (teacherId?:any,timeRange?:any) => {
  return axios.get(`/admin/getFreeTimeSlots/${teacherId}/${timeRange}`);
};
export const createRole = (data:any) => {
  return axios.post(`/admin/createRole`,data);
};
// updateRole
export const updateRole = (data:any,roleId:any) => {
  return axios.put(`/admin/updateRole/${roleId}`,data);
};

export const getRoles = () => {
  return axios.get(`/admin/getAllRoles`);
};

export const getRights = () => {
  return axios.get(`/admin/getFreeTimeSlots`);
};
// assignRightsToRole


export const addRight = (data:any) => {
  return axios.post(`/admin/addRight`,data);
};

export const createAdmin = (data:any) => {
  return axios.post(`/admin/createAdmin`,data);
};

export const getAllAdminUsers = ()=>{
  return axios.get(`/admin/getAllAdminUsers`);
}
export const updateAdmin = (data:any,id:any) => {
  return axios.put(`/admin/updateAdmin/${id}`,data);
};

export const deleteAdmin = (id:any) => {
  return axios.delete(`/admin/deleteAdmin/${id}`);
};

export const assignRightsToRole = (roleId: string, rights: string[]) => {
  return axios.post(`/admin/assign-rights`,{ roleId, rights });
};

export const getRightsByRole = (roleId: string) => {
  return axios.get(`/admin/rights/${roleId}`);
};

export const getUserRights = (roleId: string) => {
  return axios.get(`/admin/user-rights/${roleId}`);
};