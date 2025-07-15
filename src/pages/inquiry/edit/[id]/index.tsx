import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import ApiLoadingWrapper from "@/components/api-loading-wrapper/api-loading-wrapper";
import Toast from "@/components/toast/toast";
import {
  fetchPublicInquiryById,
  updatePublicInquiryById,
  resetPublicInquiryEdit,
} from "@/app/inquiry/publicInquiryEditSlice";
import InputField from "@/components/input-field/input-field";
import CustomSelectField from "@/components/custom-select/custom-select";
import SelectField from "@/components/select-field/select-field";
import InputDateField from "@/components/input-date/input-date";
import TextAreaField from "@/components/text-area/text-area";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import RadioField from "@/components/radio-field/radio-field";
import Button from "@/components/button/button";
import styles from "@/styles/components/molecules/inquiry-tab.module.scss";
import { calculateAge } from "@/libs/utils";
import InquiryTabLayout from "@/components/inquiry-tabs/InquiryTabLayout";
import { useLanguage } from "@/localization/LocalContext";

const InquiryTabEdit: React.FC = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const publicInquiryEditState = useSelector(
    (state: RootState) => state.publicInquiryEdit || {}
  );
  const {
    loading,
    error,
    inquiryData,
    updateLoading,
    updateSuccess,
    updateError,
  } = publicInquiryEditState;

  const [dropdownOptions, setDropdownOptions] = useState<any>(null);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [dropdownError, setDropdownError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [trainStations, setTrainStations] = useState<any[]>(
    inquiryData?.routes || []
  );
  const [inquiryRecords, setInquiryRecords] = useState<any[]>(
    inquiryData?.inquiry_details || []
  );
  const [orderRecords, setOrderRecords] = useState<any[]>(
    inquiryData?.orders || []
  );

  useEffect(() => {
    if (inquiryData) {
      setInquiryRecords(inquiryData.inquiry_details || []);
      setOrderRecords(inquiryData.orders || []);
      // Always set trainStations to exactly three rows
      const routes = inquiryData.routes || [];
      let newStations = [];
      if (routes.length >= 3) {
        newStations = routes.slice(0, 3);
      } else {
        newStations = [
          ...routes,
          ...Array.from({ length: 3 - routes.length }, () => ({
            id: undefined,
            date_added: '',
            company: '',
            route_name: '',
            nearest_station: '',
          })),
        ];
      }
      setTrainStations(newStations);
    }
  }, [inquiryData]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoadingDropdowns(true);
      setDropdownError(null);
      try {
        const res = await (
          await import("@/app/api-handler")
        ).default.request("/api/inquiry-form-dropdowns", "GET");
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

  useEffect(() => {
    if (id) {
      dispatch(fetchPublicInquiryById(id as string));
    }
    return () => {
      dispatch(resetPublicInquiryEdit());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (inquiryData) {
      setFormData({
        recordId: inquiryData.id || "",
        inquiryDate: inquiryData.first_inquiry_date || "",
        inquiryTime:
          inquiryData.first_inquiry_hour && inquiryData.first_inquiry_minute
            ? `${String(inquiryData.first_inquiry_hour).padStart(
                2,
                "0"
              )}:${String(inquiryData.first_inquiry_minute).padStart(2, "0")}`
            : "",
        assignee: inquiryData.responder_id
          ? String(inquiryData.responder_id)
          : "",
        channel: inquiryData.inquiry_media_id
          ? String(inquiryData.inquiry_media_id)
          : "",
        referralSource: inquiryData.referral_source
          ? String(inquiryData.referral_source)
          : "",
        referrerName: inquiryData.referral_name || "",
        leadStatus: inquiryData.lead_status
          ? String(inquiryData.lead_status)
          : "",
        fullNameKatakana: inquiryData.name_kana || "",
        fullName: inquiryData.name || "",
        contacterType: inquiryData.represents_id
          ? String(inquiryData.represents_id)
          : "1",
        gender: inquiryData.gender ? String(inquiryData.gender) : "1",
        dateOfBirth: inquiryData.dob ? inquiryData.dob.substring(0, 10) : "",
        age: inquiryData.age ? String(inquiryData.age) : "",
        phone1: inquiryData.phone1 || "",
        phone1Type: inquiryData.phone1_type
          ? String(inquiryData.phone1_type)
          : "",
        phone2: inquiryData.phone2 || "",
        phone2Type: inquiryData.phone2_type
          ? String(inquiryData.phone2_type)
          : "",
        phone3: inquiryData.phone3 || "",
        phone3Type: inquiryData.phone3_type
          ? String(inquiryData.phone3_type)
          : "",
        primaryPhone: inquiryData.primary_contact_phone || "phone1",
        email1: inquiryData.email1 || "",
        email2: inquiryData.email2 || "",
        primaryEmail: inquiryData.primary_contact_email || "email1",
        postcode: inquiryData.post_code || "",
        prefecture: inquiryData.prefecture_id
          ? String(inquiryData.prefecture_id)
          : "",
        address1: inquiryData.address1 || "",
        address2: inquiryData.address2 || "",
        building: inquiryData.apartment_name || "",
        language: inquiryData.language ? String(inquiryData.language) : "",
        advertisingEmail: inquiryData.newsletter_emails
          ? String(inquiryData.newsletter_emails)
          : "1",
        preferredServices: Array.isArray(inquiryData.services)
          ? inquiryData.services.map((s: any) => String(s))
          : [],
        firstServiceDate: inquiryData.first_service_requested_date || "",
        additionalRequests: inquiryData.other_service_requests || "",
        note: inquiryData.remarks || "",
        responseInquiryDate: "",
        responseTime: "",
        responseStatus: "",
        inquiry: "",
        response: "",
        orderFormSentAt: "",
        orderTime: "",
        orderFormSent: "",
        orderOwner: "",
        orderStatus: "",
      });
    }
  }, [inquiryData]);

  useEffect(() => {
    if (updateSuccess) {
      setToast({ message: "Inquiry updated successfully!", type: "success" });
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (updateError) {
      setToast({
        message: updateError || "Failed to update inquiry.",
        type: "fail",
      });
    }
  }, [updateError]);

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
      .map((item: any) => ({ value: String(item.value), label: item.label })) ||
    [];
  const genderOptions =
    dropdownOptions?.gender?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [];
  const contacterTypeOptions = dropdownOptions?.represents?.map(
    (item: any) => ({ value: String(item.value), label: item.label })
  ) || [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (name === "dateOfBirth" && value) {
      setFormData((prev: any) => ({
        ...prev,
        age: calculateAge(value).toString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    const allServiceIds = (dropdownOptions?.services || []).map((item: any) =>
      String(item.value)
    );
    const selectedServiceIds = (formData.preferredServices || []).map(
      (s: any) => String(s)
    );
    const services: Record<string, number | ""> = {};
    allServiceIds.forEach((id: string) => {
      services[id] = selectedServiceIds.includes(id) ? Number(id) : "";
    });
    const [inquiryHour, inquiryMinute] = formData.inquiryTime
      ? formData.inquiryTime.split(":")
      : ["", ""];
    const [orderHour, orderMinute] = formData.orderTime
      ? formData.orderTime.split(":")
      : ["", ""];
    // Build the payload matching the backend structure
    const payload: any = {
      first_inquiry_date: formData.inquiryDate,
      first_inquiry_hour: inquiryHour,
      first_inquiry_minute: inquiryMinute,
      responder_id: formData.assignee,
      inquiry_media_id: formData.channel,
      referral_source: formData.referralSource,
      referral_name: formData.referrerName,
      lead_status: formData.leadStatus,
      name: formData.fullName,
      name_kana: formData.fullNameKatakana,
      represents_id: formData.contacterType,
      dob_year: formData.dateOfBirth ? new Date(formData.dateOfBirth).getFullYear().toString() : "",
      dob_month: formData.dateOfBirth ? (new Date(formData.dateOfBirth).getMonth() + 1).toString() : "",
      dob_day: formData.dateOfBirth ? new Date(formData.dateOfBirth).getDate().toString() : "",
      age: formData.age,
      gender: formData.gender,
      phone1_type: formData.phone1Type,
      phone1: formData.phone1,
      phone2_type: formData.phone2Type,
      phone2: formData.phone2,
      phone3_type: formData.phone3Type,
      phone3: formData.phone3,
      email1: formData.email1,
      email2: formData.email2,
      primary_contact_phone: formData.primaryPhone,
      primary_contact_email: formData.primaryEmail,
      post_code: formData.postcode,
      prefecture_id: formData.prefecture,
      address1: formData.address1,
      address2: formData.address2,
      apartment_name: formData.building,
      language: formData.language,
      newsletter_emails: formData.advertisingEmail,
      services,
      first_service_requested_date: formData.firstServiceDate,
      other_service_requests: formData.additionalRequests,
      remarks: formData.note,
      // --- NESTED/ARRAY FIELDS ---
      station_details: (trainStations.length >= 3
        ? trainStations.slice(0, 3)
        : [
            ...trainStations,
            ...Array.from({ length: 3 - trainStations.length }, () => ({
              id: undefined,
              date_added: '',
              company: '',
              route_name: '',
              nearest_station: '',
            })),
          ]
      ).map(station => ({
        id: station.id,
        date_added: station.date_added,
        company: station.company,
        route_name: station.route_name,
        nearest_station: station.nearest_station,
      })),
      inquiry_detail: {
        person_incharge_id: formData.owner,
        inquiry_date: formData.responseInquiryDate,
        inquiry_hour: formData.responseTime ? formData.responseTime.split(":")[0] : "",
        inquiry_minute: formData.responseTime ? formData.responseTime.split(":")[1] : "",
        inquiry_status: formData.responseStatus,
        inquiry: formData.inquiry,
        answer: formData.response,
      },
      existing_inquiry_details: inquiryRecords.map(record => ({
        ...record
      })),
      inquiry_order_detail: {
        submission_date: formData.orderFormSentAt,
        submission_hour: formData.orderTime ? formData.orderTime.split(':')[0] : "",
        submission_minute: formData.orderTime ? formData.orderTime.split(':')[1] : "",
        order_form_sent: formData.orderFormSent ? 1 : 0,
        responder_id: formData.orderOwner,
        order_status: formData.orderStatus,
      },
    };
    dispatch(
      updatePublicInquiryById({ inquiryId: id as string, inquiryData: payload })
    );
  };

  const removeInquiryRecord = (index: number) => {
    if (inquiryRecords.length > 1) {
      const newRecords = inquiryRecords.filter((_, i) => i !== index);
      setInquiryRecords(newRecords);
    }
  };

  const minTrainStations = 3;
  const paddedTrainStations =
    trainStations.length >= minTrainStations
      ? trainStations
      : [
          ...trainStations,
          ...Array.from({ length: minTrainStations - trainStations.length }, () => ({
            id: undefined,
            date_added: '',
            company: '',
            route_name: '',
            nearest_station: '',
          })),
        ];

  if (loading || loadingDropdowns) {
    return (
      <InquiryTabLayout>
        <ApiLoadingWrapper loading={true} error={null}>
          <div style={{ minHeight: "400px" }} />
        </ApiLoadingWrapper>
      </InquiryTabLayout>
    );
  }
  if (error || dropdownError) {
    return (
      <InquiryTabLayout>
        <ApiLoadingWrapper
          loading={false}
          error={error || dropdownError}
          onRetry={() => id && dispatch(fetchPublicInquiryById(id as string))}
          errorTitle="Error loading inquiry data"
        >
          <div style={{ minHeight: "400px" }} />
        </ApiLoadingWrapper>
      </InquiryTabLayout>
    );
  }
  if (!formData) {
    return null;
  }

  return (
    <InquiryTabLayout>
      <ApiLoadingWrapper
        loading={loading || loadingDropdowns}
        error={error || dropdownError}
        onRetry={() => id && dispatch(fetchPublicInquiryById(id as string))}
        errorTitle="Error loading inquiry data"
      >
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={4000}
          />
        )}
        <form onSubmit={handleSubmit} className="tab-content">
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
                  readOnly
                  disabled
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
                  label={t("admin-form.labels.assignee")}
                  options={assigneeOptions}
                  value={formData.assignee}
                  onChange={(e) =>
                    handleInputChange("assignee", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-12 col-lg-6 col-xl-3">
                <CustomSelectField
                  name="channel"
                  label={t("admin-form.labels.channel")}
                  options={channelOptions}
                  value={formData.channel}
                  onChange={(e) => handleInputChange("channel", e.target.value)}
                />
              </div>
            </div>
            <div className="row g-1 mb-4">
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
            {/* INQUIRER INFO Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adInquiryCreate.inquirerInfo")}</h3>
              <div className="row g-1 mb-1">
                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <InputField
                    name="fullNameKatakana"
                    label={t("admin-form.labels.fullNameKatakana")}
                    placeholder={t("admin-form.placeholders.fullNameKatakana")}
                    value={formData.fullNameKatakana}
                    onChange={(e) =>
                      handleInputChange("fullNameKatakana", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <InputField
                    name="fullName"
                    label={t("admin-form.labels.fullName")}
                    placeholder={t("admin-form.placeholders.fullName")}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                  />
                </div>
              </div>
              <div className="row g-1 mb-1">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                  <div className="d-flex gap-2 align-items-end">
                    <div style={{ flex: "1" }}>
                      <InputDateField
                        name="dateOfBirth"
                        label="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ width: "80px" }}>
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
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
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
                        onChange={() =>
                          handleInputChange("primaryPhone", "phone1")
                        }
                      />
                      <div className={styles.flexOne}>
                        <InputField
                          labelClassName="-ml-4"
                          name="phone1"
                          label={t("admin-form.labels.phone1")}
                          value={formData.phone1}
                          onChange={(e) =>
                            handleInputChange("phone1", e.target.value)
                          }
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
                        onChange={() =>
                          handleInputChange("primaryPhone", "phone2")
                        }
                      />
                      <div className={styles.flexOne}>
                        <InputField
                          labelClassName="-ml-4"
                          name="phone2"
                          label={t("admin-form.labels.phone2")}
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
                        onChange={() =>
                          handleInputChange("primaryPhone", "phone3")
                        }
                      />
                      <div className={styles.flexOne}>
                        <InputField
                          labelClassName="-ml-4"
                          name="phone3"
                          label={t("admin-form.labels.phone3")}
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
                      onChange={() =>
                        handleInputChange("primaryEmail", "email1")
                      }
                    />
                    <div className={styles.flexOne}>
                      <InputField
                        labelClassName="-ml-4"
                        name="email1"
                        label={t("admin-form.labels.email1")}
                        value={formData.email1}
                        onChange={(e) =>
                          handleInputChange("email1", e.target.value)
                        }
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
                      onChange={() =>
                        handleInputChange("primaryEmail", "email2")
                      }
                    />
                    <div className={styles.flexOne}>
                      <InputField
                        labelClassName="-ml-4"
                        name="email2"
                        label={t("admin-form.labels.email2")}
                        value={formData.email2}
                        onChange={(e) =>
                          handleInputChange("email2", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange("postcode", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                      <CustomSelectField
                        name="prefecture"
                        placeholder={t("admin-form.placeholders.prefecture")}
                        options={prefectureOptions}
                        value={formData.prefecture}
                        onChange={(e) =>
                          handleInputChange("prefecture", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                      <InputField
                        name="address1"
                        placeholder={t("admin-form.placeholders.address1")}
                        value={formData.address1}
                        onChange={(e) =>
                          handleInputChange("address1", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3 col-lg-4">
                      <InputField
                        name="address2"
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
            </div>

            {/* Train Station Grid */}
            <div className="">
              <label className={styles.formLabel}>
                {t("admin-form.labels.trainStation")}{" "}
              </label>
              {/* Header Row */}
              <div
                className={`${styles.gridHeader} ${styles.trainStationGrid}`}
              >
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
                      value={station.date_added}
                      onChange={(e) => {
                        const newStations = [...trainStations];
                        if (newStations[index]) {
                          newStations[index] = { ...newStations[index], date_added: e.target.value };
                        } else {
                          newStations[index] = { id: undefined, date_added: e.target.value, company: '', route_name: '', nearest_station: '' };
                        }
                        setTrainStations(newStations);
                      }}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`trainStation${index}Company`}
                      placeholder={t(
                        "admin-form.placeholders.railwayCompanyJR"
                      )}
                      value={station.company}
                      onChange={(e) => {
                        const newStations = [...trainStations];
                        if (newStations[index]) {
                          newStations[index] = { ...newStations[index], company: e.target.value };
                        } else {
                          newStations[index] = { id: undefined, date_added: '', company: e.target.value, route_name: '', nearest_station: '' };
                        }
                        setTrainStations(newStations);
                      }}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`trainStation${index}Line`}
                      placeholder={t(
                        "admin-form.placeholders.trainLineExample"
                      )}
                      value={station.route_name}
                      onChange={(e) => {
                        const newStations = [...trainStations];
                        if (newStations[index]) {
                          newStations[index] = { ...newStations[index], route_name: e.target.value };
                        } else {
                          newStations[index] = { id: undefined, date_added: '', company: '', route_name: e.target.value, nearest_station: '' };
                        }
                        setTrainStations(newStations);
                      }}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`trainStation${index}Station`}
                      placeholder={t(
                        "admin-form.placeholders.trainStationExample"
                      )}
                      value={station.nearest_station}
                      onChange={(e) => {
                        const newStations = [...trainStations];
                        if (newStations[index]) {
                          newStations[index] = { ...newStations[index], nearest_station: e.target.value };
                        } else {
                          newStations[index] = { id: undefined, date_added: '', company: '', route_name: '', nearest_station: e.target.value };
                        }
                        setTrainStations(newStations);
                      }}
                    />
                  </div>
                  <div className="d-flex gap-1">
                    <Button
                      text={t("buttons.delete")}
                      type="danger"
                      onClick={() => {
                        const newStations = trainStations.filter(
                          (_, i) => i !== index
                        );
                        setTrainStations(newStations);
                      }}
                    />
                  </div>
                </div>
              ))}
              {/* Language and Advertising Email */}
              <div className="row g-1">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                  <CustomSelectField
                    name="language"
                    label="Language"
                    options={languageOptions}
                    value={formData.language}
                    onChange={(e) =>
                      handleInputChange("language", e.target.value)
                    }
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
              </div>{" "}
            </div>
          </div>

          {/* INQUIRY DETAILS Section */}
          <div className="form-section mb-4">
            <h3 className="ad-heading">
              {t("adInquiryCreate.inquiryDetails")}
            </h3>

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
            <h3 className="ad-heading">
              {t("adInquiryCreate.inquiryResponse")}
            </h3>

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
                  onChange={(e) =>
                    handleInputChange("response", e.target.value)
                  }
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
                      value={record.inquiry_date}
                      onChange={(e) => {
                        const newRecords = [...inquiryRecords];
                        newRecords[index] = { ...newRecords[index], inquiry_date: e.target.value };
                        setInquiryRecords(newRecords);
                      }}
                    />
                    {/* If you want a second date field, duplicate or remove as needed */}
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <SelectField
                      name={`inquiryRecord${index}Assignee`}
                      options={assigneeOptions}
                      value={record.person_incharge_id}
                      onChange={(e) => {
                        const newRecords = [...inquiryRecords];
                        newRecords[index] = { ...newRecords[index], person_incharge_id: e.target.value };
                        setInquiryRecords(newRecords);
                      }}
                    />
                    {/* UpdatedBy field if present in your data, otherwise remove */}
                  </div>
                  <div>
                    <TextAreaField
                      name={`inquiryRecord${index}Details`}
                      placeholder={t("admin-form.placeholders.inquiryDetails")}
                      value={record.inquiry}
                      onChange={(e) => {
                        const newRecords = [...inquiryRecords];
                        newRecords[index] = { ...newRecords[index], inquiry: e.target.value };
                        setInquiryRecords(newRecords);
                      }}
                      className={styles.fullHeightTextArea}
                    />
                  </div>
                  <div>
                    <TextAreaField
                      name={`inquiryRecord${index}Response`}
                      placeholder={t("admin-form.placeholders.response")}
                      value={record.answer}
                      onChange={(e) => {
                        const newRecords = [...inquiryRecords];
                        newRecords[index] = { ...newRecords[index], answer: e.target.value };
                        setInquiryRecords(newRecords);
                      }}
                      className={styles.fullHeightTextArea}
                    />
                  </div>
                  <div>
                    <SelectField
                      name={`inquiryRecord${index}Status`}
                      options={statusOptions}
                      value={record.inquiry_status}
                      onChange={(e) => {
                        const newRecords = [...inquiryRecords];
                        newRecords[index] = { ...newRecords[index], inquiry_status: e.target.value };
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
                  options={[
                    {
                      value: "orderFormSent",
                      label: t("admin-form.labels.orderFormSent"),
                    },
                  ]}
                  selectedValues={
                    formData.orderFormSent ? ["orderFormSent"] : []
                  }
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
              <div
                className={`${styles.orderStatusContainer} col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3`}
              >
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
              <div
                className={`${styles.gridHeader} ${styles.orderRecordsGrid}`}
              >
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
                      value={record.submission_date}
                      onChange={(e) => {
                        const newRecords = [...orderRecords];
                        newRecords[index] = { ...newRecords[index], submission_date: e.target.value };
                        setOrderRecords(newRecords);
                      }}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <SelectField
                      name={`orderRecord${index}Assignee`}
                      options={assigneeOptions}
                      value={record.responder_id}
                      onChange={(e) => {
                        const newRecords = [...orderRecords];
                        newRecords[index] = { ...newRecords[index], responder_id: e.target.value };
                        setOrderRecords(newRecords);
                      }}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <SelectField
                      name={`orderRecord${index}Status`}
                      options={orderStatusOptions}
                      value={record.order_status}
                      onChange={(e) => {
                        const newRecords = [...orderRecords];
                        newRecords[index] = { ...newRecords[index], order_status: e.target.value };
                        setOrderRecords(newRecords);
                      }}
                      disabled={true}
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
                  text={updateLoading ? "Updating..." : "Update"}
                  className={styles.registerButton}
                  htmlType="submit"
                  disabled={updateLoading}
                />
              </div>
            </div>
          </div>
        </form>
      </ApiLoadingWrapper>
    </InquiryTabLayout>
  );
};

export default InquiryTabEdit;
