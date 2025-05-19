import React, { forwardRef, useEffect } from "react";
import styles from "../../styles/components/atoms/input.module.scss";
interface InputFieldProps {
  label?: string;
  tag?: any;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  errorText?: string | null;
  labelClassName?: string;
  className?: string;
  dataLabel?: string;
  autocomplete?: string;
  id?:string;
  validations?: any;
  onClick?: any;
  ref?: any;
  readOnly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

}
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
 
  label,
  tag,
  type = "text",
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
  readOnly,
  onClick,
  onBlur,
  labelClassName
}, ref) => { 
    
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
    <div className={styles.inputWrapper}>
      <label htmlFor={name} className={labelClassName}>
        {label && <>{label}</>}
        {/* {tag && <span className={styles.tag}>{tag}</span>} */}
        {renderTags()}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        onBlur={onBlur}
        onClick={onClick}
        disabled={disabled}
        ref={ref}
        autoComplete={autocomplete}
        className={`${errorText ? styles.error : ""} ${className}`} // Handle className here
        // data-placeholder= {label}
        readOnly={readOnly}
        id={id}
      />
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
});
InputField.displayName = 'InputField'; // Assign displayName here

export default InputField;
