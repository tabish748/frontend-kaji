import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/atoms/radio-button-group.module.scss';
import { useRef } from 'react';

interface RadioButtonGroupProps {
  label: string;
  options: { value: string | number; label: string }[];
  getSelectedOption?: (value: string) => void;
  defaultOption?: string; 
  className?:string;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ label, options, getSelectedOption, defaultOption }) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultOption || '');
  const defaultApplied = useRef(false); // Flag to check if default has been applied

  useEffect(() => {
    if (defaultOption && getSelectedOption && !defaultApplied.current) {
      
      getSelectedOption(defaultOption);
      defaultApplied.current = true; // Mark that default has been applied
    }
  }, [defaultOption, getSelectedOption]);

  const handleOptionClick = (value: string | number) => {
    setSelectedOption(value.toString());
    if (getSelectedOption) {
      
        getSelectedOption(value.toString());
    }
};


  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{label}</div>
      <div className={styles.optionWrapper}>
        {options.map((option, index) => (
          <div key={index} className={styles.option}>
            <span
              onClick={() => handleOptionClick(option.value)}
              className={selectedOption === option.value.toString() ? styles.selected : styles.unselected}
            >
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
