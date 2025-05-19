import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/features/auth/authSlice'; // Adjust the path to your logout action
import styles from '../../styles/components/organisms/session-modal.module.scss';
import { useRouter } from 'next/router';

interface SessionModalProps {
  onClose: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCountdown(1800);  
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          dispatch(logout());
          localStorage.removeItem('token');
          router.push('/login');
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [dispatch, router]);

  const staySignedIn = () => {
    onClose();
    setCountdown(0);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${seconds}秒`;
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h4>セッションタイムアウト</h4> <br />
        <h5>
        長時間操作が行われていないため、{formatTime(countdown)}後に自動的にログアウトされます。
        </h5>
        <br />
        <button onClick={staySignedIn} className={styles.button}>
        操作を続ける
        </button>
      </div>
    </div>
  );
};

export default SessionModal;
