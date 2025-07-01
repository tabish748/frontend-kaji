import React from "react";
import Style from "../../styles/components/atoms/radio-field.module.scss";
import inputStyles from "../../styles/components/atoms/input.module.scss";
import { useRouter } from "next/router";
import { CUSTOMER_ROUTES } from "@/libs/constants";

interface RadioOption {
  label: string;
  value: string | number;
}

export interface RadioFieldProps {
  label?: string; // label for the entire group
  options: RadioOption[]; // array of options
  name: string; // name attribute for radio inputs
  selectedValue: string | number; // currently selected value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // callback function for change events
  className?: string; // additional class names
  disabled?: boolean; // disable the radio group
  hidden?: boolean; // hidden the radio group
  errorText?: string | null; // Add error text prop for validation
  validations?: any; // Add validations prop for form validation
  tag?: any; // Add tag prop for visual indicators like "required"
}

const RadioField = React.forwardRef<HTMLDivElement, RadioFieldProps>(({
  label,
  options,
  name,
  selectedValue,
  onChange,
  className = "",
  disabled = false,
  hidden = false,
  errorText,
  validations,
  tag,
}, ref) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const isClient = CUSTOMER_ROUTES.includes(currentPath);

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

  const renderTags = () => {
    if (Array.isArray(tag)) {
      return tag.map((item, index) => (
        <span key={index} className={`${inputStyles.tag} ${inputStyles[getTagClass(item.value)]}`}>
          {item.label}
        </span>
      ));
    } else if (typeof tag === 'string') {
      return <span className={`${inputStyles.tag} ${inputStyles.tagDefault}`}>{tag}</span>;
    }
    return null;
  };

  return (
    <div ref={ref} className={`${inputStyles.inputWrapper} ${className}`} style={{ display: hidden ? "none" : "unset" }}>
      {label && (
        <label className={`${label ? "" : "d-none"}`}>
          {label}
          {renderTags()}
        </label>
      )}
      <div 
        className={`${Style.responsiveFlex}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '8px 0'
        }}
      >
        {options.map((option, index) => (
          <div key={index}>
            <label
              htmlFor={`${name}_${option.value}`}
              className={
                isClient ? Style.clientRadioLabel : Style.adminRadioLabel
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#455560'
              }}
            >
              <input
                type="radio"
                id={`${name}_${option.value}`}
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={onChange}
                disabled={disabled}
                style={{
                  marginRight: '0'
                }}
              />
              <span></span>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {errorText && <div className={inputStyles.errorText}>{errorText}</div>}
    </div>
  );
});

RadioField.displayName = 'RadioField';

export default RadioField;
