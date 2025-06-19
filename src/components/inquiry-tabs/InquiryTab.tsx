import React, { useState, useEffect } from "react";
import { Form } from "../form/form";
import InputField from "../input-field/input-field";
import CustomSelectField from "../custom-select/custom-select";
import InputDateField from "../input-date/input-date";
import TextAreaField from "../text-area/text-area";
import CheckboxField from "../checkbox-field/checkbox-field";
import RadioField from "../radio-field/radio-field";
import styles from "../../styles/components/molecules/inquiry-tab.module.scss";
import { calculateAge, convertTo24Hour } from "../../libs/utils";
import ApiHandler from "../../app/api-handler";

const InquiryTab: React.FC = () => {
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
    contacterType: "self",
    gender: "male",
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

  // Separate array states for display purposes
  const [trainStations, setTrainStations] = useState([
    {
      date: "",
      railwayCompany: "JR",
      trainLine: "山手線",
      trainStation: "渋谷",
    },
    {
      date: "",
      railwayCompany: "JR",
      trainLine: "山手線",
      trainStation: "渋谷",
    },
  ]);

  const [inquiryRecords, setInquiryRecords] = useState([
    {
      inquiryDate: "",
      assignee: "",
      updatedBy: "",
      inquiryDetails: "",
      response: "",
      status: "",
    },
    {
      inquiryDate: "",
      assignee: "",
      updatedBy: "",
      inquiryDetails: "",
      response: "",
      status: "",
    },
  ]);

  const [orderRecords, setOrderRecords] = useState([
    { orderFormSentAt: "", assignee: "", status: "" },
    { orderFormSentAt: "", assignee: "", status: "" },
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

  const handleSubmit = async () => {
    // Helper function to split time into hours and minutes
    const getTimeComponents = (timeStr: string | undefined) => {
      if (!timeStr) return { hour: "", minute: "" };
      const [hours, minutes] = timeStr.split(":");
      return { hour: hours || "", minute: minutes || "" };
    };

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

    // Format services array
    const servicesArray: Record<string, number | null> = {};
    (newFormData.preferredServices || []).forEach((service: number) => {
      servicesArray[`services[${service}]`] = service;
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
      represents_id: Number(
        newFormData.contacterType === "self"
          ? 1
          : newFormData.contacterType === "family_proxy"
          ? 2
          : newFormData.contacterType === "secretary"
          ? 3
          : 4
      ),
      dob_year: dob?.getFullYear() || "",
      dob_month: dob ? dob.getMonth() + 1 : "",
      dob_day: dob?.getDate() || "",
      age: Number(newFormData.age),
      gender: Number(
        newFormData.gender === "male"
          ? 1
          : newFormData.gender === "female"
          ? 2
          : 3
      ),
      phone_type1: newFormData.phone1Type,
      phone1: newFormData.phone1,
      phone_type2: newFormData.phone2Type || "",
      phone2: newFormData.phone2 || "",
      phone_type3: newFormData.phone3Type || "",
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
      ...servicesArray,
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
        setErrors((prev) => ({ ...prev, submit: "Failed to create inquiry" }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: "Failed to create inquiry" }));
    }
  };

  const channelOptions =
    dropdownOptions?.inquiry_media?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const referralSourceOptions =
    dropdownOptions?.referral_source?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const leadStatusOptions =
    dropdownOptions?.lead_staus?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const phoneTypeOptions =
    dropdownOptions?.phone_types?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const statusOptions =
    dropdownOptions?.inquiry_status?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const orderStatusOptions =
    dropdownOptions?.order_status?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const serviceOptions =
    dropdownOptions?.services?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const prefectureOptions =
    dropdownOptions?.prefectures?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const advertisingEmailOptions =
    dropdownOptions?.newsletter?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const languageOptions =
    dropdownOptions?.language?.map((item: any) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const assigneeOptions =
    dropdownOptions?.users
      ?.filter((user: any) => user.status)
      .map((item: any) => ({ value: item.value, label: item.label })) || [];

  if (loadingDropdowns) return <div>Loading options...</div>;
  if (dropdownError) return <div>{dropdownError}</div>;

  return (
    <div className="tab-content">
      <div className="content-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="content-title">ADD NEW</h1>
      </div>

      <Form
        onSubmit={handleSubmit}
        showBottomSubmitBtn={true}
        registerBtnText="REGISTER"
        setErrors={setErrors}
        errors={errors}
      >
        {/* FIRST INQUIRY INFO Section */}
        <div className="form-section mb-4">
          <div className="bg-secondary text-white p-3 mb-3">
            <h3 className={`mb-0 text-uppercase ${styles.sectionHeader}`}>
              FIRST INQUIRY INFO
            </h3>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <InputField
                name="recordId"
                label="Record ID"
                placeholder="Record ID"
                value={formData.recordId}
                onChange={(e) => handleInputChange("recordId", e.target.value)}
                validations={[{ type: "required" }]}
              />
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <div className={styles.dateTimeContainer}>
                <div className={styles.dateField}>
                  <InputDateField
                    name="inquiryDate"
                    label="Inquiry Date/Time"
                    placeholder="2024/8/22"
                    value={formData.inquiryDate}
                    onChange={(e) =>
                      handleInputChange("inquiryDate", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                  />
                </div>
                <div className={styles.timeField}>
                  <InputField
                    name="inquiryTime"
                    type="time"
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
                label="Assignee"
                options={assigneeOptions}
                value={formData.assignee}
                onChange={(e) => handleInputChange("assignee", e.target.value)}
                validations={[{ type: "required" }]}
              />
            </div>
            <div className="col-sm-12 col-lg-6 col-xl-3">
              <CustomSelectField
                name="channel"
                label="Channel"
                options={channelOptions}
                value={formData.channel}
                onChange={(e) => handleInputChange("channel", e.target.value)}
                validations={[{ type: "required" }]}
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <CustomSelectField
                name="referralSource"
                label="Referral Source"
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
                label="Referrer Name"
                placeholder="Referrer Name"
                value={formData.referrerName}
                onChange={(e) =>
                  handleInputChange("referrerName", e.target.value)
                }
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <CustomSelectField
                name="leadStatus"
                label="Lead Status"
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
          <div className="section-header bg-secondary text-white p-3 mb-3">
            <h3 className={`mb-0 text-uppercase ${styles.sectionHeader}`}>
              INQUIRER INFO
            </h3>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <InputField
                name="fullNameKatakana"
                label="Full name in Katakana  "
                placeholder="Full name in Katakana"
                value={formData.fullNameKatakana}
                onChange={(e) =>
                  handleInputChange("fullNameKatakana", e.target.value)
                }
                validations={[{ type: "required" }]}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <InputField
                name="fullName"
                label="Full name  "
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                validations={[{ type: "required" }]}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <RadioField
                name="contacterType"
                label="Contacter Type"
                options={[
                  { label: "Self", value: "self" },
                  { label: "Family Proxy", value: "family_proxy" },
                  { label: "Secretary", value: "secretary" },
                  { label: "Concierge", value: "concierge" },
                ]}
                selectedValue={formData.contacterType}
                onChange={(e) =>
                  handleInputChange("contacterType", e.target.value)
                }
              />
            </div>
          </div>

          {/* Date of Birth Row */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div
                className={`${styles.dFlex} ${styles.gap1} ${styles.alignItemsEnd}`}
              >
                <div className={styles.flexOne}>
                  <InputDateField
                    name="dateOfBirth"
                    label="Date Of Birth"
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
                <div className={styles.flexAgeField}>
                  <InputField
                    name="age"
                    label="Age"
                    placeholder="Age"
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
                label="Gender  "
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                selectedValue={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              />
            </div>
          </div>

                    {/* Phone Numbers Row */}
          <div className="row g-1 mb-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className="d-flex gap-1 align-items-center justify-content-between">
                <div className="d-flex align-items-end justify-content-center">
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
                      label="Phone 1  "
                      placeholder="000-0000-0000"
                      value={formData.phone1}
                      onChange={(e) =>
                        handleInputChange("phone1", e.target.value)
                      }
                      validations={[{ type: "required" }]}
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone1Type"
                  label="Type"
                  options={phoneTypeOptions}
                  value={formData.phone1Type}
                  onChange={(e) =>
                    handleInputChange("phone1Type", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className="d-flex gap-1 align-items-end justify-content-between">
                <div className="d-flex align-items-end justify-content-center">
                  <input
                    className={`mb-1 mr-1 ${styles.borderOnlyRadio}`}
                    type="radio"
                    name="primaryPhone"
                    value="phone2"
                    checked={formData.primaryPhone === "phone2"}
                    onChange={() => handleInputChange("primaryPhone", "phone2")}
                  />
                    <InputField
                      labelClassName="-ml-4"
                      name="phone2"
                      label="Phone 2"
                      placeholder="000-0000-0000"
                      value={formData.phone2}
                      onChange={(e) =>
                        handleInputChange("phone2", e.target.value)
                      }
                    />
                </div>
                <CustomSelectField
                  name="phone2Type"
                  label="Type"
                  options={phoneTypeOptions}
                  value={formData.phone2Type}
                  onChange={(e) =>
                    handleInputChange("phone2Type", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <div className="d-flex gap-1 align-items-center justify-content-between">
                <div className="d-flex align-items-end justify-content-center">
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
                      label="Phone 3"
                      placeholder="000-0000-0000"
                      value={formData.phone3}
                      onChange={(e) =>
                        handleInputChange("phone3", e.target.value)
                      }
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone3Type"
                  label="Type"
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
          <div className="row mb-3">
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
                    label="E-Mail 1  "
                    placeholder="E-mail 1"
                    value={formData.email1}
                    onChange={(e) => handleInputChange("email1", e.target.value)}
                    validations={[{ type: "required" }, { type: "email" }]}
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
                    label="E-Mail 2"
                    placeholder="E-mail 2"
                    value={formData.email2}
                    onChange={(e) => handleInputChange("email2", e.target.value)}
                    validations={[{ type: "email" }]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Row */}
          <div className="row g-3 mb-3">
            <div className="col-md-12">
              <label className={styles.addressLabel}>Address  </label>
              <div className="row g-2">
                <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                  <InputField
                    name="postcode"
                    // label=""
                    placeholder="Postcode"
                    value={formData.postcode}
                    onChange={(e) =>
                      handleInputChange("postcode", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                  <CustomSelectField
                    name="prefecture"
                    placeholder="Prefecture"
                    // label="Prefecture  "
                    options={prefectureOptions}
                    value={formData.prefecture}
                    onChange={(e) =>
                      handleInputChange("prefecture", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                  <InputField
                    name="address1"
                    // label="Address1  "
                    placeholder="Address1"
                    value={formData.address1}
                    onChange={(e) =>
                      handleInputChange("address1", e.target.value)
                    }
                    validations={[{ type: "required" }]}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                  <InputField
                    name="address2"
                    // label="Address 2"
                    placeholder="Address 2"
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
                    placeholder="Building"
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
          <div className="mb-3">
            <label className="form-label">Train Station  </label>

            {/* Header Row */}
            <div className={`${styles.gridHeader} ${styles.trainStationGrid}`}>
              <div>DATE</div>
              <div>RAILWAY COMPANY</div>
              <div>TRAIN LINE</div>
              <div>TRAIN STATION</div>
              <div>ACTION</div>
            </div>

            {/* Data Rows */}
            {trainStations.map((station, index) => (
              <div
                key={index}
                className={`${styles.gridRow} ${styles.trainStationGrid}`}
              >
                <div>
                  <InputDateField
                    name={`trainStation${index}Date`}
                    placeholder="年/月/日"
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
                    placeholder="JR"
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
                    placeholder="山手線"
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
                    placeholder="渋谷"
                    value={station.trainStation}
                    onChange={(e) => {
                      const newStations = [...trainStations];
                      newStations[index].trainStation = e.target.value;
                      setTrainStations(newStations);
                    }}
                  />
                </div>
                <div className="d-flex gap-1">
                  <button type="button" className={styles.editButton}>
                    EDIT
                  </button>
                  <button type="button" className={styles.deleteButton}>
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Language and Advertising Email */}
          <div className="row g-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <CustomSelectField
                name="language"
                label="Language"
                options={languageOptions}
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <RadioField
                name="advertisingEmail"
                label="Advertising Email"
                options={advertisingEmailOptions}
                selectedValue={formData.advertisingEmail}
                onChange={(e) =>
                  handleInputChange("advertisingEmail", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* INQUIRY DETAILS Section */}
        <div className="form-section mb-4">
          <div className="section-header bg-secondary text-white p-3 mb-3">
            <h3 className={`mb-0 text-uppercase ${styles.sectionHeader}`}>
              INQUIRY DETAILS
            </h3>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-12">
              <CheckboxField
                name="preferredServices"
                label="Preferred Service"
                options={serviceOptions}
                selectedValues={formData.preferredServices}
                onChange={(values) =>
                  handleInputChange("preferredServices", values)
                }
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <InputDateField
                name="firstServiceDate"
                label="First Service Date"
                placeholder="2024/8/22"
                value={formData.firstServiceDate}
                onChange={(e) =>
                  handleInputChange("firstServiceDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-12">
              <TextAreaField
                name="additionalRequests"
                label="Additional Requests"
                placeholder="Additional Requests"
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
          <div className="section-header bg-secondary text-white p-3 mb-3">
            <h3 className={`mb-0 text-uppercase ${styles.sectionHeader}`}>
              INQUIRY RESPONSE
            </h3>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <CustomSelectField
                name="owner"
                label="Owner"
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
                    label="Inquiry Date/Time"
                    placeholder="2024/8/22"
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
                label="Status"
                options={statusOptions}
                value={formData.responseStatus}
                onChange={(e) =>
                  handleInputChange("responseStatus", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <TextAreaField
                name="inquiry"
                label="Inquiry"
                placeholder="Inquiry"
                value={formData.inquiry}
                onChange={(e) => handleInputChange("inquiry", e.target.value)}
                rows={4}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <TextAreaField
                name="response"
                label="Response"
                placeholder="Response"
                value={formData.response}
                onChange={(e) => handleInputChange("response", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Inquiry Records Grid */}
          <div className="mb-3">
            {/* Header Row */}
            <div
              className={`${styles.gridHeader} ${styles.inquiryRecordsGrid}`}
            >
              <div>INQUIRY DATE / UPDATED DATE</div>
              <div>ASSIGNEE / UPDATED BY</div>
              <div>INQUIRY DETAILS</div>
              <div>RESPONSE</div>
              <div>STATUS</div>
              <div>ACTION</div>
            </div>

            {/* Data Rows */}
            {inquiryRecords.map((record, index) => (
              <div
                key={index}
                className={`${styles.gridRow} ${styles.inquiryRecordsGrid} align-items-center`}
              >
                <div className="d-flex flex-column gap-1">
                  <InputDateField
                    name={`inquiryRecord${index}Date1`}
                    placeholder="年/月/日"
                    value={record.inquiryDate}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].inquiryDate = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                  <InputDateField
                    name={`inquiryRecord${index}Date2`}
                    placeholder="年/月/日"
                    value={record.inquiryDate}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].inquiryDate = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                </div>
                <div className="d-flex flex-column gap-1">
                  <CustomSelectField
                    name={`inquiryRecord${index}Assignee`}
                    options={assigneeOptions}
                    value={record.assignee}
                    onChange={(e) => {
                      const newRecords = [...inquiryRecords];
                      newRecords[index].assignee = e.target.value;
                      setInquiryRecords(newRecords);
                    }}
                  />
                  <CustomSelectField
                    name={`inquiryRecord${index}UpdatedBy`}
                    options={[
                      { value: "", label: "Updated By" },
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
                    placeholder="Inquiry Details"
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
                    placeholder="Response"
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
                  <CustomSelectField
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
                  <button type="button" className={styles.deleteButton}>
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER Section */}
        <div className="form-section mb-4">
          <div className="section-header bg-secondary text-white p-3 mb-3">
            <h3 className={`mb-0 text-uppercase ${styles.sectionHeader}`}>
              ORDER
            </h3>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className={styles.dateTimeContainer}>
                <div className={styles.dateField}>
                  <InputDateField
                    name="orderFormSentAt"
                    label="Order Form Sent At"
                    placeholder="2024/8/22"
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
            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <CustomSelectField
                name="orderOwner"
                label="Owner"
                options={assigneeOptions}
                value={formData.orderOwner}
                onChange={(e) =>
                  handleInputChange("orderOwner", e.target.value)
                }
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <CustomSelectField
                name="orderStatus"
                label="Status"
                options={orderStatusOptions}
                value={formData.orderStatus}
                onChange={(e) =>
                  handleInputChange("orderStatus", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-12">
              <CheckboxField
                name="orderFormSent"
                label=""
                options={[{ value: "orderFormSent", label: "Order Form Sent" }]}
                selectedValues={formData.orderFormSent ? ["orderFormSent"] : []}
                onChange={(values) =>
                  handleInputChange(
                    "orderFormSent",
                    values.includes("orderFormSent")
                  )
                }
              />
            </div>
          </div>

          {/* Order Records Grid */}
          <div className="mb-3">
            {/* Header Row */}
            <div className={`${styles.gridHeader} ${styles.orderRecordsGrid}`}>
              <div>ORDER FORM SENT AT</div>
              <div>ASSIGNEE</div>
              <div>STATUS</div>
            </div>

            {/* Data Rows */}
            {orderRecords.map((record, index) => (
              <div
                key={index}
                className={`${styles.gridRow} ${styles.orderRecordsGrid}`}
              >
                <div>
                  <InputDateField
                    name={`orderRecord${index}Date`}
                    placeholder="年/月/日"
                    value={record.orderFormSentAt}
                    onChange={(e) => {
                      const newRecords = [...orderRecords];
                      newRecords[index].orderFormSentAt = e.target.value;
                      setOrderRecords(newRecords);
                    }}
                  />
                </div>
                <div>
                  <CustomSelectField
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
                  <CustomSelectField
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
              </div>
            ))}
          </div>
        </div>

        {/* Note Section */}
        <div className="form-section mb-4">
          <div className="row g-3">
            <div className="col-md-12">
              <TextAreaField
                name="note"
                label="Note"
                placeholder="Note"
                value={formData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
                rows={6}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default InquiryTab;
