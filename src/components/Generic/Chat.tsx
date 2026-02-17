import { useEffect, useRef, useState } from 'react';
import { useSocket } from './SocketContext';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { getMessages } from '../../api/auth';
import defaultImage from '/images/avatar.png';
import { EllipsisVertical } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { EmptyTemplate } from './EmptyTemplate';

export const Chat = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const userType = useSelector((state: any) => state.auth.userType);
  const [message, setMessage] = useState('');
  const [messageId,setMessageId] = useState('')
  const { sendMessage, messages, setMessages, handleDeleteMessage }: any =
    useSocket();
  const chatContainerRef: any = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (id:any) => {
    setMessageId(id);
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessages();
        setMessages(response.data.messages); // Assuming your context provides a `setMessages` function
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [setMessages]);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message, userId, userType);
      setMessage(''); // Clear input after sending
    }
  };

  const copyCode = (message:any) => {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        toast.success('Message copied.');
        setIsDropdownOpen(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleDelMessage = (msgId:any) =>{
    handleDeleteMessage(msgId);
    setIsDropdownOpen(false);
  }

  return (
    <>
    <ToastContainer />
      <div style={{ height: '30rem' }}>

        <div className="flex-1  " style={{ height: '30rem' }}>
          <header className="bg-white p-4 text-gray-700 ch gh">
            <h1 className="text-2xl font-semibold ">Group Chat</h1>
          </header>
          {messages && messages.length > 0 ? (
            <div
              ref={chatContainerRef}
              className="overflow-y-auto p-4 bg-blue-200 dark:bg-black  "
              style={{ height: '30rem' }}
            >
              {messages.map((message: any, index: any) => (
                <>
                  {message?.senderId !== userId ||
                  message?.senderType !== userType ? (
                    <div
                      ref={chatContainerRef}
                      className="flex flex-col mb-4 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-1">
                          {(message?.senderType === 'admin' || !(message?.senderDetails?.profileImg || message?.senderDetails?.imageUrl)) ? (
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
                    <div className='flex flex-col items-end'>
                    <div className={`${message?.id === messageId ? '' : ''} flex justify-end mb-4 cursor-pointer `}>
                      <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3 ">
                        <p>{message?.message}</p>
                      </div>
                      <button
                        onClick={()=>{toggleDropdown(message?.id)}}
                        id="dropdownMenuIconButton"
                        data-dropdown-toggle="dropdownDots"
                        data-dropdown-placement="bottom-start"
                        className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900  rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                        type="button"
                      >
                        <EllipsisVertical />
                      </button>
                    
                    </div>

                      {(isDropdownOpen && message?.id === messageId) && (
                        <div
                          id="dropdownDots"
                          className="z-10 mb-6 bg-white dark:bg-zinc-600 divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600"
                        >
                          <ul
                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownMenuIconButton"
                          >
                            <li>
                              <a
                                onClick={()=>{copyCode(message?.message)}}
                                className="block px-4 cursor-pointer py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Copy
                              </a>
                            </li>
                          
                            <li>
                              <a
                                onClick={()=>{handleDelMessage(message?.id)}}
                                className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Delete
                              </a>
                            </li>
                            <li>
                              <a
                               onClick={()=>{setIsDropdownOpen(false)}}
                                className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Close
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                      </div>
                  )}
                </>
              ))}
              <div ref={chatContainerRef}></div>
            </div>
          ):(
            <div>
                <EmptyTemplate 
                    heading="No messages"
                    description="No messages found"
                />
                 
                </div>
          )}
        </div>
      </div>
      <footer className="bg-white dark:bg-black border-t border-gray-300 p-4 absolute bottom-0 w-4/5">
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
    </>
  );
};
