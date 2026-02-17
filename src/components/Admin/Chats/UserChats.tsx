import { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import axios from '../../../api/axios';
import {
  getAdminDetailsByUsername,
  getMessages,
  getPrivateMessages,
  getRecentChats,
} from '../../../api/auth';
import defaultImage from '/images/avatar.png';
import { EllipsisVertical } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useSocket } from '../../Generic/SocketContext';
import { GetUserImage } from '../../Generic/GetUserImage';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';
import { EmptyTemplate } from '../../Generic/EmptyTemplate';
import { useParams } from 'react-router-dom';

export const UserChats = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const userType = useSelector((state: any) => state.auth.userType);
  const [message, setMessage] = useState('');
  const [messageId, setMessageId] = useState('');
  const [recentUsers, setRecentUsers] = useState([]);
  const [whomToSend, setWhomToSend] = useState<any>('');
  const [wtsId, setWTSId] = useState<any>('');
  const [wtsType, setWTType] = useState<any>('');
  const [filteredMessages, setFilteredMessages] = useState<any>([]);
  const [adminDetails, setAdminDetails] = useState<any>([]);

  const { sendPrivateMessage, privateMessage, setPrivateMessages }: any =
    useSocket();

  const [privateMessageList, setPrivateMessageList] = useState<any>([]);
  const chatContainerRef: any = useRef(null);

  //getAdminDetails
  useEffect(() => {
    const getAdminDetails = async () => {
      try {
        const response = await getAdminDetailsByUsername({ username: 'admin' });
        debugger;
        if (response.data) {
          // setResponse(response.data.admin);

          setAdminDetails(response.data.admin);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAdminDetails();
  }, []);

  useEffect(() => {
    // alert('hello got you new meesage')
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    console.log('privateMessage', privateMessage);
  }, [privateMessage]);

  const { usersId, usersType } = useParams();

  useEffect(() => {
    if (usersId && usersType) {
      if (
        recentUsers.filter(
          (r: any) =>
            (r.senderId === usersId && r.senderType === usersType) ||
            (r.receiverId === usersId && r.receiverType === usersType),
        ).length === 0
      ) {
        sendPrivateMessage('Hi.', usersId, usersType, userId, userType);
        getRecentUsers();
      }
    }
  }, [usersId, usersType]);

  useEffect(() => {
    getRecentUsers();

    fetchMessages();
  }, [setPrivateMessages]);

  const fetchMessages = async () => {
    try {
      const response = await getPrivateMessages(userId, userType);
      debugger;
      setPrivateMessages(response.data); // Assuming your context provides a `setPrivateMessages` function
    } catch (error) {
      console.error('Error fetching privateMessage:', error);
    }
  };
  const getRecentUsers = async () => {
    try {
      const response = await getRecentChats(userId, userType);
      debugger;
      if (userType == 'admin') {
        setRecentUsers(response.data);
      } else {
        let excludeAdmin = response.data.filter(
          (r: any) => r.senderType !== 'admin' && r.receiverType !== 'admin',
        );
        setRecentUsers(excludeAdmin);
      }
    } catch (error) {
      console.error('Error fetching privateMessage:', error);
    }
  };
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (message.trim()) {
      sendPrivateMessage(message, wtsId, wtsType, userId, userType);
      setMessage(''); // Clear input after sending
    }
  };

  useEffect(() => {
    if (privateMessage) {
      // Check if privateMessage is an array
      if (Array.isArray(privateMessage)) {
        setPrivateMessageList((prevMessages: any) => [
          ...prevMessages,
          ...privateMessage.filter(
            (msg) =>
              !prevMessages.some((prevMsg: any) => prevMsg.id === msg.id), // Assuming `id` is unique
          ),
        ]);
      } else {
        setPrivateMessageList((prevMessages: any) => [
          ...prevMessages,
          privateMessage,
        ]);
      }
    }
  }, [privateMessage]);

  useEffect(() => {
    // Filter messages for the selected user whenever `whomToSend` changes
    if (whomToSend) {
      const filtered = privateMessageList.filter(
        (msg: any) =>
          (msg.senderId === wtsId && msg.senderType === wtsType) ||
          (msg.receiverId === wtsId && msg.receiverType === wtsType),
      );
      const getOnlyYourMsg = filtered.filter(
        (msg: any) =>
          (msg.senderId === userId && msg.senderType === userType) ||
          (msg.receiverId === userId && msg.receiverType === userType),
      );
      debugger;
      setFilteredMessages(getOnlyYourMsg);
    }
  }, [whomToSend, privateMessageList, wtsId, wtsType]);

  const handleUserClick = (user: any) => {
    console.log('user::', user);
    if (user?.username == 'admin') {
      setWhomToSend(adminDetails);
      setWTSId(adminDetails?.id);
      setWTType('admin');
    } else {
      setWhomToSend(user?.otherUserDetails);
      setWTSId(user?.otherUserDetails?.id);
      setWTType(user?.otherUserDetails?.userType);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex lg:mt-0 md:mt-0 mt-10" style={{ height: '30rem' }}>
        <div
          className="lg:w-1/4 md:w-1/4 w-2/4 bg-white dark:bg-black border-r border-gray-300"
          style={{ height: '30rem' }}
        >
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-blue-600  ch gh text-white">
            <h1 className="text-2xl font-semibold">Recent Chats</h1>
          </header>

          <div
            className="overflow-y-auto  p-3 mb-9 bg-white dark:bg-black"
            style={{ height: '30rem' }}
          >
            <>
              {adminDetails && userType != 'admin' && (
                <>
                  <div
                    onClick={() => {
                      handleUserClick(adminDetails);
                    }}
                    className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md  border-b border-gray-300"
                  >
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 ">
                      <img
                        src="/images/avatar.png"
                        className={'w-12 h-12 rounded-full'}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">
                        {adminDetails?.name}
                      </h2>
                    </div>
                  </div>
                </>
              )}
            </>

            {recentUsers.map((val: any) => {
              return (
                <div
                  onClick={() => {
                    handleUserClick(val);
                  }}
                  className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <GetUserImage
                      userId={val?.otherUserDetails?.id}
                      userType={val?.otherUserDetails?.userType}
                      imageUrl={
                        val?.otherUserDetails?.profileImg
                          ? val?.otherUserDetails?.profileImg
                          : val?.otherUserDetails?.imageUrl
                      }
                      classes={'w-12 h-12 rounded-full'}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {val?.otherUserDetails?.firstName}{' '}
                      {val?.otherUserDetails?.lastName}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {val?.message?.length > 30
                        ? val?.message?.slice(0, 30) + '...'
                        : val?.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="flex-1 bg-gray-100 dark:bg-black"
          style={{ height: '38rem' }}
        >
          {whomToSend && (
            <header className="bg-white p-4 text-gray-700 ch gh flex items-center gap-2">
              <GetUserImageAndName
                userId={whomToSend?.id}
                userType={whomToSend?.userType}
                imageUrl={
                  whomToSend?.profileImg
                    ? whomToSend?.profileImg
                    : whomToSend?.imageUrl
                }
                firstName={
                  whomToSend?.firstName ? whomToSend?.firstName : 'Admin'
                }
                lastName={whomToSend?.lastName ? whomToSend?.lastName : ''}
                showType={true}
              />
            </header>
          )}

          {filteredMessages && whomToSend && filteredMessages?.length > 0 ? (
            <div
              ref={chatContainerRef}
              className="overflow-y-auto p-4 bg-gray-200  "
              style={{ height: '30rem' }}
            >
              {filteredMessages?.map((message: any, index: any) => (
                <>
                  {message?.senderId !== userId ||
                  message?.senderType !== userType ? (
                    <div
                      ref={chatContainerRef}
                      className="flex flex-col mb-4 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-1">
                          {message?.senderType === 'admin' ? (
                            <img
                              src={defaultImage}
                              alt="User Avatar"
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <img
                              src={`${axios.defaults.baseURL}/${
                                message?.senderDetails?.profileImg
                                  ? message?.senderDetails?.profileImg
                                  : message?.senderDetails?.imageUrl
                              }`}
                              alt="User Avatar"
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                        </div>
                        {message?.senderType === 'admin' ? (
                          <p className="font-semibold text-md ">
                            {message?.senderDetails?.name}
                          </p>
                        ) : (
                          <div className="flex flex-col justify-center">
                            <p className="font-semibold text-md ">
                              {message?.senderDetails?.firstName}{' '}
                              {message?.senderDetails?.lastName}
                            </p>
                            <p className="text-gray-500 text-sm  -mt-1.5 ">
                              {message?.senderType}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex max-w-96 bg-white dark:bg-zinc-600 rounded-lg p-3 gap-3 mt-3 ml-10 ">
                        <p className="text-gray-700">{message?.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <div
                        className={`${
                          message?.id === messageId ? '' : ''
                        } flex justify-end mb-4 cursor-pointer `}
                      >
                        <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3 ">
                          <p>{message?.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
              <div ref={chatContainerRef}></div>
            </div>
          ) : (
            <div>
              <EmptyTemplate
                heading="No messages"
                description="No messages found"
              />
            </div>
          )}
        </div>
      </div>
      {whomToSend && (
        <footer className="bg-white dark:bg-black border-t border-gray-300 p-4 absolute lg:bottom-0 md:bottom-0 -bottom-30 w-4/5">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-2 dark:bg-black rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
            >
              Send
            </button>
          </form>
        </footer>
      )}
    </>
  );
};
