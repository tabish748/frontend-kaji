import React, { useState, useEffect } from "react";
import { Form } from "../form/form";
import InputField from "../input-field/input-field";
import CustomSelectField from "../custom-select/custom-select";
import SelectField from "../select-field/select-field";
import InputDateField from "../input-date/input-date";
import TextAreaField from "../text-area/text-area";
import CheckboxField from "../checkbox-field/checkbox-field";
import RadioField from "../radio-field/radio-field";
import styles from "../../styles/components/molecules/inquiry-tab.module.scss";
import { calculateAge, convertTo24Hour } from "../../libs/utils";
import ApiHandler from "../../app/api-handler";
import Button from "../button/button";
import { useLanguage } from "../../localization/LocalContext";

const InquiryTab: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    recordId: "",
    inquiryDate: "",
    inquiryTime: "",
    assignee: "",
    channel: "",
    referralSource: "",
    referrerName: "",
    leadStatus: "",
    fullNameKatakana: "",
    fullName: "",
    contacterType: "1",
    gender: "1",
    dateOfBirth: "",
    age: "",
    phone1: "",
    phone1Type: "",
    phone2: "",
    phone2Type: "",
    phone3: "",
    phone3Type: "",
    primaryPhone: "phone1",
    email1: "",
    email1Type: "",
    email2: "",
    email2Type: "",
    primaryEmail: "email1",
    postcode: "",
    prefecture: "",
    address1: "",
    address2: "",
    building: "",
    language: "",
    advertisingEmail: "subscribe",
    preferredServices: [],
    firstServiceDate: "",
    additionalRequests: "",
    owner: "",
    responseInquiryDate: "",
    responseTime: "",
    responseStatus: "",
    inquiry: "",
    response: "",
    orderFormSentAt: "",
    orderTime: "",
    orderOwner: "",
    orderStatus: "",
    orderFormSent: false,
    note: "",
  });

  // Mock array states for display purposes (will be replaced by API data)
  const [trainStations, setTrainStations] = useState([
    {
      date: "2024/01/15",
      railwayCompany: "JR",
      trainLine: "山手線",
      trainStation: "渋谷",
    },
    {
      date: "2024/02/20",
      railwayCompany: "東急",
      trainLine: "田園都市線",
      trainStation: "二子玉川",
    },
    {
      date: "2024/03/10",
      railwayCompany: "小田急",
      trainLine: "小田原線",
      trainStation: "新宿",
    },
  ]);

  const [inquiryRecords, setInquiryRecords] = useState([
    {
      inquiryDate: "2024/01/10",
      assignee: "田中太郎",
      updatedBy: "佐藤花子",
      inquiryDetails: "税務相談について詳細を確認したい",
      response: "担当者から連絡いたします",
      status: "対応中",
    },
    {
      inquiryDate: "2024/01/20",
      assignee: "山田次郎",
      updatedBy: "鈴木一郎",
      inquiryDetails: "法務相談の件でフォローアップ",
      response: "資料を準備してお送りします",
      status: "完了",
    },
  ]);

  const [orderRecords, setOrderRecords] = useState([
    { orderFormSentAt: "2024/01/15", assignee: "田中太郎", status: "送信済み" },
    { orderFormSentAt: "2024/02/01", assignee: "佐藤花子", status: "確認中" },
    { orderFormSentAt: "2024/02/15", assignee: "山田次郎", status: "完了" },
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Remove functions for API-driven data (keeping delete for demo purposes)
  const removeTrainStation = (index: number) => {
    if (trainStations.length > 1) {
      const newStations = trainStations.filter((_, i) => i !== index);
      setTrainStations(newStations);
    }
  };

  const removeInquiryRecord = (index: number) => {
    if (inquiryRecords.length > 1) {
      const newRecords = inquiryRecords.filter((_, i) => i !== index);
      setInquiryRecords(newRecords);
    }
  };

  const removeOrderRecord = (index: number) => {
    if (orderRecords.length > 1) {
      const newRecords = orderRecords.filter((_, i) => i !== index);
      setOrderRecords(newRecords);
    }
  };

  // Helper function to split time into hours and minutes
  const getTimeComponents = (timeStr: string | undefined): { hour: string; minute: string } => {
    if (!timeStr) return { hour: "", minute: "" };
    const [hours, minutes] = timeStr.split(":");
    return { hour: hours || "", minute: minutes || "" };
  };

  const handleSubmit = async () => {
    // Convert any 12-hour times to 24-hour format first
    const newFormData = { ...formData };
    type TimeField = "inquiryTime" | "responseTime" | "orderTime";
    (["inquiryTime", "responseTime", "orderTime"] as TimeField[]).forEach(
      (field) => {
        if (newFormData[field] && /am|pm/i.test(newFormData[field]!)) {
          try {
            newFormData[field] = convertTo24Hour(newFormData[field]!);
          } catch (e) {
            setErrors((prev) => ({ ...prev, [field]: "Invalid time format" }));
            return;
          }
        }
      }
    );

    // Get time components
    const firstInquiryTime = getTimeComponents(newFormData.inquiryTime);
    const responseTime = getTimeComponents(newFormData.responseTime);
    const orderTime = getTimeComponents(newFormData.orderTime);

    // Build services object: {1: 1, 2: 2, 3: 3, 4: "", ...}
    const allServiceIds = (dropdownOptions?.services || []).map((item: any) => String(item.value));
    const selectedServiceIds = (newFormData.preferredServices || []).map((s: any) => String(s));
    const services: Record<string, number | ""> = {};
    allServiceIds.forEach((id: string) => {
      services[id] = selectedServiceIds.includes(id) ? Number(id) : "";
    });

    // Format date of birth components
    const dob = newFormData.dateOfBirth
      ? new Date(newFormData.dateOfBirth)
      : null;

    const submissionData = {
      first_inquiry_date: newFormData.inquiryDate,
      first_inquiry_hour: firstInquiryTime.hour,
      first_inquiry_minute: firstInquiryTime.minute,
      responder_id: newFormData.assignee,
      inquiry_media_id: Number(newFormData.channel),
      referral_source: Number(newFormData.referralSource),
      referral_name: newFormData.referrerName,
      lead_status: Number(newFormData.leadStatus),
      name: newFormData.fullName,
      name_kana: newFormData.fullNameKatakana,
      represents_id: Number(newFormData.contacterType),
      dob_year: dob?.getFullYear() || "",
      dob_month: dob ? dob.getMonth() + 1 : "",
      dob_day: dob?.getDate() || "",
      age: Number(newFormData.age),
      gender: Number(newFormData.gender),
      phone1_type: newFormData.phone1Type,
      phone1: newFormData.phone1,
      phone2_type: newFormData.phone2Type || "",
      phone2: newFormData.phone2 || "",
      phone3_type: newFormData.phone3Type || "",
      phone3: newFormData.phone3 || "",
      email1: newFormData.email1,
      email2: newFormData.email2 || "",
      primary_contact_phone: newFormData.primaryPhone,
      primary_contact_email: newFormData.primaryEmail,
      post_code: newFormData.postcode,
      prefecture_id: Number(newFormData.prefecture),
      address1: newFormData.address1,
      address2: newFormData.address2 || "",
      apartment_name: newFormData.building || "",
      language: Number(newFormData.language),
      newsletter_emails: Number(
        newFormData.advertisingEmail === "subscribe" ? 1 : 0
      ),
      services,
      first_service_requested_date: newFormData.firstServiceDate,
      other_service_requests: newFormData.additionalRequests || "",
      remarks: newFormData.note || "",
      station_details: trainStations.map((station) => ({
        date_added: station.date,
        company: station.railwayCompany,
        route_name: station.trainLine,
        nearest_station: station.trainStation,
      })),
      inquiry_detail: {
        person_incharge_id: newFormData.owner,
        inquiry_date: newFormData.responseInquiryDate,
        inquiry_hour: responseTime.hour,
        inquiry_minute: responseTime.minute,
        inquiry_status: Number(newFormData.responseStatus),
        inquiry: newFormData.inquiry || "",
        answer: newFormData.response || "",
      },
      inquiry_order_detail: {
        submission_date: newFormData.orderFormSentAt,
        submission_hour: orderTime.hour,
        submission_minute: orderTime.minute,
        order_form_sent: newFormData.orderFormSent ? 1 : 0,
        responder_id: newFormData.orderOwner,
        order_status: Number(newFormData.orderStatus),
      },
    };

    try {
      const response = await ApiHandler.request(
        "/api/company/public-inquiry/create",
        "POST",
        submissionData,
        {},
        {},
        true
      );

      if (response.success) {
        // Handle success
        console.log("Inquiry created successfully");
      } else {
        // Handle error
        setErrors((prev) => ({ ...prev, submit: t("admin-form.errors.submitFailed") }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: t("admin-form.errors.submitFailed") }));
    }
  };

  const channelOptions =
    dropdownOptions?.inquiry_media?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const referralSourceOptions =
    dropdownOptions?.referral_source?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const leadStatusOptions =
    dropdownOptions?.lead_staus?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const phoneTypeOptions =
    dropdownOptions?.phone_types?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const statusOptions =
    dropdownOptions?.inquiry_status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const orderStatusOptions =
    dropdownOptions?.order_status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const serviceOptions =
    dropdownOptions?.services?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const prefectureOptions =
    dropdownOptions?.prefectures?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const advertisingEmailOptions =
    dropdownOptions?.newsletter?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const languageOptions =
    dropdownOptions?.language?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const assigneeOptions =
    dropdownOptions?.users
      ?.filter((user: any) => user.status)
      .map((item: any) => ({ value: String(item.value), label: item.label })) || [];
  const genderOptions =
    dropdownOptions?.gender?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const contacterTypeOptions =
    dropdownOptions?.represents?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
    ];

  if (loadingDropdowns) return <div>{t("admin-form.loading.options")}</div>;
  if (dropdownError) return <div>{dropdownError}</div>;

  return (
    <div className="tab-content">
              <Form
          onSubmit={handleSubmit}
          // showBottomSubmitBtn={true}
          registerBtnText="REGISTER"
          setErrors={setErrors}
        errors={errors}
      >
        {/* FIRST INQUIRY INFO Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adInquiryCreate.firstInquiryInfo")}</h3>

          <div className="row g-1 mb-1">
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <InputField
                name="recordId"
                label={t("admin-form.labels.recordId")}
                placeholder={t("admin-form.placeholders.recordId")}
                value={formData.recordId}
                onChange={(e) => handleInputChange("recordId", e.target.value)}
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
              />
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <div className={styles.dateTimeContainer}>
                <div className={styles.dateField}>
                  <InputDateField
                    name="inquiryDate"
                    label={t("admin-form.labels.inquiryDateTime")}
                    placeholder={t("admin-form.placeholders.date")}
                    value={formData.inquiryDate}
                    onChange={(e) =>
                      handleInputChange("inquiryDate", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
                <div className={styles.timeField}>
                  <InputField
                    name="inquiryTime"
                    type="time"
                    label={""}
                    value={formData.inquiryTime}
                    onChange={(e) =>
                      handleInputChange("inquiryTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <CustomSelectField
                name="assignee"
                label={t("admin-form.labels.assignee")}
                options={assigneeOptions}
                value={formData.assignee}
                onChange={(e) => handleInputChange("assignee", e.target.value)}
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
              />
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <CustomSelectField
                name="channel"
                label={t("admin-form.labels.channel")}
                options={channelOptions}
                value={formData.channel}
                onChange={(e) => handleInputChange("channel", e.target.value)}
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
              />
            </div>
          </div>

          <div className="row g-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <CustomSelectField
                name="referralSource"
                label={t("admin-form.labels.referralSource")}
                options={referralSourceOptions}
                value={formData.referralSource}
                onChange={(e) =>
                  handleInputChange("referralSource", e.target.value)
                }
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <InputField
                name="referrerName"
                label={t("admin-form.labels.referrerName")}
                placeholder={t("admin-form.placeholders.referrerName")}
                value={formData.referrerName}
                onChange={(e) =>
                  handleInputChange("referrerName", e.target.value)
                }
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <CustomSelectField
                name="leadStatus"
                label={t("admin-form.labels.leadStatus")}
                options={leadStatusOptions}
                value={formData.leadStatus}
                onChange={(e) =>
                  handleInputChange("leadStatus", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* INQUIRER INFO Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adInquiryCreate.inquirerInfo")}</h3>

          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3  ">
              <InputField
                name="fullNameKatakana"
                label={t("admin-form.labels.fullNameKatakana")}
                placeholder={t("admin-form.placeholders.fullNameKatakana")}
                value={formData.fullNameKatakana}
                onChange={(e) =>
                  handleInputChange("fullNameKatakana", e.target.value)
                }
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
                name="contacterType"
                label={t("admin-form.labels.contacterType")}
                options={contacterTypeOptions}
                selectedValue={formData.contacterType}
                onChange={(e) =>
                  handleInputChange("contacterType", e.target.value)
                }
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
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
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
              />
            </div>
          </div>

          {/* Phone Numbers Row */}
          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div
                className={`d-flex gap-1 align-items-center justify-content-start ${styles.phoneTypeContainer}`}
              >
                <div
                  className={`d-flex align-items-end justify-content-center ${styles.phoneInputContainer} ${styles.flexOne}`}
                >
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
                      onChange={(e) =>
                        handleInputChange("phone1", e.target.value)
                      }
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
                  onChange={(e) =>
                    handleInputChange("phone1Type", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div
                className={`d-flex gap-1 align-items-center justify-content-start ${styles.phoneTypeContainer}`}
              >
                <div
                  className={`d-flex align-items-end justify-content-center ${styles.phoneInputContainer} ${styles.flexOne}`}
                >
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
                      onChange={(e) =>
                        handleInputChange("phone2", e.target.value)
                      }
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone2Type"
                  label={t("admin-form.labels.type")}
                  options={phoneTypeOptions}
                  value={formData.phone2Type}
                  onChange={(e) =>
                    handleInputChange("phone2Type", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <div
                className={`d-flex gap-1 align-items-center justify-content-start ${styles.phoneTypeContainer}`}
              >
                <div
                  className={`d-flex align-items-end justify-content-center ${styles.phoneInputContainer} ${styles.flexOne}`}
                >
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
                      onChange={(e) =>
                        handleInputChange("phone3", e.target.value)
                      }
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone3Type"
                  label={t("admin-form.labels.type")}
                  options={phoneTypeOptions}
                  value={formData.phone3Type}
                  onChange={(e) =>
                    handleInputChange("phone3Type", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Email Addresses Row */}
          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div
                className={`${styles.flexOne} d-flex align-items-end justify-content-center`}
              >
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
                      onChange={(e) =>
                        handleInputChange("email1", e.target.value)
                      }
                      validations={[{ type: "required" }, { type: "email" }]}
                      tag={[{ value: "required", label: "Required" }]}
                    />
                  </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div
                className={`${styles.flexOne} d-flex align-items-end justify-content-center`}
              >
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
                      onChange={(e) =>
                        handleInputChange("email2", e.target.value)
                      }
                      validations={[{ type: "email" }]}
                    />
                  </div>
              </div>
            </div>
          </div>

          {/* Address Row */}
          <div className="row g-1 mb-1">
            <div className="col-md-12">
              <label className={styles.formLabel}>{t("admin-form.labels.address")} </label>
              <div className="row g-2">
                <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                  <InputField
                    name="postcode"
                    // label=""
                    placeholder={t("admin-form.placeholders.postcode")}
                    value={formData.postcode}
                    onChange={(e) =>
                      handleInputChange("postcode", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                  <CustomSelectField
                    name="prefecture"
                    placeholder={t("admin-form.placeholders.prefecture")}
                    // label="Prefecture  "
                    options={prefectureOptions}
                    value={formData.prefecture}
                    onChange={(e) =>
                      handleInputChange("prefecture", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                  <InputField
                    name="address1"
                    // label="Address1  "
                    placeholder={t("admin-form.placeholders.address1")}
                    value={formData.address1}
                    onChange={(e) =>
                      handleInputChange("address1", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                    tag={[{ value: "required", label: "Required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                  <InputField
                    name="address2"
                    // label="Address 2"
                    placeholder={t("admin-form.placeholders.address2")}
                    value={formData.address2}
                    onChange={(e) =>
                      handleInputChange("address2", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-md-12">
                  <InputField
                    name="building"
                    // label="Building"
                    placeholder={t("admin-form.placeholders.building")}
                    value={formData.building}
                    onChange={(e) =>
                      handleInputChange("building", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Train Station Grid */}
          <div className="">
            <label className={styles.formLabel}>{t("admin-form.labels.trainStation")} </label>

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
              <div
                key={index}
                className={`${styles.gridRow} ${styles.trainStationGrid}`}
              >
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
                onChange={(e) =>
                  handleInputChange("advertisingEmail", e.target.value)
                }
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
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
                onChange={(values) =>
                  handleInputChange("preferredServices", values)
                }
                validations={[{ type: "required" }]}
                tag={[{ value: "required", label: "Required" }]}
              />
            </div>
          </div>

          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <InputDateField
                name="firstServiceDate"
                label={t("admin-form.labels.firstServiceDate")}
                placeholder={t("admin-form.placeholders.date")}
                value={formData.firstServiceDate}
                onChange={(e) =>
                  handleInputChange("firstServiceDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row g-1">
            <div className="col-md-12">
              <TextAreaField
                name="additionalRequests"
                label={t("admin-form.labels.additionalRequests")}
                placeholder={t("admin-form.placeholders.additionalRequests")}
                value={formData.additionalRequests}
                onChange={(e) =>
                  handleInputChange("additionalRequests", e.target.value)
                }
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* INQUIRY RESPONSE Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adInquiryCreate.inquiryResponse")}</h3>

          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <CustomSelectField
                name="owner"
                label={t("admin-form.labels.owner")}
                options={assigneeOptions}
                value={formData.owner}
                onChange={(e) => handleInputChange("owner", e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className={styles.dateTimeContainer}>
                <div className={styles.dateField}>
                  <InputDateField
                    name="responseInquiryDate"
                    label={t("admin-form.labels.inquiryDateTime")}
                    placeholder={t("admin-form.placeholders.date")}
                    value={formData.responseInquiryDate}
                    onChange={(e) =>
                      handleInputChange("responseInquiryDate", e.target.value)
                    }
                  />
                </div>
                <div className={styles.timeField}>
                  <InputField
                    name="responseTime"
                    type="time"
                    label={t("admin-form.labels.time")}
                    value={formData.responseTime}
                    onChange={(e) =>
                      handleInputChange("responseTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <CustomSelectField
                name="responseStatus"
                label={t("admin-form.labels.status")}
                options={statusOptions}
                value={formData.responseStatus}
                onChange={(e) =>
                  handleInputChange("responseStatus", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row g-1 mb-1">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <TextAreaField
                name="inquiry"
                label={t("admin-form.labels.inquiry")}
                placeholder={t("admin-form.placeholders.inquiry")}
                value={formData.inquiry}
                onChange={(e) => handleInputChange("inquiry", e.target.value)}
                rows={4}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <TextAreaField
                name="response"
                label={t("admin-form.labels.response")}
                placeholder={t("admin-form.placeholders.response")}
                value={formData.response}
                onChange={(e) => handleInputChange("response", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Inquiry Records Grid */}
          <div className="">
            {/* Header Row */}
            <div
              className={`${styles.gridHeader} ${styles.inquiryRecordsGrid}`}
            >
              <div className="d-flex justify-content-center align-items-center">
                {t("adInquiryCreate.gridHeaders.number")}
              </div>
              <div>{t("adInquiryCreate.gridHeaders.inquiryDateUpdated")}</div>
              <div>{t("adInquiryCreate.gridHeaders.assigneeUpdatedBy")}</div>
              <div>{t("adInquiryCreate.gridHeaders.inquiryDetails")}</div>
              <div>{t("adInquiryCreate.gridHeaders.response")}</div>
              <div>{t("adInquiryCreate.gridHeaders.status")}</div>
              <div>{t("adInquiryCreate.gridHeaders.action")}</div>
            </div>

            {/* Data Rows */}
            {inquiryRecords.map((record, index) => (
              <div
                key={index}
                className={`${styles.gridRow} ${styles.inquiryRecordsGrid} align-items-center`}
              >
                <div className={styles.rowNumber}>{index + 1}</div>
                <div className="d-flex flex-column gap-1">
                  <InputDateField
                    name={`inquiryRecord${index}Date1`}
                    placeholder={t("admin-form.placeholders.japaneseDate")}
                    value={record.inquiryDate}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].inquiryDate = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                  <InputDateField
                    name={`inquiryRecord${index}Date2`}
                    placeholder={t("admin-form.placeholders.japaneseDate")}
                    value={record.inquiryDate}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].inquiryDate = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                </div>
                <div className="d-flex flex-column gap-1">
                  <SelectField
                    name={`inquiryRecord${index}Assignee`}
                    options={assigneeOptions}
                    value={record.assignee}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].assignee = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                  <SelectField
                    name={`inquiryRecord${index}UpdatedBy`}
                    options={[
                      { value: "", label: t("admin-form.placeholders.updatedBy") },
                      ...assigneeOptions.slice(1),
                    ]}
                    value={record.updatedBy}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].updatedBy = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <TextAreaField
                    name={`inquiryRecord${index}Details`}
                    placeholder={t("admin-form.placeholders.inquiryDetails")}
                    value={record.inquiryDetails}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].inquiryDetails = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                    className={styles.fullHeightTextArea}
                  />
                </div>
                <div>
                  <TextAreaField
                    name={`inquiryRecord${index}Response`}
                    placeholder={t("admin-form.placeholders.response")}
                    value={record.response}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].response = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                    className={styles.fullHeightTextArea}
                  />
                </div>
                <div>
                  <SelectField
                    name={`inquiryRecord${index}Status`}
                    options={statusOptions}
                    value={record.status}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].status = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <Button
                    text={t("buttons.delete")}
                    type="danger"
                    onClick={() => removeInquiryRecord(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER Section */}
        <div className="form-section mb-4">
          <h3 className="ad-heading">{t("adInquiryCreate.order")}</h3>

          <div className="row g-1 align-items-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
              <div className={styles.dateTimeContainer}>
                <div className={styles.dateField}>
                  <InputDateField
                    name="orderFormSentAt"
                    label={t("admin-form.labels.orderFormSentAt")}
                    placeholder={t("admin-form.placeholders.date")}
                    value={formData.orderFormSentAt}
                    onChange={(e) =>
                      handleInputChange("orderFormSentAt", e.target.value)
                    }
                  />
                </div>
                <div className={styles.timeField}>
                  <InputField
                    name="orderTime"
                    type="time"
                    value={formData.orderTime}
                    onChange={(e) =>
                      handleInputChange("orderTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3 mt-4  p-2">
              <CheckboxField
                name="orderFormSent"
                label=""
                options={[{ value: "orderFormSent", label: t("admin-form.labels.orderFormSent") }]}
                selectedValues={formData.orderFormSent ? ["orderFormSent"] : []}
                onChange={(values) =>
                  handleInputChange(
                    "orderFormSent",
                    values.includes("orderFormSent")
                  )
                }
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
              <CustomSelectField
                name="orderOwner"
                label={t("admin-form.labels.owner")}
                options={assigneeOptions}
                value={formData.orderOwner}
                onChange={(e) =>
                  handleInputChange("orderOwner", e.target.value)
                }
              />
            </div>
            <div className={`${styles.orderStatusContainer} col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3`}>
              <CustomSelectField
                name="orderStatus"
                label={t("admin-form.labels.status")}
                options={orderStatusOptions}
                value={formData.orderStatus}
                onChange={(e) =>
                  handleInputChange("orderStatus", e.target.value)
                }
              />
            </div>
          </div>

          {/* Order Records Grid */}
          <div className="">
            {/* Header Row */}
            <div className={`${styles.gridHeader} ${styles.orderRecordsGrid}`}>
              <div className="d-flex justify-content-center align-items-center">
                {t("adInquiryCreate.gridHeaders.number")}
              </div>
              <div>{t("adInquiryCreate.gridHeaders.orderFormSentAt")}</div>
              <div>{t("admin-form.labels.assignee")}</div>
              <div>{t("adInquiryCreate.gridHeaders.status")}</div>
              <div></div>
            </div>

            {/* Data Rows */}
            {orderRecords.map((record, index) => (
              <div
                key={index}
                className={`${styles.gridRow} ${styles.orderRecordsGrid}`}
              >
                <div className={styles.rowNumber}>{index + 1}</div>
                <div>
                  <InputDateField
                    name={`orderRecord${index}Date`}
                    placeholder={t("admin-form.placeholders.japaneseDate")}
                    value={record.orderFormSentAt}
                    onChange={(e) => {
                      const newRecords = [...orderRecords];
                      newRecords[index].orderFormSentAt = e.target.value;
                      setOrderRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <SelectField
                    name={`orderRecord${index}Assignee`}
                    options={assigneeOptions}
                    value={record.assignee}
                    onChange={(e) => {
                      const newRecords = [...orderRecords];
                      newRecords[index].assignee = e.target.value;
                      setOrderRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <SelectField
                    name={`orderRecord${index}Status`}
                    options={orderStatusOptions}
                    value={record.status}
                    onChange={(e) => {
                      const newRecords = [...orderRecords];
                      newRecords[index].status = e.target.value;
                      setOrderRecords(newRecords);
                    }}
                  />
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Section */}
        <div className="form-section mb-4">
          <div className="row g-1">
            <div className="col-md-12">
              <TextAreaField
                name="note"
                label={t("admin-form.labels.note")}
                placeholder={t("admin-form.placeholders.note")}
                value={formData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
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

export default InquiryTab;
