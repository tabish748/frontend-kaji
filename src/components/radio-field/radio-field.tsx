import React from 'react';
import Style from '../../styles/components/atoms/radio-field.module.scss'
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
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  options,
  name,
  selectedValue,
  onChange,
  className = '',
  disabled = false,
  hidden=false,
}) => {

  return (
    <div className={className} style={{display: hidden ? 'none' : 'unset'}}>
      {label && <div className={`${Style.radioLabel} d-block`}>{label}</div>}
      <div className='d-flex gap-1 mt-1'>
        {options.map((option, index) => (
          <div key={index}>
            <label htmlFor={`${name}_${option.value}`} className={Style.radioLabel}>
              <input
                type="radio"
                id={`${name}_${option.value}`}
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={onChange}
                disabled={disabled}
                className='mr-1'
              />
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioField;
