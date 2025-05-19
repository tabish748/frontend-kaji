import React, { useRef,forwardRef } from "react";
import styles from "../../styles/components/atoms/input.module.scss";
import { parseISO, isBefore, isAfter } from 'date-fns';

interface InputDateFieldProps {
  label?: string;
  tag?: any;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  errorText?: string | null;
  className?: string;
  dataLabel?: string;
  autocomplete?: string;
  id?: string;
  validations?: any;
  ref?: any;
  minDate?: string;
  maxDate?: any;
  readOnly?:boolean;
  inputType?: 'date' | 'datetime-local' | 'month'; // New prop

}

const InputDateField: React.FC<InputDateFieldProps> =forwardRef<HTMLDivElement, InputDateFieldProps>(({
  label,
  tag,
  value,
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
  inputType = 'date', // Default to 'date'

}, ref) => {
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let inputDate = e.target.value;
  //   let parts = inputDate.split('-');

  //   // Restrict the year part to 4 digits and handle empty parts gracefully
  //   if (parts.length > 0 && parts[0].length > 4) {
  //     parts[0] = parts[0].substring(0, 4);
  //   }

  //   // Update the value in the input field
  //   e.target.value = parts.join('-');

  //   // Call the original onChange handler if provided
  //   if (onChange) {
  //     onChange(e);
  //   }
  // };


  const handleInputChange = (e: any) => {
    let inputDate = e.target.value;
    let parts = inputDate.split('-');

    // Restrict the year part to 4 digits and handle empty parts gracefully
    if (parts.length > 0 && parts[0].length > 4) {
      parts[0] = parts[0].substring(0, 4);
    }

    // Combine parts back into a date string
    const formattedDate = parts.join('-');

    // Parse dates using date-fns
    const dateValue = parseISO(formattedDate);
    const minDateValue = minDate ? parseISO(minDate) : null;
    const maxDateValue = maxDate ? parseISO(maxDate) : null;

    if (minDateValue && isBefore(dateValue, minDateValue)) {
      e.target.value = minDate;
    } else if (maxDateValue && isAfter(dateValue, maxDateValue)) {
      e.target.value = maxDate;
    } else {
      e.target.value = formattedDate;
    }

    // Call the original onChange handler if provided
    if (onChange) {
      onChange(e);
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
        return 'tagDefault'; // Default class for simple text tags
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
      // Render a simple text tag with a default red color
      return <span className={`${styles.tag} ${styles.tagDefault}`}>{tag}</span>;
    }
    return null; 
  };

  return (
    <div className={styles.inputWrapper} ref={ref}>
      <label htmlFor={name}>
        {label && <>{label}</>}
        {/* {tag && <span className={styles.tag}>{tag}</span>} */}
        {/* {tag && <span className={`${styles.tag} ${getTagClass(tag)}`}>{tag}</span>} */}
        {renderTags()}

      </label>
      <input
        type={inputType}
        value={value || ""}
        placeholder={placeholder}
        onChange={handleInputChange}  // Update here
        name={name}
        disabled={disabled}
        autoComplete={autocomplete}
        className={`${errorText ? styles.error : ""} ${className}`}
        id={id}
        min={minDate}
        max={(maxDate && maxDate != false) ? maxDate : ((maxDate == false) ? '' : new Date().toISOString().split('T')[0]) }
        readOnly={readOnly}
      />
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
});
InputDateField.displayName = 'InputDateField';
export default InputDateField;
