import React, { useEffect, useRef } from 'react';
import Style from '../../styles/components/molecules/confirmation-box.module.scss';
import { useLanguage } from "../../localization/LocalContext";

interface Props {
  isOpen: boolean;
  title: string;
  secondText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string; // Optional prop for custom confirm button text
  cancelButtonText?: string; // Optional prop for custom cancel button text
  className?: string; // Optional prop for custom className

}

const ConfirmationBox: React.FC<Props> = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  confirmButtonText, // Use the new props
  cancelButtonText,
  secondText,
  className,

}) => {
  const { t } = useLanguage();

  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Enter') {
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onConfirm]);


  if (!isOpen) return null;

  // Use the provided text or fallback to the default text from context
  const confirmText = confirmButtonText || t('deleteTxt');
  const cancelText = cancelButtonText || t('cancel');
  const secondLineText = secondText || t('この操作は元に戻せません。');

  return (
    <div className={Style.overlay}>
      <div className={`${Style.box} ${className || ''}`}>
        <div className={Style.title}>{title} <br /> {secondLineText}</div>
        <div className={Style.buttons}>
          <button className={Style.cancelBtn} onClick={onCancel}>{cancelText}</button>
          <button ref={confirmButtonRef}
            className={Style.confirmBtn} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;
