import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import SidebarLinkGroup from './SidebarLinkGroup';
import {
  FaUsers,
  FaUserPlus,
  FaCalendarAlt,
  FaVideo,
  FaDollarSign,
  FaClipboardList,
  FaGamepad,
  FaComments,
  FaAddressBook,
  FaSpeakerDeck,
  FaRubleSign,
} from 'react-icons/fa';
import { IoBookmark } from 'react-icons/io5';
import {
  BookmarkCheck,
  BookOpenCheck,
  Calendar1Icon,
  Clapperboard,
  Currency,
  CurrencyIcon,
  Drum,
  FileClock,
  Gamepad,
  GraduationCap,
  HelpingHand,
  Home,
  LandPlot,
  MessageCircle,
  MessageCircleHeart,
  MessageCircleMore,
  MonitorPlay,
  MonitorUp,
  NotebookPen,
  NotebookText,
  SquareLibrary,
  User,
  UserPen,
  UserPlus,
  UserRoundCheck,
  Users,
  Users2,
  Video,
} from 'lucide-react';
import { RiCodeView, RiParentFill } from 'react-icons/ri';
import { HiCurrencyDollar } from 'react-icons/hi';
import { getUserRights } from '../../api/auth';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface NavItem {
  path?: string;
  name: string;
  icon: React.ReactElement;
  subItems?: NavItem[];
  right?:string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const userType = useSelector((state: any) => state.auth.userType);
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );
  const [userRights, setUserRights] = useState<string[]>([]);
  // const [userRole,setUserRole] = useState('null');
  const userRole = useSelector((state: any) => state.auth.userRole);

  useEffect(() => {
    const fetchUserRights = async () => {
        try {
            const response = await getUserRights(userRole);
            setUserRights(response.data.rights);
        } catch (error) {
            console.error('Error fetching user rights:', error);
        }
    };

    fetchUserRights();
}, [userRole]);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const getIconSize = () => {
    if (sidebarOpen) {
      return 20;
    } else {
      return 30;
    }
  };
  const adminNavItems: NavItem[] = [
    {
      path: '/admindashboard',
      name: 'Dashboard',
      icon: <Home size={getIconSize()} />,
      right:'dashboard'
    },
    {
      path: '/chat',
      name: 'Group Chat',
      icon: <MessageCircle size={getIconSize()} />,
      right:'group_chat'

    },
    {
      path: '/userChat',
      name: 'Chats',
      icon: <MessageCircleMore size={getIconSize()} />,
      right:'chats'

    },
    {
      path: '/student',
      name: 'Students',
      icon: <Users size={getIconSize()} />,
      right:'students'

    },
    {
      path: '/teacher',
      name: 'Teachers',
      icon: <GraduationCap size={getIconSize()} />,
      right:'teachers'

    },
    {
      path: '/addcourses',
      name: 'Courses',
      icon: <SquareLibrary size={getIconSize()} />,
      right:'courses'

    },
    {
      path: '/assignteacher',
      name: 'Assign Teacher',
      icon: <UserPlus size={getIconSize()} />,
      right:'assign_teacher'
      
    },

    {
      path: '/scheduleclass',
      name: 'Schedule Class',
      icon: <Clapperboard size={getIconSize()} />,
      right:'schedule_class'

    },
    // {
    //   path: '/joinmeeting',
    //   name: 'Join Meeting',
    //   icon: <Video size={getIconSize()} />,
    // },
    {
      path: '/uploadresource',
      name: 'Upload Resource',
      icon: <MonitorUp size={getIconSize()} />,
      right:'upload_resources'

    },
    {
      path: '/giveFeedback',
      name: 'Feedback',
      icon: <MessageCircleHeart size={getIconSize()} />,
      right:'feedback'

    },
    {
      path: '/makeupclassconfig',
      name: 'Makeup Class',
      icon: <MonitorPlay size={getIconSize()} />,
      right:'makeup_class'

    },
    {
      path: '/enrollmentRequests',
      name: 'Enrollments',
      icon: <Users2 size={getIconSize()} />,
      right:'enrollments'

    },
    {
      path: '/planmanagement',
      name: 'Student Plan',
      icon: <HiCurrencyDollar size={getIconSize()} />,
      right:'student_plan'

    },
    {
      path: '/planrequests',
      name: 'Change Plan Requests',
      icon: <HelpingHand size={getIconSize()} />,
      right:'change_plan'

    },
    {
      path: '/addFee',
      name: 'Fee Management',
      icon: <CurrencyIcon size={getIconSize()} />,
      right:'fee_management'

    },
    {
      path: '/writeblog',
      name: 'Create a blog',
      icon: <NotebookPen size={getIconSize()} />,
      right:'create_blog'

    },
    {
      path: '/blogs',
      name: 'Blogs',
      icon: <NotebookText size={getIconSize()} />,
      right:'blogs'

    },
    {
      path: '/announcements',
      name: 'Announcemnts',
      icon: <Drum size={getIconSize()} />,
      right:'announcements'

    },
    {
      path: '/support',
      name: 'Support System',
      icon: <BookOpenCheck size={getIconSize()} />,
      right:'support_system'

    },
    {
      path: '/parent',
      name: 'Parents',
      icon: <RiParentFill size={getIconSize()} />,
      right:'parents'

    },
    {
      path: '/rbac',
      name: 'RBAC',
      icon: <FaRubleSign size={getIconSize()} />,
      right:'rbac'

    },
    
   
  ];

  const teacherNavItems: NavItem[] = [
    {
      path: '/teacherdashbord',
      name: 'Dashboard',
      icon: <Home size={getIconSize()} />,
    },
    // {
    //   path: '/chat',
    //   name: 'Group Chat',
    //   icon: <MessageCircle size={getIconSize()} />,
    // },
    {
      path: '/userChat',
      name: 'Chats',
      icon: <MessageCircleMore size={getIconSize()} />,
    },
    {
      path: '/mystudents',
      name: 'My Students',
      icon: <Users size={getIconSize()} />,
    },
    {
      path: '/mycourses',
      name: 'My Courses',
      icon: <SquareLibrary size={getIconSize()} />,
    },
    // {
    //   path: '/uploadresource',
    //   name: 'Upload Resource',
    //   icon: <MonitorUp size={getIconSize()} />,
    // },
    // {
    //   name: 'Assignments',
    //   icon: <FileClock size={sidebarOpen ? 20 : 25} />,
    //   subItems: [
    //     {
    //       path: '/uploadassignment',
    //       name: 'Upload Assignment',
    //       icon: <MonitorUp size={getIconSize()} />,
    //     },
    //     {
    //       path: '/allassignment',
    //       name: 'Assignments Details',
    //       icon: <FileClock size={getIconSize()} />,
    //     },
    //     {
    //       path: '/submittedassignment',
    //       name: ' Submitted Assignments ',
    //       icon: <FaClipboardList size={getIconSize()} />,
    //     },
    //   ],
    // },
    // {
    //   path: '/quiz',
    //   name: 'Quiz',
    //   icon: <BookOpenCheck size={getIconSize()} />,
    // },
    // { path: '/scheduleclass', name: 'Schedule Class', icon: <FaCalendarAlt size={20} /> },
    // {
    //   path: '/upcomingclasses',
    //   name: 'Upcoming Classes',
    //   icon: <Calendar1Icon size={getIconSize()} />,
    // },
    // {
    //   path: '/joinmeeting',
    //   name: 'Join Meeting',
    //   icon: <Video size={getIconSize()} />,
    // },
    {
      path: '/giveFeedback',
      name: 'Give Feedback',
      icon: <MessageCircleHeart size={getIconSize()} />,
    },
    {
      path: '/studentfeedback',
      name: 'Student Feedback',
      icon: <MessageCircleHeart size={getIconSize()} />,
    },
    {
      path: '/teacherprofile',
      name: 'My Profile',
      icon: <UserPen size={getIconSize()} />,
    },
    {
      path: '/writeblog',
      name: 'Create a blog',
      icon: <NotebookPen size={getIconSize()} />,
    },
    {
      path: '/blogs',
      name: 'Blogs',
      icon: <NotebookText size={getIconSize()} />,
    },
    {
      path: '/support',
      name: 'Support System',
      icon: <BookOpenCheck size={getIconSize()} />,
    },
   
  ];

  const studentNavItems: NavItem[] = [
    { path: '/dashboard', name: 'Dashboard', icon: <Home size={20} /> },
    // { path: '/courses', name: 'My Courses', icon: <SquareLibrary size={20} /> },
    {
      path: '/chat',
      name: 'Group Chat',
      icon: <MessageCircle size={getIconSize()} />,
    },
    {
      path: '/userChat',
      name: 'Chats',
      icon: <MessageCircleMore size={getIconSize()} />,
    },
    {
      path: '/mycourses',
      name: 'My Courses',
      icon: <SquareLibrary size={20} />,
    },

    {
      path: '/studentquiz',
      name: 'My Quiz',
      icon: <BookOpenCheck size={20} />,
    },
    {
      path: '/assignments',
      name: 'My Assignments',
      icon: <FileClock size={20} />,
    },
    // { path: '/upcomingclasses', name: 'Upcoming Classes', icon: <FaCalendarAlt size={20} /> },

    // { path: '/joinmeeting', name: 'Join Meeting', icon: <FaVideo size={20} /> },
    {
      path: '/feedback',
      name: 'Give Feedback',
      icon: <MessageCircleHeart size={20} />,
    },
    {
      path: '/feedbacks',
      name: 'Feedbacks',
      icon: <RiCodeView size={20} />,
    },
    { path: '/faq', name: 'Student FAQ', icon: <BookOpenCheck size={20} /> },
    {
      path: '/Attendance',
      name: 'Attendance',
      icon: <UserRoundCheck size={20} />,
    },
    {
      path: '/playgame',
      name: 'Play Game',
      icon: <Gamepad size={20} />,
    },
    {
      path: '/bookmarks',
      name: 'My Bookmarks',
      icon: <BookmarkCheck size={20} />,
    },
    {
      path: '/myplan',
      name: 'My Plan',
      icon: <LandPlot size={20} />,
    },
    {
      path: '/library',
      name: 'My Library',
      icon: <SquareLibrary size={20} />,
    },
    {
      path: '/blogs',
      name: 'Blogs',
      icon: <NotebookPen size={20} />,
    },
    {
      path: '/support',
      name: 'Support System',
      icon: <BookOpenCheck size={20} />,
    },
    
    // { path: '/payment', name: 'Payment', icon: <FaDollarSign size={20} /> },
  ];

  const parentNavItems: NavItem[] = [
    { path: '/parentDashboard', name: 'Student Progress', icon: <Home size={20} /> },
    {
      path: '/userChat',
      name: 'Chats',
      icon: <MessageCircleMore size={getIconSize()} />,
    },
    
    // { path: '/payment', name: 'Payment', icon: <FaDollarSign size={20} /> },
  ];
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const getNavItems = (): NavItem[] => {
    if(userType=='admin'){
      if(userRole=='null' || userRole==undefined){
        return adminNavItems;
      }else{
        return adminNavItems.filter((item:any) => userRights.includes(item.right));
      }
    }

    switch (userType) {
        case 'teacher':
            return teacherNavItems;
        case 'parent':
            return parentNavItems;
        case 'student':
            return studentNavItems;
        default:
            return [];
    }
};


  const getLinkClass = (isActive: boolean): string => {
    return `group  relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium duration-300 ease-in-out text-left ${
      isActive
        ? 'text-slate-950 bg-blue-500 dark:bg-zinc-700 text-white  dark:text-white'
        : 'text-zinc-700 dark:text-white dark:hover:bg-slate-900 hover:bg-blue-400 hover:text-white'
    }`;
  };

  const filteredNavItems = adminNavItems.filter((item:any) => userRights.includes(item.right));


  return (
    <aside
      className={`absolute left-0 top-0 z-9999 border-r-8 border-blue-200 border-double flex h-screen ${
        sidebarOpen ? ' md:w-60 lg:w-60 w-48' : 'md:w-24 lg:w-24 w-0'
      } flex-col overflow-y-hidden duration-300 ease-linear dark:bg-boxdark bg-gradient-to-b from-blue-300 to-blue-400 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-850`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between  px-6 pt-5.5 lg:pt-6.5">
        <NavLink to="/">
          {sidebarOpen && <img src={Logo} alt="Logo" />}
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className=" px-2 lg:mt-4 lg:px-4">
          <div>
            <div className="no-scrollbar  flex flex-col overflow-y-auto duration-300 ease-linear">
              <nav className="">
                <div>
                  {getNavItems().map((item) =>
                    item.subItems ? (
                      <SidebarLinkGroup
                        key={item.name}
                        activeCondition={pathname.includes(
                          item.subItems[0].path!,
                        )}
                      >
                        {(handleClick, open) => (
                          <>
                            <button
                              onClick={handleClick}
                              className={getLinkClass(
                                pathname.includes(item.subItems![0].path!),
                              )}
                              title={item.name}
                            >
                              {item.icon}
                              {sidebarOpen && (
                                <span className="ml-2">{item.name}</span>
                              )}
                            </button>
                            {open && (
                              <ul className="list-none mt-2 mb-5.5  flex flex-col gap-2.5 pl-5">
                                {item.subItems!.map((subItem) => (
                                  <li
                                    key={subItem.path}
                                    className="list-none "
                                    title={item.name}
                                  >
                                    <NavLink
                                      to={subItem.path!}
                                      className={({ isActive }) =>
                                        getLinkClass(isActive)
                                      }
                                      title={item.name}
                                    >
                                      {subItem.icon}
                                      {sidebarOpen && (
                                        <span className="ml-2">
                                          {subItem.name}
                                        </span>
                                      )}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </SidebarLinkGroup>
                    ) : (
                      <NavLink
                        key={item.path}
                        to={item.path!}
                        className={({ isActive }) => getLinkClass(isActive)}
                        title={item.name}
                      >
                        {item.icon}
                        {sidebarOpen && (
                          <span className="ml-2">{item.name}</span>
                        )}
                      </NavLink>
                    ),
                  )}
                </div>
              </nav>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
