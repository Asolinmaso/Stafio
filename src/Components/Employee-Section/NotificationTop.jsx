import React, { useState,useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./NotificationTop.css";

const NotificationBar = () => {
  const [visible, setVisible] = useState(true);
   const [latestAnnouncement, setLatestAnnouncement] = useState(null);

    useEffect(() => {
       // Retrieve announcements from localStorage
       const stored = localStorage.getItem("announcements");
       if (stored) {
         const parsed = JSON.parse(stored);
         if (parsed.length > 0) {
           // Get the last (latest) announcement
           setLatestAnnouncement(parsed[parsed.length - 1]);
           
         }
       }
     }, []);

  if (!visible || !latestAnnouncement) return null;

  return (
    <div className="notification-top">
      <div className="notification-content">
        <div className="notification-space">
         <p className="event-names">{latestAnnouncement.eventName}</p>
         <span>---</span>
         <p className="event-messages">{latestAnnouncement.message}</p>
         </div>
        <div className="close" onClick={() => setVisible(false)}>
          <FaTimes />
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
