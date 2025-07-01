import React, { useState, useEffect } from "react";
import BasicInfo2Tab from "@/components/inquiry-tabs/BasicInfo2Tab";
import InquiryTabLayout from "@/components/inquiry-tabs/InquiryTabLayout";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import CustomSelectField from "@/components/custom-select/custom-select";
import TextAreaField from "@/components/text-area/text-area";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import RadioField from "@/components/radio-field/radio-field";
import Button from "@/components/button/button";
import InputDateField from "@/components/input-date/input-date";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import styles from "@/styles/components/molecules/inquiry-tab.module.scss";
import bsStyles from "@/styles/components/molecules/bs-tab.module.scss";
import ApiHandler from "@/app/api-handler";
import { useLanguage } from "@/localization/LocalContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import { calculateAge } from "@/libs/utils";

interface ChildData {
  id: string;
  fullNameKatakana: string;
  fullName: string;
  nickName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  language: string;
  bodyTemperature: string;
  healthStatus: string;
  allergies: string;
  allergiesDetails: string;
  character: string[];
  characterOther: string[];
  favoriteActivity: string;
  allowedRooms: string;
  firstAidLocation: string;
  parentingPolicy: string;
  familyDoctors: Array<{
    familyDoctor: string;
    phone: string;
    primaryDoctor: string;
    hospitalVisits: boolean;
  }>;
  schoolInfo: Array<{
    schoolName: string;
    phone: string;
    address: string;
    classTeacher: string;
    grade: string;
    class: string;
    schoolCommute: boolean;
  }>;
}

