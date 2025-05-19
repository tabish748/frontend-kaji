import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/components/molecules/project-heir-collapse.module.scss";
import ToggleButton from "../toggle-button/toggle-button";
import { useLanguage } from "@/localization/LocalContext";
import InputField from "../input-field/input-field";
import { usePostCodeLookup } from "@/hooks/postCodeHook/postCodeHook";
import SelectField from "../select-field/select-field";
import { phoneTypeOptions } from "@/libs/optionsHandling";
import ConfirmationBox from "../confirmation-box/confirmation-box";
import { removeDecimal } from "@/libs/utils";
import { useCheckEmailExist } from "@/hooks/postCodeHook/isEmailExistHook/isEmailExistHook";
import { useCheckPhoneExist } from "@/hooks/postCodeHook/isPhoneExistHook/isPhoneExistHook";
import Toast from "../toast/toast";
import FullscreenLoader from "../loader/loader";
type ToastState = {
  message: string | string[];
  type: string;
};
const ProjectHeirCollapseComponent: React.FC<any> = ({
  heirData,
  prefectures,
  updateInitialState,
  onRepresentativeChange,
  isRepresentative,
  onInputChangeNotify,
  key,
  totalRecords,
  showHeirs,
  index
}) => {
  
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [pendingChange, setPendingChange] = useState<() => void | null>(null as any);
  const [changesConfirmed, setChangesConfirmed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [formState, setFormState] = useState<any>({
    id: heirData?.id || "",
    customerId: heirData?.customer_id,
    representative: heirData?.is_representative == "1" ? "1" :  "0",
    firstName: heirData?.first_name || "",
    lastName: heirData?.last_name || "",
    firstNameKana: heirData?.first_name_kana || "",
    lastNameKana: heirData?.last_name_kana || "",
    relationship: heirData?.relation || "",
    personalCode: heirData?.personal_code || "",
    phoneType1: heirData?.phone_type1 || "",
    phoneType2: heirData?.phone_type2 || "",
    phoneType3: heirData?.phone_type3 || "",
    phone1: heirData?.phone1 || "",
    phone2: heirData?.phone2 || "",
    phone3: heirData?.phone3 || "",
    email: heirData?.email || "",
    email2: heirData?.email2 || "",
    legalInheritance: heirData?.pivot?.legal_inheritance || "",
    taxPayment: removeDecimal(heirData?.pivot?.tax_payment) || "",
    postCode: heirData?.zipcode,
    prefecture: heirData?.prefecture_id,
    postAddress: heirData?.address,
    primaryContact: heirData?.primary_contact || "",
  });
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });



  useEffect(() => {
    updateInitialState(formState);
  }, [formState]);
  const hasInteractedWithPostCode = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    
    // Extract the base name if it contains an ID (e.g., "postAddress-123" -> "postAddress")
    const baseName = name.includes('-') ? name.split('-')[0] : name;
    
    console.log('original name:', name);
    console.log('base name:', baseName);
    console.log('value:', value);
    
    if (baseName === 'postCode') {
      hasInteractedWithPostCode.current = true;
    }

    const newChange = () => {
      // Update form state using the base name, not the full name with ID
      setFormState((prevState: any) => {
        console.log('Updating state:', baseName, value);
        return { ...prevState, [baseName]: value };
      });

      // Only trigger notification for non-special fields
      if (baseName === 'legalInheritance' || baseName === 'taxPayment') {
        return;
      } else if (onInputChangeNotify) {
        onInputChangeNotify();
      }
    };

    // Handle confirmation logic
    if (!changesConfirmed) {
      if (!showConfirmBox) {
        if (baseName === 'legalInheritance' || baseName === 'taxPayment') {
          newChange();
        } else {
          setShowConfirmBox(true);
          setPendingChange(() => newChange);
        }
      }
    } else {
      newChange();
    }
  };



  const handleConfirm = () => {
    if (pendingChange) {
      pendingChange();
    }
    setShowConfirmBox(false);
    setPendingChange(null as any);
    setChangesConfirmed(true);
  };


  const handleCancel = () => {
    setShowConfirmBox(false);
  };

  const { prefCode, address, resetPostCodeData } = usePostCodeLookup(formState.postCode);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (hasInteractedWithPostCode.current && (prefCode || address)) {
      if (!formState.postAddress) {
        setFormState((prevState: { prefecture: any; postAddress: any; }) => ({
          ...prevState,
          prefecture: prefCode || prevState.prefecture,
          postAddress: address || prevState.postAddress,
        }));
        
        // Try both selectors - with and without ID
        const addressInput = document.querySelector(`input[name="postAddress-${heirData.id}"], input[name="postAddress"]`) as HTMLInputElement;
        if (addressInput) {
          addressInput.focus();
          const length = addressInput.value.length;
          addressInput.setSelectionRange(length, length);
        }
      } else {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
        }
        // Try both selectors - with and without ID
        const addressInput = document.querySelector(`input[name="postAddress-${heirData.id}"], input[name="postAddress"]`) as HTMLInputElement;
        if (addressInput) {
          addressInput.focus();
          const length = addressInput.value.length;
          addressInput.setSelectionRange(length, length);
        }
      }
      resetPostCodeData();
    }
  }, [prefCode, address]);

  useEffect(() => {
    setFormState((prevState: any) => ({
      ...prevState,
      representative: heirData?.is_representative == '1' ? '1' : isRepresentative  ? "1" : "0",
    }));
  }, [isRepresentative, totalRecords, showHeirs]);
  

  const handleRepresentativeToggle = (isOn: boolean) => {
    const newRepresentativeState = isOn ? "1" : "0";
  
    const changeAction = () => {
      setFormState((prevState: any) => ({
        ...prevState,
        representative: newRepresentativeState,
      }));
  
      if (isOn && !isRepresentative) {
        
        onRepresentativeChange(heirData.id);
      }
    };
  
    if (!changesConfirmed) {
      if (!showConfirmBox) {
        setShowConfirmBox(true);
        setPendingChange(() => changeAction);
      }
    } else {
      changeAction();
    }
  };

  // const handleRepresentativeToggle = (isOn: boolean) => {
  //   const newRepresentativeState = isOn ? "1" : "0";
  
  //   const changeAction = () => {
  //     setFormState((prevState: any) => ({
  //       ...prevState,
  //       representative: newRepresentativeState,
  //     }));
  
  //     if (isOn && !isRepresentative) {
  //       console.log('heirData.id', heirData.id)
  //       onRepresentativeChange(heirData.id);
  //     }
  //   };
  
  //   if (!changesConfirmed) {
  //     if (!showConfirmBox) {
  //       setShowConfirmBox(true);
  //       setPendingChange(() => changeAction);
  //     }
  //   } else {
  //     changeAction();
  //   }
  // };

  
  // const handleRepresentativeToggle = (isOn: boolean) => {
  //   const newRepresentativeState = isOn ? "1" : "0";

  //   const changeAction = () => {
  //     setFormState((prevState: any) => ({
  //       ...prevState,
  //       representative: newRepresentativeState,
  //     }));

  //     // Additional actions, like notifying parent components
  //     if (newRepresentativeState === "1" && !isRepresentative) {
  //       onRepresentativeChange(heirData.id);
  //     }
  //   };

  //   // Use confirmation logic similar to input change
  //   if (!changesConfirmed) {
  //     if (!showConfirmBox) {
  //       setShowConfirmBox(true);
  //       setPendingChange(() => changeAction);
  //     }
  //   } else {
  //     changeAction(); // Apply change directly if already confirmed
  //   }
  // };


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormState((prevState: any) => ({
      ...prevState,
      primaryContact: e.target.value
    }));
  };




  
  const { checkEmail, exists, message:checkMessage, errorMessages: isEmailExistsErrorMessages, resetCheckEmail } = useCheckEmailExist();

  useEffect(() => {
    if (exists === true) {
      setToast({
        message: checkMessage || "",
        type: "success",
      });
    } else if (isEmailExistsErrorMessages && isEmailExistsErrorMessages.length > 0) {
      setToast({
        message: isEmailExistsErrorMessages,
        type: "fail",
      });
    }
    resetCheckEmail
  }, [exists, isEmailExistsErrorMessages, checkMessage])

  const { checkPhone, phoneExistState, message: phoneExistsMessage, isChecking :isCheckingPhone, errorMessages: isPhoneExistsErrorMessages } = useCheckPhoneExist();

  useEffect(() => {
    
    if (phoneExistState === true) {
      setToast({
        message: phoneExistsMessage || "",
        type: "success",
      });
    } else if (isPhoneExistsErrorMessages && isPhoneExistsErrorMessages.length > 0) {
      setToast({
        message: isPhoneExistsErrorMessages,
        type: "fail",
      });
    }
  }, [phoneExistState, isPhoneExistsErrorMessages, phoneExistsMessage])


  const handleEmailFocusOut = (emailFieldName: keyof any, otherEmailFields: string[] = []) => {
    const email = formState[emailFieldName];
    const otherEmails = otherEmailFields.map(field => formState[field as keyof any])
    
    if (email && typeof email === "string" && !otherEmails.includes(email)) {
      checkEmail(formState.customerId == null ? String(formState.id) :String(formState.customerId), email, formState.customerId == null ? "family_member" : "customer");
    } else if (email && otherEmails.includes(email)) {
      setToast({
        message: [`顧客(${formState.personalCode})に対して同一メールアドレスを入力しようとしています。`],
        type: "fail",
      });
    }
  };


  const handlePhoneFocusOut = (phoneFieldName: keyof any, otherPhoneFields: string[]) => {
    const phone = formState[phoneFieldName];
    const otherPhones = otherPhoneFields.map(field => formState[field as keyof any]);
    
    if (phone && !otherPhones.includes(phone)) {
      checkPhone(formState.customerId == null ? String(formState.id) :String(formState.customerId), phone, formState.customerId == null ? "family_member" : "customer");
    } else if(phone && otherPhones.includes(phone)) {
      setToast({
        message: [`顧客(${formState.personalCode})に対して同一電話番号を入力しようとしています。`],
        type: "fail",
      });
    }
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" }); 
  };

  return (
    <>
     
     {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      <div className={styles.titleBar} onClick={toggleCollapse}>
        <h5>{formState.personalCode} - {formState.firstName + formState.lastName}</h5>
        <span className={`${styles.arrow} ${!isCollapsed ? styles.up : ''}`}>▼</span>

      </div>
      <div
        ref={contentRef}
        className={`${styles.collapseContainer} ${isCollapsed ? styles.collapsed : styles.expanded
          }`}
      >
        <div></div>

        <div className={styles.collapseSection}>
          <div
            className={`${styles.heirfieldsWrapper} ${styles.heirfieldsHeader}`}
          >
            <p>{t("representative")}</p>
            <p>{t("name")}</p>
            <p>{t("relationship")}</p>
            <p>{t("contact/address")}</p>
            <p>{t("legalInheritance")}</p>
            <p>{t("taxPaymentYen")}</p>
          </div>
          <div className={styles.heirfieldsWrapper}>
            <ToggleButton
              value={formState.representative == "1"}
              label={t("representative")}
              options={{
                on: `${t("representative")}`,
                off: `${t("representative")}`,
              }}
              getSelectedOption={handleRepresentativeToggle}
              disabled={totalRecords == 1 ? true : false}
              hideSelectedText={true}
            />

            <div className={styles.heirNameGrid}>
              <InputField
                name="firstNameKana"
                value={formState.firstNameKana}
                onChange={handleInputChange}
                placeholder={t("firstNameKana")}
                tag={t('required')}
              />
              <InputField
                name="lastNameKana"
                value={formState.lastNameKana}
                onChange={handleInputChange}
                className={styles.nameField}
                placeholder={t("lastNameKana")}
                // tag={t('required')}
              />

              <InputField
                name="firstName"
                value={formState.firstName}
                onChange={handleInputChange}
                placeholder={t("firstName")}
              />
              <InputField
                name="lastName"
                value={formState.lastName}
                onChange={handleInputChange}
                placeholder={t("lastName")}
              />

            </div>

            <InputField
              name="relationship"
              value={formState.relationship}
              onChange={handleInputChange}
              placeholder={t("relationship")}
            />
            <div>
              <div className={styles.phoneFields}>
                <input 
                  name={`primaryContact-${heirData.id}`}
                  value="phone1"
                  checked={formState.primaryContact === "phone1"}
                  onChange={handleRadioChange}
                  type="radio"

                // className={Style.selectRadio}
                />
                <SelectField
                  options={phoneTypeOptions}
                  value={formState.phoneType1}
                  name='phoneType1'
                  onChange={handleInputChange}
                  placeholder={t("phoneType") + 1}
                />
                <InputField
                  name="phone1"
                  value={formState.phone1}
                  onChange={handleInputChange}
                  placeholder={t("phone")}
                  onBlur={() => handlePhoneFocusOut("phone1",["phone2","phone3"])}
                />
              </div>
              <div className={styles.phoneFields}>
                <input name={`primaryContact-${heirData.id}`}
                  value="phone2"
                  checked={formState.primaryContact === "phone2"}
                  onChange={handleRadioChange}
                  type="radio"
                // className={Style.selectRadio}
                />
                <SelectField
                  options={phoneTypeOptions}
                  value={formState.phoneType2}
                  name='phoneType2'
                  onChange={handleInputChange}
                  placeholder={t("phoneType") + 2}
                />
                <InputField
                  name="phone2"
                  value={formState.phone2}
                  onChange={handleInputChange}
                  placeholder={t("phone2")}
                  onBlur={() => handlePhoneFocusOut("phone2",["phone1","phone3"])}
                />
              </div>
              <div className={styles.phoneFields}>
                <input name={`primaryContact-${heirData.id}`}
                  value="phone3"
                  checked={formState.primaryContact === "phone3"}
                  onChange={handleRadioChange}
                  type="radio"
                // className={Style.selectRadio}
                />
                <SelectField
                  options={phoneTypeOptions}
                  name='phoneType3'
                  value={formState.phoneType3}
                  onChange={handleInputChange}
                  placeholder={t("phoneType") + 3}
                />
                <InputField
                  name="phone3"
                  value={formState.phone3}
                  onChange={handleInputChange}
                  placeholder={t("phone3")}
                  onBlur={() => handlePhoneFocusOut("phone3",["phone1","phone2"])}
                />
              </div>
              <div className={`${styles.phoneFields} ${styles.emailGrid}`}>
                <input name={`primaryContact-${heirData.id}`}
                  value="email1"
                  checked={formState.primaryContact === "email1"}
                  onChange={handleRadioChange}
                  type="radio"
                // className={Style.selectRadio}
                />
                <InputField
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder={t("email")}
                  onBlur={() => handleEmailFocusOut("email",["email2"])} 
                />
              </div>
              <div className={`${styles.phoneFields} ${styles.emailGrid}`}>
                <input name={`primaryContact-${heirData.id}`}
                  value="email2"
                  checked={formState.primaryContact === "email2"}
                  onChange={handleRadioChange}
                  type="radio"
                // className={Style.selectRadio}
                />
                <InputField
                  name="email2"
                  value={formState.email2}
                  onChange={handleInputChange}
                  placeholder={t("email") + 2}
                  onBlur={() => handleEmailFocusOut("email2",["email"])} 
                />
              </div>
            </div>

            <InputField
              name="legalInheritance"
              value={formState.legalInheritance}
              onChange={handleInputChange}
              placeholder={t("legalInheritance")}
            />

            <InputField
              name="taxPayment"
              value={String(formState.taxPayment)}
              onChange={handleInputChange}
              placeholder={t("taxPayment")}
              type='number'
            />
          </div>

          <div className={styles.postFieldsWrapper}>
            <div className={styles.postFieldsInnerWrapper}>
              <InputField
                name="postCode"
                value={formState.postCode}
                onChange={handleInputChange}
                placeholder={t("postCode")}
              />
              <SelectField
                options={prefectures}
                value={formState.prefecture}
                onChange={(e) =>
                  setFormState((prevState: any) => ({
                    ...prevState,
                    prefecture: e.target.value,
                  }))
                }
                placeholder={t("prefectures")}
              />
              <InputField
                name={`postAddress-${heirData.id}`}
                value={formState.postAddress}
                onChange={handleInputChange}
                placeholder={t("address")}
              />
            </div>
          </div>
        </div>
      </div>
      {showConfirmBox && (
        <ConfirmationBox
          isOpen={showConfirmBox}
          title={t("custInfoChangeAlert")}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default ProjectHeirCollapseComponent;
