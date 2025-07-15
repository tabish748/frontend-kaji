import React, {forwardRef} from 'react';
import styles from '../../styles/components/atoms/select.module.scss';
import inputStyles from '../../styles/components/atoms/input.module.scss';
import Image from 'next/image';

interface SelectFieldProps {
  label?: string;
  tag?: any;
  options?: Array<{ value: string | number; label: string }>;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  errorText?: string;
  placeholder?: string;
  className?: string;
  parentClassName?: string;
  name?: string;
  id?: string;
  hidden?: boolean;
  validations?: any;
  readonly?: any;
  ref?: any;
  labelClassName?: string;
  icon?: React.ReactNode | string;
}

const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(({
  label,
  tag,
  options,
  value,
  onChange,
  disabled = false,
  errorText,
  placeholder,
  className = '',
  parentClassName = '',
  name,
  id,
  hidden,
  readonly,
  labelClassName,
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

  // Render function for tags
  const renderTags = () => {
    if (Array.isArray(tag)) {
      return tag.map((item, index) => (
        <span key={index} className={`${inputStyles.tag} ${inputStyles[getTagClass(item.value)]}`}>
          {item.label}
        </span>
      ));
    } else if (typeof tag === 'string') {
      // Render a simple text tag with a default red color
      return <span className={`${inputStyles.tag} ${inputStyles.tagDefault}`}>{tag}</span>;
    }
    return null; 
  };

  // Render function for icon
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      // Check if the string is a URL (simple check)
      if (icon.match(/\.(jpeg|jpg|gif|png|svg)$/) || icon.startsWith('http') || icon.startsWith('/')) {
        return (
          <span className={styles.iconWrapper}>
            <Image src={icon} alt="icon" width={20} height={20} />
          </span>
        );
      } else {
        // Handle text icon
        return <span className={styles.iconWrapper}>{icon}</span>;
      }
    }
    return <span className={styles.iconWrapper}>{icon}</span>;
  };

  return (
    <div className={`${inputStyles.inputWrapper} ${styles.selectWrapper} ${parentClassName}`} hidden={hidden} ref={ref}>
    {
      label &&   <label htmlFor={name}  className={`${label ? "" : "d-none"} ${labelClassName ? labelClassName : ''}`} >
      {label && <>{label}</>}
      {/* {tag && <span className={styles.tag}>{tag}</span>} */}
      {renderTags()}
    </label>
    }
      <div style={{ position: 'relative' }} className={errorText ? styles.hasError : ""}>
        {renderIcon()}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${errorText ? styles.error : ''} ${className}`}
          name={name}
          id={id}
          style={icon ? { paddingLeft: 50 } : {}}
        >
          {placeholder && (
            <option value="" className={styles.placeholder}>
              {placeholder}
            </option>
          )}
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {errorText && <div className={inputStyles.errorText}>{errorText}</div>}
    </div>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;
