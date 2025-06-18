import React from "react";
import Style from "../../styles/components/atoms/radio-field.module.scss";
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
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  options,
  name,
  selectedValue,
  onChange,
  className = "",
  disabled = false,
  hidden = false,
}) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const isClient = CUSTOMER_ROUTES.includes(currentPath);

  return (
    <div className={className} style={{ display: hidden ? "none" : "unset" }}>
      {label && (
        <div
          className={`${
            isClient ? Style.clientRadioLabel : Style.adminRadioLabel
          } d-block`}
        >
          {label}
        </div>
      )}
      <div 
        className={`${Style.dynamicRadioGrid} ${Style.responsiveFlex}`}
      >
        {options.map((option, index) => (
          <div key={index}>
            <label
              htmlFor={`${name}_${option.value}`}
              className={
                isClient ? Style.clientRadioLabel : Style.adminRadioLabel
              }
            >
              <input
                type="radio"
                id={`${name}_${option.value}`}
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={onChange}
                disabled={disabled}
              />
              <span></span>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioField;
