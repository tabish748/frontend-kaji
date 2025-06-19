import React from "react";
import styles from "../../styles/components/atoms/input.module.scss";

export interface CheckboxFieldProps {
  label?: string;
  name: string;
  options?: Array<{ value: string | number; label: string }>;
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
  disabled?: boolean; // New prop for disabled state
  errorText?: any; // New prop for error text
  validation?: any;
  tag?: any;
  validations?: any; // <-- Add this line for validations
}

const CheckboxField = React.forwardRef<HTMLDivElement, CheckboxFieldProps>(({
  label,
  name,
  options,
  selectedValues = [], // Add default empty array
  onChange,
  className,
  disabled = false,
  errorText,
  tag,
  validations,
}, ref) => {
  const renderTags = () => {
    if (Array.isArray(tag)) {
      return tag.map((item, index) => (
        <span
          key={index}
          className={`${styles.tag} ${getTagClass(item.value)}`}
        >
          {item.label}
        </span>
      ));
    } else if (typeof tag === "string") {
      // Render a simple text tag with a default red color
      return (
        <span className={`${styles.tag} ${styles.tagDefault}`}>{tag}</span>
      );
    }
    return null;
  };

  const getTagClass = (tagValue: string) => {
    switch (tagValue) {
      case "firstTime":
        return "tagFirstTime";
      case "inherit":
        return "tagInherit";
      case "required":
        return "tagRequired";
      default:
        return "tagDefault"; // Default class for simple text tags
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newSelectedValues = e.target.checked
      ? [...selectedValues, newValue]
      : selectedValues.filter((value) => value !== newValue);
    
    onChange(newSelectedValues);
  };

  return (
    <div
      ref={ref}
      className={`${styles.inputWrapper} ${className || ""} ${
        errorText ? styles.hasError : ""
      }`}
      data-testid={`checkbox-field-${name}`}
    >
      <label className={`${label ? '': "d-none"} `}>
        {label}
        {renderTags()}
      </label>

      <div className={styles.responsiveFlex}>
        {options?.map((option) => (
          <div key={option.value} className={styles.checkboxOption}>
            <input
              type="checkbox"
              id={`${name}_${option.value}`}
              name={name}
              value={option.value}
              checked={selectedValues.includes(String(option?.value))}
              onChange={handleCheckboxChange}
              disabled={disabled}
              className={errorText ? styles.error : ""}
              aria-invalid={!!errorText}
            />
            <label htmlFor={`${name}_${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>
      {errorText && <div className={styles.errorText} role="alert">{errorText}</div>}
    </div>
  );
});

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
