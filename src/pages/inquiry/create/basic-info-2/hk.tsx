import React, { useState, useEffect } from 'react';
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

export default function BasicInfo2HKPage() {
  const { t } = useLanguage();
  
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
    console.log("HK Form submitted:", formData);
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
    dropdownOptions?.at_home_status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const petOptions =
    dropdownOptions?.pets?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [...generateGenericOptions(4), { value: "other", label: "Other" }];

  // Service Details Options
  const serviceDetailOptions =
    dropdownOptions?.hk_service_details?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [...generateGenericOptions(18), { value: "other", label: "Other" }];

  // Cleaning Area Options
  const cleaningAreaOptions =
    dropdownOptions?.hk_cleaning_areas?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || [...generateGenericOptions(13), { value: "other", label: "Other" }];

  // Inspection Area Options
  const inspectionAreaOptions =
    dropdownOptions?.hk_inspection_areas?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(4);

  if (loadingDropdowns) return <div>{t("admin-form.loading.options")}</div>;
  if (dropdownError) return <div>{dropdownError}</div>;

  return (
    <InquiryTabLayout>
      <BasicInfo2Tab>
        <div className="nested-tab-content-inner">
          <Form
            onSubmit={handleSubmit}
            registerBtnText="REGISTER"
            setErrors={setErrors}
            errors={errors}
          >
            {/* BASIC SERVICE INFO Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adHk.basicServiceInfo")}</h3>

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
      </BasicInfo2Tab>
    </InquiryTabLayout>
  );
} 
