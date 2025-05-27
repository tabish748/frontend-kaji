import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import styles from "../../styles/components/molecules/custom-select.module.scss";
import { useLanguage } from "@/localization/LocalContext";

interface SelectFieldProps {
  label?: string;
  tag?: any;
  options?: any;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  errorText?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
  hidden?: boolean;
  loading?: boolean;
  validations?: any;
  ref?: any;
  shadowPlaceholder?: string;
  onClear?: () => void;
  icon?: React.ReactNode | string;
}

// Forward ref to allow the parent component to access the DOM node
const CustomSelectField = forwardRef<HTMLLabelElement, SelectFieldProps>(({
  label,
  tag,
  options = [],
  value,
  onChange,
  disabled = false,
  errorText,
  placeholder,
  className = "",
  name,
  id,
  hidden,
  onClear,
  shadowPlaceholder,
  loading = false,
  icon
}, forwardedRef) => {
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const filteredOptions = options?.filter((option: { label: string | string[]; }) =>
    String(option?.label).includes(searchTerm)
  );
  
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Merge wrapperRef with forwardedRef
  useImperativeHandle(forwardedRef, () => wrapperRef.current as any);

  // Render function for icon
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      // Check if the string is a URL (simple check)
      if (icon.match(/\.(jpeg|jpg|gif|png|svg)$/) || icon.startsWith('http') || icon.startsWith('/')) {
        return (
          <span className={styles.iconWrapper}>
            <img src={icon} alt="icon" style={{ width: 20, height: 20 }} />
          </span>
        );
      } else {
        // Handle text icon
        return <span className={styles.iconWrapper}>{icon}</span>;
      }
    }
    return <span className={styles.iconWrapper}>{icon}</span>;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
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

  useEffect(() => {
    if (value && options) {
      const matchedOption = options?.find((option: { value: string | number; }) => option.value == value);
      if (matchedOption) {
        setSelectedLabel(matchedOption.label);
        const matchedIndex = options.findIndex((option: { value: string | number; }) => option.value == value);
        setSelectedOptionIndex(matchedIndex != -1 ? matchedIndex : null);
      } else {
        // setSelectedLabel('');
        // setSelectedOptionIndex(null);
        // if (onChange) {
        //   const event = {
        //     target: { value: "", name: name },
        //   };
        //   onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
        // }
        if (onClear) onClear();
      }
    } else {
      setSelectedLabel(''); 
      setSelectedOptionIndex(null);
    }
  }, [options, value, onChange, onClear]);

  const handleClearValue = (e: React.MouseEvent) => {
    setSelectedLabel('');
    setSelectedOptionIndex(null);
    e.stopPropagation();
    if (onChange) {
      const event = {
        target: { value: "", name: name },
      };
      onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
    }

    if (onClear) {
      onClear();
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus(); // Focus on the input when the dropdown opens
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsOpen(prevIsOpen => !prevIsOpen);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();

      const validIndex = (index: number, direction: 'up' | 'down') => {
        let newIndex = index;
        do {
          newIndex = direction === 'down' ? newIndex + 1 : newIndex - 1;
          if (newIndex < 0) newIndex = filteredOptions.length - 1;
          if (newIndex >= filteredOptions.length) newIndex = 0;
        } while (filteredOptions[newIndex].status === false);
        return newIndex;
      };

      const nextIndex = e.key === 'ArrowDown'
        ? (selectedOptionIndex === null ? 0 : validIndex(selectedOptionIndex, 'down'))
        : (selectedOptionIndex === null ? filteredOptions.length - 1 : validIndex(selectedOptionIndex, 'up'));

      // Only update the highlighted index, don't select the value
      setSelectedOptionIndex(nextIndex);

      // Scroll the active option into view
      const activeOption = document.querySelector(`[data-index="${nextIndex}"]`);
      if (activeOption) {
        activeOption.scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter' && selectedOptionIndex !== null) {
      e.preventDefault();
      // Only select the value when Enter is pressed
      const selectedOption = filteredOptions[selectedOptionIndex]; 
      if (selectedOption && selectedOption.status !== false) {
        setSelectedLabel(selectedOption.label);
        setIsOpen(false);
        if (onChange) {
          const event = {
            target: { value: selectedOption.value, name: name },
          };
          onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
        }
      }
    }
  };

  return (
    <div
      className={`${styles.selectWrapper} ${className}`}
      hidden={hidden}
      ref={wrapperRef}
    >
      {label && <label htmlFor={name}>
        {label && <>{label}</>}
        {renderTags()}
      </label>}
      <div style={{ position: 'relative' }} className={errorText ? styles.hasError : ""}>
        {renderIcon()}
        <div
          className={`${styles.placeholderWrapper} ${selectedLabel ? styles.hasValue : ""
            } ${(errorText && !disabled) ? styles.error : ""}  ${disabled ? styles.disabledSelect : ''}`}
          onMouseDown={handleMouseDown} // Use mousedown to handle opening
          tabIndex={0} 
          onFocus={() => {
            if (!isOpen) {
              setIsOpen(true);
            }
          }}
          onBlur={handleBlur}
          style={icon ? { paddingLeft: 50 } : {}} // Add left padding if icon
        >
          {loading && <div className={styles.spinner}></div>}
          {selectedLabel ? (
            <span>{selectedLabel}</span>
          ) : (
            <span className={styles.placeholder}>
              {shadowPlaceholder || placeholder || t('pleaseSelect')}
            </span>
          )}
          {(selectedLabel && !disabled) && (
            <span className={styles.crossButton} onMouseDown={handleClearValue}>
              ✖
            </span>
          )}
        </div>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('pleaseSearch')}
            ref={inputRef} // Set ref to the input
            onKeyDown={handleKeyDown} // Add keydown event listener
          />
          <div
      // className={selectedOptionIndex === null ? styles.selectedOption : ''}
      data-value={''}
      onClick={(e) => {
        setSelectedLabel('');
        setSelectedOptionIndex(null);
        setIsOpen(false);
        if (onChange) {
          const event = {
            target: { value: "", name: name },
          };
          onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
        }  
      }}
    >
      
    </div>
          {filteredOptions.map((option: any, index: any) => (
            <div
              key={index}
              className={`${index === selectedOptionIndex ? styles.selectedOption : ''} 
              ${option.status === false ? `${styles.disabledOption} ${styles.hiddenOption}` : ''}`}
              data-value={option.value}
              data-index={index} // Add data-index attribute
              onClick={(e) => {
                if (option.status !== false) { // Only proceed if option is enabled
                  const selectedValue = e.currentTarget.getAttribute("data-value");
                  setSelectedLabel(option.label);
                  setSelectedOptionIndex(index);
                  setIsOpen(false);
                  if (onChange && selectedValue) {
                    const event = {
                      target: { value: selectedValue, name: name },
                    };
                    onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
                  }
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {(errorText && !disabled) && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
});
CustomSelectField.displayName = 'CustomSelectField';

export default CustomSelectField;
