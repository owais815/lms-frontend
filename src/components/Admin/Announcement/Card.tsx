import React from 'react';
import { formatDate } from '../../Generic/FormatDate';
import { FaTrash } from 'react-icons/fa';
import { deleteannouncement } from '../../../api/auth';
import { ConfirmationDialog } from '../../Generic/ConfirmationDialog';
import { toast, ToastContainer } from 'react-toastify';

const AnnouncementCard = ({ announcements,onDelete }:any) => {
    const [show, setShow] = React.useState(false);
    const [id,setId] = React.useState('');
    const handleDelete = async() => {
        const response = await deleteannouncement(id);
        if(response){
            onDelete();
            toast.success("Announcement deleted successfully");
            setShow(false);
        }
    }
  return (
    <>
    <ToastContainer  />
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {announcements.length > 0 ? (
        announcements.map((announcement:any) => (
          <div
            key={announcement.id}
            className="w-full max-w-sm bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {announcement.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{announcement.message}</p>
            <div className="text-gray-500 text-xs mb-2">
              <span className="font-semibold">Scheduled Time:</span>{' '}
              {/* {new Date(announcement.scheduledTime).toLocaleString()} */}
              {formatDate(announcement.scheduledTime)}
            </div>
            <div className="text-gray-500 text-xs mb-2">
              <span className="font-semibold">Expires On:</span>{' '}
              {/* {new Date(announcement.scheduledTime).toLocaleString()} */}
             <span className='bg-red-900 text-white p-1 rounded-2xl'> {formatDate(announcement.expirationDate)} </span>
            </div>
            <div className=" mb-2 flex justify-end">
              <button onClick={()=>{setId(announcement.id);setShow(true)}} className='text-red-500 hover:text-red-700 '><FaTrash size={20}/></button>
            </div>
            
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No announcements available</p>
      )}
{show && 
      <ConfirmationDialog 
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement?"
        handleConfirm={handleDelete}
        closeDialog={() => {setShow(false)}}
        confirmText="Delete"
      />
    }
    </div>
    </>
  );
};

export default AnnouncementCard;
