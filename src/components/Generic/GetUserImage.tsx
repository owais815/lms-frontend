import axios from "../../api/axios";
import useOnlineStatus from "./ListOfOnlineUsers";

export const GetUserImage = (props:{imageUrl?:any,userId:any,userType:any,classes?:any}) => {
    const {imageUrl,userId,userType,classes } = props;
    const isOnline = useOnlineStatus(userId, userType);
  return (
   
      <div className={`relative ${classes ? classes:'w-8 h-8'}`}>
        <img
          src={
            imageUrl
              ? `${axios.defaults.baseURL}/${imageUrl}`
              : '/images/avatar.png'
          }
          // alt={"test"}
          className={`object-cover rounded-3xl ${classes ? classes:'w-8 h-8'}`}
        />
        <div
        title={isOnline ? 'Online' : 'Offline'}
        className={`${isOnline ? 'bg-green-700' : 'bg-red-700'} h-4 w-4 rounded-full border-2 border-white `}
          style={{ position: 'absolute', bottom: 0, right: 0 }}
        ></div>
      </div>
  );
};
