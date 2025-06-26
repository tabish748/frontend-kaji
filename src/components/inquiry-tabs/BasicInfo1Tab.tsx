import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form } from "../form/form";
import InputField from "../input-field/input-field";
import CustomSelectField from "../custom-select/custom-select";
import SelectField from "../select-field/select-field";
import InputDateField from "../input-date/input-date";
import TextAreaField from "../text-area/text-area";
import CheckboxField from "../checkbox-field/checkbox-field";
import RadioField from "../radio-field/radio-field";
import styles from "../../styles/components/molecules/inquiry-tab.module.scss";
import { calculateAge } from "../../libs/utils";
import ApiHandler from "../../app/api-handler";
import Button from "../button/button";
import { useLanguage } from "../../localization/LocalContext";
import { FiPaperclip } from "react-icons/fi";

const BasicInfo1Tab: React.FC = () => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    // Order Info
    orderDate: "",
    orderTime: "",
    customerStatus: "",
    
    // Inquiry Info
    customerId: "",
    fullNameKatakana: "",
    fullName: "",
    customerType: "1",
    dateOfBirth: "",
    age: "",
    gender: "1",
    phone1: "",
    phone1Type: "",
    phone2: "",
    phone2Type: "",
    phone3: "",
    phone3Type: "",
    email1: "",
    email1Type: "",
    email2: "",
    email2Type: "",
    postcode: "",
    prefecture: "",
    address1: "",
    address2: "",
    building: "",
    language: "",
    primaryPhone: "phone1",
    primaryEmail: "email1",
    advertisingEmail: "subscribe",
    preferredServices: [],
    proxyCheckIn: "required",
    matchingListHK: [],
    matchingListBS: [],
    note1: "",
    note2: "",
    note3: ""
  });

  // Mock data for train stations
  const [trainStations, setTrainStations] = useState([
    {
      date: "2024/8/22",
      railwayCompany: "JR",
      trainLine: "山手線",
      trainStation: "渋谷",
    },
    {
      date: "2024/8/22",
      railwayCompany: "JR",
      trainLine: "山手線",
      trainStation: "渋谷",
    },
  ]);

  // Mock data for key possession records
  const [keyPossessionRecords, setKeyPossessionRecords] = useState([
    {
      dateReceived: "",
      dateReturned: "",
      staffName: "",
      status: "",
      receipt: "",
    },
    {
      dateReceived: "",
      dateReturned: "",
      staffName: "",
      status: "",
      receipt: "",
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [dropdownOptions, setDropdownOptions] = useState<any>(null);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [dropdownError, setDropdownError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoadingDropdowns(true);
      setDropdownError(null);
      try {
        const res = await ApiHandler.request(
          "/api/inquiry-form-dropdowns",
          "GET"
        );
        if (res.success) {
          setDropdownOptions(res.data);
        } else {
          setDropdownError("Failed to load dropdowns");
        }
      } catch (e) {
        setDropdownError("Failed to load dropdowns");
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdowns();
  }, []);

  const handleInputChange = (name: string, value: any) => {
    // Skip updating file fields through regular onChange - they should only be updated via handleFileChange
    if (name.toLowerCase().includes('file') || name.toLowerCase().includes('upload') || name.toLowerCase().includes('attachment')) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calculate age when date of birth changes
    if (name === 'dateOfBirth' && value) {
      const age = calculateAge(value);
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  // Handle file uploads specifically
  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const removeTrainStation = (index: number) => {
    if (trainStations.length > 1) {
      const newStations = trainStations.filter((_, i) => i !== index);
      setTrainStations(newStations);
    }
  };

  const removeKeyPossessionRecord = (index: number) => {
    if (keyPossessionRecords.length > 1) {
      const newRecords = keyPossessionRecords.filter((_, i) => i !== index);
      setKeyPossessionRecords(newRecords);
    }
  };

  const handleSubmit = async () => {
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  // Helper function to generate generic options if backend options are empty
  const generateGenericOptions = (count: number = 8) => {
    return Array.from({ length: count }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Option ${i + 1}`,
    }));
  };

  // Dropdown options from backend with fallback generic options
  const customerStatusOptions =
    dropdownOptions?.customer_status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);
  
  const customerTypeOptions =
    dropdownOptions?.customer_type?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(4);

  const genderOptions =
    dropdownOptions?.gender?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const phoneTypeOptions =
    dropdownOptions?.phone_types?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const emailTypeOptions =
    dropdownOptions?.email_types?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(2);

  const prefectureOptions =
    dropdownOptions?.prefectures?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(47);

  const languageOptions =
    dropdownOptions?.language?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const advertisingEmailOptions =
    dropdownOptions?.newsletter?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(2);

  const serviceOptions =
    dropdownOptions?.services?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(6);

  const proxyCheckInOptions =
    dropdownOptions?.proxy_checkin?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(2);

  const matchingListHKOptions =
    dropdownOptions?.matching_list_hk?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(8);

  const matchingListBSOptions =
    dropdownOptions?.matching_list_bs?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(8);

  const statusOptions =
    dropdownOptions?.status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const assigneeOptions =
    dropdownOptions?.users
      ?.filter((user: any) => user.status)
      .map((item: any) => ({ value: String(item.value), label: item.label })) || generateGenericOptions(5);

  if (loadingDropdowns) return <div>{t("admin-form.loading.options")}</div>;
  if (dropdownError) return <div>{dropdownError}</div>;

  return (
    <div className="tab-content">
      <Form
        onSubmit={handleSubmit}
        registerBtnText="REGISTER"
        setErrors={setErrors}
        errors={errors}
      >
        {/* ORDER INFO Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adBasicInfo1.orderInfo")}</h3>

          <div className="row g-1">
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <div className={styles.dateTimeContainer}>
                <div className={styles.dateField}>
                  <InputDateField
                    name="orderDate"
                    label={t("admin-form.labels.orderDateTime")}
                    placeholder={t("admin-form.placeholders.date")}
                    value={formData.orderDate}
                    onChange={(e) => handleInputChange("orderDate", e.target.value)}
                  />
                </div>
                <div className={styles.timeField}>
                  <InputField
                    name="orderTime"
                    type="time"
                    value={formData.orderTime}
                    onChange={(e) => handleInputChange("orderTime", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <CustomSelectField
                name="customerStatus"
                label={t("admin-form.labels.customerStatus")}
                options={customerStatusOptions}
                value={formData.customerStatus}
                onChange={(e) => handleInputChange("customerStatus", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* INQUIRY INFO Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adBasicInfo1.inquiryInfo")}</h3>

          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3  ">
              <InputField
                name="customerId"
                label={t("admin-form.labels.customerId")}
                placeholder={t("admin-form.placeholders.customerId")}
                value={formData.customerId}
                onChange={(e) => handleInputChange("customerId", e.target.value)}
              />
            </div>
          </div>

          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3  ">
              <InputField
                name="fullNameKatakana"
                label={t("admin-form.labels.fullNameKatakana")}
                placeholder={t("admin-form.placeholders.fullNameKatakana")}
                value={formData.fullNameKatakana}
                onChange={(e) => handleInputChange("fullNameKatakana", e.target.value)}
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3  ">
              <InputField
                name="fullName"
                label={t("admin-form.labels.fullName")}
                placeholder={t("admin-form.placeholders.fullName")}
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <RadioField
                name="customerType"
                label={t("admin-form.labels.customerType")}
                options={customerTypeOptions}
                selectedValue={formData.customerType}
                onChange={(e) => handleInputChange("customerType", e.target.value)}
              />
            </div>
          </div>

          {/* Date of Birth Row */}
          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div className="d-flex gap-2 align-items-end">
                <div style={{ flex: '1' }}>
                  <InputDateField
                    name="dateOfBirth"
                    label={t("admin-form.labels.dateOfBirth")}
                    placeholder="YYYY/MM/DD"
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      handleInputChange("dateOfBirth", e.target.value);
                      handleInputChange(
                        "age",
                        e.target.value
                          ? calculateAge(e.target.value).toString()
                          : ""
                      );
                    }}
                  />
                </div>
                <div style={{ width: '80px' }}>
                  <InputField
                    name="age"
                    label={t("admin-form.labels.age")}
                    placeholder={t("admin-form.placeholders.age")}
                    value={formData.age}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <RadioField
                name="gender"
                label={t("admin-form.labels.gender")}
                options={genderOptions}
                selectedValue={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              />
            </div>
          </div>

          {/* Phone Numbers Row */}
          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className={`d-flex gap-1 align-items-center justify-content-start ${styles.phoneTypeContainer}`}>
                <div className={`d-flex align-items-end justify-content-center ${styles.phoneInputContainer} ${styles.flexOne}`}>
                  <input
                    className={`mb-1 mr-1 ${styles.borderOnlyRadio}`}
                    type="radio"
                    name="primaryPhone"
                    value="phone1"
                    checked={formData.primaryPhone === "phone1"}
                    onChange={() => handleInputChange("primaryPhone", "phone1")}
                  />
                  <div className={styles.flexOne}>
                    <InputField
                      labelClassName="-ml-4"
                      name="phone1"
                      label={t("admin-form.labels.phone1")}
                      placeholder={t("admin-form.placeholders.phone")}
                      value={formData.phone1}
                      onChange={(e) => handleInputChange("phone1", e.target.value)}
                      validations={[{ type: "required" }]}
                      tag={[{ value: "required", label: "Required" }]}
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone1Type"
                  label={t("admin-form.labels.type")}
                  options={phoneTypeOptions}
                  value={formData.phone1Type}
                  onChange={(e) => handleInputChange("phone1Type", e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className={`d-flex gap-1 align-items-center justify-content-start ${styles.phoneTypeContainer}`}>
                <div className={`d-flex align-items-end justify-content-center ${styles.phoneInputContainer} ${styles.flexOne}`}>
                  <input
                    className={`mb-1 mr-1 ${styles.borderOnlyRadio}`}
                    type="radio"
                    name="primaryPhone"
                    value="phone2"
                    checked={formData.primaryPhone === "phone2"}
                    onChange={() => handleInputChange("primaryPhone", "phone2")}
                  />
                  <div className={styles.flexOne}>
                    <InputField
                      labelClassName="-ml-4"
                      name="phone2"
                      label={t("admin-form.labels.phone2")}
                      placeholder={t("admin-form.placeholders.phone")}
                      value={formData.phone2}
                      onChange={(e) => handleInputChange("phone2", e.target.value)}
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone2Type"
                  label={t("admin-form.labels.type")}
                  options={phoneTypeOptions}
                  value={formData.phone2Type}
                  onChange={(e) => handleInputChange("phone2Type", e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <div className={`d-flex gap-1 align-items-center justify-content-start ${styles.phoneTypeContainer}`}>
                <div className={`d-flex align-items-end justify-content-center ${styles.phoneInputContainer} ${styles.flexOne}`}>
                  <input
                    className={`mb-1 mr-1 ${styles.borderOnlyRadio}`}
                    type="radio"
                    name="primaryPhone"
                    value="phone3"
                    checked={formData.primaryPhone === "phone3"}
                    onChange={() => handleInputChange("primaryPhone", "phone3")}
                  />
                  <div className={styles.flexOne}>
                    <InputField
                      labelClassName="-ml-4"
                      name="phone3"
                      label={t("admin-form.labels.phone3")}
                      placeholder={t("admin-form.placeholders.phone")}
                      value={formData.phone3}
                      onChange={(e) => handleInputChange("phone3", e.target.value)}
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone3Type"
                  label={t("admin-form.labels.type")}
                  options={phoneTypeOptions}
                  value={formData.phone3Type}
                  onChange={(e) => handleInputChange("phone3Type", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Email Addresses Row */}
          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div className={`${styles.flexOne} d-flex align-items-end justify-content-center`}>
                <input
                  className={`mb-1 mr-1 ${styles.borderOnlyRadio}`}
                  type="radio"
                  name="primaryEmail"
                  value="email1"
                  checked={formData.primaryEmail === "email1"}
                  onChange={() => handleInputChange("primaryEmail", "email1")}
                />
                <div className={styles.flexOne}>
                  <InputField
                    labelClassName="-ml-4"
                    name="email1"
                    label={t("admin-form.labels.email1")}
                    placeholder={t("admin-form.placeholders.email1")}
                    value={formData.email1}
                    onChange={(e) => handleInputChange("email1", e.target.value)}
                    validations={[{ type: "required" }, { type: "email" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div className={`${styles.flexOne} d-flex align-items-end justify-content-center`}>
                <input
                  className={`mb-1 mr-1 ${styles.borderOnlyRadio}`}
                  type="radio"
                  name="primaryEmail"
                  value="email2"
                  checked={formData.primaryEmail === "email2"}
                  onChange={() => handleInputChange("primaryEmail", "email2")}
                />
                <div className={styles.flexOne}>
                  <InputField
                    labelClassName="-ml-4"
                    name="email2"
                    label={t("admin-form.labels.email2")}
                    placeholder={t("admin-form.placeholders.email2")}
                    value={formData.email2}
                    onChange={(e) => handleInputChange("email2", e.target.value)}
                    validations={[{ type: "email" }]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Row */}
          <div className="row g-1 mb-1">
            <div className="col-md-12">
              <label className={styles.formLabel}>{t("admin-form.labels.address")}</label>
              <div className="row g-2">
                <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                  <InputField
                    name="postcode"
                    placeholder={t("admin-form.placeholders.postcode")}
                    value={formData.postcode}
                    onChange={(e) => handleInputChange("postcode", e.target.value)}
                    validations={[{ type: "required" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                  <CustomSelectField
                    name="prefecture"
                    placeholder={t("admin-form.placeholders.prefecture")}
                    options={prefectureOptions}
                    value={formData.prefecture}
                    onChange={(e) => handleInputChange("prefecture", e.target.value)}
                    validations={[{ type: "required" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                  <InputField
                    name="address1"
                    placeholder={t("admin-form.placeholders.address1")}
                    value={formData.address1}
                    onChange={(e) => handleInputChange("address1", e.target.value)}
                    validations={[{ type: "required" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                  <InputField
                    name="address2"
                    placeholder={t("admin-form.placeholders.address2")}
                    value={formData.address2}
                    onChange={(e) => handleInputChange("address2", e.target.value)}
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-md-12">
                  <InputField
                    name="building"
                    placeholder={t("admin-form.placeholders.building")}
                    value={formData.building}
                    onChange={(e) => handleInputChange("building", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Train Station Grid */}
          <div className="">
            <label className={styles.formLabel}>{t("admin-form.labels.trainStation")}</label>

            {/* Header Row */}
            <div className={`${styles.gridHeader} ${styles.trainStationGrid}`}>
              <div className="d-flex justify-content-center align-items-center">
                {t("adInquiryCreate.gridHeaders.number")}
              </div>
              <div>{t("adInquiryCreate.gridHeaders.date")}</div>
              <div>{t("adInquiryCreate.gridHeaders.railwayCompany")}</div>
              <div>{t("adInquiryCreate.gridHeaders.trainLine")}</div>
              <div>{t("adInquiryCreate.gridHeaders.trainStation")}</div>
              <div>{t("adInquiryCreate.gridHeaders.action")}</div>
            </div>

            {/* Data Rows */}
            {trainStations.map((station, index) => (
              <div key={index} className={`${styles.gridRow} ${styles.trainStationGrid}`}>
                <div className={styles.rowNumber}>{index + 1}</div>
                <div>
                  <InputDateField
                    name={`trainStation${index}Date`}
                    placeholder={t("admin-form.placeholders.japaneseDate")}
                    value={station.date}
                    onChange={(e) => {
                      const newStations = [...trainStations];
                      newStations[index].date = e.target.value;
                      setTrainStations(newStations);
                    }}
                  />
                </div>
                <div>
                  <InputField
                    name={`trainStation${index}Company`}
                    placeholder={t("admin-form.placeholders.railwayCompanyJR")}
                    value={station.railwayCompany}
                    onChange={(e) => {
                      const newStations = [...trainStations];
                      newStations[index].railwayCompany = e.target.value;
                      setTrainStations(newStations);
                    }}
                  />
                </div>
                <div>
                  <InputField
                    name={`trainStation${index}Line`}
                    placeholder={t("admin-form.placeholders.trainLineExample")}
                    value={station.trainLine}
                    onChange={(e) => {
                      const newStations = [...trainStations];
                      newStations[index].trainLine = e.target.value;
                      setTrainStations(newStations);
                    }}
                  />
                </div>
                <div>
                  <InputField
                    name={`trainStation${index}Station`}
                    placeholder={t("admin-form.placeholders.trainStationExample")}
                    value={station.trainStation}
                    onChange={(e) => {
                      const newStations = [...trainStations];
                      newStations[index].trainStation = e.target.value;
                      setTrainStations(newStations);
                    }}
                  />
                </div>
                <div className="d-flex gap-1">
                  <Button text={t("buttons.edit")} type="success" />
                  <Button
                    text={t("buttons.delete")}
                    type="danger"
                    onClick={() => removeTrainStation(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Language and Advertising Email */}
          <div className="row g-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <CustomSelectField
                name="language"
                label={t("admin-form.labels.language")}
                options={languageOptions}
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <RadioField
                name="advertisingEmail"
                label={t("admin-form.labels.advertisingEmail")}
                options={advertisingEmailOptions}
                selectedValue={formData.advertisingEmail}
                onChange={(e) => handleInputChange("advertisingEmail", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* INQUIRY DETAILS Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adInquiryCreate.inquiryDetails")}</h3>

          <div className="row g-1 mb-1">
            <div className="col-md-12">
              <CheckboxField
                name="preferredServices"
                label={t("admin-form.labels.preferredService")}
                options={serviceOptions}
                selectedValues={formData.preferredServices}
                onChange={(values) => handleInputChange("preferredServices", values)}
              />
            </div>
          </div>


        </div>

        {/* KEY IN OUR POSSESSION Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adBasicInfo1.keyInOurPossession")}</h3>

          <div className="">
            {/* Header Row */}
            <div className={`${styles.gridHeader} ${styles.keyPossessionGrid}`}>
              <div className="d-flex justify-content-center align-items-center">
                {t("adInquiryCreate.gridHeaders.number")}
              </div>
              <div>{t("adBasicInfo1.gridHeaders.dateOfReceived")}</div>
              <div>{t("adBasicInfo1.gridHeaders.dateOfReturned")}</div>
              <div>{t("adBasicInfo1.gridHeaders.staffName")}</div>
              <div>{t("adBasicInfo1.gridHeaders.status")}</div>
              <div>{t("adBasicInfo1.gridHeaders.receipt")}</div>
              <div>{t("adInquiryCreate.gridHeaders.action")}</div>
            </div>

            {/* Data Rows */}
            {keyPossessionRecords.map((record, index) => (
              <div key={index} className={`${styles.gridRow} ${styles.keyPossessionGrid} align-items-center`}>
                <div className={styles.rowNumber}>{index + 1}</div>
                <div>
                  <InputDateField
                    name={`keyRecord${index}DateReceived`}
                    placeholder={t("admin-form.placeholders.japaneseDate")}
                    value={record.dateReceived}
                    onChange={(e) => {
                      const newRecords = [...keyPossessionRecords];
                      newRecords[index].dateReceived = e.target.value;
                      setKeyPossessionRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <InputDateField
                    name={`keyRecord${index}DateReturned`}
                    placeholder={t("admin-form.placeholders.japaneseDate")}
                    value={record.dateReturned}
                    onChange={(e) => {
                      const newRecords = [...keyPossessionRecords];
                      newRecords[index].dateReturned = e.target.value;
                      setKeyPossessionRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <SelectField
                    name={`keyRecord${index}StaffName`}
                    placeholder="Staff name"
                    options={assigneeOptions}
                    value={record.staffName}
                    onChange={(e) => {
                      const newRecords = [...keyPossessionRecords];
                      newRecords[index].staffName = e.target.value;
                      setKeyPossessionRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <SelectField
                    name={`keyRecord${index}Status`}
                    placeholder="Status"
                    options={statusOptions}
                    value={record.status}
                    onChange={(e) => {
                      const newRecords = [...keyPossessionRecords];
                      newRecords[index].status = e.target.value;
                      setKeyPossessionRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <Link href="#"><FiPaperclip /></Link>
                </div>
                <div className="d-flex gap-1">
                  <Button text={t("buttons.edit")} type="success" />
                  <Button
                    text={t("buttons.delete")}
                    type="danger"
                    onClick={() => removeKeyPossessionRecord(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIGNAL STATUS Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adBasicInfo1.signalStatus")}</h3>

          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <RadioField
                name="proxyCheckIn"
                label={t("admin-form.labels.proxyCheckIn")}
                options={proxyCheckInOptions}
                selectedValue={formData.proxyCheckIn}
                onChange={(e) => handleInputChange("proxyCheckIn", e.target.value)}
              />
            </div>
          </div>

          <div className="row g-1">
            <div className="col-md-12">
              <TextAreaField
                name="note1"
                label={t("admin-form.labels.note")}
                placeholder={t("admin-form.placeholders.note")}
                value={formData.note1}
                onChange={(e) => handleInputChange("note1", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* OTHER Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adBasicInfo1.other")}</h3>

          <div className="row g-1 mb-1">
            <div className="col-md-12">
              <CheckboxField
                name="matchingListHK"
                label={t("admin-form.labels.matchingListHK")}
                options={matchingListHKOptions}
                selectedValues={formData.matchingListHK}
                onChange={(values) => handleInputChange("matchingListHK", values)}
              />
            </div>
          </div>
          
          <div className="row g-1 mb-1">
            <div className="col-md-12">
              <CheckboxField
                name="matchingListBS"
                label={t("admin-form.labels.matchingListBS")}
                options={matchingListBSOptions}
                selectedValues={formData.matchingListBS}
                onChange={(values) => handleInputChange("matchingListBS", values)}
              />
            </div>
          </div>

          <div className="row g-1">
            <div className="col-md-12">
              <TextAreaField
                name="note2"
                label={t("admin-form.labels.note")}
                placeholder={t("admin-form.placeholders.note")}
                value={formData.note2}
                onChange={(e) => handleInputChange("note2", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* NOTE Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adBasicInfo1.note")}</h3>

          <div className="row g-1">
            <div className="col-md-12">
              <TextAreaField
                name="note3"
                label={t("admin-form.labels.note")}
                placeholder={t("admin-form.placeholders.note")}
                value={formData.note3}
                onChange={(e) => handleInputChange("note3", e.target.value)}
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-section mb-4">
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <Button 
                text={t("buttons.register")} 
                className={styles.registerButton}
                htmlType="submit"
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicInfo1Tab; 