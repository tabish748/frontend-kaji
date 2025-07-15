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
import { saveHcService, resetSaveHcService } from '@/app/customer/saveHcServiceSlice';
import { fetchCustomerServicesDropdowns, resetCustomerServicesDropdowns } from '@/app/features/dropdowns/getCustomerServicesDropdownsSlice';
import ApiLoadingWrapper from '@/components/api-loading-wrapper/api-loading-wrapper';

export default function BasicInfo2HCPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const saveState = useSelector((state: RootState) => state.saveHcService) || {};
  const { loading: saving, error: saveError, success: saveSuccess } = saveState;
  
  // Dropdown state from Redux
  const dropdownState = useSelector((state: RootState) => state.customerServicesDropdowns) || {};
  const { customerServicesDropdowns: dropdownOptions, loading: loadingDropdowns, error: dropdownError } = dropdownState;
  
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
    atHomeStatus: "",
    pets: [] as string[],
    otherPet: [""] as string[],
    
    // Note
    note: ""
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Load dropdowns on component mount
  useEffect(() => {
    dispatch(fetchCustomerServicesDropdowns());
  }, [dispatch]);

  // Reset HC service state on component mount
  useEffect(() => {
    dispatch(resetSaveHcService());
  }, [dispatch]);

  // Handle save success
  useEffect(() => {
    if (saveSuccess) {
      setToast({ message: 'HC service created successfully!', type: 'success' });
      // Redirect to the inquiry list or show success message
      setTimeout(() => {
        router.push('/inquiry');
      }, 2000);
      dispatch(resetSaveHcService());
    }
  }, [saveSuccess, router, dispatch]);

  // Handle save error
  useEffect(() => {
    if (saveError) {
      setToast({ message: saveError, type: 'fail' });
    }
  }, [saveError]);

  const handleInputChange = (name: string, value: any) => {
    if (name.toLowerCase().includes('file') || name.toLowerCase().includes('upload') || name.toLowerCase().includes('attachment')) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dynamic other input changes
  const handleOtherInputChange = (field: string, index: number, value: string) => {
    setFormData((prev) => {
      const currentValue = prev[field as keyof typeof prev];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: currentValue.map((item: string, i: number) => 
            i === index ? value : item
          )
        };
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
    const submissionData = new FormData();
    submissionData.append('person_incharge_id', formData.owner);
    formData.serviceDetails.filter(service => service !== "other").forEach((service, index) => {
      submissionData.append(`service_details[${index + 1}]`, service);
    });
    formData.otherRequirement.filter(item => item.trim()).forEach((item, index) => {
      submissionData.append(`more_service_details[${index + 1}]`, item);
    });
    submissionData.append('other_service_details', formData.otherRequirementText);
    formData.cleaningArea.filter(area => area !== "other").forEach((area, index) => {
      submissionData.append(`cleaning_locations[${index + 1}]`, area);
    });
    formData.otherCleaningArea.filter(item => item.trim()).forEach((item, index) => {
      submissionData.append(`more_cleaning_locations[${index + 1}]`, item);
    });
    submissionData.append('other_cleaning_locations', formData.otherCleaningAreaText);
    formData.inspectionArea.forEach((area, index) => {
      submissionData.append(`inspection_locations[${index + 1}]`, area);
    });
    submissionData.append('floor_plan', formData.layout);
    if (formData.layoutMap) {
      submissionData.append('floor_plan_attachment[0]', formData.layoutMap);
    }
    formData.pets.filter(pet => pet !== "other").forEach((pet, index) => {
      submissionData.append(`pets[${index + 1}]`, pet);
    });
    if (formData.pets.includes("other") && formData.otherPet && Array.isArray(formData.otherPet) && formData.otherPet[0] && formData.otherPet[0].trim()) {
      submissionData.append('pet_others', formData.otherPet[0]);
    } else {
      submissionData.append('pet_others', '');
    }
    submissionData.append('home_status', formData.atHomeStatus);
    submissionData.append('remarks', formData.note);
    dispatch(saveHcService(submissionData));
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

  const petOptions =
    dropdownOptions?.hk_hc_pets?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [...generateGenericOptions(4), { value: "other", label: "Other" }];

  // Service Details Options (HC specific)
  const serviceDetailOptions =
    dropdownOptions?.hk_hc_services?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [...generateGenericOptions(15), { value: "other", label: "Other" }];

  // Cleaning Area Options (HC specific)
  const cleaningAreaOptions =
    dropdownOptions?.hk_hc_cleaning_areas?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [...generateGenericOptions(10), { value: "other", label: "Other" }];

  // Inspection Area Options (HC specific)
  const inspectionAreaOptions =
    dropdownOptions?.hk_hc_inspection_areas?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(6);

  return (
    <InquiryTabLayout>
      <BasicInfo2Tab>
        <ApiLoadingWrapper
          loading={loadingDropdowns}
          error={dropdownError}
          onRetry={() => {
            dispatch(fetchCustomerServicesDropdowns());
          }}
        >
          <div className="nested-tab-content-inner">
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
              registerBtnText="REGISTER"
              setErrors={setErrors}
              errors={errors}
            >
              {/* BASIC SERVICE INFO Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHc.basicServiceInfo")}</h3>

                <div className="row g-1">
                  <div className="col-sm-12 col-lg-6 col-xl-4">
                    <InputField
                      name="owner"
                      label={t("admin-form.labels.owner")}
                      placeholder={t("admin-form.placeholders.owner")}
                      value={formData.owner}
                      onChange={(e) => handleInputChange("owner", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SERVICE DETAILS Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHc.serviceDetails")}</h3>

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
                                icon={<FiMinus    />}
                                onClick={() => removeOtherInput("otherRequirement", index)}
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          className={styles.addButton}
                          size="small"
                          icon={<FiPlus    />}
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
                                icon={<FiMinus    />}
                                onClick={() => removeOtherInput("otherCleaningArea", index)}
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          className={styles.addButton}
                          size="small"
                          icon={<FiPlus    />}
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
                <h3 className="ad-heading">{t("adHc.other")}</h3>

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
                        {formData.otherPet.map((item, index) => (
                          <div key={index} className="d-flex align-items-center gap-1">
                            <InputField
                              name={`otherPet_${index}`}
                              placeholder={t("admin-form.placeholders.otherPet")}
                              value={item}
                              onChange={(e) => handleOtherInputChange("otherPet", index, e.target.value)}
                            />
                            {formData.otherPet.length > 1 && (
                              <Button
                                type="danger"
                                className={`${styles.addButton} ${styles.danger}`}
                                size="small"
                                icon={<FiMinus    />}
                                onClick={() => removeOtherInput("otherPet", index)}
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          className={styles.addButton}
                          size="small"
                          icon={<FiPlus    />}
                          onClick={() => addOtherInput("otherPet")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* NOTE Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHc.note")}</h3>

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
      </BasicInfo2Tab>
    </InquiryTabLayout>
  );
} 