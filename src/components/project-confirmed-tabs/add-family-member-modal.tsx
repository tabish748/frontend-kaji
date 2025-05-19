import React, { useRef } from "react";
import InputField from "../input-field/input-field";
import Style from "../../styles/components/molecules/search-modal.module.scss";
import CustomerStyle from "../../styles/pages/customer-create.module.scss";
import plus from "../../../public/assets/svg/userAdd.svg";
import Image from "next/image";
import close from "../../../public/assets/svg/modalClose.svg";
import { useLanguage } from "@/localization/LocalContext";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import { useState, useEffect } from "react";
import { statusValidInvalidOptions } from "@/libs/optionsHandling";
import { searchForOptions } from "@/libs/optionsHandling";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCustomers } from "@/app/features/insurance/customerSearchSlice";
import TableBuddy from "../table-buddy/table-buddy";
import Button from "../button/button";
import FamilyMemberModalStyle from "@/styles/components/molecules/family-member-modal.module.scss";
import { Form } from "../form/form";
import SelectField from "../select-field/select-field";
import {
  createFamilyMember,
  resetFamilyMemberCreateState,
} from "@/app/features/customers/createFamilyMemberSlice";
import Toast from "../toast/toast";
import { phoneTypeOptions } from "@/libs/optionsHandling";
import { useCheckEmailExist } from "@/hooks/postCodeHook/isEmailExistHook/isEmailExistHook";
import { useCheckPhoneExist } from "@/hooks/postCodeHook/isPhoneExistHook/isPhoneExistHook";
import { usePostCodeLookup } from "@/hooks/postCodeHook/postCodeHook";
interface Props {
  onClose?: (customer?: any) => void;
  prefectures: any;
  familyCode: string;
  onDataReceived?: (data: any) => void; // Add this line
}
interface Customer {
  familyCode: string;
  personalCode: string;
  firstLastName: string;
  phone: string;
  selectBtn: React.ReactNode | string;
}
const initialState = {
  id: "nill",
  representative: "0",
  firstName: "",
  lastName: "",
  firstNameKana: "",
  lastNameKana: "",
  relationship: "",
  personalCode: "",
  phoneType1: "",
  phoneType2: "",
  phoneType3: "",
  phone1: "",
  phone2: "",
  phone3: "",
  email: "",
  email2: "",
  legalInheritance: "",
  taxPayment: "",
  postCode: "",
  prefecture: "",
  postAddress: "",
  primaryContact: "phone1",
  customerId: "_new"
  // Add other fields as necessary
};
type ToastState = {
  message: string | string[];
  type: string;
};
const AddFamilyMemberModal: React.FC<Props> = ({
  onClose,
  prefectures,
  familyCode,
  onDataReceived,
}) => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState<any>(initialState);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [errors, setErrors] = useState<any>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, errorMessages, status, message } = useSelector(
    (state: RootState) => state.familyMemberCreate
  );
  
  const { prefCode: prefCodeApi, address: addressApi, resetPostCodeData } = usePostCodeLookup(
    formState.postCode
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (prefCodeApi || addressApi) {
      if(!formState.postAddress) {
        setFormState((prevState: any) => ({
          ...prevState,
          prefecture: prefCodeApi || prevState.prefecture, 
          postAddress: addressApi || prevState.postAddress,
        }));
        const addressInput = document.querySelector('input[id="modalAddress"]') as HTMLInputElement;
        if (addressInput) {
          addressInput.focus();
          const length = addressInput.value.length;
          addressInput.setSelectionRange(length, length);
        }
      }
      else {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
        }
        const addressInput = document.querySelector('input[id="modalAddress"]') as HTMLInputElement;
        if (addressInput) {
          addressInput.focus();
          const length = addressInput.value.length;
          addressInput.setSelectionRange(length, length);
        }
      }
      resetPostCodeData();
    }
  }, [prefCodeApi, addressApi]);

  
  useEffect(() => {
    if (data && data.length > 0) {
      onDataReceived && onDataReceived(data);
    }
  }, [data, onDataReceived]);

  useEffect(() => {
    if (status === true) {
      setToast({
        message: message || "Property Created successfully!",
        type: "success",
      });
      onClose?.()
      dispatch(resetFamilyMemberCreateState());
    } else if (errorMessages && errorMessages.length > 0) {
      setToast({
        message: errorMessages,
        type: "fail",
      });
    }
  }, [dispatch, errorMessages, message, status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    const officeDptId = localStorage.getItem('officeDepartmentsId');
    const payload = {
      family_code: familyCode,
      office_departments_id: String(officeDptId),
      first_name: formState.firstName,
      last_name: formState.lastName,
      first_name_kana: formState.firstNameKana,
      last_name_kana: formState.lastNameKana,
      email: formState.email,
      email2: formState.email2,
      relation: formState.relationship,
      phone_type1: formState.phoneType1,
      phone_type2: formState.phoneType2,
      phone_type3: formState.phoneType3,
      phone1: formState.phone1,
      phone2: formState.phone2,
      phone3: formState.phone3,
      prefecture_id: formState.prefecture,
      address: formState.postAddress,
      zipcode: formState.postCode,
      return_type: "family_members",
      primary_contact: formState.primaryContact,
    };
    dispatch(createFamilyMember(payload as any));
  };

  const handleClostToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetFamilyMemberCreateState());
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

  const { checkPhone, phoneExistState, message: phoneExistsMessage, errorMessages: isPhoneExistsErrorMessages } = useCheckPhoneExist();

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
      checkEmail(String(formState.customerId), email, "family_member");
    } else if (email && otherEmails.includes(email)) {
      setToast({
        message: [t('duplicateEmailError')],
        type: "fail",
      });
    }
  };


  const handlePhoneFocusOut = (phoneFieldName: keyof any, otherPhoneFields: string[]) => {
    const phone = formState[phoneFieldName];
    const otherPhones = otherPhoneFields.map(field => formState[field as keyof any]);
    
    if (phone && !otherPhones.includes(phone)) {
      checkPhone(String(formState.customerId), phone, "family_member");
    } else if(phone && otherPhones.includes(phone)) {
      setToast({
        message: [t('duplicatePhoneError')],
        type: "fail",
      });
    }
  };


  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleClostToast}
        />
      )}

      <div className={Style.modalOverlay}>
        <div className={Style.modalContent}>
          <div className={`${Style.modalHeaderForCustomer} ${Style.justify_center} p-0`}>
            {/* <p>{t("customerSearch")}</p> */}
            <h5 className="text-center mt-1 mb-1 d-flex justify-content-center">
              <b>{t("相続人追加")}</b>
            </h5>
            <Button
              onClick={() => onClose?.()}
              className={Style.closeButton}
              icon={
                <Image src={close} alt="Close Icon" width={15} height={20} />
              }
            />
          </div>

          <div className={Style.searchCustomerFieldsWrapper}>
            <div className="h-100"></div>
            <div>
              <Form onSubmit={handleSubmit} setErrors={setErrors} errors={errors} isLoading={loading} showTobSubmitBtn={false}>
                <div className={FamilyMemberModalStyle.nameFieldsWrapper}>
                  <InputField
                    name="firstNameKana"
                    value={formState.firstNameKana}
                    onChange={handleInputChange}
                    label={t("firstNameKana")}
                    placeholder={t("firstNameKana")}
                    tag={t("required")}
                    validations={[{ type: "required" },{ type: "onlyKanaCharacters" }]}
                    errorText={errors["firstNameKana"]}
                  />

                  <InputField
                    name="lastNameKana"
                    value={formState.lastNameKana}
                    onChange={handleInputChange}
                    label={t("lastNameKana")}
                    placeholder={t("lastNameKana")}
                    // tag={t("required")}
                    validations={[{ type: "onlyKanaCharacters" }]}
                    // errorText={errors["lastNameKana"]}
                  />

                  <InputField
                    name="firstName"
                    value={formState.firstName}
                    onChange={handleInputChange}
                    label={t("firstName")}
                    placeholder={t("firstName")}
                  />
                  <InputField
                    name="lastName"
                    value={formState.lastName}
                    onChange={handleInputChange}
                    label={t("lastName")}
                    placeholder={t("lastName")}
                  />
                </div>
                <div className={FamilyMemberModalStyle.relationShipWrapper}>
                  <InputField
                    name="relationship"
                    value={formState.relationship}
                    onChange={handleInputChange}
                    label={t("relationship")}
                    placeholder={t("relationship")}
                  />
                </div>

                <div className={`${CustomerStyle.phoneRow} ${CustomerStyle.newPhoneRow}`}>
                  <input name="primaryContact"
                    value="phone1"
                    checked={formState.primaryContact === "phone1"}
                    onChange={handleRadioChange}
                    type="radio"
                    className={CustomerStyle.selectRadio}
                    
                  />
                  <InputField
                    name="phone1"
                    value={formState.phone1}
                    onChange={handleInputChange}
                    label={t("phone")}
                    placeholder={t("phone")}
                    onBlur={() => handlePhoneFocusOut("phone1",["phone2","phone3"])}
                  />
                  <SelectField
                    options={phoneTypeOptions}
                    name="phoneType1"
                    value={formState.phoneType1}
                    onChange={handleInputChange}
                    label={t("phoneType")}
                    placeholder={t("phoneType1")}
                  />
                  <input name="primaryContact"
                    value="phone2"
                    type="radio"
                    checked={formState.primaryContact === "phone2"}
                    onChange={handleRadioChange}
                    className={CustomerStyle.selectRadio}
                  />
                  <InputField
                    name="phone2"
                    value={formState.phone2}
                    onChange={handleInputChange}
                    label={t("phone") + 2}
                    placeholder={t("phone2")}
                    onBlur={() => handlePhoneFocusOut("phone2",["phone1","phone3"])}
                  />
                  <SelectField
                    name="phoneType2"
                    options={phoneTypeOptions}
                    value={formState.phoneType2}
                    onChange={handleInputChange}
                    label={t("phoneType") + 2}
                    placeholder={t("phoneType2")}
                  />
                  <input name="primaryContact"
                    value="phone3"
                    checked={formState.primaryContact === "phone3"}
                    onChange={handleRadioChange}
                    type="radio"
                    className={CustomerStyle.selectRadio}
                  />
                  <InputField
                    name="phone3"
                    value={formState.phone3}
                    onChange={handleInputChange}
                    label={t("phone3")}
                    placeholder={t("phone3")}
                    onBlur={() => handlePhoneFocusOut("phone3",["phone1","phone2"])}
                  />
                  <SelectField
                    name="phoneType3"
                    value={formState.phoneType3}
                    options={phoneTypeOptions}
                    onChange={handleInputChange}
                    label={t("phoneType") + 3}
                    placeholder={t("phoneType3")}
                  />
                </div>

                <div className={`${CustomerStyle.emailRow} ${CustomerStyle.newEmailRow}`}>
                  <input name="primaryContact"
                    value="email1"
                    checked={formState.primaryContact === "email1"}
                    onChange={handleRadioChange}
                    type="radio"
                    className={CustomerStyle.selectRadio}
                  />
                  <InputField
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    label={t("email")}
                    placeholder={t("email")}
                    onBlur={() => handleEmailFocusOut("email",["email2"])}  
                  />
                  <input name="primaryContact"
                    value="email2"
                    checked={formState.primaryContact === "email2"}
                    onChange={handleRadioChange}
                    type="radio"
                    className={CustomerStyle.selectRadio}
                  />
                  <InputField
                    name="email2"
                    value={formState.email2}
                    onChange={handleInputChange}
                    label={t("email") + 2}
                    placeholder={t("email") + 2}
                    onBlur={() => handleEmailFocusOut("email2",["email"])}  
                  />
                </div>
                <div className={FamilyMemberModalStyle.postCodeRow}>
                  <InputField
                    name="postCode"
                    value={formState.postCode}
                    onChange={handleInputChange}
                    label={t("postCode")}
                    placeholder={t("postCode")}
                  />

                  <SelectField
                    name="prefecture"
                    value={formState.prefecture}
                    onChange={handleInputChange}
                    label={t("prefectures")}
                    placeholder={t("prefectures")}
                    options={prefectures}
                  />

                  <InputField
                    name="postAddress"
                    value={formState.postAddress}
                    onChange={handleInputChange}
                    label={t("address")}
                    placeholder={t("address")}
                    id="modalAddress"
                  />
                </div>
              </Form>
              {/* <GenericForm
              fields={fields}
              onSubmit={handleSubmit}
              buttonClassName={Style.CustomerSrchBtn}
              showResetButton={true}
              onReset={handleFormReset}
              showResetLabel="reset"
              ResetBtnClassName={Style.CustomerSrchResetBtn}
              submitButtonLabel={`${t("search")}`}
              isLoading={loading}
              parentClassName={FamilyMemberModalStyle.addFamilyMemberModalFormWrapper}
            ></GenericForm> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFamilyMemberModal;
