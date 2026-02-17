// SocketContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios, { SOCKET_URL } from '../../api/axios';

const SocketContext: any = createContext(null);

export const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState<any>([]);
  const [privateMessage, setPrivateMessages] = useState<any>([]);
  //notifications
  const [notifications, setNotifications] = useState<any>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket: any = io(SOCKET_URL, {
      withCredentials: true,
      path: '/chat/socket.io/',
      transports: ['websocket', 'polling'],
      secure: true, // Add this if not already present
    });

    // Event listeners for online users
    newSocket.on('onlineUsers', (users: any) => {
      setOnlineUsers(users);
    });

    // Event listener for receiving new messages
    newSocket.on('newMessage', (message: any) => {
      if (!message.isPrivate) {
        setMessages((prevMessages: any) => [...prevMessages, message]);
      }
    });

    // Listening for incoming private messages
    newSocket.on('privateMessageSent', (message: any) => {
      // Handle displaying the private message to the user
      setPrivateMessages((prevMessages: any) => [
        ...(prevMessages || []),
        message,
      ]);
      console.log('Received a private message:', message);
    });

    //notifications
    newSocket.on('newNotification', (notification: any) => {
    //  alert("got a notifications for you..")
      setNotifications((prev: any) => [notification, ...prev]);

      // Play notification sound
      playNotificationSound();

      // Show notification modal
      setShowNotificationModal(true);
    });

    // Receive unread notifications when user connects
    newSocket.on('unreadNotifications', (unread: any) => {
      setNotifications(unread);
    });

    // Set the socket instance in state
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Function to emit the userConnected event
  const emitUserConnected = (userId: any, userType: any) => {
    if (socket) {
      socket.emit('userConnected', { userId, userType });
    }
  };
  if (socket) {
    socket.on('messageDeleted', ({ id }: any) => {
      setMessages((prevMessages: any) =>
        prevMessages.filter((msg: any) => msg.id !== id),
      );
    });
  }

  const handleDeleteMessage = (messageId: any) => {
    socket.emit('deleteMessage', messageId);
  };
  // Function to emit a chat message
  const sendMessage = (message: any, senderId: any, senderType: any) => {
    if (socket) {
      socket.emit('chatMessage', { message, senderId, senderType });
    }
  };
  // Emitting a private message
  const sendPrivateMessage = (
    message: any,
    receiverId: any,
    receiverType: any,
    userId: any,
    userType: any,
  ) => {
    socket.emit('privateMessage', {
      message,
      senderId: userId, // Current logged-in user ID
      senderType: userType, // 'student', 'teacher', or 'admin'
      receiverId,
      receiverType,
    });
  };

  // Function to play notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/notif.mp3'); // Make sure to add a notification.mp3 file in the public folder
    audio.play();
  };

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        emitUserConnected,
        sendMessage,
        messages,
        privateMessage,
        setMessages,
        handleDeleteMessage,
        sendPrivateMessage,
        setPrivateMessages,
        notifications,
        showNotificationModal,
        setShowNotificationModal,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext);
