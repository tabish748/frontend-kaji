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
    label?: string // Add label param
  ) => {
    for (let validation of validations) {
      if (validation.type === "required") {
        if (!validation.params) {
          validation.params = {};
        }
        // Prefer label, then placeholder, then name
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
          const { name, value, validations, placeholder, label } = child.props;

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
              if (child.type === CheckboxField) {
                checkValue = Array.isArray(value)
                  ? value.length > 0
                    ? value.join(",")
                    : ""
                  : value;
              }
              // Pass label to validator
              const error = validateField(
                name,
                checkValue,
                validations,
                placeholder,
                label // Pass label here
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

    // Scroll to the first invalid field
    if (firstInvalidField && fieldRefs.current[firstInvalidField]) {
      const elementPosition =
        (fieldRefs.current[firstInvalidField]?.getBoundingClientRect()
          .top as any) + window.pageYOffset;

      // Scroll to the calculated position minus 100px for the desired offset
      window.scrollTo({
        top: elementPosition - 100, // Scroll to the element with an extra offset
        behavior: "smooth",
      });
      fieldRefs.current[firstInvalidField]?.focus();
    }

    return formValid;
  };

  const handleInputChange = (name: string, value: string) => {
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    const newErrors = { ...errors };
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        (child.type === InputField ||
          child.type === TextAreaField ||
          child.type === CustomSelectField ||
          child.type === SelectField ||
          child.type === InputDateField ||
          child.type === CustomDateField) &&
        child.props.name === name
      ) {
        const { validations, placeholder } = child.props;
        if (validations) {
          const error = validateField(name, value, validations, placeholder);
          newErrors[name] = error;
        }
      } else if (
        React.isValidElement(child) &&
        child.props &&
        (child.props as any).children
      ) {
        traverseAndHandleInputChange(
          (child.props as any).children,
          name,
          value,
          newErrors
        );
      }
    });
    if (setErrors) setErrors(newErrors);
  };

  const traverseAndHandleInputChange = (
    elements: React.ReactNode,
    name: string,
    value: string,
    newErrors: Record<string, string | null>
  ) => {
    React.Children.forEach(elements, (child) => {
      if (
        React.isValidElement(child) &&
        (child.type === InputField ||
          child.type === TextAreaField ||
          child.type === CustomSelectField ||
          child.type === SelectField ||
          child.type === InputDateField ||
          child.type === CustomDateField) &&
        child.props.name === name
      ) {
        const { validations, placeholder }: any = child.props;
        if (validations) {
          const error = validateField(name, value, validations, placeholder);
          newErrors[name] = error;
        }
      } else if (
        React.isValidElement(child) &&
        child.props &&
        (child.props as any).children
      ) {
        traverseAndHandleInputChange(
          (child.props as any).children,
          name,
          value,
          newErrors
        );
      }
    });
  };

  const traverseAndCloneChildren = (
    elements: React.ReactNode
  ): React.ReactNode => {
    return React.Children.map(elements, (child) => {
      if (React.isValidElement(child)) {
        if (
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
    if (setErrors && !validateForm()) return; // Skip submit if validation fails

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