export default function BasicInfo2BSPage() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    // Basic Service Info
    owner: "",

    // Service Details
    numBSRequests: "",

    // Child Registration Form
    childRegistrationSentAt: "",
    childRegistrationTime: "",
    childRegistrationSent: false,
    childRegistrationOwner: "",
    childRegistrationStatus: "",

    // Note
    note: "",
  });

  const [children, setChildren] = useState<ChildData[]>([
    {
      id: "1",
      fullNameKatakana: "",
      fullName: "",
      nickName: "",
      dateOfBirth: "",
      age: "",
      gender: "1",
      language: "",
      bodyTemperature: "36.5",
      healthStatus: "",
      allergies: "no",
      allergiesDetails: "",
      character: [],
      characterOther: [""],
      favoriteActivity: "",
      allowedRooms: "",
      firstAidLocation: "",
      parentingPolicy: "",
      familyDoctors: [
        {
          familyDoctor: "",
          phone: "",
          primaryDoctor: "",
          hospitalVisits: false,
        },
      ],
      schoolInfo: [
        {
          schoolName: "",
          phone: "",
          address: "",
          classTeacher: "",
          grade: "",
          class: "",
          schoolCommute: false,
        },
      ],
    },
  ]);

  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    0
  );
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

  const handleChildChange = (childId: string, field: string, value: any) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId ? { ...child, [field]: value } : child
      )
    );
  };

  const addChild = () => {
    const newChild: ChildData = {
      id: (children.length + 1).toString(),
      fullNameKatakana: "",
      fullName: "",
      nickName: "",
      dateOfBirth: "",
      age: "",
      gender: "1",
      language: "",
      bodyTemperature: "36.5",
      healthStatus: "",
      allergies: "no",
      allergiesDetails: "",
      character: [],
      characterOther: [""],
      favoriteActivity: "",
      allowedRooms: "",
      firstAidLocation: "",
      parentingPolicy: "",
      familyDoctors: [
        {
          familyDoctor: "",
          phone: "",
          primaryDoctor: "",
          hospitalVisits: false,
        },
      ],
      schoolInfo: [
        {
          schoolName: "",
          phone: "",
          address: "",
          classTeacher: "",
          grade: "",
          class: "",
          schoolCommute: false,
        },
      ],
    };
    setChildren((prev) => [...prev, newChild]);
    setOpenAccordionIndex(children.length); // Open the new accordion
  };

  const addFamilyDoctor = (childId: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              familyDoctors: [
                ...child.familyDoctors,
                {
                  familyDoctor: "",
                  phone: "",
                  primaryDoctor: "",
                  hospitalVisits: false,
                },
              ],
            }
          : child
      )
    );
  };

  const removeFamilyDoctor = (childId: string, index: number) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              familyDoctors: child.familyDoctors.filter((_, i) => i !== index),
            }
          : child
      )
    );
  };

  const addSchoolInfo = (childId: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              schoolInfo: [
                ...child.schoolInfo,
                {
                  schoolName: "",
                  phone: "",
                  address: "",
                  classTeacher: "",
                  grade: "",
                  class: "",
                  schoolCommute: false,
                },
              ],
            }
          : child
      )
    );
  };

  const removeSchoolInfo = (childId: string, index: number) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              schoolInfo: child.schoolInfo.filter((_, i) => i !== index),
            }
          : child
      )
    );
  };

  // Character other input management
  const addCharacterOther = (childId: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              characterOther: [...child.characterOther, ""],
            }
          : child
      )
    );
  };

  const removeCharacterOther = (childId: string, index: number) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              characterOther: child.characterOther.filter(
                (_, i) => i !== index
              ),
            }
          : child
      )
    );
  };

  const handleCharacterOtherChange = (
    childId: string,
    index: number,
    value: string
  ) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              characterOther: child.characterOther.map((item, i) =>
                i === index ? value : item
              ),
            }
          : child
      )
    );
  };

  const handleSubmit = async () => {
    console.log("BS Form submitted:", { formData, children });
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
      .map((item: any) => ({ value: String(item.value), label: item.label })) ||
    generateGenericOptions(5);

  const genderOptions = dropdownOptions?.gender?.map((item: any) => ({
    value: String(item.value),
    label: item.label,
  })) || [
    { value: "1", label: "Boy" },
    { value: "2", label: "Girl" },
    { value: "3", label: "Other" },
  ];

  const languageOptions =
    dropdownOptions?.language?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(3);

  const healthStatusOptions =
    dropdownOptions?.health_status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(4);

  const statusOptions =
    dropdownOptions?.inquiry_status?.map((item: any) => ({
      value: String(item.value),
      label: item.label,
    })) || generateGenericOptions(4);

  const characterOptions = [
    { value: "personality1", label: "性格1" },
    { value: "personality2", label: "性格2" },
    { value: "personality3", label: "性格3" },
    { value: "personality4", label: "性格4" },
    { value: "personality5", label: "性格5" },
    { value: "other", label: "Other" },
  ];

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
              <h3 className="ad-heading">{t("bsPage.basicServiceInfo")}</h3>

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
              <h3 className="ad-heading">{t("bsPage.serviceDetails")}</h3>

              <div className="row g-1 mb-3">
                <div className="col-sm-12 col-lg-6 col-xl-4">
                  <CustomSelectField
                    name="numBSRequests"
                    label={t('bsPage.noOfBSRequests')}
                    options={[
                      { value: "", label: t('bsPage.noOfBSRequests') },
                      ...generateGenericOptions(10),
                    ]}
                    value={formData.numBSRequests}
                    onChange={(e) =>
                      handleInputChange("numBSRequests", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Age Table */}
              <div
                className={`${styles.gridHeader} ${bsStyles.ageTableHeader}`}
              >
                <div className={bsStyles.centerAlign}>{t('bsPage.number')}</div>
                <div className={bsStyles.centerAlign}>{t('bsPage.age')}</div>
                <div className={bsStyles.centerAlign}>{t('bsPage.gender')}</div>
                <div className={bsStyles.centerAlign}>{t('bsPage.note')}</div>
                <div className={bsStyles.centerAlign}>{t('bsPage.action')}</div>
              </div>
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className={`${styles.gridRow} ${bsStyles.ageTableRow}`}
                >
                  <div className={`${styles.rowNumber}`}>{index}</div>
                  <div className="d-flex align-items-center gap-1">
                    <InputField
                      name={`ageDetail${index}Age`}
                      placeholder={t('bsPage.age')}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <RadioField
                      name={`ageDetail${index}Gender`}
                      options={genderOptions}
                      selectedValue=""
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`ageDetail${index}Note`}
                      placeholder={t('bsPage.note')}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                  <div className="d-flex gap-1">
                    <Button text={t('bsPage.edit')} type="success" />
                    <Button text={t('bsPage.delete')} type="danger" />
                  </div>
                </div>
              ))}

              {/* Note Section after Age Table */}
              <div className="row g-1 mt-3">
                <div className="col-md-12">
                  <TextAreaField
                    name="serviceDetailsNote"
                    label={t('bsPage.note')}
                    placeholder={t('bsPage.note')}
                    value=""
                    onChange={() => {}}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* CHILD REGISTRATION FORM Section */}
            <div className="form-section mb-4">
              <h3 className="ad-heading">{t("bsPage.childRegistrationForm")}</h3>

              <div className="row g-1 align-items-center">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                  <div className={styles.dateTimeContainer}>
                    <div className={styles.dateField}>
                      <InputDateField
                        name="childRegistrationSentAt"
                        label={t('bsPage.childRegistrationFormSentAt')}
                        placeholder={t("admin-form.placeholders.date")}
                        value={formData.childRegistrationSentAt}
                        onChange={(e) =>
                          handleInputChange(
                            "childRegistrationSentAt",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.timeField}>
                      <InputField
                        name="childRegistrationTime"
                        type="time"
                        value={formData.childRegistrationTime}
                        onChange={(e) =>
                          handleInputChange(
                            "childRegistrationTime",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3 mt-4 p-2">
                  <CheckboxField
                    name="childRegistrationSent"
                    label=""
                    options={[
                      { value: "sent", label: t('bsPage.childRegistrationFormSent') },
                    ]}
                    selectedValues={
                      formData.childRegistrationSent ? ["sent"] : []
                    }
                    onChange={(values) =>
                      handleInputChange(
                        "childRegistrationSent",
                        values.includes("sent")
                      )
                    }
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
                  <CustomSelectField
                    name="childRegistrationOwner"
                    label="Owner"
                    options={assigneeOptions}
                    value={formData.childRegistrationOwner}
                    onChange={(e) =>
                      handleInputChange(
                        "childRegistrationOwner",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3">
                  <CustomSelectField
                    name="childRegistrationStatus"
                    label="Status"
                    options={statusOptions}
                    value={formData.childRegistrationStatus}
                    onChange={(e) =>
                      handleInputChange(
                        "childRegistrationStatus",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* Child Registration Form Grid Header */}
              <div
                className={`${styles.gridHeader} ${bsStyles.childRegHeader}`}
              >
                <div className={bsStyles.centerAlign}>#</div>
                <div className={bsStyles.centerAlign}>
                  {t('bsPage.childRegistrationFormSentAt')}
                </div>
                <div className={bsStyles.centerAlign}>{t('bsPage.owner')}</div>
                <div className={bsStyles.centerAlign}>{t('bsPage.status')}</div>
                <div className={bsStyles.centerAlign}></div>
              </div>

              {/* Child Registration Form Grid Rows */}
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className={`${styles.gridRow} ${bsStyles.childRegRow}`}
                >
                  <div className={`${styles.rowNumber}`}>{index}</div>
                  <div>
                    <InputDateField
                      name={`childRegFormDate${index}`}
                      placeholder="年/月/日"
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`childRegFormOwner${index}`}
                      placeholder={t('bsPage.owner')}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`childRegFormStatus${index}`}
                      placeholder={t('bsPage.status')}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                  <div>{/* Empty column */}</div>
                </div>
              ))}
            </div>

            {/* CHILDREN ACCORDION SECTION */}
            <div className="form-section mb-4">
              <Accordion
                openIndex={openAccordionIndex}
                onToggle={(index) =>
                  setOpenAccordionIndex(
                    openAccordionIndex === index ? null : index
                  )
                }
              >
                {children.map((child, index) => (
                  <AccordionItem
                    key={child.id}
                    heading={`CHILD${child.id}`}
                    label=""
                  >
                    <div
                      className="child-form-content"
                      style={{ padding: "1rem" }}
                    >
                      {/* Basic Child Info */}
                      <div className="row g-1 mb-3">
                        <div className="col-12 col-sm-4">
                          <InputField
                            name={`child${child.id}FullNameKatakana`}
                            label={t('bsPage.fullNameKatakana')}
                            placeholder={t('bsPage.fullNameKatakana')}
                            value={child.fullNameKatakana}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "fullNameKatakana",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-12 col-sm-4">
                          <InputField
                            name={`child${child.id}FullName`}
                            label={t('bsPage.fullName')}
                            placeholder={t('bsPage.fullName')}
                            value={child.fullName}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "fullName",
                                e.target.value
                              )
                            }
                            validations={[{ type: "required" }]}
                            tag={[{ value: "required", label: "Required" }]}
                          />
                        </div>
                        <div className="col-12 col-sm-4">
                          <InputField
                            name={`child${child.id}NickName`}
                            label={t('bsPage.nickName')}
                            placeholder={t('bsPage.nickName')}
                            value={child.nickName}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "nickName",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Date of Birth, Gender, Language Row */}
                      <div className="row g-1 mb-3">
                        <div className="col-12 col-sm-4">
                          <div className="d-flex gap-2 align-items-end">
                            <div style={{ flex: 1 }}>
                              <InputDateField
                                name={`child${child.id}DateOfBirth`}
                                label={t('bsPage.dateOfBirth')}
                                placeholder={t('bsPage.dateOfBirth')}
                                value={child.dateOfBirth}
                                onChange={(e) => {
                                  handleChildChange(child.id, "dateOfBirth", e.target.value);
                                  handleChildChange(
                                    child.id,
                                    "age",
                                    e.target.value ? calculateAge(e.target.value).toString() : ""
                                  );
                                }}
                              />
                            </div>
                            <div style={{ width: "80px" }}>
                              <InputField
                                name={`child${child.id}Age`}
                                label={t('bsPage.age')}
                                placeholder={t('bsPage.age')}
                                value={child.age}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4">
                          <RadioField
                            name={`child${child.id}Gender`}
                            label={t('bsPage.gender')}
                            options={genderOptions}
                            selectedValue={child.gender}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "gender",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-12 col-sm-4">
                          <CustomSelectField
                            name={`child${child.id}Language`}
                            label={t('bsPage.language')}
                            options={languageOptions}
                            value={child.language}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "language",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Body Temperature, Allergies, At-home Status Row */}
                      <div className="row g-1 mb-3">
                        <div className="col-12 col-sm-4">
                          <div className="d-flex align-items-end gap-1">
                            <InputField
                              name={`child${child.id}BodyTemperature`}
                              label={t('bsPage.bodyTemperature')}
                              placeholder={t('bsPage.bodyTemperature')}
                              value={child.bodyTemperature}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "bodyTemperature",
                                  e.target.value
                                )
                              }
                            />
                            <span
                              style={{
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#6b7280",
                              }}
                            >
                              ℃
                            </span>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4">
                          <RadioField
                            name={`child${child.id}Allergies`}
                            label={t('bsPage.allergies')}
                            options={[
                              { value: "yes", label: "Yes (Has Allergies)" },
                              { value: "no", label: "No (Has No Allergies)" },
                            ]}
                            selectedValue={child.allergies}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "allergies",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-12 col-sm-4">
                          <CustomSelectField
                            name={`child${child.id}AtHomeStatus`}
                            label={t('bsPage.atHomeStatus')}
                            options={
                              dropdownOptions?.at_home_status?.map(
                                (item: any) => ({
                                  value: String(item.value),
                                  label: item.label,
                                })
                              ) || generateGenericOptions(3)
                            }
                            value=""
                            onChange={() => {}}
                          />
                        </div>
                      </div>

                      {/* Health Status Row */}
                      <div className="row g-1 mb-3">
                        <div className="col-12 col-sm-6">
                          <CustomSelectField
                            name={`child${child.id}HealthStatus`}
                            label={t('bsPage.healthStatus')}
                            options={healthStatusOptions}
                            value={child.healthStatus}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "healthStatus",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Allergies Details */}
                      {child.allergies === "yes" && (
                        <div className="row g-1 mb-3">
                          <div className="col-12">
                            <TextAreaField
                              name={`child${child.id}AllergiesDetails`}
                              label={t('bsPage.allergiesDetails')}
                              placeholder={t('bsPage.allergiesDetails')}
                              value={child.allergiesDetails}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "allergiesDetails",
                                  e.target.value
                                )
                              }
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      {/* Character */}
                      <div className="row g-1 mb-3">
                        <div className="col-12">
                          <CheckboxField
                            name={`child${child.id}Character`}
                            label={t('bsPage.character')}
                            options={characterOptions}
                            selectedValues={child.character}
                            onChange={(values) =>
                              handleChildChange(child.id, "character", values)
                            }
                          />
                          {child.character.includes("other") && (
                            <div className="mt-2">
                              <div className="d-flex flex-wrap align-items-center gap-2">
                                {child.characterOther.map((item, index) => (
                                  <div
                                    key={index}
                                    className="d-flex align-items-center gap-1"
                                  >
                                    <InputField
                                      name={`child${child.id}CharacterOther${index}`}
                                      placeholder={t('bsPage.other')}
                                      value={item}
                                      onChange={(e) =>
                                        handleCharacterOtherChange(
                                          child.id,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                    {child.characterOther.length > 1 && (
                                      <Button
                                        type="danger"
                                        className={`${styles.addButton} ${styles.danger}`}
                                        icon={<FiMinus />}
                                        onClick={() =>
                                          removeCharacterOther(child.id, index)
                                        }
                                      />
                                    )}
                                  </div>
                                ))}
                                <Button
                                  className={styles.addButton}
                                  icon={<FiPlus />}
                                  onClick={() => addCharacterOther(child.id)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Text Areas */}
                      <div className="row g-1 mb-3">
                        <div className="col-12">
                          <TextAreaField
                            name={`child${child.id}FavoriteActivity`}
                            label={t('bsPage.favoriteActivity')}
                            placeholder={t('bsPage.favoriteActivity')}
                            value={child.favoriteActivity}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "favoriteActivity",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="row g-1 mb-3">
                        <div className="col-12">
                          <TextAreaField
                            name={`child${child.id}AllowedRooms`}
                            label={t('bsPage.allowedRoomsForSitting')}
                            placeholder={t('bsPage.allowedRoomsForSitting')}
                            value={child.allowedRooms}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "allowedRooms",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="row g-1 mb-3">
                        <div className="col-12">
                          <TextAreaField
                            name={`child${child.id}FirstAidLocation`}
                            label={t('bsPage.firstAidKitLocation')}
                            placeholder={t('bsPage.firstAidKitLocation')}
                            value={child.firstAidLocation}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "firstAidLocation",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="row g-1 mb-3">
              <div className="col-12">
                          <TextAreaField
                            name={`child${child.id}ParentingPolicy`}
                            label={t('bsPage.parentingPolicy')}
                            placeholder={t('bsPage.parentingPolicy')}
                            value={child.parentingPolicy}
                            onChange={(e) =>
                              handleChildChange(
                                child.id,
                                "parentingPolicy",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Family Doctor Table */}
                      <div className="mb-4">
                        <div
                          className={`${styles.gridHeader} ${bsStyles.familyDoctorHeader}`}
                        >
                          <div className={bsStyles.centerAlign}>{t('bsPage.number')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.familyDoctor')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.phone')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.primaryDoctor')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.hospitalVisits')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.action')}</div>
                        </div>
                        {child.familyDoctors.map((doctor, doctorIndex) => (
                          <div
                            key={doctorIndex}
                            className={`${styles.gridRow} ${bsStyles.familyDoctorRow}`}
                          >
                            <div className={`${styles.rowNumber}`}>
                              {doctorIndex + 1}
                            </div>
                            <div>
                              <InputField
                                name={`child${child.id}FamilyDoctor${doctorIndex}`}
                                placeholder={t('bsPage.familyDoctor')}
                                value={doctor.familyDoctor}
                                onChange={(e) => {
                                  const newDoctors = [...child.familyDoctors];
                                  newDoctors[doctorIndex].familyDoctor =
                                    e.target.value;
                                  handleChildChange(
                                    child.id,
                                    "familyDoctors",
                                    newDoctors
                                  );
                                }}
                              />
                            </div>
                            <div>
                              <InputField
                                name={`child${child.id}DoctorPhone${doctorIndex}`}
                                placeholder={t('bsPage.phone')}
                                value={doctor.phone}
                                onChange={(e) => {
                                  const newDoctors = [...child.familyDoctors];
                                  newDoctors[doctorIndex].phone =
                                    e.target.value;
                                  handleChildChange(
                                    child.id,
                                    "familyDoctors",
                                    newDoctors
                                  );
                                }}
                              />
                            </div>
                            <div>
                              <InputField
                                name={`child${child.id}PrimaryDoctor${doctorIndex}`}
                                placeholder={t('bsPage.primaryDoctor')}
                                value={doctor.primaryDoctor}
                                onChange={(e) => {
                                  const newDoctors = [...child.familyDoctors];
                                  newDoctors[doctorIndex].primaryDoctor =
                                    e.target.value;
                                  handleChildChange(
                                    child.id,
                                    "familyDoctors",
                                    newDoctors
                                  );
                                }}
                              />
                            </div>
                            <div className={bsStyles.centerAlign}>
                              <input
                                type="checkbox"
                                checked={doctor.hospitalVisits}
                                onChange={(e) => {
                                  const newDoctors = [...child.familyDoctors];
                                  newDoctors[doctorIndex].hospitalVisits =
                                    e.target.checked;
                                  handleChildChange(
                                    child.id,
                                    "familyDoctors",
                                    newDoctors
                                  );
                                }}
                              />
                            </div>
                            <div className={bsStyles.centerAlign}>
                              <Button
                                text={t('bsPage.delete')}
                                type="danger"
                                disabled={child.familyDoctors.length === 1}
                                onClick={() =>
                                  removeFamilyDoctor(child.id, doctorIndex)
                                }
                              />
                            </div>
                          </div>
                        ))}
                        <div className={bsStyles.buttonContainer}>
                          <Button
                            text={t('bsPage.addPrimaryDoctorInformation')}
                            onClick={() => addFamilyDoctor(child.id)}
                            className={styles.registerButton}
                          />
                        </div>
                      </div>

                      {/* School Information Table */}
                      <div className="mb-4">
                        <div
                          className={`${styles.gridHeader} ${bsStyles.schoolInfoHeader}`}
                        >
                          <div className={bsStyles.centerAlign}>{t('bsPage.number')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.kindergartenSchoolCram')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.phone')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.schoolCommute')}</div>
                          <div className={bsStyles.centerAlign}>{t('bsPage.action')}</div>
                        </div>
                        {child.schoolInfo.map((school, schoolIndex) => (
                          <div key={schoolIndex}>
                            <div
                              className={`${styles.gridRow} ${bsStyles.schoolInfoRow}`}
                            >
                              <div className={`${styles.rowNumber}`}>
                                {schoolIndex + 1}
                              </div>
                              <div>
                                <InputField
                                  name={`child${child.id}SchoolName${schoolIndex}`}
                                  placeholder={t('bsPage.schoolName')}
                                  value={school.schoolName}
                                  onChange={(e) => {
                                    const newSchools = [...child.schoolInfo];
                                    newSchools[schoolIndex].schoolName =
                                      e.target.value;
                                    handleChildChange(
                                      child.id,
                                      "schoolInfo",
                                      newSchools
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <InputField
                                  name={`child${child.id}SchoolPhone${schoolIndex}`}
                                  placeholder={t('bsPage.phone')}
                                  value={school.phone}
                                  onChange={(e) => {
                                    const newSchools = [...child.schoolInfo];
                                    newSchools[schoolIndex].phone =
                                      e.target.value;
                                    handleChildChange(
                                      child.id,
                                      "schoolInfo",
                                      newSchools
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <InputField
                                  name={`child${child.id}SchoolAddress${schoolIndex}`}
                                  placeholder={t('bsPage.address')}
                                  value={school.address}
                                  onChange={(e) => {
                                    const newSchools = [...child.schoolInfo];
                                    newSchools[schoolIndex].address =
                                      e.target.value;
                                    handleChildChange(
                                      child.id,
                                      "schoolInfo",
                                      newSchools
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <InputField
                                  name={`child${child.id}SchoolClassTeacher${schoolIndex}`}
                                  placeholder={t('bsPage.classTeacher')}
                                  value={school.classTeacher}
                                  onChange={(e) => {
                                    const newSchools = [...child.schoolInfo];
                                    newSchools[schoolIndex].classTeacher =
                                      e.target.value;
                                    handleChildChange(
                                      child.id,
                                      "schoolInfo",
                                      newSchools
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <InputField
                                  name={`child${child.id}SchoolGrade${schoolIndex}`}
                                  placeholder={t('bsPage.grade')}
                                  value={school.grade}
                                  onChange={(e) => {
                                    const newSchools = [...child.schoolInfo];
                                    newSchools[schoolIndex].grade =
                                      e.target.value;
                                    handleChildChange(
                                      child.id,
                                      "schoolInfo",
                                      newSchools
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <InputField
                                  name={`child${child.id}SchoolClass${schoolIndex}`}
                                  placeholder={t('bsPage.class')}
                                  value={school.class}
                                  onChange={(e) => {
                                    const newSchools = [...child.schoolInfo];
                                    newSchools[schoolIndex].class =
                                      e.target.value;
                                    handleChildChange(
                                      child.id,
                                      "schoolInfo",
                                      newSchools
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <InputField
                                  name={`child${child.id}SchoolCommute${schoolIndex}`}
                                  placeholder={t('bsPage.schoolCommute')}
                                  value={school.schoolCommute ? "Yes" : "No"}
                                  onChange={(e) => {
                                    const newSchools = [...child.schoolInfo];
                                    newSchools[schoolIndex].schoolCommute =
                                      e.target.value === "Yes";
                                    handleChildChange(
                                      child.id,
                                      "schoolInfo",
                                      newSchools
                                    );
                                  }}
                                />
                              </div>
                              <div className={bsStyles.centerAlign}>
                                <Button
                                  text={t('bsPage.delete')}
                                  type="danger"
                                  disabled={child.schoolInfo.length === 1}
                                  onClick={() =>
                                    removeSchoolInfo(child.id, schoolIndex)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className={bsStyles.buttonContainer}>
                          <Button
                            text={t('bsPage.addSchoolInformation')}
                            onClick={() => addSchoolInfo(child.id)}
                            className={styles.registerButton}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className={bsStyles.addChildButtonContainer}>
                <Button
                  text={t('bsPage.addChild')}
                  onClick={addChild}
                  className={styles.registerButton}
                />
              </div>
              <div className="form-section mb-4">
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <Button
                      text={t('bsPage.register')}
                      className={styles.registerButton}
                      htmlType="submit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </BasicInfo2Tab>
    </InquiryTabLayout>
  );
} 