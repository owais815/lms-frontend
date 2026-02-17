import { useEffect, useState } from "react";
import AnnouncementCard from "./Card";
import { getAllAnnouncements } from "../../../api/auth";
import Announcement from 'react-announcement'


export const ViewAnnouncement = () => {
    const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch announcements from the backend
    fetchAnnouncments();
  }, []);

  const fetchAnnouncments = async() =>{
    try{
        const response = await getAllAnnouncements();
        setAnnouncements(response.data.announcements);

    }catch(error){
        console.error('Error fetching announcements:', error);
    }
  }
  
    return (
        <div className="container mx-auto p-4">
    
      
        <h1 className="text-2xl font-bold text-center mb-6">Announcements</h1>
        <AnnouncementCard announcements={announcements} onDelete={fetchAnnouncments} />
      </div>
    );
}