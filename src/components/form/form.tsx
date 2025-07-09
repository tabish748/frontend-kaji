import React, { useState, ReactNode, useRef, useEffect } from "react";
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
  const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(false);

  // Ref to store references to each field
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Helper function to scroll to element and focus
  const scrollToElement = (element: HTMLElement) => {
    if (!element) return;
    
    try {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      
      // Focus on the element after a short delay
      setTimeout(() => {
        if (typeof element.focus === 'function') {
          element.focus();
        } else {
          // For elements that can't be focused directly, try to focus the first input
          const focusableElement = element.querySelector('input:not([type="hidden"]), select, textarea, button') as HTMLElement;
          if (focusableElement && typeof focusableElement.focus === 'function') {
            focusableElement.focus();
          }
        }
      }, 500);
    } catch (error) {
      // Error handling without console
    }
  };

  // Auto-scroll to first error when errors are updated externally (only during form submission)
  useEffect(() => {
    if (shouldAutoScroll && errors && Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      
      if (firstErrorField) {
        // Use setTimeout to ensure the errors are rendered first
        setTimeout(() => {
          const fieldElement = fieldRefs.current[firstErrorField];
          
          if (fieldElement && typeof fieldElement.getBoundingClientRect === 'function') {
            scrollToElement(fieldElement);
          } else {
            // Try to find the field by querying the DOM directly
            const domElement = document.querySelector(
              `[name="${firstErrorField}"], ` +
              `input[name="${firstErrorField}"], ` +
              `select[name="${firstErrorField}"], ` +
              `textarea[name="${firstErrorField}"], ` +
              `[data-name="${firstErrorField}"]`
            ) as HTMLElement;
            
            if (domElement) {
              // Check if the field is inside a collapsed accordion
              const accordionPanel = domElement.closest('[class*="accordionPanel"]');
              
              if (accordionPanel) {
                // Check if the accordion is closed (has panelClosed class)
                const isAccordionClosed = accordionPanel.classList.contains('panelClosed') ||
                                         accordionPanel.className.includes('panelClosed');
                
                if (isAccordionClosed) {
                  // Find the accordion item container
                  const accordionItem = accordionPanel.closest('[class*="accordionItem"]');
                  
                  if (accordionItem) {
                    // Look for the accordion trigger button
                    const accordionTrigger = accordionItem.querySelector('[class*="accordionLabel"]') as HTMLElement;
                    
                    if (accordionTrigger && typeof accordionTrigger.click === 'function') {
                      accordionTrigger.click();
                      
                      // Wait for accordion animation to complete before scrolling
                      setTimeout(() => {
                        scrollToElement(domElement);
                      }, 400);
                      return;
                    }
                  }
                }
              }
              
              // Scroll to element if not in accordion or accordion is already open
              scrollToElement(domElement);
            }
          }
        }, 150);
      }
      // Reset the auto-scroll flag after handling
      setShouldAutoScroll(false);
    }
  }, [errors, shouldAutoScroll]);

  const validateField = (
    name: string,
    value: any,
    validations: any[],
    placeholder: string,
    label?: string
  ) => {
    for (let validation of validations) {
      if (validation.type === "required") {
        // Special handling for checkbox arrays
        if (Array.isArray(value)) {
          if (!value.length) {
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
              return Validators.required(
                { value: "" },
                label || placeholder || name
              );
            }
          } else {
            // For single date, check if the value is empty or invalid
            if (!value || !value.trim() || !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
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
            return Validators.required(
              { value: "" },
              label || placeholder || name
            );
          }
          continue;
        }

        // Handle empty string or undefined/null values
        if (value === undefined || value === null || value === '') {
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
          const { name, value, validations, placeholder, label, selectedValues, selectedValue, type, isRange, fileValue } = child.props;

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
              
              // Special handling for RadioField - use selectedValue prop
              if (child.type === RadioField) {
                checkValue = selectedValue || '';
                
                // Additional validation for RadioField - check if value exists in options
                if (checkValue && validations.some((v: any) => v.type === 'required')) {
                  const options = child.props.options || [];
                  const hasValidOption = options.some((opt: any) => String(opt.value) === String(checkValue));
                  if (!hasValidOption && options.length > 0) {
                    // Don't fail validation if options are still loading (empty array)
                    // This prevents validation errors during API loading states
                  }
                }
              }

              // Special handling for date fields
              if ((child.type === InputDateField || child.type === CustomDateField)) {
                checkValue = value || '';
              }

              // Special handling for file fields - use fileValue if available
              if (child.type === InputField && type === 'file' && fileValue !== undefined) {
                checkValue = fileValue;
              }

              const error = validateField(
                name,
                checkValue,
                validations,
                placeholder,
                label
              );

              if (error) {
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
    
    if (setErrors) {
      setErrors(newErrors);
    }

    // Set flag to trigger auto-scroll on form submission validation failure
    if (firstInvalidField && !formValid) {
      setShouldAutoScroll(true);
    }

    return formValid;
  };

  const handleInputChange = (name: string, value: any) => {
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
    
    if (!validateForm()) {
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
      // Error handling without console
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
