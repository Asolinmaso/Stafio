import React, { useState, useEffect } from "react";
import { FaTimes, FaRocket } from "react-icons/fa";
import "./NotificationBar.css";

const NotificationBar = () => {
  const [visible, setVisible] = useState(true);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5001/api/broadcast");
        if (res.ok) {
          const parsed = await res.json();
          if (parsed.length > 0) {
            setLatestAnnouncement(parsed[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  if (!visible || !latestAnnouncement) return null;

  return (
    <div className="notification">
      <div className="icon">
        <FaRocket size={28} />
      </div>

      <div className="content">
        <div className="notification-container">
          <h4 className="event-name">{latestAnnouncement.eventName || latestAnnouncement.title}</h4>
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
