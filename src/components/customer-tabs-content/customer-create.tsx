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
import CheckboxField from "@/components/checkbox-field/checkbox-field";
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
import { resetCustomerCreateState } from "@/app/features/customers/customerCreateSlice";
import { usePostCodeLookup } from "@/hooks/postCodeHook/postCodeHook";
import { fetchInquiryFormDropdowns } from "@/app/features/generals/getInquiryCreateDropdownSlice";

type ToastState = {
  message: string | string[];
  type: string;
};
interface FamilyMember{
  newsLetter: any;
}
interface Customer{
  newsLetter: string;
} 
type DropdownOption = {
  label: string;
  value: string;
};

interface FormDropdownsType {
  
  newsletter: DropdownOption[];
 
}


export default function CustomerCreateTab() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formState, setFormState] = useState({
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
    address: "",
    remarks: "",
    relationship: "",
    spouse: "1",
    estimatedRelationshipDecedent: "",
    estimatedHeirNumber: "",
    handiCapped: [],
    familyMember:{
      newsLetter: "",
    }
  });
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });

  const { prefCode: prefCodeApi, address: addressApi } = usePostCodeLookup(
    formState.postCode,
    
  );

  
  useEffect(() => {
    if (prefCodeApi || addressApi) {
      setFormState((prevState) => ({
        ...prevState,
        prefectures: prefCodeApi || prevState.prefectures,
        address: addressApi || prevState.address,
      }));
    }
  }, [prefCodeApi, addressApi]);

  const [formDropdowns, setFormDropdowns] = useState<FormDropdownsType>({
    newsletter: [],
    
  });

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchInsuranceDropdowns());
    dispatch(fetchPrefectures());
    dispatch(resetCustomerCreateState());
    setToast({ message: "", type: "" });
  }, [dispatch]);

  const { ageOptions } = useSelector(
    (state: RootState) => state.insuranceDropdown
  );
  const prefecturesOptions = useSelector(
    (state: RootState) => state.prefectures.prefectures
  );
  const {
    status,
    message,
    loading,
    errorMessages,
    error,
    data: customerData,
  } = useSelector((state: RootState) => state.customerCreate);

  useEffect(() => {
    if (status === true) {
      setToast({
        message: message || "Customer created successfully!",
        type: "success",
      });
      const toastTimeout = setTimeout(() => {
        dispatch(resetCustomerCreateState());
        // router.push(
        //   `/customer/update?id=${customerData.id}&familyCode=${customerData.family_code}`
        // );
      }, 1000);
    }
  }, [status]);

  useEffect(() => {
    if (error == true) {
      if (errorMessages && errorMessages.length > 0) {
        setToast({
          message: errorMessages,
          type: "fail",
        });
      }
    } else {
      setToast({
        message: errorMessages,
        type: "fail",
      });
    }
  }, [error, errorMessages]);

  const handleFormSubmit = () => {
    
    const payload = {
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
      is_died: formState.isDied,
      relation: formState.relationship,
      family_member:{
        newsletter: formState.familyMember.newsLetter,
      }
    };
    dispatch(createCustomer(payload as any));
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let newFormState = { ...formState, [name]: value };

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
    setFormState((prevState) => ({
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

      setFormState((prevState) => ({
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
  const handleClostToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetCustomerCreateState());
  };

  const dropdownData = useSelector(
    (state: RootState) => state.inquiryCreateDropdowns
  );
  useEffect(() => {
    if (dropdownData)
      setFormDropdowns(dropdownData.inquiryFormDropdowns as any);
  }, [dropdownData]);

  useEffect(() => {
    dispatch(fetchInsuranceDropdowns());
    dispatch(fetchInquiryFormDropdowns());
  }, []);

  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleClostToast}
        />
      )}
      <div className={Style.customerContentWrapper}>
        <Form onSubmit={handleFormSubmit} isLoading={loading}>
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
            />
            <InputField
              name="lastNameKana"
              value={formState.lastNameKana}
              label={t("lastNameKana")}
              placeholder={t("lastNameKana")}
              onChange={handleInputChange}
              tag={t("required")}
            />
            <ToggleButton
              value={formState.isDied === "1"}
              label={t("deathOccur")}
              options={{
                on: `${t("died")}`,
                off: `${t("alive")}`,
              }}
              getSelectedOption={(isOn) => {
                setFormState((prevState) => ({
                  ...prevState,
                  isDied: isOn ? "1" : "0",
                }));
              }}
              hideSelectedText={false}
            />
            <span></span>
            <InputField
              name="firstName"
              value={formState.firstName}
              label={t("firstName")}
              placeholder={t("firstName")}
              onChange={handleInputChange}
              tag={t("required")}
            />
            <InputField
              name="lastName"
              value={formState.lastName}
              label={t("lastName")}
              placeholder={t("lastName")}
              onChange={handleInputChange}
              tag={t("required")}
            />
            <ToggleButton
              value={formState.isHandicapped === "1"}
              label={t("isHandicapped")}
              options={{
                on: `${t("isHandicapped")}`,
                off: `${t("isHandicapped")}`,
              }}
              getSelectedOption={(isOn) => {
                setFormState((prevState) => ({
                  ...prevState,
                  isHandicapped: isOn ? "1" : "0",
                }));
              }}
              hideSelectedText={true}
            />
          </div>
          <div
            className={Style.customerDobSection}
            style={{ maxWidth: "unset" }}
          >
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
                {/* <div className={Style.dobField}>
                  <SelectField
                    name="age"
                    value={formState.age}
                    options={ageOptions}
                    onChange={handleInputChange}
                    placeholder={t("age")}
                  />
                </div>
                <span>{t("age")}</span> */}
                <div className={Style.dobField}>
                  <InputField
                    name="actualAge"
                    value={formState.actualAge}
                    onChange={handleInputChange}
                    placeholder={t("actualAge")}
                  />
                </div>
                <span>{t("currentAge")}</span>
                <InputField
                  name="relationship"
                  label={t("relationship")}
                  value={formState.relationship}
                  onChange={handleInputChange}
                  placeholder={t("relationship")}
                />
                <div className={`${Style.dobField} mb-2`}>
                  <p>{t("gender")}</p>
                  <div className={Style.customerDobContainer}>
                    <RadioField
                      name="gender"
                      selectedValue={formState.gender}
                      onChange={handleInputChange}
                      // label={t("gender")}
                      options={genderOptions}
                      className={Style.genderRadio}
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="newsLetter"
                  label={t("newsLetter")}
                  options={formDropdowns.newsletter}
                  value={formState.familyMember.newsLetter}
                  // onChange={(e) => {
                  //   setFormState((prevState) => ({
                  //     ...prevState,
                  //     familyMember: {
                  //       ...prevState.familyMember,
                  //       newsLetter: e.target.value,
                  //     },
                  //   }));
                  // }}
                  // disabled={fieldsReadOnly}
                  className="mb-2"
                />
              </div>
            </div>
          </div>

          <div className={Style.phoneRow}>
            <InputField
              name="phone1"
              value={formState.phone1}
              label={t("phone")}
              placeholder={t("phone")}
              onChange={handleInputChange}
            />

            <SelectField
              label={t("phoneType")}
              options={phoneTypeOptions}
              value={formState.phoneType1}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  phoneType1: e.target.value,
                }))
              }
              placeholder={t("phoneType") + 1}
              className={Style.insuranceDropdownSelect}
            />
            <InputField
              name="phone2"
              value={formState.phone2}
              label={t("phone") + 2}
              placeholder={t("phone") + 2}
              onChange={handleInputChange}
            />

            <SelectField
              label={t("phoneType") + 2}
              options={phoneTypeOptions}
              value={formState.phoneType2}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  phoneType2: e.target.value,
                }))
              }
              placeholder={t("phoneType") + 2}
              className={Style.insuranceDropdownSelect}
            />
            <InputField
              name="phone3"
              value={formState.phone3}
              label={t("phone") + 3}
              placeholder={t("phone") + 3}
              onChange={handleInputChange}
            />

            <SelectField
              name="phoneType3"
              label={t("phoneType") + 3}
              options={phoneTypeOptions}
              value={formState.phoneType3}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  phoneType3: e.target.value,
                }))
              }
              placeholder={t("phoneType") + 3}
              className={Style.insuranceDropdownSelect}
            />
          </div>
          <div className={Style.emailRow}>
            <InputField
              name="email1"
              value={formState.email1}
              label={t("email")}
              placeholder={t("email")}
              onChange={handleInputChange}
            />
            <InputField
              name="email2"
              value={formState.email2}
              label={t("email") + 2}
              placeholder={t("email") + 2}
              onChange={handleInputChange}
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
              value={formState.address}
              label={t("address")}
              placeholder={t("address")}
              onChange={handleInputChange}
            />
          </div>

          <HeadingRow headingTitle={t("familyStructure")} />

          <div className={`${Style.customerFamilyContainer} mb-1`}>
            <InputField
              name="estimatedRelationshipDecedent"
              label={t("estimatedRelationshipDecedent")}
              value={formState.estimatedRelationshipDecedent}
              placeholder={t("estimatedRelationshipDecedent")}
              className={Style.customSelectFields}
            />
            <CustomSelectField
              name="estimatedHeirNumber"
              label={t("estimatedHeirNumber")}
              value={formState.estimatedHeirNumber}
              options={monthOptions}
              placeholder={t("estimatedHeirNumber")}
              className={Style.customSelectFields}
            />
            <RadioField
              name="spouse"
              label={t("spouse")}
              selectedValue={formState.spouse}
              onChange={handleInputChange}
              options={spouseOptions}
              className={Style.genderRadio}
            />
            <CheckboxField
              name="handiCapped"
              options={handiCappedOptions}
              selectedValues={formState.handiCapped}
              onChange={handleCheckboxChange}
              className={`mt-3 ${Style.userTypeCheckbox}`}
            />
          </div>
          <HeadingRow headingTitle={t("remarks")} />
          <TextAreaField
            name="remarks"
            value={formState.remarks}
            placeholder={t("remarks")}
            className="mt-2"
            onChange={handleInputChange}
            rows={5}
            cols={50}
          />
        </Form>
      </div>
    </>
  );
}
