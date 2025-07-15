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
import { getHmsShowService, resetGetHmsShowService } from '@/app/customer/getHmsShowServiceSlice';
import { saveHmsService, resetSaveHmsService } from '@/app/customer/saveHmsServiceSlice';
import { fetchCustomerServicesDropdowns, resetCustomerServicesDropdowns } from '@/app/features/dropdowns/getCustomerServicesDropdownsSlice';
import ApiLoadingWrapper from '@/components/api-loading-wrapper/api-loading-wrapper';

export default function BasicInfo2HmsEditPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const hmsShowServiceState = useSelector((state: RootState) => state.getHmsShowService) || {};
  const { data: hmsShowServiceData, loading: hmsShowServiceLoading = false, error: hmsShowServiceError = null } = hmsShowServiceState;
  const saveState = useSelector((state: RootState) => state.saveHmsService) || {};
  const { loading: saving, error: saveError, success: saveSuccess } = saveState;

  // Dropdown state
  const dropdownState = useSelector((state: RootState) => state.customerServicesDropdowns) || {};
  const { customerServicesDropdowns: dropdownOptions, loading: loadingDropdowns = false, error: dropdownError = null } = dropdownState;

  const [formData, setFormData] = useState({
    owner: "",
    serviceDetails: [] as string[],
    otherRequirement: [""],
    note: ""
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

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
      dispatch(getHmsShowService(id));
    }
  }, [id, dispatch]);

  // Reset HMS show service state on component mount
  useEffect(() => {
    dispatch(resetGetHmsShowService());
    dispatch(resetSaveHmsService());
  }, [dispatch]);

  // Handle HMS show service data when loaded
  useEffect(() => {
    if (hmsShowServiceData) {
      const data = hmsShowServiceData;
      const serviceDetailsArray: string[] = [];
      if (data.service_details) {
        Object.values(data.service_details).forEach((value: any) => {
          if (value) serviceDetailsArray.push(String(value));
        });
      }
      const otherRequirementArray = [];
      if (data.more_service_details) {
        Object.values(data.more_service_details).forEach((value: any) => {
          if (value) otherRequirementArray.push(String(value));
        });
      }
      if (otherRequirementArray.length === 0) otherRequirementArray.push("");
      
      // Ensure 'other' is checked if there is a value in the corresponding array
      if (otherRequirementArray.some(item => item && item.trim() !== "")) {
        if (!serviceDetailsArray.includes("other")) {
          serviceDetailsArray.push("other");
        }
      }
      
      setFormData({
        owner: data.person_incharge_id ? String(data.person_incharge_id) : "",
        serviceDetails: serviceDetailsArray,
        otherRequirement: otherRequirementArray,
        note: data.remarks || ""
      });
    }
  }, [hmsShowServiceData]);

  // Handle HMS show service error
  useEffect(() => {
    if (hmsShowServiceError) {
      setToast({ message: 'Failed to load HMS service data. Please try again.', type: 'fail' });
    }
  }, [hmsShowServiceError]);

  // Handle save success
  useEffect(() => {
    if (saveSuccess) {
      setToast({ message: 'HMS service updated successfully!', type: 'success' });
      // Refetch the data to update the form
      if (id && typeof id === 'string') {
        dispatch(getHmsShowService(id));
      }
      dispatch(resetSaveHmsService());
    }
  }, [saveSuccess, id, dispatch]);

  // Handle save error
  useEffect(() => {
    if (saveError) {
      setToast({ message: saveError, type: 'fail' });
    }
  }, [saveError]);

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
      return updated;
    });
  }, [dropdownOptions, formData.otherRequirement]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtherInputChange = (field: string, index: number, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      const updatedArray = [...currentArray];
      updatedArray[index] = value;
      return {
        ...prev,
        [field]: updatedArray,
      };
    });
  };

  const addOtherInput = (field: string) => {
    setFormData((prev) => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: [...currentArray, ""],
      };
    });
  };

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
    if (!id || typeof id !== 'string') {
      setToast({ message: "Invalid ID", type: "fail" });
      return;
    }
    const submissionData = new FormData();
    if (hmsShowServiceData?.id) {
      submissionData.append('id', String(hmsShowServiceData.id));
    }
    submissionData.append('customer_id', String(id));
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

  // Service Details Options
  const serviceDetailOptions = React.useMemo(() => {
    let opts = dropdownOptions?.hk_hc_services?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(15);
    if (!opts.some((o: any) => o.value === 'other')) {
      opts = [...opts, { value: 'other', label: 'Other' }];
    }
    return opts;
  }, [dropdownOptions]);

  return (
    <InquiryTabLayout>
      <BasicInfo2Tab>
        <ApiLoadingWrapper
          loading={loadingDropdowns || hmsShowServiceLoading}
          error={dropdownError || hmsShowServiceError}
          onRetry={() => {
            dispatch(fetchCustomerServicesDropdowns());
            if (id && typeof id === 'string') dispatch(getHmsShowService(id));
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
              registerBtnText="UPDATE"
              setErrors={setErrors}
              errors={errors}
            >
              {/* BASIC SERVICE INFO Section */}
              <div className="form-section mb-4">
                <h3 className="ad-heading">{t("adHms.basicServiceInfo")}</h3>
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
                  <div className="col-12 d-flex justify-content-center gap-2">
                    <Button
                      text="UPDATE"
                      className={styles.registerButton}
                      htmlType="submit"
                      disabled={saving}
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