import React, { forwardRef } from "react";
import styles from "../../styles/components/atoms/input.module.scss";

interface TextAreaFieldProps {
  label?: string;
  tag?: any;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  errorText?: string | null;
  labelClassName?: string;
  className?: string;
  rows?: number;
  icon?: React.ReactNode;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(({
  label,
  tag,
  value,
  onChange,
  disabled = false,
  errorText,
  placeholder,
  className = "",
  name,
  labelClassName,
  rows = 4,
  icon
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
        return 'tagDefault';
    }
  };

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

  const renderIcon = () => {
    if (!icon) return null;
    return <span className={styles.iconWrapper}>{icon}</span>;
  };

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={name} className={`${label ? "" : "d-none"} ${labelClassName}`}>
        {label && <>{label}</>}
        {renderTags()}
      </label>
      <div style={{ position: 'relative' }} className={errorText ? styles.hasError : ""}>
        {renderIcon()}
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          disabled={disabled}
          ref={ref}
          className={`${errorText ? styles.error : ""} ${className}`}
          rows={rows}
          style={icon ? { paddingLeft: 50 } : {}}
        />
      </div>
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
});

TextAreaField.displayName = 'TextAreaField';

export default TextAreaField; 