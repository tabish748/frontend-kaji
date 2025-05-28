import React from "react";
import Style from "../../styles/components/atoms/radio-field.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
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
  const userRole = useSelector((state: RootState) => state.auth.userRole?.name);
  const isClient = userRole === "client";

  return (
    <div className={className} style={{ display: hidden ? "none" : "unset" }}>
      {label && (
        <div
          className={
            `${isClient ? Style.clientRadioLabel : Style.adminRadioLabel} d-block`
          }
        >
          {label}
        </div>
      )}
      <div className="d-flex gap-1 " style={{ flexWrap: "wrap" }}>
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
