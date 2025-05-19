import React from "react";
import styles from "../../styles/components/molecules/toast.module.scss";
import Image from "next/image";

type ToastProps = {
  message: string | string[];
  type: string;
  onClose?: () => void; // Added onClose prop
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <button onClick={onClose} className={styles.closeButton}>
        &times;
      </button>

      {
        Array.isArray(message) ? (
          message.map((item, index) => (
            <div className="d-flex mt-1" key={index}>
              <Image
                src="/assets/svg/close.svg" // This seems to be an error icon, ensure correct path
                alt="close"
                width={15}
                height={20}
                className={styles.dangerIconMargin}
              />
              <p style={{ color: "#455560" }}>{item}</p>
            </div>
          ))
        ) : (
          <div className="d-flex mt-1">
            <Image
              src="/assets/svg/success.svg"
              alt="success"
              width={15}
              height={20}
              className={styles.alertIconMargin}
            />
            <p style={{ color: "#455560" }}>{message}</p>
          </div>
        )
      }
    </div>
  );
};

export default Toast;
