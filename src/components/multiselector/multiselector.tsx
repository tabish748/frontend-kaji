// CustomMultiSelectField.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/components/molecules/custom-multiselect.module.scss";
import { useLanguage } from "@/localization/LocalContext";

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectFieldProps {
  label?: string;
  tag?: string;
  options?: Array<Option>;
  values?: Array<string | number>;
  onChange?: (selectedValues: Array<string | number>) => void;
  disabled?: boolean;
  errorText?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
  hidden?: boolean;
  shadowPlaceholder?: string;
}

const CustomMultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  tag,
  options = [],
  values = [],
  onChange,
  disabled = false,
  errorText,
  placeholder,
  className = "",
  name,
  id,
  hidden,
  shadowPlaceholder,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
const isOptionSelected = (optionValue: any) => {
  const optionValueString = String(optionValue);
  // Check if 'values' is an array before using .map()
  const test = Array.isArray(values) && values.map(String).includes(optionValueString);
  return test;
};



const handleOptionClick = (optionValue: string | number) => {
  const optionValueString = String(optionValue);
  let updatedValues = [];

  if (Array.isArray(values)) {
    updatedValues = isOptionSelected(optionValueString)
      ? values.filter((value) => String(value) !== optionValueString)
      : [...values, optionValueString];
  } else {
    // If values is not an array, initialize it as an array with the current optionValue
    updatedValues = [optionValueString];
  }
  
  
  onChange && onChange(updatedValues);
};


  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef?.current &&
      !wrapperRef?.current?.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveSelectedOption = (
    optionValue: string | number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent the dropdown from toggling
    const optionValueString = String(optionValue);
    const updatedValues = values?.map(String)?.filter((value) => value !== optionValueString);
    onChange && onChange(updatedValues?.map((val) => val));
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
    <div
      className={`${styles.multiSelectWrapper} ${className}`}
      hidden={hidden}
      ref={wrapperRef}
      

    >
      {/* {label && (
        <label htmlFor={name} className="d-flex">
          <span className={styles.label}>{label}</span>
          {tag && <span className={styles.tag}>{tag}</span>}
        </label>
      )} */}
        {label && (
        <label htmlFor={name} className="d-flex">
          <span className={styles.label}>{label}</span>
          {renderTags()} 
        </label>
      )}
      <div
        className={`${styles.placeholderWrapper} ${
          values.length > 0 ? styles.hasValue : ""
        } ${errorText ? styles.error : ""} ${
          disabled ? styles.disabledSelect : ""
        }`}
        tabIndex={0} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {values.length > 0 &&
          values.slice(0, 5).map((value, index) => (
            <span key={index} className={styles.selectedOption}>
              {options.find((option) => option.value == value)?.label || ""}
              <span
                className={styles.cross}
                onClick={(e) => handleRemoveSelectedOption(value, e)}
              >
                ✖
              </span>
            </span>
          ))}
        {values.length > 5 && <span className={styles.moreIndicator}>...</span>}
        {values.length === 0 && (
          <span className={styles.placeholder}>
            {/* {placeholder || shadowPlaceholder} */}
          </span>
        )}
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("pleaseSearch")}
          />
          {filteredOptions?.map((option, index) => (
            <div
              className={`${styles.option} ${
                isOptionSelected(option.value) ? styles.active : "not"
              }`}
              key={index}
              onClick={() => handleOptionClick(option.value)}
            >
              <input
                id={`checkbox-${index}`}
                type="checkbox"
                checked={isOptionSelected(option.value)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor={`checkbox-${index}`}
                className={styles.customCheckbox}
              ></label>
              {option.label}
            </div>
          ))}
        </div>
      )}
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
};

export default CustomMultiSelectField;
