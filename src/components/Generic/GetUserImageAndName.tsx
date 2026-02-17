import axios from "../../api/axios";
import useOnlineStatus from "./ListOfOnlineUsers";

export const GetUserImageAndName = (props:{imageUrl?:any,firstName:any,lastName?:any,userId:any,userType:any,showType?:boolean}) => {
    const {imageUrl,firstName,lastName,userId,userType,showType } = props;
    const isOnline = useOnlineStatus(userId, userType);
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <img
          src={
            imageUrl
              ? `${axios.defaults.baseURL}/${imageUrl}`
              : '/images/avatar.png'
          }
          alt={firstName}
          className="w-8 h-8 object-cover rounded-3xl"
        />
        <div
        title={isOnline ? 'Online' : 'Offline'}
        className={`${isOnline ? 'bg-green-700' : 'bg-red-700'} h-3 w-3 rounded-full border-2 border-white `}
          style={{ position: 'absolute', bottom: 0, right: 0 }}
        ></div>
      </div>
      <div className="flex flex-col ">
      <p className="subheading">
        {`${firstName} ${lastName}`}
      </p>
      {showType && <p style={{marginTop:'-6px'}} className='text-sm font-medium text-gray-900 dark:text-white '>{userType}</p>}
      </div>
    </div>
  );
};
