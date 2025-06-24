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

    // Add useEffect to calculate initial height only if rows is not provided
    React.useEffect(() => {
      if (textareaRef.current && !rows) {
        adjustTextareaHeight();
      }
    }, [value, rows]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Only use auto-height if rows prop is not provided
      if (!rows) {
        adjustTextareaHeight();
      }
      onChange?.(e);
    };

    // Extract height calculation logic into a separate function
    const adjustTextareaHeight = () => {
      if (textareaRef.current && !rows) {
        // Use a hidden div to calculate height without causing reflow
        const hiddenDiv = document.createElement('div');
        const styles = window.getComputedStyle(textareaRef.current);
        
        // Copy textarea styles to hidden div
        hiddenDiv.style.width = styles.width;
        hiddenDiv.style.padding = styles.padding;
        hiddenDiv.style.border = styles.border;
        hiddenDiv.style.lineHeight = styles.lineHeight;
        hiddenDiv.style.fontSize = styles.fontSize;
        hiddenDiv.style.fontFamily = styles.fontFamily;
        
        // Replace new lines with <br> and spaces with &nbsp;
        hiddenDiv.innerHTML = value?.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;') || '';
        
        // Hide the div and append to body temporarily
        hiddenDiv.style.position = 'absolute';
        hiddenDiv.style.visibility = 'hidden';
        document.body.appendChild(hiddenDiv);
        
        // Use the hidden div height without enforcing a minimum pixel value
        const newHeight = hiddenDiv.offsetHeight + 2;
        
        // Remove the hidden div
        document.body.removeChild(hiddenDiv);
        
        // Set the new height
        textareaRef.current.style.height = `${newHeight}px`;
      }
    };

    return (
      <div className={styles.inputWrapper} ref={ref}>
        <label htmlFor={name}>
          {label && <>{label}</>}
          {tag && <span className={styles.tag}>{tag}</span>}
        </label>
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
          style={{ 
            resize: 'none',
            minHeight: style?.minHeight || '60px',
            ...(rows ? {} : { height: 'auto' })
          }}
        ></textarea>
        {errorText && <div className={styles.errorText}>{errorText}</div>}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
