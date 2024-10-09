import React, { useEffect } from "react";
import styles from "../Styles/notification.module.css"; // Create a notification CSS file

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{position:'fixed',top:'0',right:'0',height:'fit-content'}}>
      <div className={styles.notification}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
      </div>
    </div>
  );
};

export default Notification;
