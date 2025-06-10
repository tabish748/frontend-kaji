import React from "react";
import Style from "../../styles/components/atoms/radio-field.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
interface RadioOption {
  label: string;
  value: string | number;
}

type GridColumnCount = 1 | 2 | 3 | 4 | 5 | 6;

export interface RadioFieldProps {
  label?: string; // label for the entire group
  options: RadioOption[]; // array of options
  name: string; // name attribute for radio inputs
  selectedValue: string | number; // currently selected value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // callback function for change events
  className?: string; // additional class names
  disabled?: boolean; // disable the radio group
  hidden?: boolean; // hidden the radio group
  columnsLg?: GridColumnCount; // number of columns for large screens
  columnsMd?: GridColumnCount; // number of columns for medium screens
  columnsSm?: GridColumnCount; // number of columns for small screens
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
  columnsLg = 4, // default to 2 columns for large screens
  columnsMd = 2, // default to 2 columns for medium screens
  columnsSm = 1, // default to 2 columns for small screens
}) => {
  const userRole = JSON.parse(localStorage.getItem("loggedInUser")!).userRole;
  const isClient = userRole === "client";

  const responsiveClass =
    Style[`responsiveCols_${columnsLg}_${columnsMd}_${columnsSm}`];

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
      <div className={`${Style.radioGrid} ${responsiveClass}`}>
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
