import React from "react";
import InputField from "../input-field/input-field";
import SelectField from "../select-field/select-field";
import CheckboxField, {
  CheckboxFieldProps,
} from "../checkbox-field/checkbox-field";
import RadioField, { RadioFieldProps } from "../radio-field/radio-field";
import Button from "../button/button";
import { useLanguage } from "../../localization/LocalContext";
import { Validators } from "./validators";
import RadioButtonGroup from "../radio-button-group/radio-button-group";
import { useEffect } from 'react';
import CustomSelectField from "../custom-select/custom-select";
import InputDateField from "../input-date/input-date";
import CustomMultiSelectField from "../multiselector/multiselector";
export type FieldType =
  | "input"
  | "select"
  | "checkbox"
  | "radio"
  | "radio-group"
  | "password"
  | "customSelect"
  | "date"
  | "multi-select";

type OptionType = { value: string | number; label: string };

type ValidationInput = {
  value: string;
};

type Params = string | number;

interface FieldProps {
  type: FieldType;
  label?: string;
  name?: string;
  value?: string;
  options?: OptionType[];
  colSpan?: number;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.ChangeEvent<any>) => void;
  onClear?: () => void;
  className?: string;
  selectedValue?: string;
  validation?: any;
  getSelectedOption?: (value: string) => void;
  defaultOption?: string;
  selectedValues?: string[];
  disabled?: boolean;
  isHideSubmission?: boolean;
  placeholder?: string;
  tag?: string;
  dataLabel?: string;
  autocomplete?: string;
  checkboxErrorReq?: string;
  id?: string;
  order?: any;
}

interface GenericFormProps {
  fields?: FieldProps[];
  onSubmit: () => void;
  isHideSubmission?: boolean;
  parentClassName?: string;
  isLoading?: boolean;
  buttonClassName?: string;
  reverseSubmitBtn?: boolean;
  showResetButton?: boolean;
  disabledSubmitBtn?: boolean;
  ResetBtnClassName?: string;
  onReset?: () => void;
  submitButtonLabel?: string;
  children?: React.ReactNode;
  showResetLabel?: string;
  checkboxErrorReq?: any;
  setCheckboxErrorMsg?: any;
  onChangeCheckBox?: any;
  tag?: string;
}

const validateField = (field: FieldProps) => {
  let error: string | null = null;
  if (field.validation) {
    for (const validationType of field.validation) {
      const [type, param] = validationType.split(":");
      const validationFunction = Validators[type];
      if (validationFunction) {
        error = validationFunction(
          { value: field.value || "" },
          type === "required" ? field.label : (param as Params)
        );
        if (error) {
          break;
        }
      }
    }
  }
  return error;
};


