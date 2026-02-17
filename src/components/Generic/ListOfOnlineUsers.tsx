// OnlineStatus.js

import { useEffect } from 'react';
import { useSocket } from './SocketContext';

// const OnlineStatus = ({userId,userType}:any) => {
//   const { onlineUsers }:any = useSocket();

  
  // const onlineTeachers = onlineUsers.filter((user:any) => user.userType === userType && user.id == userId);
  // const onlineStudents = onlineUsers.filter((user:any) => user.userType === 'student' && user.id == userId);

  // return (
  //   <div className="p-4">
  //     <h3>Online Teachers ({onlineTeachers.length})</h3>
  //     {onlineTeachers.map((teacher:any) => (
  //       <div key={teacher.id}>{teacher.name} (Online)</div>
  //     ))}

  //     <h3>Online Students ({onlineStudents.length})</h3>
  //     {onlineStudents.map((student:any) => (
  //       <div key={student.id}>{student.name} (Online)</div>
  //     ))}
  //   </div>
  // );
// };

// export default OnlineStatus;
const useOnlineStatus = (userId:any, userType:any) => {
  const { onlineUsers }:any = useSocket();
  // Check if the user with the specified userId and userType is online
  const isOnline = onlineUsers.some((user:any) => user.userType === userType && user?.details?.id === userId);

  return isOnline;
};

export default useOnlineStatus;