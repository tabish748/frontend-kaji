import React, { useState, ReactNode, useRef } from "react";
import { Validators } from "../generic-form/validators";
import InputField from "../input-field/input-field";
import Button from "../button/button";
import { useLanguage } from "@/localization/LocalContext";
import Style from "../../styles/components/molecules/form-comp.module.scss";
import ConfirmationBox from "../confirmation-box/confirmation-box";
import CustomSelectField from "../custom-select/custom-select";
import SelectField from "../select-field/select-field";
import InputDateField from "../input-date/input-date";
import CustomDateField from "../custom-date-field/custom-date-field";
import TextAreaField from "../text-area/text-area";
import CheckboxField from "../checkbox-field/checkbox-field";

interface FormProps {
  children: ReactNode;
  isLoading?: boolean;
  showResetButton?: boolean;
  showDeleteButton?: boolean;
  resetButtonLoading?: boolean;
  deleteButtonLoading?: boolean;
  isSubmitFix?: boolean;
  onSubmit: () => void;
  onClickResetButton?: () => void;
  onClickDeleteButton?: () => void;
  className?: string;
  showTobSubmitBtn?: boolean;
  registerBtnText?: string;
  showConfirmation?: boolean;
  disabledSubmitForm?: boolean;
  showBottomSubmitBtn?: boolean;
  setErrors?: React.Dispatch<
    React.SetStateAction<Record<string, string | null>>
  >;
  errors?: Record<string, string | null>;
}

