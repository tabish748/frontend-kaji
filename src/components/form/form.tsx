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
import RadioField from "../radio-field/radio-field";

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
            child.type === CheckboxField ||
            child.type === RadioField
          ) {
            if (validations) {
              let checkValue = value;
              
              // Special handling for CheckboxField
              if (child.type === CheckboxField) {
                checkValue = selectedValues || [];
              }
              
              // Special handling for RadioField
              if (child.type === RadioField) {
                checkValue = value || '';
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
                console.log('Validation error for field:', name, 'error:', error, 'value:', checkValue, 'type:', child.type?.name);
                newErrors[name] = error;
                formValid = false;
                if (!firstInvalidField) {
                  firstInvalidField = name;
                  console.log('Setting firstInvalidField to:', name);
                }
              } else {
                console.log('Field passed validation:', name, 'value:', checkValue);
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

    // Debug logging for field refs and validation
    console.log('firstInvalidField:', firstInvalidField);
    console.log('fieldRefs.current:', fieldRefs.current);
    console.log('Available field refs:', Object.keys(fieldRefs.current));

    if (firstInvalidField) {
      const fieldElement = fieldRefs.current[firstInvalidField];
      console.log(`Field element for ${firstInvalidField}:`, fieldElement);
      
      if (fieldElement) {
        // Check if the element has getBoundingClientRect method
        if (typeof fieldElement.getBoundingClientRect === 'function') {
          console.log('Scrolling to field:', firstInvalidField);
          const elementPosition = fieldElement.getBoundingClientRect().top + window.pageYOffset;

          window.scrollTo({
            top: elementPosition - 100,
            behavior: "smooth",
          });
          
          // Try to focus on the element or its first focusable child
          if (typeof fieldElement.focus === 'function') {
            fieldElement.focus();
          } else {
            // For elements that can't be focused directly (like divs), try to focus the first input
            const firstInput = fieldElement.querySelector('input, select, textarea') as HTMLElement;
            if (firstInput && typeof firstInput.focus === 'function') {
              firstInput.focus();
            }
          }
        } else {
          console.warn(`Field element for ${firstInvalidField} doesn't have getBoundingClientRect method`, fieldElement);
        }
      } else {
        console.warn(`No field element found for ${firstInvalidField}. Available refs:`, Object.keys(fieldRefs.current));
        
        // Try to find the field by querying the DOM directly
        const domElement = document.querySelector(`[name="${firstInvalidField}"], [data-testid*="${firstInvalidField}"], input[name="${firstInvalidField}"]`) as HTMLElement;
        if (domElement) {
          console.log('Found field via DOM query:', domElement);
          
          // Check if the field is inside a collapsed accordion
          const accordionPanel = domElement.closest('[class*="accordionPanel"]');
          if (accordionPanel) {
            console.log('Field is inside accordion panel:', accordionPanel);
            
            // Check if the accordion panel is closed
            const isClosed = accordionPanel.classList.contains('panelClosed') || 
                           accordionPanel.className.includes('panelClosed') ||
                           !accordionPanel.classList.contains('panelOpen');
            
            if (isClosed) {
              // Try to find and click the accordion header to open it
              const accordionItem = accordionPanel.parentElement;
              const accordionHeader = accordionItem?.querySelector('[class*="accordionLabel"]');
              
                              if (accordionHeader && accordionHeader instanceof HTMLElement) {
                  console.log('Found accordion header, clicking to open:', accordionHeader);
                  accordionHeader.click();
                  
                  // Wait a bit for accordion animation to complete before scrolling
                  setTimeout(() => {
                    const elementPosition = domElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                      top: elementPosition - 100,
                      behavior: "smooth",
                    });
                    if (domElement.focus) {
                      domElement.focus();
                    }
                  }, 300);
                  return;
                }
              }
            }
          
          const elementPosition = domElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - 100,
            behavior: "smooth",
          });
          if (domElement.focus) {
            domElement.focus();
          }
        } else {
          console.warn(`Could not find field ${firstInvalidField} in DOM either`);
        }
      }
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
        } else if (child.type === RadioField && child.props.name === name) {
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
        } else if (child.type === RadioField && child.props.name === name) {
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
        } else if (child.type === RadioField) {
          return React.cloneElement(child as any, {
            errorText: (errors && errors[child.props.name]) || undefined,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              if (child.props.onChange) child.props.onChange(e);
              handleInputChange(child.props.name, e.target.value);
            },
            ref: (el: any) => {
              console.log('Setting ref for RadioField:', child.props.name, el);
              fieldRefs.current[child.props.name] = el;
            },
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
