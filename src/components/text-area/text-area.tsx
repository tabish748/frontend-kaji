import React, { useRef, forwardRef } from "react";
import styles from "../../styles/components/atoms/input.module.scss";

interface TextAreaFieldProps {
  label?: string;
  tag?: string;
  name?: string;
  value?: string | null;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  errorText?: string | null;
  className?: string;
  rows?: number;
  cols?: number;
  id?: string;
  readOnly?: boolean;
  validations?: any;
  ref?: any;
  style?: React.CSSProperties;
}

const TextAreaField: React.FC<TextAreaFieldProps> = forwardRef<HTMLDivElement, TextAreaFieldProps>(
  (
    {
      label,
      tag,
      value,
      onChange,
      disabled = false,
      errorText,
      placeholder,
      className = "",
      name,
      rows,
      cols,
      id,
      readOnly,
      style,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
    };

    // Calculate the wrapper style for full height scenario
    const wrapperStyle = !rows ? {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%'
    } : {};

    // Calculate textarea style
    const textareaStyle = {
      resize: 'none' as const,
      ...(rows 
        ? { minHeight: style?.minHeight || '60px' }
        : { 
            flex: '1',
            minHeight: style?.minHeight || '60px',
            height: 'auto'
          }
      ),
      ...style
    };

    return (
      <div 
        className={styles.inputWrapper} 
        ref={ref}
        style={wrapperStyle}
      >
        {(label || tag) && (
          <label htmlFor={name}>
            {label && <>{label}</>}
            {tag && <span className={styles.tag}>{tag}</span>}
          </label>
        )}
        <textarea
          value={value || ""}
          placeholder={placeholder}
          onChange={handleInput}
          ref={textareaRef}
          name={name}
          disabled={disabled}
          className={`${errorText ? styles.error : ""} ${className}`}
          rows={rows}
          cols={cols}
          readOnly={readOnly}
          id={id}
          style={textareaStyle}
        ></textarea>
        {errorText && <div className={styles.errorText}>{errorText}</div>}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
