import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import BasicInfo2Tab from '@/components/inquiry-tabs/BasicInfo2Tab';
import InquiryTabLayout from '@/components/inquiry-tabs/InquiryTabLayout';
import { Form } from '@/components/form/form';
import InputField from '@/components/input-field/input-field';
import CustomSelectField from '@/components/custom-select/custom-select';
import TextAreaField from '@/components/text-area/text-area';
import CheckboxField from '@/components/checkbox-field/checkbox-field';
import Button from '@/components/button/button';
import styles from '@/styles/components/molecules/inquiry-tab.module.scss';
import ApiHandler from '@/app/api-handler';
import { useLanguage } from '@/localization/LocalContext';
import { FiPlus, FiMinus } from 'react-icons/fi';
import Toast from '@/components/toast/toast';
import { AppDispatch, RootState } from '@/app/store';
import { getHkService, resetGetHkService } from '@/app/customer/getHkServiceSlice';
import { fetchCustomerServicesDropdowns, resetCustomerServicesDropdowns } from '@/app/features/dropdowns/getCustomerServicesDropdownsSlice';
import ApiLoadingWrapper from '@/components/api-loading-wrapper/api-loading-wrapper';

export default function BasicInfo2HKEditPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const hkServiceState = useSelector((state: RootState) => state.getHkService) || {};
  const { data: hkServiceData, loading: hkServiceLoading = false, error: hkServiceError = null } = hkServiceState;
  
  // Dropdown state
  const dropdownState = useSelector((state: RootState) => state.customerServicesDropdowns) || {};
  const { customerServicesDropdowns: dropdownOptions, loading: loadingDropdowns = false, error: dropdownError = null } = dropdownState;
  
  const [formData, setFormData] = useState({
    // Basic Service Info
    owner: "",
    
    // Service Details
    serviceDetails: [] as string[],
    otherRequirement: [""] as string[],
    otherRequirementText: "",
    
    // Cleaning Area
    cleaningArea: [] as string[],
    otherCleaningArea: [""] as string[],
    otherCleaningAreaText: "",
    
    // Inspection Area
    inspectionArea: [] as string[],
    
    // Other
    layout: "",
    layoutMap: null as File | null,
    existingLayoutMap: [] as string[],
    atHomeStatus: "",
    pets: [] as string[],
    otherPet: "", // Changed from array to single string
    
    // Note
    note: ""
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load dropdown options using Redux
  useEffect(() => {
    dispatch(fetchCustomerServicesDropdowns());
  }, [dispatch]);

  // Reset dropdown state on component mount
  useEffect(() => {
    dispatch(resetCustomerServicesDropdowns());
  }, [dispatch]);

  // Load existing data using Redux
  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(getHkService(id));
    }
  }, [id, dispatch]);

  // Reset HK service state on component mount
  useEffect(() => {
    dispatch(resetGetHkService());
  }, [dispatch]);

  // Handle HK service data when loaded
  useEffect(() => {
    if (hkServiceData) {
      const data = hkServiceData;
      
      // Convert service details from indexed object to array
      const serviceDetailsArray: string[] = [];
      if (data.service_details) {
        Object.values(data.service_details).forEach((value: any) => {
          if (value) serviceDetailsArray.push(String(value));
        });
      }
      
      // Convert cleaning locations from indexed object to array
      const cleaningAreaArray: string[] = [];
      if (data.cleaning_locations) {
        Object.values(data.cleaning_locations).forEach((value: any) => {
          if (value) cleaningAreaArray.push(String(value));
        });
      }
      
      // Convert inspection locations from indexed object to array
      const inspectionAreaArray: string[] = [];
      if (data.inspection_locations) {
        Object.values(data.inspection_locations).forEach((value: any) => {
          if (value) inspectionAreaArray.push(String(value));
        });
      }
      
      // Convert pets from indexed object to array
      const petsArray: string[] = [];
      if (data.pets) {
        Object.values(data.pets).forEach((value: any) => {
          if (value) petsArray.push(String(value));
        });
      }
      
      // Convert more service details from indexed object to array
      const otherRequirementArray = [];
      if (data.more_service_details) {
        Object.values(data.more_service_details).forEach((value: any) => {
          if (value) otherRequirementArray.push(String(value));
        });
      }
      if (otherRequirementArray.length === 0) otherRequirementArray.push("");
      
      // Convert more cleaning locations from indexed object to array
      const otherCleaningAreaArray = [];
      if (data.more_cleaning_locations) {
        Object.values(data.more_cleaning_locations).forEach((value: any) => {
          if (value) otherCleaningAreaArray.push(String(value));
        });
      }
      if (otherCleaningAreaArray.length === 0) otherCleaningAreaArray.push("");
      
      // Use pet_others as a string directly
      const otherPetValue: string = typeof data.pet_others === "string" ? data.pet_others : "";
      
      // Check if there are any "other" values and add "other" to the main arrays
      const hasOtherServiceDetails = otherRequirementArray.some(item => item && item.trim() !== "");
      const hasOtherCleaningAreas = otherCleaningAreaArray.some(item => item && item.trim() !== "");
      const hasOtherPets = typeof otherPetValue === 'string' && otherPetValue.trim() !== "";
      
      // Add "other" to service details if there are other service details
      if (hasOtherServiceDetails && !serviceDetailsArray.includes("other")) {
        serviceDetailsArray.push("other");
      }
      
      // Add "other" to cleaning areas if there are other cleaning areas
      if (hasOtherCleaningAreas && !cleaningAreaArray.includes("other")) {
        cleaningAreaArray.push("other");
      }
      
      // Add "other" to pets if there are other pets
      if (hasOtherPets && !petsArray.includes("other")) {
        petsArray.push("other");
      }

      setFormData({
        owner: data.person_incharge_id ? String(data.person_incharge_id) : "",
        serviceDetails: serviceDetailsArray,
        otherRequirement: otherRequirementArray,
        otherRequirementText: data.other_service_details || "",
        cleaningArea: cleaningAreaArray,
        otherCleaningArea: otherCleaningAreaArray,
        otherCleaningAreaText: data.other_cleaning_locations || "",
        inspectionArea: inspectionAreaArray,
        layout: data.floor_plan || "",
        layoutMap: null,
        existingLayoutMap: data.existing_floor_plan_attachment || [],
        atHomeStatus: data.home_status ? String(data.home_status) : "",
        pets: petsArray,
        otherPet: otherPetValue, // Single string value
        note: data.remarks || ""
      });
    }
  }, [hkServiceData]);

  // Handle HK service error
  useEffect(() => {
    if (hkServiceError) {
      setToast({ message: 'Failed to load HK service data. Please try again.', type: 'fail' });
    }
  }, [hkServiceError]);

  // Synchronize 'other' checked state after both dropdownOptions and formData are loaded
  useEffect(() => {
    if (!dropdownOptions) return;
    setFormData(prev => {
      let updated = { ...prev };
      // Service Details
      const hasOtherService = prev.otherRequirement.some(item => item && item.trim() !== "");
      if (hasOtherService && !prev.serviceDetails.includes("other")) {
        updated.serviceDetails = [...prev.serviceDetails, "other"];
      } else if (!hasOtherService && prev.serviceDetails.includes("other")) {
        updated.serviceDetails = prev.serviceDetails.filter(v => v !== "other");
      }
      // Cleaning Area
      const hasOtherCleaning = prev.otherCleaningArea.some(item => item && item.trim() !== "");
      if (hasOtherCleaning && !prev.cleaningArea.includes("other")) {
        updated.cleaningArea = [...prev.cleaningArea, "other"];
      } else if (!hasOtherCleaning && prev.cleaningArea.includes("other")) {
        updated.cleaningArea = prev.cleaningArea.filter(item => item !== "other");
      }
      // Pets
      const hasOtherPet = prev.otherPet && prev.otherPet.trim() !== "";
      if (hasOtherPet && !prev.pets.includes("other")) {
        updated.pets = [...prev.pets, "other"];
      } else if (!hasOtherPet && prev.pets.includes("other")) {
        updated.pets = prev.pets.filter(v => v !== "other");
      }
      return updated;
    });
  }, [dropdownOptions, hkServiceData]);

  const handleInputChange = (name: string, value: any) => {
    if (name.toLowerCase().includes('file') || name.toLowerCase().includes('upload') || name.toLowerCase().includes('attachment')) {
      return;
    }

    setFormData((prev) => {
      let updatedFormData = {
        ...prev,
        [name]: value,
      };
      
      // Auto-check "other" for pets when otherPet field changes
      if (name === "otherPet") {
        const hasOtherValue = value && value.trim() !== "";
        if (hasOtherValue && !prev.pets.includes("other")) {
          updatedFormData.pets = [...prev.pets, "other"];
        } else if (!hasOtherValue && prev.pets.includes("other")) {
          updatedFormData.pets = prev.pets.filter(item => item !== "other");
        }
      }
      
      return updatedFormData;
    });
  };

  // Handle dynamic other input changes
  const handleOtherInputChange = (field: string, index: number, value: string) => {
    setFormData((prev) => {
      const currentValue = prev[field as keyof typeof prev];
      if (Array.isArray(currentValue)) {
        const newArray = currentValue.map((item: string, i: number) => 
          i === index ? value : item
        );
        
        // Check if any "other" values exist and automatically check "other" option
        let updatedFormData = {
          ...prev,
          [field]: newArray
        };
        
        // Auto-check "other" for service details
        if (field === "otherRequirement") {
          const hasOtherValues = newArray.some(item => item && item.trim() !== "");
          if (hasOtherValues && !prev.serviceDetails.includes("other")) {
            updatedFormData.serviceDetails = [...prev.serviceDetails, "other"];
          } else if (!hasOtherValues && prev.serviceDetails.includes("other")) {
            updatedFormData.serviceDetails = prev.serviceDetails.filter(item => item !== "other");
          }
        }
        
        // Auto-check "other" for cleaning areas
        if (field === "otherCleaningArea") {
          const hasOtherValues = newArray.some(item => item && item.trim() !== "");
          if (hasOtherValues && !prev.cleaningArea.includes("other")) {
            updatedFormData.cleaningArea = [...prev.cleaningArea, "other"];
          } else if (!hasOtherValues && prev.cleaningArea.includes("other")) {
            updatedFormData.cleaningArea = prev.cleaningArea.filter(item => item !== "other");
          }
        }
        
        return updatedFormData;
      }
      return prev;
    });
  };

  // Add new other input
  const addOtherInput = (field: string) => {
    setFormData((prev) => {
      const currentValue = prev[field as keyof typeof prev];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: [...currentValue, ""]
        };
      }
      return prev;
    });
  };

  // Remove other input
  const removeOtherInput = (field: string, index: number) => {
    setFormData((prev) => {
      const currentValue = prev[field as keyof typeof prev];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: currentValue.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      layoutMap: file,
    }));
  };

  const handleSubmit = async () => {
    if (!id || typeof id !== 'string') {
      setToast({ message: "Invalid ID", type: "fail" });
      return;
    }

    setSubmitting(true);
    try {
      // Create FormData for file upload
      const submissionData = new FormData();
      
      // Add basic data
      submissionData.append('id', String(hkServiceData?.id || id));
      submissionData.append('customer_id', String(id));
      submissionData.append('person_incharge_id', formData.owner);
      
      // Add service details as indexed array (filter out "other")
      formData.serviceDetails.filter(service => service !== "other").forEach((service, index) => {
        submissionData.append(`service_details[${index + 1}]`, service);
      });
      
      // Add more service details as indexed array (only if "other" is checked)
      if (formData.serviceDetails.includes("other")) {
        formData.otherRequirement.filter(item => item.trim()).forEach((item, index) => {
          submissionData.append(`more_service_details[${index + 1}]`, item);
        });
      } else {
        // Send empty array when "other" is unchecked
        submissionData.append('more_service_details[0]', '');
      }
      
      submissionData.append('other_service_details', formData.otherRequirementText);
      
      // Add cleaning locations as indexed array (filter out "other")
      formData.cleaningArea.filter(area => area !== "other").forEach((area, index) => {
        submissionData.append(`cleaning_locations[${index + 1}]`, area);
      });
      
      // Add more cleaning locations as indexed array (only if "other" is checked)
      if (formData.cleaningArea.includes("other")) {
        formData.otherCleaningArea.filter(item => item.trim()).forEach((item, index) => {
          submissionData.append(`more_cleaning_locations[${index + 1}]`, item);
        });
      } else {
        // Send empty array when "other" is unchecked
        submissionData.append('more_cleaning_locations[0]', '');
      }
      
      submissionData.append('other_cleaning_locations', formData.otherCleaningAreaText);
      
      // Add inspection locations as indexed array
      formData.inspectionArea.forEach((area, index) => {
        submissionData.append(`inspection_locations[${index + 1}]`, area);
      });
      
      submissionData.append('floor_plan', formData.layout);
      
      // Add existing floor plan attachments
      formData.existingLayoutMap.forEach((attachment, index) => {
        submissionData.append(`existing_floor_plan_attachment[${index}]`, attachment);
      });
      
      // Add new floor plan file if uploaded
      if (formData.layoutMap) {
        submissionData.append('floor_plan_attachment[0]', formData.layoutMap);
      }
      
      // Add pets as indexed array (filter out "other")
      formData.pets.filter(pet => pet !== "other").forEach((pet, index) => {
        submissionData.append(`pets[${index + 1}]`, pet);
      });
      
      // Add pet others as simple string (only if "other" is checked)
      if (formData.pets.includes("other") && formData.otherPet && formData.otherPet.trim()) {
        submissionData.append('pet_others', formData.otherPet);
      } else {
        // Send empty string when "other" is unchecked
        submissionData.append('pet_others', '');
      }
      
      submissionData.append('home_status', formData.atHomeStatus);
      submissionData.append('remarks', formData.note);

      const res = await ApiHandler.request(
        "/api/company/customer/hk-service/save",
        "POST",
        submissionData
      );
      
      if (res.success) {
        setToast({ message: "HK service updated successfully!", type: "success" });
        // Refetch the data after successful update
        dispatch(getHkService(id));
      } else {
        setToast({ message: res.message || "Failed to update HK service", type: "fail" });
      }
    } catch (error: any) {
      setToast({ message: error.message || "Failed to update HK service", type: "fail" });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to generate generic options if backend options are empty
  const generateGenericOptions = (count: number = 8) => {
    return Array.from({ length: count }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Option ${i + 1}`,
    }));
  };

  // Dropdown options from backend with fallback generic options
  const assigneeOptions =
    dropdownOptions?.users
      ?.filter((user: any) => user.status)
      .map((item: any) => ({ value: String(item.value), label: item.label })) || generateGenericOptions(5);

  const atHomeStatusOptions =
    dropdownOptions?.home_statuses?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  // Service Details Options
  const serviceDetailOptions = React.useMemo(() => {
    let opts = dropdownOptions?.hk_hc_services?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(18);
    // Ensure 'other' is present if needed
    if (!opts.some((o: any) => o.value === 'other')) {
      opts = [...opts, { value: 'other', label: 'Other' }];
    }
    return opts;
  }, [dropdownOptions]);

  // Cleaning Area Options
  const cleaningAreaOptions = React.useMemo(() => {
    let opts = dropdownOptions?.hk_hc_cleaning_areas?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(13);
    if (!opts.some((o: any) => o.value === 'other')) {
      opts = [...opts, { value: 'other', label: 'Other' }];
    }
    return opts;
  }, [dropdownOptions]);

  // Inspection Area Options
  const inspectionAreaOptions =
    dropdownOptions?.hk_hc_inspection_areas?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(4);

  // Pet Options
  const petOptions = React.useMemo(() => {
    let opts = dropdownOptions?.hk_hc_pets?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(4);
    if (!opts.some((o: any) => o.value === 'other')) {
      opts = [...opts, { value: 'other', label: 'Other' }];
    }
    return opts;
  }, [dropdownOptions]);

  return (
    <InquiryTabLayout>
      <BasicInfo2Tab>
        <ApiLoadingWrapper
          loading={loadingDropdowns || hkServiceLoading}
          error={dropdownError || hkServiceError}
          onRetry={() => {
            // Retry both dropdowns and service data
            dispatch(fetchCustomerServicesDropdowns());
            dispatch(resetCustomerServicesDropdowns());
            if (id && typeof id === 'string') dispatch(getHkService(id));
          }}
        >
          <div className="nested-tab-content-inner">
            {/* Toast Notification */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                duration={4000}
              />
            )}

            <Form
              onSubmit={handleSubmit}
              registerBtnText="UPDATE"
              setErrors={setErrors}
              errors={errors}
            >
              {/* BASIC SERVICE INFO Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHk.basicServiceInfo")}</h3>

                <div className="row g-1">
                  <div className="col-sm-12 col-lg-6 col-xl-4">
                    <CustomSelectField
                      name="owner"
                      label={t("admin-form.labels.owner")}
                      placeholder={t("admin-form.placeholders.owner")}
                      options={assigneeOptions}
                      value={formData.owner}
                      onChange={(e) => handleInputChange("owner", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SERVICE DETAILS Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHk.serviceDetails")}</h3>

                <div className="row g-1 mb-3">
                  <div className="col-md-12">
                    <CheckboxField
                      name="serviceDetails"
                      label={t("admin-form.labels.serviceDetails")}
                      options={serviceDetailOptions}
                      selectedValues={formData.serviceDetails}
                      onChange={(values) => handleInputChange("serviceDetails", values)}
                    />
                  </div>
                </div>

                {formData.serviceDetails.includes("other") && (
                  <div className="row g-1 mb-3">
                    <div className="col-md-12">
                      
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        {formData.otherRequirement.map((item, index) => (
                          <div key={index} className="d-flex align-items-center gap-1">
                            <InputField
                              name={`otherRequirement_${index}`}
                              placeholder={t("admin-form.placeholders.otherRequirement")}
                              value={item}
                              onChange={(e) => handleOtherInputChange("otherRequirement", index, e.target.value)}
                            />
                            {formData.otherRequirement.length > 1 && (
                              <Button
                                type="danger"
                                className={`${styles.addButton} ${styles.danger}`}
                                size="small"
                                icon={<FiMinus />}
                                onClick={() => removeOtherInput("otherRequirement", index)}
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          className={styles.addButton}
                          size="small"
                          icon={<FiPlus />}
                          onClick={() => addOtherInput("otherRequirement")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="row g-1">
                  <div className="col-md-12">
                    <TextAreaField
                      name="otherRequirementText"
                      label={t("admin-form.labels.otherRequirementText")}
                      placeholder={t("admin-form.placeholders.otherRequirement")}
                      value={formData.otherRequirementText}
                      onChange={(e) => handleInputChange("otherRequirementText", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* CLEANING AREA Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHk.cleaningArea")}</h3>

                <div className="row g-1 mb-3">
                  <div className="col-md-12">
                    <CheckboxField
                      name="cleaningArea"
                      label={t("admin-form.labels.cleaningArea")}
                      options={cleaningAreaOptions}
                      selectedValues={formData.cleaningArea}
                      onChange={(values) => handleInputChange("cleaningArea", values)}
                    />
                  </div>
                </div>

                {formData.cleaningArea.includes("other") && (
                  <div className="row g-1 mb-3">
                    <div className="col-md-12">
                      
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        {formData.otherCleaningArea.map((item, index) => (
                          <div key={index} className="d-flex align-items-center gap-1">
                            <InputField
                              name={`otherCleaningArea_${index}`}
                              placeholder={t("admin-form.placeholders.otherCleaningArea")}
                              value={item}
                              onChange={(e) => handleOtherInputChange("otherCleaningArea", index, e.target.value)}
                            />
                            {formData.otherCleaningArea.length > 1 && (
                              <Button
                                type="danger"
                                className={`${styles.addButton} ${styles.danger}`}
                                size="small"
                                icon={<FiMinus />}
                                onClick={() => removeOtherInput("otherCleaningArea", index)}
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          className={styles.addButton}
                          size="small"
                          icon={<FiPlus />}
                          onClick={() => addOtherInput("otherCleaningArea")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="row g-1">
                  <div className="col-md-12">
                    <TextAreaField
                      name="otherCleaningAreaText"
                      label={t("admin-form.labels.otherCleaningAreaText")}
                      placeholder={t("admin-form.placeholders.otherCleaningArea")}
                      value={formData.otherCleaningAreaText}
                      onChange={(e) => handleInputChange("otherCleaningAreaText", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* INSPECTION AREA Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHk.inspectionArea")}</h3>

                <div className="row g-1 mb-3">
                  <div className="col-md-12">
                    <CheckboxField
                      name="inspectionArea"
                      label={t("admin-form.labels.inspectionArea")}
                      options={inspectionAreaOptions}
                      selectedValues={formData.inspectionArea}
                      onChange={(values) => handleInputChange("inspectionArea", values)}
                    />
                  </div>
                </div>
              </div>

              {/* OTHER Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHk.other")}</h3>

                <div className="row g-1 mb-3">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <InputField
                      name="layout"
                      label={t("admin-form.labels.layout")}
                      placeholder={t("admin-form.placeholders.layout")}
                      value={formData.layout}
                      onChange={(e) => handleInputChange("layout", e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <InputField
                      type="file"
                      name="layoutMap"
                      label={t("admin-form.labels.layoutMap")}
                      accept="image/*,.pdf"
                      value={formData.layoutMap?.name || ""}
                      fileValue={formData.layoutMap}
                      onFileChange={handleFileChange}
                      existingFileName={formData.existingLayoutMap.length > 0 ? "Existing file" : undefined}
                      icon="📎"
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                    <CustomSelectField
                      name="atHomeStatus"
                      label={t("admin-form.labels.atHomeStatus")}
                      options={atHomeStatusOptions}
                      value={formData.atHomeStatus}
                      onChange={(e) => handleInputChange("atHomeStatus", e.target.value)}
                    />
                  </div>
                </div>

                <div className="row g-1 mb-3">
                  <div className="col-md-12">
                    <CheckboxField
                      name="pets"
                      label={t("admin-form.labels.pets")}
                      options={petOptions}
                      selectedValues={formData.pets}
                      onChange={(values) => handleInputChange("pets", values)}
                    />
                  </div>
                </div>

                {formData.pets.includes("other") && (
                  <div className="row g-1 mb-3">
                    <div className="col-md-12">
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <InputField
                          name="otherPet"
                          placeholder={t("admin-form.placeholders.otherPet")}
                          value={formData.otherPet}
                          onChange={(e) => handleInputChange("otherPet", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* NOTE Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHk.note")}</h3>

                <div className="row g-1">
                  <div className="col-md-12">
                    <TextAreaField
                      name="note"
                      label={t("admin-form.labels.noteText")}
                      placeholder={t("admin-form.placeholders.note")}
                      value={formData.note}
                      onChange={(e) => handleInputChange("note", e.target.value)}
                      rows={6}
                    />
                  </div>
                </div>
              </div>

              {/* Submit & Delete Buttons */}
              <div className="form-section mb-4">
                <div className="row">
                  <div className="col-12 d-flex justify-content-center gap-2">
                    <Button 
                      text="UPDATE"
                      className={styles.registerButton}
                      htmlType="submit"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </ApiLoadingWrapper>
      </BasicInfo2Tab>
    </InquiryTabLayout>
  );
} 