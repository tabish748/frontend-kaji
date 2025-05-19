import React, { useEffect, useState, useRef } from "react";
import Style from "../../styles/pages/customer-create.module.scss";
import { useLanguage } from "../../localization/LocalContext";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import { useDispatch, useSelector } from "react-redux";
import Toast from "@/components/toast/toast";
import { AppDispatch, RootState } from "../../app/store";
import { useRouter } from "next/router";
import settingStyles from "../../styles/pages/settings.module.scss";
import { Form } from "../form/form";
import Pagination from "../pagination/pagination";
import InputDateField from "../input-date/input-date";
import InputField from "../input-field/input-field";
import ToggleButton from "../toggle-button/toggle-button";
import SelectField from "../select-field/select-field";
import HeadingRow from "../heading-row/heading-row";
import {
  monthOptions,
  dayOptions,
  yearOptions,
  genderOptions,
  phoneTypeOptions,
  spouseOptions,
  handiCappedOptions,
} from "@/libs/optionsHandling";
import { fetchInsuranceDropdowns } from "@/app/features/insurance/insuranceDropdownSlice";
import RadioField from "../radio-field/radio-field";
import CustomSelectField from "../custom-select/custom-select";
import TextAreaField from "../text-area/text-area";
import { fetchPrefectures } from "@/app/features/generals/getPrefecturesSlice";
import { createCustomer } from "@/app/features/customers/customerCreateSlice";
import {
  fetchCustomerById,
  resetCustomerDetail,
} from "@/app/features/customers/getCustomerByIdSlice";
import { getParamValue, handleNoRecordFound } from "@/libs/utils";
import {
  updateCustomer,
  resetCustomerUpdateState,
} from "@/app/features/customers/customerUpdateSlice";
import FamilyCreateTab from "./family-create";
import { usePostCodeLookup } from "@/hooks/postCodeHook/postCodeHook";
import CheckboxField from "../checkbox-field/checkbox-field";
import { useCheckEmailExist } from "@/hooks/postCodeHook/isEmailExistHook/isEmailExistHook";
import { useCheckPhoneExist } from "@/hooks/postCodeHook/isPhoneExistHook/isPhoneExistHook";
import ConfirmationBox from "../confirmation-box/confirmation-box";
import { deleteCustomerById, resetCustomerDeleteStatus } from "@/app/features/customers/deleteCustomerByIdSlice";
import FullscreenLoader from "../loader/loader";


type ToastState = {
  message: string | string[];
  type: string;
};

