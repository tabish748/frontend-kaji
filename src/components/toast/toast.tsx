import React, { useEffect, useState } from "react";
import styles from "../../styles/components/molecules/toast.module.scss";
import Image from "next/image";

type ToastProps = {
  message: string | string[];
  type: string;
  onClose?: () => void;
  duration?: number;
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset and show toast whenever message changes
    setIsVisible(false);
    
    // Small delay to ensure clean re-render
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-hide timer
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration + 100); // Add 100ms to account for the show delay

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {Array.isArray(message) ? (
        message.map((item, index) => (
          <div className="d-flex mt-1" key={index}>
            <Image
              src={type === "success" ? "/assets/svg/success.svg" : "/assets/svg/close.svg"}
              alt={type === "success" ? "success" : "error"}
              width={15}
              height={20}
              className={type === "success" ? styles.alertIconMargin : styles.dangerIconMargin}
            />
            <p style={{ color: "#455560" }}>{item}</p>
          </div>
        ))
      ) : (
        <div className="d-flex mt-1">
          <Image
            src={type === "success" ? "/assets/svg/success.svg" : "/assets/svg/close.svg"}
            alt={type === "success" ? "success" : "error"}
            width={15}
            height={20}
            className={type === "success" ? styles.alertIconMargin : styles.dangerIconMargin}
          />
          <p style={{ color: "#455560" }}>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Toast;
