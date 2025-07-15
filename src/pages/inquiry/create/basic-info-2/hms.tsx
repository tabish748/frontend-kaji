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
import { saveHmsService, resetSaveHmsService } from '@/app/customer/saveHmsServiceSlice';
import { fetchCustomerServicesDropdowns, resetCustomerServicesDropdowns } from '@/app/features/dropdowns/getCustomerServicesDropdownsSlice';
import ApiLoadingWrapper from '@/components/api-loading-wrapper/api-loading-wrapper';

export default function BasicInfo2HMSPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const saveState = useSelector((state: RootState) => state.saveHmsService) || {};
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
    
    // Note
    note: ""
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Load dropdowns on component mount
  useEffect(() => {
    dispatch(fetchCustomerServicesDropdowns());
  }, [dispatch]);

  // Reset HMS service state on component mount
  useEffect(() => {
    dispatch(resetSaveHmsService());
  }, [dispatch]);

  // Handle save success
  useEffect(() => {
    if (saveSuccess) {
      setToast({ message: 'HMS service created successfully!', type: 'success' });
      // Redirect to the inquiry list or show success message
      setTimeout(() => {
        router.push('/inquiry');
      }, 2000);
      dispatch(resetSaveHmsService());
    }
  }, [saveSuccess, router, dispatch]);

  // Handle save error
  useEffect(() => {
    if (saveError) {
      setToast({ message: saveError, type: 'fail' });
    }
  }, [saveError]);

  const handleInputChange = (name: string, value: any) => {
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

  const handleSubmit = async () => {
    const submissionData = new FormData();
    submissionData.append('person_incharge_id', formData.owner);
    formData.serviceDetails.filter(service => service !== "other").forEach((service, index) => {
      submissionData.append(`service_details[${index + 1}]`, service);
    });
    formData.otherRequirement.filter(item => item.trim()).forEach((item, index) => {
      submissionData.append(`more_service_details[${index + 1}]`, item);
    });
    submissionData.append('remarks', formData.note);
    dispatch(saveHmsService(submissionData));
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

  // Service Details Options (HMS specific)
  const serviceDetailOptions =
    dropdownOptions?.hk_hc_services?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [...generateGenericOptions(6), { value: "other", label: "Other" }];

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
              <h3 className="ad-heading">{t("adHms.basicServiceInfo")}</h3>

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
              <h3 className="ad-heading">{t("adHms.serviceDetails")}</h3>

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
            </div>

            {/* NOTE Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adHms.note")}</h3>

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