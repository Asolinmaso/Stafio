import React, { useState, useEffect } from "react";
import { FaTimes, FaRocket } from "react-icons/fa";
import "./NotificationBar.css";

const NotificationBar = () => {
  const [visible, setVisible] = useState(true);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

useEffect(() => {
  const loadLatestAnnouncement = () => {
    const stored = localStorage.getItem("announcements");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) {
        setLatestAnnouncement(parsed[parsed.length - 1]);
        setVisible(true); // show again for new announcement
      }
    }
  };

  // Load initially
  loadLatestAnnouncement();

  // 🔥 Listen for updates
  window.addEventListener("announcementUpdated", loadLatestAnnouncement);

  return () => {
    window.removeEventListener("announcementUpdated", loadLatestAnnouncement);
  };
}, []);


 if (!visible || !latestAnnouncement) return null;

  return (
    <div className="notification">
      <div className="icon">
        <FaRocket size={28} />
      </div>

      <div className="content">
        <div className="notification-container">
          <h4 className="event-name">{latestAnnouncement.eventName}</h4>
          <p className="event-message">{latestAnnouncement.message}</p>
        </div>

        <div className="actions">
          <span className="dismiss" onClick={() => setVisible(false)}>
            Dismiss
          </span>
          <span className="viewAll">View All</span>
        </div>
      </div>

      <div className="close" onClick={() => setVisible(false)}>
        <FaTimes />
      </div>
    </div>
  );
};

export default NotificationBar;
