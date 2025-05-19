import React, {forwardRef} from 'react';
import styles from '../../styles/components/atoms/select.module.scss';

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
}

const SelectField: React.FC<SelectFieldProps> = forwardRef<HTMLDivElement, SelectFieldProps>(({
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
        return 'tagDefault';
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
    <div className={`${styles.selectWrapper} ${parentClassName}`} hidden={hidden} ref={ref}>
    {
      label &&   <label htmlFor={name}  className={`${labelClassName ? labelClassName : ''}`} >
      {label && <>{label}</>}
      {/* {tag && <span className={styles.tag}>{tag}</span>} */}
      {renderTags()}
    </label>
    }
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${errorText ? styles.error : ''} ${className}`}
        name={name}
        id={id}
        
      >
        {placeholder && (
          <option value="">
          </option>
        )}
        {options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;
