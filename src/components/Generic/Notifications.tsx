import React, { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useSelector } from "react-redux";

const NotificationModal = () => {
  const { notifications, showNotificationModal, setShowNotificationModal }:any = useSocket();
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const userId = useSelector((state:any) => state.auth.userId);
  const userType = useSelector((state:any) => state.auth.userType);
  // Filter notifications by userId and userType
  useEffect(() => {
    if (notifications && userId && userType) {
      const filtered = notifications
        .filter(
          (notification:any) =>
            notification.userId === userId && notification.userType === userType
        )
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); 
      setFilteredNotifications(filtered);
    }
  }, [notifications, userId, userType]);

  // Automatically open modal if there are unread notifications
  useEffect(() => {
    if (filteredNotifications.length > 0) {
      setShowNotificationModal(true);
    }
  }, [filteredNotifications, setShowNotificationModal]);

  if (!showNotificationModal) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96 max-h-[80vh] flex flex-col">
        <h2 className="text-lg font-semibold mb-2">New Notifications</h2>
        <ul className="overflow-y-auto flex-1">
          {filteredNotifications.slice(0, 5).map((notification:any, index) => (
            <li key={index} className="p-2 border-b last:border-0">
              <strong className="font-semibold block mb-1 text-gray-800">{notification.title}</strong>
              <p className="text-gray-600 text-sm break-all ">"{notification.message}"</p>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowNotificationModal(false)}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;