interface InputFieldProps {
  errorText?: string | null;
  onChange?: any;
  validations?: Array<{ type: string; params?: any }>;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  isLoading,
  showResetButton,
  showDeleteButton,
  onClickResetButton,
  onClickDeleteButton,
  resetButtonLoading,
  deleteButtonLoading,
  className,
  isSubmitFix,
  registerBtnText,
  showTobSubmitBtn = false,
  showBottomSubmitBtn = false,
  showConfirmation = true,
  disabledSubmitForm = false,
  setErrors,
  errors,
}) => {
  const { t } = useLanguage();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showConfirmBox, setShowConfirmBox] = useState<boolean>(false);

  // Ref to store references to each field
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const validateField = (
    name: string,
    value: any,
    validations: any[],
    placeholder: string,
    label?: string
  ) => {
    console.log('validateField called for:', name, 'with value:', value);

    for (let validation of validations) {
      if (validation.type === "required") {
        // Special handling for checkbox arrays
        if (Array.isArray(value)) {
          if (!value.length) {
            console.log('Checkbox validation failed for:', name);
            return Validators.required(
              { value: "" },
              label || placeholder || name
            );
          }
          continue;
        }

        // Special handling for date inputs
        if (typeof value === 'string' && (name.toLowerCase().includes('date') || name === 'contractPeriod')) {
          // Check if it's a date range input (contains 'to')
          if (value.includes(' to ')) {
            const dates = value.split(' to ');
            // For date range, both dates must be present
            if (dates.length !== 2 || !dates[0].trim() || !dates[1].trim()) {
              console.log('Date range validation failed for:', name);
              return Validators.required(
                { value: "" },
                label || placeholder || name
              );
            }
          } else {
            // For single date, check if the value is empty or invalid
            if (!value || !value.trim() || !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
              console.log('Single date validation failed for:', name);
              return Validators.required(
                { value: "" },
                label || placeholder || name
              );
            }
          }
          continue;
        }

        // Special handling for file inputs
        if (name.toLowerCase().includes('file') || name.toLowerCase().includes('upload') || name.toLowerCase().includes('attachment')) {
          // For file inputs, check if File object exists
          if (!value || (value instanceof File && value === null)) {
            console.log('File validation failed for:', name);
            return Validators.required(
              { value: "" },
              label || placeholder || name
            );
          }
          continue;
        }

        // Handle empty string or undefined/null values
        if (value === undefined || value === null || value === '') {
          console.log('Required validation failed for:', name);
          return Validators.required(
            { value },
            label || placeholder || name
          );
        }
        
        if (!validation.params) {
          validation.params = {};
        }
        validation.params.placeholder = label || placeholder || name;
      }
      
      if (Validators[validation.type]) {
        const error = Validators[validation.type]({ value }, label || placeholder || name);
        if (error) {
          console.log('Validation failed for:', name, 'with error:', error);
          return error;
        }
      }
    }
    return null;
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors: Record<string, string | null> = {};
    let firstInvalidField: any = null;

    const traverseAndValidate = (elements: React.ReactNode) => {
      React.Children.forEach(elements, (child) => {
        if (React.isValidElement(child)) {
          const { name, value, validations, placeholder, label, selectedValues, type, isRange, fileValue } = child.props;

          if (
            child.type === InputField ||
            child.type === TextAreaField ||
            child.type === CustomSelectField ||
            child.type === SelectField ||
            child.type === InputDateField ||
            child.type === CustomDateField ||
            child.type === CheckboxField
          ) {
            if (validations) {
              let checkValue = value;
              
              // Special handling for CheckboxField
              if (child.type === CheckboxField) {
                checkValue = selectedValues || [];
              }

              // Special handling for date fields
              if ((child.type === InputDateField || child.type === CustomDateField)) {
                checkValue = value || '';
                console.log('Date field validation:', name, checkValue, isRange);
              }

              // Special handling for file fields - use fileValue if available
              if (child.type === InputField && type === 'file' && fileValue !== undefined) {
                checkValue = fileValue;
                console.log('File field validation:', name, checkValue);
              }

              const error = validateField(
                name,
                checkValue,
                validations,
                placeholder,
                label
              );

              if (error) {
                console.log('Validation error for field:', name, 'error:', error);
                newErrors[name] = error;
                formValid = false;
                if (!firstInvalidField) {
                  firstInvalidField = name;
                }
              }
            }
          } else if (child.props && child.props.children) {
            traverseAndValidate(child.props.children);
          }
        }
      });
    };

    traverseAndValidate(children);
    console.log('Final validation result:', { formValid, errors: newErrors });
    
    if (setErrors) {
      setErrors(newErrors);
    }

    if (firstInvalidField && fieldRefs.current[firstInvalidField]) {
      const elementPosition =
        (fieldRefs.current[firstInvalidField]?.getBoundingClientRect()
          .top as any) + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - 100,
        behavior: "smooth",
      });
      fieldRefs.current[firstInvalidField]?.focus();
    }

    return formValid;
  };

  const handleInputChange = (name: string, value: any) => {
    console.log("Form handleInputChange - name:", name);
    console.log("Form handleInputChange - value:", value);
    
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    const newErrors = { ...errors };
    
    const validateInput = (props: any) => {
      const { validations, placeholder, label } = props;
      if (validations) {
        const error = validateField(name, value, validations, placeholder, label);
        newErrors[name] = error;
      }
    };

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === CheckboxField && child.props.name === name) {
          validateInput(child.props);
        } else if (
          (child.type === InputField ||
          child.type === TextAreaField ||
          child.type === CustomSelectField ||
          child.type === SelectField ||
          child.type === InputDateField ||
          child.type === CustomDateField) &&
          child.props.name === name
        ) {
          validateInput(child.props);
        } else if (child.props && child.props.children) {
          traverseAndHandleInputChange(child.props.children, name, value, newErrors);
        }
      }
    });
    
    if (setErrors) setErrors(newErrors);
  };

  const traverseAndHandleInputChange = (
    elements: React.ReactNode,
    name: string,
    value: any,
    newErrors: Record<string, string | null>
  ) => {
    const validateInput = (props: any) => {
      const { validations, placeholder, label } = props;
      if (validations) {
        const error = validateField(name, value, validations, placeholder, label);
        newErrors[name] = error;
      }
    };

    React.Children.forEach(elements, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === CheckboxField && child.props.name === name) {
          validateInput(child.props);
        } else if (
          (child.type === InputField ||
          child.type === TextAreaField ||
          child.type === CustomSelectField ||
          child.type === SelectField ||
          child.type === InputDateField ||
          child.type === CustomDateField) &&
          child.props.name === name
        ) {
          validateInput(child.props);
        } else if (child.props && child.props.children) {
          traverseAndHandleInputChange(child.props.children, name, value, newErrors);
        }
      }
    });
  };

  const traverseAndCloneChildren = (elements: React.ReactNode): React.ReactNode => {
    return React.Children.map(elements, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === CheckboxField) {
          return React.cloneElement(child as any, {
            errorText: (errors && errors[child.props.name]) || undefined,
            onChange: (values: string[]) => {
              if (child.props.onChange) child.props.onChange(values);
              handleInputChange(child.props.name, values);
            },
            ref: (el: any) => (fieldRefs.current[child.props.name] = el),
          });
        } else if (
          child.type === InputField ||
          child.type === TextAreaField ||
          child.type === CustomSelectField ||
          child.type === SelectField ||
          child.type === InputDateField ||
          child.type === CustomDateField
        ) {
          return React.cloneElement(child as any, {
            errorText: (errors && errors[child.props.name]) || undefined,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              console.log('Form onChange for field:', child.props.name, 'value:', e.target.value); // Debug log
              if (child.props.onChange) child.props.onChange(e);
              handleInputChange(child.props.name, e.target.value);
            },
            ref: (el: any) => (fieldRefs.current[child.props.name] = el),
          });
        } else if (child.props && child.props.children) {
          return React.cloneElement(
            child,
            undefined,
            traverseAndCloneChildren(child.props.children)
          );
        }
      }
      return child;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started'); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed'); // Debug log
      return;
    }

    if (showConfirmation) {
      setShowConfirmBox(true);
    } else {
      await handleConfirmSubmit();
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      await onSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setShowConfirmBox(false);
    }
  };

  return (
    <>
      {showConfirmBox && (
        <ConfirmationBox
          isOpen={showConfirmBox}
          title={t("編集内容を確定します。")}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmBox(false)}
          secondText="よろしいですか？"
          confirmButtonText="OK"
          cancelButtonText="キャンセル"
          className={Style.confirmationBox}
        />
      )}
      <div className="d-flex justify-content-between">
        <span></span>
        {showTobSubmitBtn && (
          <Button
            text={registerBtnText ? registerBtnText : t("register")}
            type="primary"
            size="small"
            htmlType="submit"
            className={`${Style.SubmitBtn} ${Style.centerSubmitBtn}`}
            isLoading={isLoading}
            onClick={handleFormSubmit}
            disabled={disabledSubmitForm}
          />
        )}
        {showDeleteButton ? (
          <Button
            text={t("delete")}
            type="danger"
            size="small"
            htmlType="button"
            className={`${Style.SubmitBtn} ${Style.delBtn}`}
            isLoading={deleteButtonLoading}
            onClick={onClickDeleteButton}
          />
        ) : (
          <span></span>
        )}
      </div>
      <div className={Style.formContainer}>
        <form onSubmit={handleFormSubmit} className={className}>
          {traverseAndCloneChildren(children)}
          <div
            className={`d-flex justify-content-between mt-2 gap-1 ${
              isSubmitFix === true && "submitFixBg"
            }`}
          >
            <span></span>
            <div className="d-flex justify-content-between gap-1">
              {showResetButton && (
                <Button
                  text={t("reset2")}
                  type="secondary"
                  size="small"
                  htmlType="button"
                  className={Style.SubmitBtn}
                  isLoading={resetButtonLoading}
                  onClick={onClickResetButton}
                />
              )}
              {showBottomSubmitBtn && (
                <Button
                  text={registerBtnText ? registerBtnText : t("register")}
                  type="primary"
                  size="small"
                  htmlType="submit"
                  className={`${Style.SubmitBtn} ${Style.centerSubmitBtn} `}
                  isLoading={isLoading}
                  onClick={handleFormSubmit}
                  disabled={disabledSubmitForm}
                />
              )}
            </div>
            {showDeleteButton ? (
              <Button
                text={t("delete")}
                type="danger"
                size="small"
                htmlType="button"
                className={`${Style.SubmitBtn} ${Style.delBtn}`}
                isLoading={deleteButtonLoading}
                onClick={onClickDeleteButton}
              />
            ) : (
              <span></span>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