export default function CustomerUpdateTab() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formState, setFormState] = useState<any>({
    familyCode: "",
    personalCode: "",
    lastNameKana: "",
    firstNameKana: "",
    lastName: "",
    firstName: "",
    isCustomer: "0",
    isRepresentative: "0",
    isDied: "0",
    isHandicapped: "0",
    year: "",
    month: "",
    day: "",
    age: "",
    actualAge: "",
    gender: "1",
    phone1: "",
    phone2: "",
    phone3: "",
    phoneType1: "",
    phoneType2: "",
    phoneType3: "",
    email1: "",
    email2: "",
    postCode: "",
    prefectures: "",
    newsletter: "",
    address: "",
    remarks: "",
    relationship: "",
    spouse: "1",
    estimatedRelationshipDecedent: "",
    estimatedHeirNumber: "",
    handiCapped: [],
    primaryContact: "phone1",
    customerId: "",
  });
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [showMainDelConfirmBox, setShowMainDelConfirmBox] = useState(false)
  const { prefCode: prefCodeApi, address: addressApi, resetPostCodeData } = usePostCodeLookup(
    formState.postCode
  );
  const [errors, setErrors] = useState<any>([]);
  const [tostMessage, setToastMessage] = useState('');
  const [type, setType] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (prefCodeApi || addressApi) {

      if (!formState.address) {
      setFormState((prevState: { prefectures: any; address: any; }) => ({
        ...prevState,
        prefectures: prefCodeApi || prevState.prefectures,
        address: addressApi || prevState.address,
      }));

      const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement;
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
      const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement;
      if (addressInput) {
        addressInput.focus();
        const length = addressInput.value.length;
        addressInput.setSelectionRange(length, length);
      }
    }
    resetPostCodeData();
    }
  }, [prefCodeApi, addressApi]);
  const [isAddressManuallyEdited, setIsAddressManuallyEdited] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchInsuranceDropdowns());
    
  }, [dispatch]);

  const { customer: customerDetail, loading: customerDetailLoading, success: showSuccess } = useSelector(
    (state: RootState) => state.customerDetail
  );
  const { ageOptions, newsletter: newsletterOpt, success: dropdownSuccess, loading: dropdownLoading } = useSelector(
    (state: RootState) => state.insuranceDropdown
  );
  const prefecturesOptions = useSelector(
    (state: RootState) => state.prefectures.prefectures
  );

  const { message: deleteMessage, success: deleteSuccess, loading: deleteLoading, errorMessages: deleteErrorMessages } = useSelector(
    (state: RootState) => state.deleteCustomer
  );

  useEffect(() => {
    if (dropdownSuccess) {
      const id = getParamValue("id");
      const familyCode = getParamValue("familyCode");
  
      if (id !== null && familyCode !== null) {
        dispatch(fetchCustomerById({ id, familyCode }));
        
        dispatch(fetchPrefectures());
      } else {
        console.error("Missing required parameters: id and familyCode");
      }
    }
  }, [dropdownSuccess]);


  const {
    loading: updateLoading,
    successMessages,
    errorMessages,
    success,
  } = useSelector((state: RootState) => state.customerUpdate);

  useEffect(() => {
    if (deleteSuccess === true) {
      setToast({
        message: deleteMessage || "Deleted successfully!",
        type: "success",
      });
      router.push('/customer');
    } else if (deleteErrorMessages && deleteErrorMessages.length > 0) {
      setToast({
        message: deleteErrorMessages,
        type: "fail",
      });
    }
    dispatch(resetCustomerDeleteStatus());
  }, [dispatch, deleteSuccess, deleteErrorMessages, deleteMessage, router]);


  useEffect(() => {
    if (success === true) {
      setToast({
        message: successMessages || "Customer updated successfully!",
        type: "success",
      });
      dispatch(resetCustomerUpdateState());
    } else if (errorMessages && errorMessages.length > 0) {
      setToast({
        message: errorMessages,
        type: "fail",
      });
      dispatch(resetCustomerUpdateState());
    }
  }, [dispatch, success, errorMessages, successMessages]);

  useEffect(() => {
    if (customerDetail) {
 
      setFormState((prevState: any) => ({
        ...prevState,
        familyCode:
          customerDetail.family_code !== null ? customerDetail.family_code : "",
        personalCode:
          customerDetail.personal_code !== null
            ? customerDetail.personal_code
            : "",
        isRepresentative:
          customerDetail.is_representative !== null
            ? String(customerDetail.is_representative)
            : "",
        isHandicapped:
          customerDetail.is_handicapped !== null
            ? String(customerDetail.is_handicapped)
            : "0",
        newsletter:
          customerDetail.newsletter !== null
            ? String(customerDetail.newsletter)
            : "",
        isDied:
          customerDetail.is_died !== null ? String(customerDetail.is_died) : "",
        gender:
          customerDetail.gender !== null ? String(customerDetail.gender) : "",
        // age: customerDetail.age !== null ? String(customerDetail.age) : "",
        actualAge:
          customerDetail.actual_age !== null
            ? String(customerDetail.actual_age)
            : "",
        phone1:
          customerDetail.phone1 !== null ? String(customerDetail.phone1) : "",
        phoneType1:
          customerDetail.phone_type1 !== null
            ? String(customerDetail.phone_type1)
            : "",
        phone2:
          customerDetail.phone2 !== null ? String(customerDetail.phone2) : "",
        phoneType2:
          customerDetail.phone_type2 !== null
            ? String(customerDetail.phone_type2)
            : "",
        phone3:
          customerDetail.phone3 !== null ? String(customerDetail.phone3) : "",
        phoneType3:
          customerDetail.phone_type3 !== null
            ? String(customerDetail.phone_type3)
            : "",
        email1:
          customerDetail.email !== null ? String(customerDetail.email) : "",
        email2:
          customerDetail.email2 !== null ? String(customerDetail.email2) : "",
        postCode:
          customerDetail.zipcode !== null ? String(customerDetail.zipcode) : "",
        prefectures:
          customerDetail.prefecture_id !== null
            ? String(customerDetail.prefecture_id)
            : "",
        address: customerDetail.address !== null ? customerDetail.address : "",
        year: customerDetail.year !== null ? customerDetail.year : "",
        month: customerDetail.month !== null ? customerDetail.month : "",
        day: customerDetail.day !== null ? customerDetail.day : "",
        firstNameKana:
          customerDetail.first_name_kana !== null
            ? customerDetail.first_name_kana
            : "",
        firstName:
          customerDetail.first_name !== null ? customerDetail.first_name : "",
        lastNameKana:
          customerDetail.last_name_kana !== null
            ? customerDetail.last_name_kana
            : "",
        lastName:
          customerDetail.last_name !== null ? customerDetail.last_name : "",
        remarks:
          customerDetail.cust_remarks !== null
            ? customerDetail.cust_remarks
            : "",
        relationship:
          customerDetail.relation !== null
            ? String(customerDetail.relation)
            : "",
        primaryContact:
          customerDetail.primary_contact !== null
            ? String(customerDetail.primary_contact) : "",
            customerId:
            customerDetail.customer_id !== null
              ? String(customerDetail.customer_id) : "",
      }));
    }
    else if (!customerDetailLoading && customerDetail === null && showSuccess) {
      handleNoRecordFound(router, setToastMessage, setType, '/customer');
    }
  }, [customerDetail, customerDetailLoading, showSuccess]);

  useEffect(() => {
    return () => {
      dispatch(resetCustomerDetail());
    };
  }, [dispatch]);


  const handleFormSubmit = () => {
    const updateData = {
      first_name: formState.firstName,
      last_name: formState.lastName,
      first_name_kana: formState.firstNameKana,
      last_name_kana: formState.lastNameKana,
      cust_email: formState.email1,
      cust_email2: formState.email2,
      cust_gender: formState.gender,
      cust_year: formState.year,
      cust_month: formState.month,
      cust_day: formState.day,
      cust_newsletter: formState.newsletter,
      // cust_age: formState.age,
      cust_actual_age: formState.actualAge,
      cust_zipcode: formState.postCode,
      cust_prefecture_id: formState.prefectures,
      cust_address: formState.address,
      phone_type1: formState.phoneType1,
      phone1: formState.phone1,
      phone_type2: formState.phoneType2,
      phone2: formState.phone2,
      phone_type3: formState.phoneType3,
      phone3: formState.phone3,
      cust_remarks: formState.remarks,
      is_representative: formState.isRepresentative,
      is_handicapped: formState.isHandicapped,
      is_died: formState.isDied,
      relation: formState.relationship,
      newsletter: formState.newsletter,
      primary_contact: formState.primaryContact,
    };
    const customerId = Number(getParamValue("id"));
    if (!isNaN(customerId))
      dispatch(updateCustomer({ id: customerId, updateData }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let newFormState = { ...formState, [name]: value };

    if (name === "address" || name === "postCode") {
      setIsAddressManuallyEdited(true);
    }

    const currentYear = new Date().getFullYear();

    if (name === "year" && value) {
      // When the year changes, calculate and update the age
      const age = currentYear - parseInt(value, 10);
      newFormState.actualAge = isNaN(age) ? "" : age.toString();
    } else if (name === "actualAge" && value) {
      // When the actual age is entered, calculate and update the year
      const year = currentYear - parseInt(value, 10);
      newFormState.year = isNaN(year) ? "" : year.toString();
    }

    setFormState(newFormState);
  };
  const handleToggleStateChange = (isOn: boolean) => {
    setFormState((prevState: any) => ({
      ...prevState,
      isCustomer: isOn ? "1" : "0",
    }));
  };
  useEffect(() => {
    if (formState.year && formState.month && formState.day) {
      const birthDate = new Date(
        Number(formState.year),
        Number(formState.month) - 1, // JS months are 0-based
        Number(formState.day)
      );
      const age = calculateAge(birthDate);
      const ageRange = determineAgeRange(age);
      setFormState((prevState: any) => ({
        ...prevState,
        age: ageRange.toString(),
      }));
    }
  }, [formState.year, formState.month, formState.day]);
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const determineAgeRange = (age: number): number => {
    if (age < 10) return 0;
    else if (age < 20) return 1;
    else if (age < 30) return 2;
    else if (age < 40) return 3;
    else if (age < 50) return 4;
    else if (age < 60) return 5;
    else if (age < 70) return 6;
    else if (age < 80) return 7;
    else if (age < 90) return 8;
    else if (age < 100) return 9;
    else return 10;
  };

  const handleCheckboxChange = (values: string[]) => {
    setFormState((prevState: any) => ({
      ...prevState,
      handiCapped: values,
    }));
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetCustomerUpdateState());
  };
  console.log('isAddressManuallyEdited',isAddressManuallyEdited)
  const { checkEmail, exists, message, errorMessages: isEmailExistsErrorMessages, resetCheckEmail } = useCheckEmailExist();

  useEffect(() => {
    if (exists === true) {
      setToast({
        message: message || "",
        type: "success",
      });
    } else if (isEmailExistsErrorMessages && isEmailExistsErrorMessages.length > 0) {
      setToast({
        message: isEmailExistsErrorMessages,
        type: "fail",
      });
    }
    resetCheckEmail
  }, [exists, isEmailExistsErrorMessages, message])

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
    const otherEmails = otherEmailFields.map(field => formState[field as keyof any]);
    if (email && typeof email === "string" && !otherEmails.includes(email)) {
      checkEmail(String(formState.customerId), email, "customer");
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
      checkPhone(String(formState.customerId), phone, "customer");
    } else if(phone && otherPhones.includes(phone)) {
      setToast({
        message: [t('duplicatePhoneError')],
        type: "fail",
      });
    }
  };

  const handleMainDeleteClick = () => {
    const id = getParamValue('id');
    const familyCode = getParamValue('familyCode');
    if (id != null && familyCode != null) {
      dispatch(deleteCustomerById({ customerId: Number(id), familyCode: familyCode }))
    }
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ["1", "99", "2"];
      if (!allowedRoles.includes(loggedInUserRole)) setIsAuthenticated(false);
      else setIsAuthenticated(true);
    }

  }, []);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState: any) => ({
      ...prevState,
      primaryContact: e.target.value
    }));
  };

  useEffect(() => {
    if(customerDetail?.zipcode)
    setIsAddressManuallyEdited(false);
  }, [customerDetail]);

  return (
    <>
      {tostMessage && <Toast message={tostMessage} type={type} onClose={() => setToastMessage('')} />}

      {
        customerDetailLoading && <FullscreenLoader />
      }
      {dropdownLoading && <FullscreenLoader />}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      <div className={Style.customerContentWrapper}>
        <Form onSubmit={handleFormSubmit} isLoading={updateLoading} setErrors={setErrors} errors={errors} showDeleteButton={isAuthenticated ? true : false} deleteButtonLoading={deleteLoading} onClickDeleteButton={() => setShowMainDelConfirmBox(true)}   disabledSubmitForm={toast.message == '顧客情報が更新されました。' && toast.type == 'success' ? true :false}>
          <HeadingRow headingTitle={t("representativeInformation")} />
          <div className={"d-flex gap-1"}>
            <InputField
              name="familyCode"
              value={formState.familyCode}
              onChange={handleInputChange}
              label={t("familyCode")}
              placeholder={t("familyCode")}
              readOnly={true}
            />

            <InputField
              name="personalCode"
              value={formState.personalCode}
              label={t("personalCode")}
              placeholder={t("personalCode")}
              onChange={handleInputChange}
              readOnly={true}
            />
          </div>
          <hr />

          <div className={Style.introFieldsWrapper}>
            <InputField
              name="firstNameKana"
              value={formState.firstNameKana}
              label={t("firstNameKana")}
              placeholder={t("firstNameKana")}
              onChange={handleInputChange}
              tag={t("required")}
              validations={[{ type: "required" },{ type: "onlyKanaCharacters" }]}
              errorText={errors["firstNameKana"]}
            />
            <InputField
              name="lastNameKana"
              value={formState.lastNameKana}
              label={t("lastNameKana")}
              placeholder={t("lastNameKana")}
              onChange={handleInputChange}
              // tag={t("required")}
              validations={[{ type: "onlyKanaCharacters" }]}
              // errorText={errors["lastNameKana"]}
            />
            <ToggleButton
              value={formState.isDied === "1"}
              label={t("deathOccur")}
              options={{
                on: `${t("died")}`,
                off: `${t("alive")}`,
              }}
              getSelectedOption={(isOn) => {
                setFormState((prevState: any) => ({
                  ...prevState,
                  isDied: isOn ? "1" : "0",
                }));
              }}
              hideSelectedText={false}
            />
            {/* <ToggleButton
              value={formState.isRepresentative === "1"}
              label={t("representative")}
              options={{
                on: `${t("representative")}`,
                off: `${t("representative")}`,
              }}
              getSelectedOption={(isOn) => {
                setFormState((prevState) => ({
                  ...prevState,
                  isRepresentative: isOn ? "1" : "0",
                }));
              }}
              hideSelectedText={true}
            /> */}
            {/* <span></span> */}
            <span></span>
            <InputField
              name="firstName"
              value={formState.firstName}
              label={t("firstName")}
              placeholder={t("firstName")}
              onChange={handleInputChange}
              tag={t("required")}
              validations={[{ type: "required" }]}
              errorText={errors["firstName"]}
            />
            <InputField
              name="lastName"
              value={formState.lastName}
              label={t("lastName")}
              placeholder={t("lastName")}
              onChange={handleInputChange}
              // tag={t("required")}
              // validations={[{ type: "required" }]}
              // errorText={errors["lastName"]}
            />

            <ToggleButton
              value={formState.isHandicapped === "1"}
              label={t("isHandicapped")}
              options={{
                on: `${t("障害者")}`,
                off: `${t("健常者")}`,
              }}
              getSelectedOption={(isOn) => {
                setFormState((prevState: any) => ({
                  ...prevState,
                  isHandicapped: isOn ? "1" : "0",
                }));
              }}
              hideSelectedText={false}
            />
            {/* <CustomSelectField
                name="newsLetter"
                label={t("newsLetter")}
                // options={formDropdowns.newsletter}
                // value={formState.familyMember.newsLetter}
                // onChange={}
                className={Style.inquiryNewsletterDropdown}
                // disabled={fieldsReadOnly}
              /> */}
          </div>
          <div className={Style.customerDobSection}>
            <div className="w-100">
              <div className={Style.customerDobContainer} style={{ maxWidth: "100%" }}>
                <div className={Style.dobField}>
                  <SelectField
                    name="year"
                    label={t("birthday")}
                    value={formState.year}
                    options={yearOptions}
                    placeholder={t("year")}
                    onChange={handleInputChange}
                  />
                </div>
                <span>{t("year")}</span>
                <div className={Style.dobField}>
                  <SelectField
                    name="month"
                    value={formState.month}
                    options={monthOptions}
                    placeholder={t("month")}
                    onChange={handleInputChange}
                  />
                </div>
                <span>{t("month")}</span>
                <div className={Style.dobField}>
                  <SelectField
                    name="day"
                    value={formState.day}
                    options={dayOptions}
                    placeholder={t("day")}
                    onChange={handleInputChange}
                  />
                </div>
                <span>{t("day")}</span>
                <div className={Style.dobField}>
                  <InputField
                    name="actualAge"
                    value={formState.actualAge}
                    onChange={handleInputChange}
                    placeholder={t("actualAge")}
                    className={Style.actualAgeField}
                  />
                </div>
                <span>{t("currentAge")}</span>
                <div className={Style.dobField}>
                  <InputField
                    name="relationship"
                    label={t("relationship")}
                    value={formState.relationship}
                    onChange={handleInputChange}
                    placeholder={t("relationship")}
                  />
                </div>
                <div className={Style.dobField}>
                  <RadioField
                    name="gender"
                    selectedValue={formState.gender}
                    onChange={handleInputChange}
                    label={t("gender")}
                    options={genderOptions}
                    className="mb-2"
                  />
                </div>
                <div className={Style.dobField}>
                  <CustomSelectField
                    name="newsletter"
                    label={t("newsLetter")}
                    options={newsletterOpt}
                    value={formState.newsletter}
                    onChange={(e) => {
                      setFormState((prevState: any) => ({
                        ...prevState,
                        newsletter: e.target.value,
                      }));
                    }}
                    // disabled={fieldsReadOnly}
                    className="mb-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`${Style.phoneRow} ${Style.newPhoneRow}`}>
            <input name="primaryContact"
              value="phone1"
              checked={formState.primaryContact === "phone1"}
              onChange={handleRadioChange}
              type="radio"
              className={Style.selectRadio}
            />
            <InputField
              name="phone1"
              value={formState.phone1}
              label={t("phone")}
              placeholder={t("phone")}
              onChange={handleInputChange}
              onBlur={() => handlePhoneFocusOut("phone1",["phone2","phone3"])}
            />

            <SelectField
              label={t("phoneType")}
              options={phoneTypeOptions}
              value={formState.phoneType1}
              onChange={(e) =>
                setFormState((prevState: any) => ({
                  ...prevState,
                  phoneType1: e.target.value,
                }))
              }
              placeholder={t("phoneType") + 1}
              className={Style.insuranceDropdownSelect}
            />
            <input name="primaryContact"
              value="phone2"
              checked={formState.primaryContact === "phone2"}
              onChange={handleRadioChange}
              type="radio"
              className={Style.selectRadio}
            />
            <InputField
              name="phone2"
              value={formState.phone2}
              label={t("phone") + 2}
              placeholder={t("phone") + 2}
              onChange={handleInputChange}
              onBlur={() => handlePhoneFocusOut("phone2",["phone1","phone3"])}
            />
            <SelectField
              label={t("phoneType") + 2}
              options={phoneTypeOptions}
              value={formState.phoneType2}
              onChange={(e) =>
                setFormState((prevState: any) => ({
                  ...prevState,
                  phoneType2: e.target.value,
                }))
              }
              placeholder={t("phoneType") + 2}
              className={Style.insuranceDropdownSelect}
            />
            <input name="primaryContact"
              value="phone3"
              checked={formState.primaryContact === "phone3"}
              onChange={handleRadioChange}
              type="radio"
              className={Style.selectRadio}
            />
            <InputField
              name="phone3"
              value={formState.phone3}
              label={t("phone") + 3}
              placeholder={t("phone") + 3}
              onChange={handleInputChange}
              onBlur={() => handlePhoneFocusOut("phone3",["phone1","phone2"])}
            />

            <SelectField
              name="phoneType3"
              label={t("phoneType") + 3}
              options={phoneTypeOptions}
              value={formState.phoneType3}
              onChange={(e) =>
                setFormState((prevState: any) => ({
                  ...prevState,
                  phoneType3: e.target.value,
                }))
              }
              placeholder={t("phoneType") + 3}
              className={Style.insuranceDropdownSelect}
            />
          </div>
          <div className={`${Style.emailRow} ${Style.newEmailRow}`}>
            <input name="primaryContact"
              value="email1"
              checked={formState.primaryContact === "email1"}
              onChange={handleRadioChange}
              type="radio"
              className={Style.selectRadio}
            />
            <InputField
              name="email1"
              value={formState.email1}
              label={t("email")}
              placeholder={t("email")}
              onChange={handleInputChange}
              onBlur={() => handleEmailFocusOut("email1",["email2"])}  
            />
            <input name="primaryContact"
              value="email2"
              checked={formState.primaryContact === "email2"}
              onChange={handleRadioChange}
              type="radio"
              className={Style.selectRadio}
            />
            <InputField
              name="email2"
              value={formState.email2}
              label={t("email") + 2}
              placeholder={t("email") + 2}
              onChange={handleInputChange}
              onBlur={() => handleEmailFocusOut("email2",["email1"])}  
            />
          </div>

          <div className={Style.familyAddressRow}>
            <InputField
              name="postCode"
              value={formState.postCode}
              label={t("postCode")}
              placeholder={t("postCode")}
              onChange={handleInputChange}
            />
            <SelectField
              name="prefectures"
              options={prefecturesOptions}
              value={formState.prefectures}
              label={t("prefectures")}
              placeholder={t("prefectures")}
              onChange={handleInputChange}
            />
            <InputField
              name="address"
              value={
                isAddressManuallyEdited
                  ? formState.address
                  : customerDetail?.address || ""
              }
              // value={formState.address}
              label={t("address")}
              placeholder={t("address")}
              onChange={handleInputChange}
            />
          </div>

          <HeadingRow headingTitle={t("remarks")} />
          <TextAreaField
            // label={t("remarks")}
            name="remarks"
            value={formState.remarks}
            placeholder={t("remarks")}
            className="mt-2"
            onChange={handleInputChange}
            style={{
              minHeight: '150px'
            }}
            rows={5}
            cols={50}
          />
        </Form>
      </div>

      {showMainDelConfirmBox && (
        <ConfirmationBox
          isOpen={showMainDelConfirmBox}
          title={`${t("areYouSureWantToDeleteCustomer")}`}
          onConfirm={() => {
            handleMainDeleteClick();
            setShowMainDelConfirmBox(false)
          }}
          onCancel={() => setShowMainDelConfirmBox(false)}
        />
      )}
    </>
  );
}
