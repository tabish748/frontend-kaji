import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/atoms/toggle-button.module.scss';

interface ToggleButtonProps {
  label?: string;
  className?: string;
  options: {
    on: string;
    off: string;
  };
  getSelectedOption: (value: boolean) => void;
  value?: any;
  defaultValue?: boolean;
  hideSelectedText?: boolean;
  disabled?: boolean;

}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, options, getSelectedOption, value, defaultValue, hideSelectedText, disabled, className }) => {
  const isControlled = value !== undefined;
  const [isOn, setIsOn] = useState(value ?? defaultValue ?? false);

  useEffect(() => {
    // If the value prop is provided, use it to set state
    if (isControlled) {
      setIsOn(value);
    }
  }, [value, isControlled]);

  const handleToggle = () => {
    if (disabled) return; // Prevent toggling if disabled
    const newValue = !isOn;
    getSelectedOption(newValue);
    if (!isControlled) {
      setIsOn(newValue);
    }
  };
  return (
    <>
      <div className={styles.toggleWrapper}>
        <span className={`${styles.label} d-block`}>{label}</span>
        <div className={styles.wrapper}>
          <div className={`${styles.toggleButton} mt-1 ${disabled ? styles.disabled : ''}`} onClick={handleToggle}>
            <div className={`${styles.slider} ${isOn ? styles.on : styles.off}`}></div>
          </div>
          <span className='ml-1' style={{ fontSize: '12px', cursor: disabled ? 'not-allowed' : 'pointer' }} hidden={hideSelectedText}>
            {isOn ? options.on : options.off}
          </span>
        </div>
      </div>
    </>
  );
};

export default ToggleButton;
