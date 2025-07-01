import React, { useState, useEffect } from 'react';
import BasicInfo2Tab from '@/components/inquiry-tabs/BasicInfo2Tab';
import InquiryTabLayout from '@/components/inquiry-tabs/InquiryTabLayout';
import { Form } from '@/components/form/form';
import InputField from '@/components/input-field/input-field';
import CustomSelectField from '@/components/custom-select/custom-select';
import TextAreaField from '@/components/text-area/text-area';
import Button from '@/components/button/button';
import styles from '@/styles/components/molecules/inquiry-tab.module.scss';
import ApiHandler from '@/app/api-handler';
import { useLanguage } from '@/localization/LocalContext';
import InputDateField from '@/components/input-date/input-date';

export default function BasicInfo2IntroducedTalentPage() {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    // Basic Service Info
    owner: "",
    
    // Contract Period
    contractStartDate: "",
    contractEndDate: "",
    
    // Job Details
    jobDetails: "",
    
    // Staff Search
    staffSearch: "",
    
    // Interview Details
    interviewDetails: [{
      registrationDate: "",
      registrant: "",
      companion: "",
      interviewDetails: "",
      interviewResult: "",
      status: ""
    }],
    
    // Hiring Info
    hiringStaffName: "",
    referralFee: "",
    firstDayEscort: "",
    
    // Attachments
    attachments: [],
    
    // Note
    note: ""
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [dropdownOptions, setDropdownOptions] = useState<any>(null);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoadingDropdowns(true);
      try {
        const res = await ApiHandler.request("/api/inquiry-form-dropdowns", "GET");
        if (res.success) {
          setDropdownOptions(res.data);
        }
      } catch (e) {
        console.error("Failed to load dropdowns", e);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdowns();
  }, []);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addInterviewDetail = () => {
    setFormData(prev => ({
      ...prev,
      interviewDetails: [
        ...prev.interviewDetails,
        {
          registrationDate: "",
          registrant: "",
          companion: "",
          interviewDetails: "",
          interviewResult: "",
          status: ""
        }
      ]
    }));
  };

  const removeInterviewDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interviewDetails: prev.interviewDetails.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    console.log("Form submitted:", formData);
  };

  if (loadingDropdowns) return <div>{t("admin-form.loading.options")}</div>;

  return (
    <InquiryTabLayout>
      <BasicInfo2Tab>
        <div className="nested-tab-content-inner">
          <Form
            onSubmit={handleSubmit}
            registerBtnText={t("buttons.register")}
            setErrors={setErrors}
            errors={errors}
          >
            {/* BASIC SERVICE INFO Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.basicServiceInfo")}</h3>
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

            {/* CONSULTANT CONTRACT INFO Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.consultantContractInfo")} 1</h3>
              <div className="row g-1">
                <div className="col-12">
                  <div className="mb-3">
                    <label>{t("adIntroducedTalentPage.contractPeriod")}</label>
                    <div className="d-flex gap-2">
                      <InputDateField
                        name="contractStartDate"
                        placeholder="YYYY/MM/DD"
                        value={formData.contractStartDate}
                        onChange={(e) => handleInputChange("contractStartDate", e.target.value)}
                      />
                      <span className="align-self-center">~</span>
                      <InputDateField
                        name="contractEndDate"
                        placeholder="YYYY/MM/DD"
                        value={formData.contractEndDate}
                        onChange={(e) => handleInputChange("contractEndDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* JOB DETAILS Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.jobDetails")} 1</h3>
              <div className="row g-1">
                <div className="col-12">
                  <TextAreaField
                    name="jobDetails"
                    label={t("adIntroducedTalentPage.jobDetails")}
                    value={formData.jobDetails}
                    onChange={(e) => handleInputChange("jobDetails", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* STAFF INFO Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.staffInfo")} 1</h3>
              <div className="row g-1">
                <div className="col-sm-12 col-lg-6">
                  <InputField
                    name="staffSearch"
                    label={t("adIntroducedTalentPage.staff")}
                    placeholder={t("adIntroducedTalentPage.searchStaff")}
                    value={formData.staffSearch}
                    onChange={(e) => handleInputChange("staffSearch", e.target.value)}
                  />
                </div>
                <div className="col-sm-12 col-lg-6">
                  <Button text={t("adIntroducedTalentPage.search")} className={styles.searchButton} />
                </div>
              </div>
            </div>

            {/* INTERVIEW DETAILS Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.interviewDetails")}</h3>
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <div>{t("adIntroducedTalentPage.registrationDate")} / {t("adIntroducedTalentPage.interviewDate")}</div>
                  <div>{t("adIntroducedTalentPage.registrant")} / {t("adIntroducedTalentPage.companion")}</div>
                  <div>{t("adIntroducedTalentPage.interviewDetails")}</div>
                  <div>{t("adIntroducedTalentPage.interviewResult")}</div>
                  <div>{t("adIntroducedTalentPage.status")}</div>
                  <div>{t("adIntroducedTalentPage.delete")}</div>
                </div>
                {formData.interviewDetails.map((detail, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div>
                      <InputDateField
                        name={`registrationDate${index}`}
                        placeholder="年/月/日"
                        value={detail.registrationDate}
                        onChange={(e) => handleInputChange(`registrationDate${index}`, e.target.value)}
                      />
                    </div>
                    <div>
                      <CustomSelectField
                        name={`registrant${index}`}
                        placeholder={t("adIntroducedTalentPage.registrant")}
                        value={detail.registrant}
                        onChange={(e) => handleInputChange(`registrant${index}`, e.target.value)}
                        options={[]}
                      />
                      <CustomSelectField
                        name={`companion${index}`}
                        placeholder={t("adIntroducedTalentPage.companion")}
                        value={detail.companion}
                        onChange={(e) => handleInputChange(`companion${index}`, e.target.value)}
                        options={[]}
                      />
                    </div>
                    <div>
                      <TextAreaField
                        name={`interviewDetails${index}`}
                        placeholder={t("adIntroducedTalentPage.interviewDetails")}
                        value={detail.interviewDetails}
                        onChange={(e) => handleInputChange(`interviewDetails${index}`, e.target.value)}
                      />
                    </div>
                    <div>
                      <TextAreaField
                        name={`interviewResult${index}`}
                        placeholder={t("adIntroducedTalentPage.interviewResult")}
                        value={detail.interviewResult}
                        onChange={(e) => handleInputChange(`interviewResult${index}`, e.target.value)}
                      />
                    </div>
                    <div>
                      <CustomSelectField
                        name={`status${index}`}
                        placeholder={t("adIntroducedTalentPage.status")}
                        value={detail.status}
                        onChange={(e) => handleInputChange(`status${index}`, e.target.value)}
                        options={[]}
                      />
                    </div>
                    <div>
                      <Button
                        text={t("adIntroducedTalentPage.delete")}
                        type="danger"
                        onClick={() => removeInterviewDetail(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button
                  text="+"
                  onClick={addInterviewDetail}
                  className={styles.addButton}
                />
              </div>
            </div>

            {/* STAFF INFO 2 Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.staffInfo")} 2</h3>
            </div>

            {/* JOB DETAILS 2 Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.jobDetails")} 2</h3>
            </div>

            {/* HIRING INFO Section */}
            <div className="hiring-info mt-4">
              <h4 className="sub-heading">{t("adIntroducedTalentPage.hiringInfo")}</h4>
              <div className="row g-3">
                <div className="col-md-4">
                  <CustomSelectField
                    name="hiringStaffName"
                    label={t("adIntroducedTalentPage.hiringStaffName")}
                    value={formData.hiringStaffName}
                    onChange={(e) => handleInputChange("hiringStaffName", e.target.value)}
                    options={[]}
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    name="referralFee"
                    label={t("adIntroducedTalentPage.referralFee")}
                    value={formData.referralFee}
                    onChange={(e) => handleInputChange("referralFee", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <InputDateField
                    name="firstDayEscort"
                    label={t("adIntroducedTalentPage.firstDayEscort")}
                    value={formData.firstDayEscort}
                    onChange={(e) => handleInputChange("firstDayEscort", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ATTACHMENTS Section */}
            <div className="attachments mt-4">
              <h4 className="sub-heading">{t("adIntroducedTalentPage.attachments")}</h4>
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <div>{t("adIntroducedTalentPage.registrationDate")}</div>
                  <div>{t("admin-form.labels.assignee")}</div>
                  <div>{t("admin-form.labels.details")}</div>
                  <div>{t("adIntroducedTalentPage.delete")}</div>
                </div>
                {/* Add attachment rows here */}
              </div>
            </div>

            {/* NOTE Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.note")}</h3>
              <div className="row g-1">
                <div className="col-12">
                  <TextAreaField
                    name="note"
                    label={t("adIntroducedTalentPage.note")}
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </div>

            {/* ADD CONTRACT Button */}
            <div className="form-section mb-4">
              <div className="row">
                <div className="col-12 d-flex justify-content-center">
                  <Button
                    text={t("adIntroducedTalentPage.addContract")}
                    className={styles.addContractButton}
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>

            {/* CONSULTANT CONTRACT INFO 2 Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("adIntroducedTalentPage.consultantContractInfo")} 2</h3>
            </div>

          </Form>
        </div>
      </BasicInfo2Tab>
    </InquiryTabLayout>
  );
}