const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  parentClassName,
  isLoading,
  buttonClassName,
  showResetButton, // Destructure this
  onReset, // Destructure this
  submitButtonLabel,
  children,
  ResetBtnClassName,
  showResetLabel,
  disabledSubmitBtn,
  checkboxErrorReq,
  setCheckboxErrorMsg,
  onChangeCheckBox,
  reverseSubmitBtn ,
  isHideSubmission 
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [initialLoad, setInitialLoad] = React.useState<any>(true);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: FieldProps
  ) => {
    const { name, value } = e.target;
    if (field.onChange) {
      field.onChange(e);
    }
    const error = validateField({ ...field, value });
    
    if (name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };



  const handleMultiSelectChange = (selectedValues: any, field: FieldProps) => {

    if (field.onChange) {
      field.onChange(selectedValues);
    }
    const error = validateField({ ...field, value: selectedValues.join(',') }); // Assuming your validation logic can handle this
    if (field.name) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field.name as any]: error,
      }));
    }
  };
  useEffect(() => {
    if (!initialLoad && onChangeCheckBox !== undefined) {
      if (checkboxErrorReq?.length === 0) {
        setCheckboxErrorMsg('部署は必須項目です。');
      } else {
        setCheckboxErrorMsg('');
      }
    }
  }, [onChangeCheckBox, initialLoad]);
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors: Record<string, string> = {};
    setInitialLoad(false)
    if(checkboxErrorReq)
      {
        if (checkboxErrorReq?.length == 0) {
          setCheckboxErrorMsg('部署は必須項目です。')
        }
        else {
          setCheckboxErrorMsg('')
        }
      }
    

    fields?.forEach((field) => {
      
      if (field.validation) {
        field?.validation?.forEach((validationType: { split: (arg0: string) => [any, any]; }) => {
          const [type, param] = validationType.split(":");
          const validationFunction =
            Validators[type as keyof typeof Validators];
          if (validationFunction) {
            const error = validationFunction(
              { value: field.value as string },
              type === "required" ? field.label : (param as Params)
            );
            if (error) {
              newErrors[field.name || ""] = error; 
            }
          }
        });
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    } else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const handleRadioButtonChange = (value: string, field: FieldProps) => {
    const error = validateField({ ...field, value });
    if (field.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field.name!]: error,
      }));
    }
  };

    useEffect(() => {
      let newErrors = { ...errors };

      fields && fields.forEach((field) => {
          if(field.validation)
          {
            if(field.validation.includes('required'))
            if (field.value && newErrors[field.name || ""]) {
              delete newErrors[field.name || ""]; // clears the error for the field if the field has a value
          }
          }
      });

      setErrors(newErrors);
  }, [fields]);
  
  const sortedFields = fields?.sort((a, b) => a?.order - b?.order);
  return (
    <form onSubmit={handleSubmit}>
      <div className={parentClassName}>
        {sortedFields?.map((field, index) => (
          <div
            key={index}
            style={{ flex: field.colSpan || 1 }}
            className={field.className}
          >
            {(field.type === "input" || field.type === "password") && (
              <InputField
                {...field}
                errorText={errors[field.name || ""] || undefined}
                onChange={(e) => handleInputChange(e, field)}
              />
            )}
            {(field.type === "date") && (
              <InputDateField
                {...field}
                errorText={errors[field.name || ""] || undefined}
                onChange={(e) => handleInputChange(e, field)}
              />
            )}
            {field.type === "customSelect" && (
              <CustomSelectField
                {...field}
                errorText={errors[field.name || ""] || undefined}
                onChange={(e) => handleInputChange(e, field)}
              />
            )}

            {field.type === "select" && (
              <SelectField
                {...field}
                errorText={errors[field.name || ""] || undefined}
                onChange={(e) => handleInputChange(e, field)}
              />
            )}

            {field.type === "multi-select" && (
              <CustomMultiSelectField
                {...field}
                onChange={(selectedValues) => handleMultiSelectChange(selectedValues, field)}

              // errorText={errors[field.name || ""] || undefined}
              />
            )}

            {field.type === "radio" && (
              <RadioField {...(field as FieldProps & RadioFieldProps)} />
            )}
            {field.type === "radio-group" && (
              <RadioButtonGroup
                label={field.label || ""}
                options={field.options || []}
                getSelectedOption={(value) => {
                  if (field.getSelectedOption) {
                    field.getSelectedOption(value);
                  }
                  handleRadioButtonChange(value, field);
                }}
                defaultOption={field.defaultOption}
              />
            )}
          </div>
        ))}
        {children}
      </div>
      {
        !isHideSubmission  && 
          <div className={`${reverseSubmitBtn && 'flex-row-reverse'} d-flex gap-1 justify-content-center`}>
          {showResetButton && (
            <Button
              text={t(`${showResetLabel}`)}
              type="secondary"
              size="small"
              onClick={handleReset}
              className={ResetBtnClassName}
            />
          )}
  
          <Button
            text={submitButtonLabel}
            type="primary"
            size="small"
            fullWidth={true}
            htmlType="submit"
            disabled={disabledSubmitBtn}
            isLoading={isLoading} // Pass the isLoading prop here
            className={buttonClassName} // Add this line
          />
        </div>
        
      }
     
    </form>
  );
};

export default GenericForm;
