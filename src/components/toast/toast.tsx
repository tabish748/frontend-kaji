import React, { useEffect, useState } from "react";
import styles from "../../styles/components/molecules/toast.module.scss";
import Image from "next/image";

type ToastProps = {
  message: string | string[];
  type: string;
  onClose?: () => void;
  duration?: number; // Optional duration in milliseconds
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 30000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // If no onClose provided, auto-close after duration
    if (!onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {onClose && (
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
      )}

      {
        Array.isArray(message) ? (
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
        )
      }
    </div>
  );
};

export default Toast;
