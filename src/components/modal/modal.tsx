import React from 'react';
import { useLanguage } from '@/localization/LocalContext';
import Button from '@/components/button/button';
import styles from '@/styles/components/molecules/modal.module.scss';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  showEditButton?: boolean;
  onEditClick?: () => void;
  type?: 'success' | 'fail';
  editText?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  showEditButton = false,
  onEditClick,
  type = 'success',
  editText,
  children
}) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Show children when modal is not visible */}
      <div style={{ display: isVisible ? 'none' : 'block' }}>
        {children}
      </div>
      
      {/* Show modal when isVisible is true */}
      {isVisible && (
        <div className={styles.overlay} onClick={onClose}>
          <div 
            className={`${styles.modal} ${styles[type]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>
                {title || t('cnInfo.modal.submittedSuccessfully')}
              </h2>
            </div>
            
            <div className={styles.content}>
              <div className={styles.message}>
                {message || t('cnInfo.modal.thankYouForSubmission')}
              </div>
              
              {editText && (
                <div className={styles.editSection}>
                  <button 
                    className={styles.editButton}
                    onClick={onEditClick || onClose}
                  >
                    {editText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal; 