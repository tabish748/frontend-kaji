import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from "../form/form";
import InputField from "../input-field/input-field";
import CustomSelectField from "../custom-select/custom-select";
import SelectField from "../select-field/select-field";
import InputDateField from "../input-date/input-date";
import TextAreaField from "../text-area/text-area";
import CheckboxField from "../checkbox-field/checkbox-field";
import RadioField from "../radio-field/radio-field";
import styles from "../../styles/components/molecules/inquiry-tab.module.scss";
import { calculateAge, parseDateForAPI } from "../../libs/utils";
import Button from "../button/button";
import { useLanguage } from "../../localization/LocalContext";
import { AppDispatch, RootState } from '../../app/store';
import { fetchAdminDropdowns } from '../../app/features/dropdowns/getAdminDropdownsSlice';
import { createCustomerBasicInfo, resetCreateCustomerBasicInfo } from '../../app/customer/createCustomerBasicInfoSlice';
import Toast from "../toast/toast";
import ApiLoadingWrapper from "../api-loading-wrapper/api-loading-wrapper";

const BasicInfo1Tab: React.FC = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const adminDropdownsState = useSelector((state: RootState) => state.adminDropdowns) || {};
  const createCustomerState = useSelector((state: RootState) => state.createCustomerBasicInfo) || {};
  
  const { adminDropdowns, loading: dropdownsLoading = false, error: dropdownsError = null } = adminDropdownsState;
  const { loading: createLoading = false, success: createSuccess = false, error: createError = null } = createCustomerState;
  
  // Toast state
  const [toast, setToast] = useState<{ message: string | string[]; type: string } | null>(null);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  
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
    proxyCheckIn: "1", // Default to "required"
    matchingListHK: [],
    matchingListBS: [],
    note1: "",
    note2: "",
    note3: ""
  });

  // Train stations data - start with one empty row
  const [trainStations, setTrainStations] = useState([
    {
      date: "",
      railwayCompany: "",
      trainLine: "",
      trainStation: "",
    },
  ]);

  // Key possession records data - start with one empty row
  const [keyPossessionRecords, setKeyPossessionRecords] = useState([
    {
      dateReceived: "",
      dateReturned: "",
      staffName: "",
      status: "",
      receipt: null as File | null,
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Function to reset form to initial state
  const resetForm = () => {
    setFormData({
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
      proxyCheckIn: "1", // Default to "required"
      matchingListHK: [],
      matchingListBS: [],
      note1: "",
      note2: "",
      note3: ""
    });

    // Reset train stations to single empty row
    setTrainStations([
      {
        date: "",
        railwayCompany: "",
        trainLine: "",
        trainStation: "",
      },
    ]);

    // Reset key possession records to single empty row
    setKeyPossessionRecords([
    {
      dateReceived: "",
      dateReturned: "",
      staffName: "",
      status: "",
      receipt: null,
    },
  ]);

    // Clear any form errors
    setErrors({});
  };

  // Fetch dropdowns on component mount - allow retry on errors
  useEffect(() => {
    if (!dropdownsLoaded && !dropdownsLoading && !dropdownsError) {
      dispatch(fetchAdminDropdowns());
      setDropdownsLoaded(true);
    }
  }, [dispatch, dropdownsLoaded, dropdownsLoading, dropdownsError]);

  // Reset create state on component mount
  useEffect(() => {
    dispatch(resetCreateCustomerBasicInfo());
  }, [dispatch]);

  // Handle success state
  useEffect(() => {
    if (createSuccess) {
      setToast({ message: 'Customer created successfully!', type: 'success' });
      // Reset form after successful save
      resetForm();
      dispatch(resetCreateCustomerBasicInfo());
    }
  }, [createSuccess, dispatch]);

  // Handle error state
  useEffect(() => {
    if (createError) {
      let errorMessage: string | string[] = 'Failed to create customer. Please try again.';
      
      // Check if createError contains validation errors in the expected format
      if (createError && typeof createError === 'object') {
        const errorMessages: string[] = [];
        
        // Iterate through each field's errors
        Object.entries(createError).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            // Add each error message for this field
            messages.forEach((message: string) => {
              errorMessages.push(message);
            });
          } else if (typeof messages === 'string') {
            // Handle case where message is a single string
            errorMessages.push(messages);
          }
        });
        
        // If we found validation errors, use them as array instead of joined string
        if (errorMessages.length > 0) {
          errorMessage = errorMessages;
        }
      } else if (typeof createError === 'string') {
        // If error is just a string, use it directly
        errorMessage = createError;
      }
      
      setToast({ message: errorMessage, type: 'fail' });
      // Clear error state after toast duration + small buffer
      setTimeout(() => {
        if (createError) {
          dispatch(resetCreateCustomerBasicInfo());
        }
      }, 4500); // Toast duration (4000ms) + 500ms buffer
    }
  }, [createError, dispatch]);

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

  // Removed complex train station validation - now using required validation on first row fields only

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
    // Transform form data to API format
    const dobParsed = parseDateForAPI(formData.dateOfBirth);
    
    // Create FormData to handle file uploads properly
    const submissionData = new FormData();
    
    // Add basic customer data to FormData
    submissionData.append('first_inquiry_date', formData.orderDate);
    submissionData.append('first_inquiry_hour', formData.orderTime.split(':')[0] || '');
    submissionData.append('first_inquiry_minute', formData.orderTime.split(':')[1] || '');
    submissionData.append('customer_status', formData.customerStatus);
    submissionData.append('name', formData.fullName);
    submissionData.append('name_kana', formData.fullNameKatakana);
    submissionData.append('represents_id', formData.customerType);
    submissionData.append('dob_year', dobParsed.year);
    submissionData.append('dob_month', dobParsed.month);
    submissionData.append('dob_day', dobParsed.day);
    submissionData.append('age', formData.age);
    submissionData.append('gender', formData.gender);
    submissionData.append('phone1_type', formData.phone1Type);
    submissionData.append('phone1', formData.phone1);
    submissionData.append('phone2_type', formData.phone2Type);
    submissionData.append('phone2', formData.phone2);
    submissionData.append('phone3_type', formData.phone3Type);
    submissionData.append('phone3', formData.phone3);
    submissionData.append('email1', formData.email1);
    submissionData.append('email2', formData.email2);
    submissionData.append('primary_contact_phone', formData.primaryPhone);
    submissionData.append('primary_contact_email', formData.primaryEmail);
    submissionData.append('post_code', formData.postcode);
    submissionData.append('prefecture_id', formData.prefecture);
    submissionData.append('address1', formData.address1);
    submissionData.append('address2', formData.address2);
    submissionData.append('apartment_name', formData.building);
    submissionData.append('language', formData.language);
    submissionData.append('newsletter_emails', formData.advertisingEmail);
    
    // Add services as indexed array
    formData.preferredServices.forEach((service, index) => {
      submissionData.append(`services[${service}]`, service);
    });
    
    // Add train stations
    trainStations.filter(station => 
        station.date || station.railwayCompany || station.trainLine || station.trainStation
    ).forEach((station, index) => {
      submissionData.append(`station_details[${index}][date_added]`, station.date);
      submissionData.append(`station_details[${index}][company]`, station.railwayCompany);
      submissionData.append(`station_details[${index}][route_name]`, station.trainLine);
      submissionData.append(`station_details[${index}][nearest_station]`, station.trainStation);
    });
    
    // Add key information with file uploads using the correct indexed format
    keyPossessionRecords.filter(record => 
      record.dateReceived || record.dateReturned || record.staffName || record.status || record.receipt
    ).forEach((record, recordIndex) => {
      const keyIndex = recordIndex + 1; // Use 1-based indexing for API
      submissionData.append(`key_information[${keyIndex}][date_added]`, record.dateReceived);
      submissionData.append(`key_information[${keyIndex}][date_returned]`, record.dateReturned);
      submissionData.append(`key_information[${keyIndex}][user_id]`, record.staffName);
      submissionData.append(`key_information[${keyIndex}][status]`, record.status);
      
      // Add receipt file if it exists
      if (record.receipt) {
        submissionData.append(`key_information[${keyIndex}][receipt][0]`, record.receipt);
      }
    });
    
    submissionData.append('deputy_checkin', formData.proxyCheckIn);
    submissionData.append('deputy_remarks', formData.note1);
    
    // Add match lists as indexed arrays
    formData.matchingListHK.forEach((item) => {
      submissionData.append(`match_list_hk[${item}]`, item);
    });
    formData.matchingListBS.forEach((item) => {
      submissionData.append(`match_list_bs[${item}]`, item);
    });
    
    submissionData.append('match_list_remarks', formData.note2);
    submissionData.append('remarks', formData.note3);

    dispatch(createCustomerBasicInfo(submissionData));
  };

  // Helper function to generate generic options if backend options are empty
  const generateGenericOptions = (count: number = 8) => {
    return Array.from({ length: count }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Option ${i + 1}`,
    }));
  };

  // Dropdown options from Redux state with fallback generic options
  const customerStatusOptions =
    adminDropdowns?.customer_status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);
  
  const customerTypeOptions =
    adminDropdowns?.represents?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(4);

  const genderOptions =
    adminDropdowns?.gender?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const phoneTypeOptions =
    adminDropdowns?.phone_types?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const prefectureOptions =
    adminDropdowns?.prefectures?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(47);

  const languageOptions =
    adminDropdowns?.language?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const advertisingEmailOptions =
    adminDropdowns?.newsletter?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(2);

  const serviceOptions =
    adminDropdowns?.services?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(6);

  const matchingListHKOptions =
    adminDropdowns?.matching_list_hk?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(8);

  const matchingListBSOptions =
    adminDropdowns?.matching_list_bs?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(8);

  // Proxy Check-In options with proper values and translations
  const proxyCheckInOptions = [
    { value: "0", label: t("adBasicInfo1.options.proxyCheckIn.notRequired") },
    { value: "1", label: t("adBasicInfo1.options.proxyCheckIn.required") }
  ];
  
  const statusOptions = generateGenericOptions(3);

  const assigneeOptions =
    adminDropdowns?.users
      ?.filter((user: any) => user.status)
      .map((item: any) => ({ value: String(item.value), label: item.label })) || generateGenericOptions(5);

  // Helper function to update train station - simplified to avoid interference with input
  const updateTrainStation = (index: number, field: string, value: string) => {
    const newStations = [...trainStations];
    newStations[index] = { ...newStations[index], [field]: value };
    setTrainStations(newStations);
  };

  // Helper function to update key record - simplified to avoid interference with input
  const updateKeyRecord = (index: number, field: string, value: any) => {
    const newRecords = [...keyPossessionRecords];
    newRecords[index] = { ...newRecords[index], [field]: value };
    setKeyPossessionRecords(newRecords);
  };

  // Use useEffect to handle dynamic row addition after state updates
  useEffect(() => {
    // Check if we need to add empty train station row
    const lastTrainStation = trainStations[trainStations.length - 1];
    const hasContentInLastRow = lastTrainStation.date || lastTrainStation.railwayCompany || 
                               lastTrainStation.trainLine || lastTrainStation.trainStation;
    
    if (hasContentInLastRow && trainStations.length < 10) { // Limit to prevent infinite rows
      setTrainStations(prev => [...prev, {
        date: "",
        railwayCompany: "",
        trainLine: "",
        trainStation: "",
      }]);
    }
  }, [trainStations]);

  // Use useEffect to handle dynamic key record addition after state updates
  useEffect(() => {
    // Check if we need to add empty key record row
    const lastKeyRecord = keyPossessionRecords[keyPossessionRecords.length - 1];
    const hasContentInLastRow = lastKeyRecord.dateReceived || lastKeyRecord.dateReturned || 
                               lastKeyRecord.staffName || lastKeyRecord.status || lastKeyRecord.receipt;
    
    if (hasContentInLastRow && keyPossessionRecords.length < 10) { // Limit to prevent infinite rows
      setKeyPossessionRecords(prev => [...prev, {
        dateReceived: "",
        dateReturned: "",
        staffName: "",
        status: "",
        receipt: null,
      }]);
    }
  }, [keyPossessionRecords]);

  return (
    <ApiLoadingWrapper
      loading={dropdownsLoading}
      error={dropdownsError}
      onRetry={() => dispatch(fetchAdminDropdowns())}
      errorTitle="Error loading form options"
    >
    <div className="tab-content">
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => {
              setToast(null);
              // Clear error state when toast is closed
              if (toast.type === 'fail' && createError) {
                dispatch(resetCreateCustomerBasicInfo());
              }
            }}
            duration={4000}
          />
        )}
        
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
                      type="tel"
                      label={t("admin-form.labels.phone1")}
                      placeholder={t("admin-form.placeholders.phone")}
                      value={formData.phone1}
                      onChange={(e) => handleInputChange("phone1", e.target.value)}
                      validations={[{ type: "required" }, { type: "isNumber" }]}
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
                  validations={formData.phone1 ? [{ type: "required" }] : []}
                  tag={formData.phone1 ? [{ value: "required", label: "Required" }] : []}
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
                      validations={formData.phone2 ? [{ type: "isNumber" }] : []}
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone2Type"
                  label={t("admin-form.labels.type")}
                  options={phoneTypeOptions}
                  value={formData.phone2Type}
                  onChange={(e) => handleInputChange("phone2Type", e.target.value)}
                  validations={formData.phone2 ? [{ type: "required" }] : []}
                  tag={formData.phone2 ? [{ value: "required", label: "Required" }] : []}
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
                      validations={formData.phone3 ? [{ type: "isNumber" }] : []}
                    />
                  </div>
                </div>
                <CustomSelectField
                  name="phone3Type"
                  label={t("admin-form.labels.type")}
                  options={phoneTypeOptions}
                  value={formData.phone3Type}
                  onChange={(e) => handleInputChange("phone3Type", e.target.value)}
                  validations={formData.phone3 ? [{ type: "required" }] : []}
                  tag={formData.phone3 ? [{ value: "required", label: "Required" }] : []}
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
                    validations={[{ type: "required" }, { type: "isNumber" }]}
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
                    onChange={(e) => updateTrainStation(index, 'date', e.target.value)}
                    validations={index === 0 ? [{ type: "required" }] : []}
                    tag={index === 0 ? [{ value: "required", label: "Required" }] : []}
                  />
                </div>
                <div>
                  <InputField
                    name={`trainStation${index}Company`}
                    placeholder={t("admin-form.placeholders.railwayCompanyJR")}
                    value={station.railwayCompany}
                    onChange={(e) => updateTrainStation(index, 'railwayCompany', e.target.value)}
                    validations={index === 0 ? [{ type: "required" }] : []}
                    tag={index === 0 ? [{ value: "required", label: "Required" }] : []}
                  />
                </div>
                <div>
                  <InputField
                    name={`trainStation${index}Line`}
                    placeholder={t("admin-form.placeholders.trainLineExample")}
                    value={station.trainLine}
                    onChange={(e) => updateTrainStation(index, 'trainLine', e.target.value)}
                    validations={index === 0 ? [{ type: "required" }] : []}
                    tag={index === 0 ? [{ value: "required", label: "Required" }] : []}
                  />
                </div>
                <div>
                  <InputField
                    name={`trainStation${index}Station`}
                    placeholder={t("admin-form.placeholders.trainStationExample")}
                    value={station.trainStation}
                    onChange={(e) => updateTrainStation(index, 'trainStation', e.target.value)}
                    validations={index === 0 ? [{ type: "required" }] : []}
                    tag={index === 0 ? [{ value: "required", label: "Required" }] : []}
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
                    onChange={(e) => updateKeyRecord(index, 'dateReceived', e.target.value)}
                  />
                </div>
                <div>
                  <InputDateField
                    name={`keyRecord${index}DateReturned`}
                    placeholder={t("admin-form.placeholders.japaneseDate")}
                    value={record.dateReturned}
                    onChange={(e) => updateKeyRecord(index, 'dateReturned', e.target.value)}
                  />
                </div>
                <div>
                  <SelectField
                    name={`keyRecord${index}StaffName`}
                    placeholder="Staff name"
                    options={assigneeOptions}
                    value={record.staffName}
                    onChange={(e) => updateKeyRecord(index, 'staffName', e.target.value)}
                  />
                </div>
                <div>
                  <SelectField
                    name={`keyRecord${index}Status`}
                    placeholder="Status"
                    options={statusOptions}
                    value={record.status}
                    onChange={(e) => updateKeyRecord(index, 'status', e.target.value)}
                  />
                </div>
                <div>
                  <InputField
                    name={`keyRecord${index}Receipt`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onFileChange={(file) => {
                      if (file) {
                        updateKeyRecord(index, "receipt", file);
                      }
                    }}
                    placeholder="Upload receipt"
                  />
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
    </ApiLoadingWrapper>
  );
};

export default BasicInfo1Tab; 