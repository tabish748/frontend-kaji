import React, { forwardRef, useState, useEffect } from "react";
import styles from "../../styles/components/atoms/input.module.scss";
import { parseISO, isBefore, isAfter } from 'date-fns';

// Create a CSS module for custom date range styles
const customStyles = {
  dateRangeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dateRangeSeparator: {
    margin: "0 4px",
    fontWeight: "500",
  }
};

interface InputDateFieldProps {
  label?: string;
  tag?: any;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => void;
  disabled?: boolean;
  errorText?: string | null;
  className?: string;
  dataLabel?: string;
  autocomplete?: string;
  id?: string;
  validations?: any;
  minDate?: string;
  maxDate?: any;
  readOnly?: boolean;
  inputType?: 'date' | 'datetime-local' | 'month';
  isRange?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
  icon?: React.ReactNode | string;
}

const InputDateField = forwardRef<HTMLDivElement, InputDateFieldProps>(({
  label,
  tag,
  value = "",
  onChange,
  disabled = false,
  errorText,
  placeholder,
  className = "",
  name,
  dataLabel,
  autocomplete,
  id,
  minDate,
  maxDate,
  readOnly,
  inputType = 'date',
  isRange = false,
  startPlaceholder = "Start date",
  endPlaceholder = "End date",
  icon
}, ref) => {
  // State for start and end dates when in range mode
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Parse the value if it's a range value (e.g., "2025-04-14 to 2025-04-19")
  useEffect(() => {
    if (isRange && value) {
      const parts = value.split(" to ");
      if (parts.length === 2) {
        setStartDate(parts[0].trim());
        setEndDate(parts[1].trim());
      }
    }
  }, [value, isRange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputDate = e.target.value;
    let parts = inputDate.split('-');

    // Restrict the year part to 4 digits and handle empty parts gracefully
    if (parts.length > 0 && parts[0].length > 4) {
      parts[0] = parts[0].substring(0, 4);
    }

    // Combine parts back into a date string
    const formattedDate = parts.join('-');

    // Parse dates using date-fns if valid date format
    if (formattedDate && formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const dateValue = parseISO(formattedDate);
      const minDateValue = minDate ? parseISO(minDate) : null;
      const maxDateValue = maxDate ? parseISO(maxDate) : null;

      if (minDateValue && isBefore(dateValue, minDateValue)) {
        e.target.value = minDate || '';
      } else if (maxDateValue && isAfter(dateValue, maxDateValue)) {
        e.target.value = maxDate || '';
      } else {
        e.target.value = formattedDate;
      }
    }

    // Call the original onChange handler if provided
    if (onChange) {
      onChange(e);
    }
  };

  // Handle changes for date range
  const handleRangeChange = (isStart: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    let inputDate = e.target.value;
    let newStartDate = isStart ? inputDate : startDate;
    let newEndDate = isStart ? endDate : inputDate;

    // Update the local state
    if (isStart) {
      setStartDate(inputDate);
    } else {
      setEndDate(inputDate);
    }

    // If both dates are set, call the onChange handler with the combined value
    if (newStartDate && newEndDate && onChange && name) {
      onChange({
        target: {
          name: name,
          value: `${newStartDate} to ${newEndDate}`
        }
      });
    }
  };
  
  const getTagClass = (tagValue: string) => {
    switch (tagValue) {
      case 'firstTime':
        return 'tagFirstTime';
      case 'inherit':
        return 'tagInherit';
      case 'required':
        return 'tagRequired';
      default:
        return 'tagDefault';
    }
  };

  // Render function for tags
  const renderTags = () => {
    if (Array.isArray(tag)) {
      return tag.map((item, index) => (
        <span key={index} className={`${styles.tag} ${getTagClass(item.value)}`}>
          {item.label}
        </span>
      ));
    } else if (typeof tag === 'string') {
      return <span className={`${styles.tag} ${styles.tagDefault}`}>{tag}</span>;
    }
    return null; 
  };

  // Render function for icon (copied/adapted from InputField)
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      if (icon.match(/\.(jpeg|jpg|gif|png|svg)$/) || icon.startsWith('http') || icon.startsWith('/')) {
        return (
          <span className={styles.iconWrapper}>
            <img src={icon} alt="icon" style={{ width: 20, height: 20 }} />
          </span>
        );
      } else {
        return <span className={styles.iconWrapper}>{icon}</span>;
      }
    }
    return <span className={styles.iconWrapper}>{icon}</span>;
  };

  return (
    <div className={styles.inputWrapper} ref={ref}>
      <label htmlFor={name}>
        {label && <>{label}</>}
        {renderTags()}
      </label>
      
      {isRange ? (
        <div style={customStyles.dateRangeContainer}>
          <div style={{ position: 'relative', width: '100%' }}>
            {renderIcon()}
            <input
              type={inputType}
              value={startDate}
              placeholder={startPlaceholder}
              onChange={(e) => handleRangeChange(true, e)}
              name={`${name}-start`}
              disabled={disabled}
              autoComplete={autocomplete}
              className={`${errorText ? styles.error : ""} ${className}`}
              id={`${id}-start`}
              min={minDate}
              max={endDate || ((maxDate && maxDate !== false) ? maxDate : undefined)}
              readOnly={readOnly}
              style={icon ? { paddingLeft: 50 } : {}}
            />
          </div>
          <span style={customStyles.dateRangeSeparator}>to</span>
          <div style={{ position: 'relative', width: '100%' }}>
            {renderIcon()}
            <input
              type={inputType}
              value={endDate}
              placeholder={endPlaceholder}
              onChange={(e) => handleRangeChange(false, e)}
              name={`${name}-end`}
              disabled={disabled}
              autoComplete={autocomplete}
              className={`${errorText ? styles.error : ""} ${className}`}
              id={`${id}-end`}
              min={startDate || minDate}
              max={(maxDate && maxDate !== false) ? maxDate : ((maxDate === false) ? '' : undefined)}
              readOnly={readOnly}
              style={icon ? { paddingLeft: 50 } : {}}
            />
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {renderIcon()}
          <input
            type={inputType}
            value={value || ""}
            placeholder={placeholder}
            onChange={handleInputChange}
            name={name}
            disabled={disabled}
            autoComplete={autocomplete}
            className={`${errorText ? styles.error : ""} ${className}`}
            id={id}
            min={minDate}
            max={(maxDate && maxDate !== false) ? maxDate : ((maxDate === false) ? '' : new Date().toISOString().split('T')[0])}
            readOnly={readOnly}
            style={icon ? { paddingLeft: 50 } : {}}
          />
        </div>
      )}
      
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
});

InputDateField.displayName = 'InputDateField';
export default InputDateField;