import Button from "@/components/button/button";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import InputField from "@/components/input-field/input-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import { useLanguage } from "@/localization/LocalContext";
import React, { ChangeEvent, useState } from "react";
import { SlCalender } from "react-icons/sl";
import {
  FaUser,
  FaPhone,
  FaRegAddressCard,
} from "react-icons/fa";
import styles from "@/styles/pages/cnabout.module.scss";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import ImageLabel from "@/components/image-lable/image-lable";
import {
  MdOutlineAlternateEmail,
  MdOutlineHomeWork,
  MdOutlineTrain,
} from "react-icons/md";
import { BiCalendar, BiHomeAlt2 } from "react-icons/bi";
import { BsFileEarmarkText, BsPaperclip } from "react-icons/bs";
import { GiAlarmClock } from "react-icons/gi";
import { IoPricetagsOutline } from "react-icons/io5";

// Define contract and plan structure
interface Plan {
  id: number;
  name: string;
  content: string;
}

interface Contract {
  id: number;
  name: string;
  plans: Plan[];
}

export default function CnAbout() {
  const { t } = useLanguage();

  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [billingFormErrors, setBillingFormErrors] = React.useState<
    Record<string, string | null>
  >({});
  const [paymentFormErrors, setPaymentFormErrors] = React.useState<
    Record<string, string | null>
  >({});
  const [formValues, setFormValues] = useState({
    firstName: "",
    fullNameKatakana: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email1: "",
    email2: "",
    postalCode: "",
    prefecture: "",
    address1: "",
    address2: "",
    building: "",
    railwayCompany1: "",
    trainLine1: "",
    trainStation1: "",
    railwayCompany2: "",
    trainLine2: "",
    trainStation2: "",
    gender: "male",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    age: "",
    language: "japanese",
    advertising: "subscribe",
  });

  const [contractFormValues, setContractFormValues] = useState({
    contractType: "general",
    service: "",
    plan: "",
    timeRange: "with",
    timeExtension: "with",
    contractPeriod: "2025-04-14 to 2025-04-19",
    startTime: "",
    endTime: "",
    weekdays: ["monday"] as string[],
  });

  const [billingFormValues, setBillingFormValues] = useState({
    firstName: "",
    fullNameKatakana: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email1: "",
    email2: "",
    postalCode: "",
    prefecture: "",
    address1: "",
    address2: "",
    building: "",
  });

  const [paymentFormValues, setPaymentFormValues] = useState({
    paymentMethod: "credit",
  });

  const POSSESSION = [
    {
      head: "key 1",
      dateOfRecieved: "2025-04-14",
      dateOfReturn: "2025-04-19",
      nameStaff: "John Doe",
      receiptOfCustody: <BsPaperclip size={16} />,
    },
    {
      head: "key 2",
      dateOfRecieved: "2025-04-14",
      dateOfReturn: "2025-04-19",
      nameStaff: "Jane Smith",
      receiptOfCustody: <BsPaperclip size={16} />,
    },
    {
      head: "key 3",
      dateOfRecieved: "2025-04-14",
      dateOfReturn: "2025-04-19",
      nameStaff: "Alice Johnson",
      receiptOfCustody: <BsPaperclip size={16} />,
    },
  ];

  // Contract and plan data
  const contracts: Contract[] = [
    {
      id: 1,
      name: "Contract 1",
      plans: [
        {
          id: 1,
          name: "Plan 1",
          content: "This is the content for Contract 1, Plan 1",
        },
        {
          id: 2,
          name: "Plan 2",
          content: "This is the content for Contract 1, Plan 2",
        },
        {
          id: 3,
          name: "Plan 3",
          content: "This is the content for Contract 1, Plan 3",
        },
      ],
    },
    {
      id: 2,
      name: "Contract 2",
      plans: [
        {
          id: 1,
          name: "Plan 1",
          content: "This is the content for Contract 2, Plan 1",
        },
        {
          id: 2,
          name: "Plan 2",
          content: "This is the content for Contract 2, Plan 2",
        },
      ],
    },
    {
      id: 3,
      name: "Contract 3",
      plans: [
        {
          id: 1,
          name: "Plan 1",
          content: "This is the content for Contract 3, Plan 1",
        },
        {
          id: 2,
          name: "Plan 2",
          content: "This is the content for Contract 3, Plan 2",
        },
        {
          id: 3,
          name: "Plan 3",
          content: "This is the content for Contract 3, Plan 3",
        },
        {
          id: 4,
          name: "Plan 4",
          content: "This is the content for Contract 3, Plan 4",
        },
      ],
    },
  ];

  // State for active contract and plan
  const [activeContractId, setActiveContractId] = useState(1);
  const [activePlanId, setActivePlanId] = useState(1);

  // Get the active contract
  const activeContract =
    contracts.find((c) => c.id === activeContractId) || contracts[0];

  // Ensure activePlanId is valid for the current contract
  const validPlans = activeContract.plans.map((p) => p.id);
  if (!validPlans.includes(activePlanId)) {
    // If current plan isn't in this contract, default to first plan
    setActivePlanId(validPlans[0]);
  }

  // Generic change handler for inputs and selects
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContractInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContractFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle contract tab change
  const handleContractChange = (contractId: number) => {
    setActiveContractId(contractId);
    // Reset to the first plan of the selected contract
    const contract = contracts.find((c) => c.id === contractId);
    if (contract && contract.plans.length > 0) {
      setActivePlanId(contract.plans[0].id);
    }
  };

  // Handle plan tab change
  const handlePlanChange = (planId: number) => {
    setActivePlanId(planId);
  };

  const handleSubmit = () => {
    console.log("submit", formValues);
  };

  const handleContractSubmit = () => {
    console.log("Contract form submitted with values:", contractFormValues);
  };

  const handleBillingSubmit = () => {
    // Form validation is handled by the Form component through the errors/setErrors props
    // Just handle the actual submission here
    console.log("Billing form submitted with values:", billingFormValues);
    // TODO: Add your API call or data processing here

    // Reset any billing form errors
    setBillingFormErrors({});
  };

  const handlePaymentSubmit = () => {
    console.log("Billing form submitted with values:", paymentFormValues);
  };

  return (
    <div className="d-flex flex-column gap-2">
      <ClientSection heading={t("aboutPage.customerInfo")}>
        <Form
          onSubmit={handleSubmit}
          setErrors={setErrors}
          errors={errors}
          className={styles.customerForm}
        >
          <div className={styles.formGrid}>
            {/* Name Section */}
            <div className={styles.label}>{t("aboutPage.nameLabel")}</div>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <InputField
                  name="firstName"
                  placeholder={t("aboutPage.firstNamePlaceholder")}
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["firstName"] || undefined}
                  icon={"abc"}
                  disabled
                />
                <InputField
                  name="fullNameKatakana"
                  placeholder={t("aboutPage.fullNameKatakanaPlaceholder")}
                  value={formValues.fullNameKatakana}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["fullNameKatakana"] || undefined}
                  icon={"abc"}
                  disabled
                />
              </div>
            </div>

            {/* Phone Section */}
            <div className={styles.label}>{t("aboutPage.phoneLabel")}</div>
            <div className={styles.fieldGroup}>
              <InputField
                name="phone1"
                placeholder={t("aboutPage.phone1Placeholder")}
                value={formValues.phone1}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["phone1"] || undefined}
                icon={<FaPhone size={12} />}
                disabled
              />
              <InputField
                name="phone2"
                placeholder={t("aboutPage.phone2Placeholder")}
                value={formValues.phone2}
                onChange={handleInputChange}
                icon={<FaPhone size={12} />}
                disabled
              />
              <InputField
                name="phone3"
                placeholder={t("aboutPage.phone3Placeholder")}
                value={formValues.phone3}
                onChange={handleInputChange}
                icon={<FaPhone size={12} />}
                disabled
              />
            </div>

            {/* Email Section */}
            <div className={styles.label}>{t("aboutPage.emailLabel")}</div>
            <div className={styles.fieldGroup}>
              <InputField
                name="email1"
                placeholder={t("aboutPage.email1Placeholder")}
                type="email"
                value={formValues.email1}
                onChange={handleInputChange}
                validations={[{ type: "required" }, { type: "email" }]}
                errorText={errors["email1"] || undefined}
                icon={<MdOutlineAlternateEmail size={12} />}
                disabled
              />
              <InputField
                name="email2"
                placeholder={t("aboutPage.email2Placeholder")}
                type="email"
                value={formValues.email2}
                onChange={handleInputChange}
                validations={[{ type: "email" }]}
                errorText={errors["email2"] || undefined}
                icon={<MdOutlineAlternateEmail size={12} />}
                disabled
              />
            </div>

            {/* Address Section */}
            <div className={styles.label}>{t("aboutPage.addressLabel")}</div>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <InputField
                  name="postalCode"
                  placeholder={t("aboutPage.postalCodePlaceholder")}
                  value={formValues.postalCode}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["postalCode"] || undefined}
                  icon={<MdOutlineHomeWork size={12} />}
                  disabled
                />
                <SelectField
                  name="prefecture"
                  placeholder={t("aboutPage.prefecturePlaceholder")}
                  options={[
                    { label: "Hokkaido", value: "hokkaido" },
                    { label: "Aomori", value: "aomori" },
                    { label: "Iwate", value: "iwate" },
                    { label: "Miyagi", value: "miyagi" },
                  ]}
                  value={formValues.prefecture}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["prefecture"] || undefined}
                  icon={<BiHomeAlt2 size={12} />}
                  disabled
                />
              </div>
              <InputField
                name="address1"
                placeholder={t("aboutPage.address1Placeholder")}
                value={formValues.address1}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["address1"] || undefined}
                icon={<BiHomeAlt2 size={12} />}
                disabled
              />
              <InputField
                name="address2"
                placeholder={t("aboutPage.address2Placeholder")}
                value={formValues.address2}
                onChange={handleInputChange}
                icon={<BiHomeAlt2 size={12} />}
                disabled
              />
              <InputField
                name="building"
                placeholder={t("aboutPage.buildingPlaceholder")}
                value={formValues.building}
                onChange={handleInputChange}
                icon={<BiHomeAlt2 size={12} />}
                disabled
              />
            </div>

            {/* Train Station Section */}
            <div className={styles.label}>
              {t("aboutPage.trainStationLabel")}
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.stationGroup}>
                <InputField
                  name="railwayCompany1"
                  placeholder={t("aboutPage.railwayCompany1Placeholder")}
                  value={formValues.railwayCompany1}
                  onChange={handleInputChange}
                  icon={<MdOutlineTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainLine1"
                  placeholder={t("aboutPage.trainLine1Placeholder")}
                  value={formValues.trainLine1}
                  onChange={handleInputChange}
                  icon={<MdOutlineTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainStation1"
                  placeholder={t("aboutPage.trainStation1Placeholder")}
                  value={formValues.trainStation1}
                  onChange={handleInputChange}
                  icon={<MdOutlineTrain size={12} />}
                  disabled
                />
              </div>
              <div className={styles.stationGroup}>
                <InputField
                  name="railwayCompany2"
                  placeholder={t("aboutPage.railwayCompany2Placeholder")}
                  value={formValues.railwayCompany2}
                  onChange={handleInputChange}
                  icon={<MdOutlineTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainLine2"
                  placeholder={t("aboutPage.trainLine2Placeholder")}
                  value={formValues.trainLine2}
                  onChange={handleInputChange}
                  icon={<MdOutlineTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainStation2"
                  placeholder={t("aboutPage.trainStation2Placeholder")}
                  value={formValues.trainStation2}
                  onChange={handleInputChange}
                  icon={<MdOutlineTrain size={12} />}
                  disabled
                />
              </div>
            </div>

            {/* Gender Section */}
            <div className={styles.label}>{t("aboutPage.genderLabel")}</div>
            <RadioField
              name="gender"
              options={[
                { label: t("aboutPage.male"), value: "male" },
                { label: t("aboutPage.female"), value: "female" },
                { label: t("aboutPage.other"), value: "other" },
              ]}
              selectedValue={formValues.gender}
              onChange={handleInputChange}
              className={styles.radioGroup}
              disabled
            />

            {/* Date of Birth Section */}
            <div className={styles.label}>
              {t("aboutPage.dateOfBirthLabel")}
            </div>
            <div className={styles.dateGroup}>
              <SelectField
                name="birthYear"
                placeholder={t("aboutPage.yearPlaceholder")}
                options={Array.from({ length: 100 }, (_, i) => ({
                  label: String(new Date().getFullYear() - i),
                  value: String(new Date().getFullYear() - i),
                }))}
                value={formValues.birthYear}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["birthYear"] || undefined}
                icon={<SlCalender size={12} />}
                disabled
              />
              <SelectField
                name="birthMonth"
                placeholder={t("aboutPage.monthPlaceholder")}
                options={Array.from({ length: 12 }, (_, i) => ({
                  label: String(i + 1),
                  value: String(i + 1),
                }))}
                value={formValues.birthMonth}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["birthMonth"] || undefined}
                icon={<SlCalender size={12} />}
                disabled
              />
              <SelectField
                name="birthDay"
                placeholder={t("aboutPage.dayPlaceholder")}
                options={Array.from({ length: 31 }, (_, i) => ({
                  label: String(i + 1),
                  value: String(i + 1),
                }))}
                value={formValues.birthDay}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["birthDay"] || undefined}
                icon={<SlCalender size={12} />}
                disabled
              />
              <InputField
                name="age"
                placeholder={t("aboutPage.agePlaceholder")}
                value={formValues.age}
                onChange={handleInputChange}
                icon={<SlCalender size={12} />}
                disabled
              />
            </div>

            {/* Language Section */}
            <div className={styles.label}>{t("aboutPage.languageLabel")}</div>
            <RadioField
              name="language"
              options={[
                { label: t("aboutPage.japanese"), value: "japanese" },
                { label: t("aboutPage.english"), value: "english" },
                { label: t("aboutPage.both"), value: "both" },
              ]}
              selectedValue={formValues.language}
              onChange={handleInputChange}
              className={styles.radioGroup}
              disabled
            />

            {/* Advertising Email Section */}
            <div className={styles.label}>
              {t("aboutPage.advertisingEmailLabel")}
            </div>
            <RadioField
              name="advertising"
              options={[
                { label: t("aboutPage.subscribe"), value: "subscribe" },
                { label: t("aboutPage.unsubscribe"), value: "unsubscribe" },
              ]}
              selectedValue={formValues.advertising}
              onChange={handleInputChange}
              className={styles.radioGroup}
              disabled
            />
          </div>

          {/* <div style={{ marginTop: "2rem" }}>
            <Button htmlType="submit" type="primary" text={t("Submit")} />
          </div> */}
        </Form>
      </ClientSection>
      <ClientSection heading={t("aboutPage.customerInfo")}>
        {/* Contract Tabs */}
        <div className={styles.tabContainer}>
          {contracts.map((contract) => (
            <button
              key={contract.id}
              className={`${styles.tabButtonContract} ${
                activeContractId === contract.id ? styles.active : ""
              }`}
              onClick={() => handleContractChange(contract.id)}
            >
              {contract.name}
            </button>
          ))}
        </div>

        {/* Plan Tabs - only show plans for the active contract */}
        <div className={styles.tabSection}>
          <div className={styles.tabContainer}>
            {activeContract.plans.map((plan) => (
              <button
                key={plan.id}
                className={`${styles.tabButtonPlan} ${
                  activePlanId === plan.id ? styles.active : ""
                }`}
                onClick={() => handlePlanChange(plan.id)}
              >
                {plan.name}
              </button>
            ))}
          </div>

          {/* Plan Content */}
          <div className={styles.tabContent}>
            {/* Display active plan content */}
            {activeContract.plans
              .filter((plan) => plan.id === activePlanId)
              .map((plan) => (
                <>
                  <h1 className={styles.contractHeading}>
                    {t(`aboutPage.plan.contactdetails`)}
                  </h1>

                  <Form
                    className={styles.customerForm}
                    onSubmit={handleContractSubmit}
                    errors={{}}
                    setErrors={() => {}}
                  >
                    <div className={`${styles.formGrid}`}>
                      {/* Contract Type Section */}
                      <div className={styles.label}>
                        {t("aboutPage.contractTypeLabel")}
                      </div>
                      <RadioField
                        name="contractType"
                        options={[
                          { label: t("aboutPage.general"), value: "general" },
                          {
                            label: t("aboutPage.affiliated"),
                            value: "affiliated",
                          },
                        ]}
                        selectedValue={contractFormValues.contractType}
                        onChange={handleContractInputChange}
                        className={styles.radioGroup}
                        disabled
                      />

                      {/* Contract Plan Section */}
                      <div className={styles.label}>
                        {t("aboutPage.contractPlanLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldRow}>
                          <CustomSelectField
                            name="service"
                            placeholder={t("aboutPage.servicePlaceholder")}
                            options={[
                              { label: t("aboutPage.basic"), value: "basic" },
                              {
                                label: t("aboutPage.premium"),
                                value: "premium",
                              },
                              {
                                label: t("aboutPage.enterprise"),
                                value: "enterprise",
                              },
                            ]}
                            icon={<BsFileEarmarkText size={12} />}
                            value={contractFormValues.service}
                            onChange={handleContractInputChange}
                            disabled
                          />
                          <CustomSelectField
                            name="plan"
                            placeholder={t("aboutPage.planPlaceholder")}
                            options={[
                              {
                                label: t("aboutPage.monthly"),
                                value: "monthly",
                              },
                              {
                                label: t("aboutPage.quarterly"),
                                value: "quarterly",
                              },
                              { label: t("aboutPage.annual"), value: "annual" },
                            ]}
                            icon={<BsFileEarmarkText size={12} />}
                            value={contractFormValues.plan}
                            onChange={handleContractInputChange}
                            disabled
                          />
                        </div>
                      </div>

                      {/* Time Range Section */}
                      <div className={styles.label}>
                        {t("aboutPage.timeRangeLabel")}
                      </div>
                      <RadioField
                        name="timeRange"
                        options={[
                          {
                            label: t("aboutPage.withTimeRange"),
                            value: "with",
                          },
                          {
                            label: t("aboutPage.withoutTimeRange"),
                            value: "without",
                          },
                        ]}
                        selectedValue={contractFormValues.timeRange}
                        onChange={handleContractInputChange}
                        className={styles.radioGroup}
                        disabled
                      />

                      {/* Time Extension Section */}
                      <div className={styles.label}>
                        {t("aboutPage.timeExtensionLabel")}
                      </div>
                      <RadioField
                        name="timeExtension"
                        options={[
                          {
                            label: t("aboutPage.withTimeExtension"),
                            value: "with",
                          },
                          {
                            label: t("aboutPage.withoutTimeExtension"),
                            value: "without",
                          },
                        ]}
                        selectedValue={contractFormValues.timeExtension}
                        onChange={handleContractInputChange}
                        className={styles.radioGroup}
                        disabled
                      />

                      {/* Contract Period Section */}
                      <div className={styles.label}>
                        {t("aboutPage.contractPeriodLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <InputDateField
                          name="contractPeriod"
                          value="2025-04-14 to 2025-04-19"
                          isRange={true}
                          startPlaceholder={t("aboutPage.startDatePlaceholder")}
                          endPlaceholder={t("aboutPage.endDatePlaceholder")}
                          icon={<BiCalendar size={12} />}
                          disabled
                        />
                      </div>

                      {/* Day of the Week Section */}
                      <div className={styles.label}>
                        {t("aboutPage.dayOfWeekLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.weekdayCheckboxes}>
                          <CheckboxField
                            name="weekdays"
                            options={[
                              { value: "monday", label: t("aboutPage.monday") },
                              {
                                value: "tuesday",
                                label: t("aboutPage.tuesday"),
                              },
                              {
                                value: "wednesday",
                                label: t("aboutPage.wednesday"),
                              },
                              {
                                value: "thursday",
                                label: t("aboutPage.thursday"),
                              },
                              { value: "friday", label: t("aboutPage.friday") },
                              {
                                value: "saturday",
                                label: t("aboutPage.saturday"),
                              },
                              { value: "sunday", label: t("aboutPage.sunday") },
                            ]}
                            selectedValues={contractFormValues.weekdays}
                            onChange={(values) =>
                              setContractFormValues((prev) => ({
                                ...prev,
                                weekdays: values,
                              }))
                            }
                            disabled
                          />
                        </div>
                      </div>

                      {/* Time Section */}
                      <div className={styles.label}>
                        {t("aboutPage.timeLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldRow}>
                          <InputField
                            name="startTime"
                            placeholder={t("aboutPage.startTimePlaceholder")}
                            icon={<GiAlarmClock size={12} />}
                            type="time"
                            value={contractFormValues.startTime}
                            onChange={handleContractInputChange}
                            disabled
                          />
                          <span className={styles.timeConnector}>~</span>
                          <InputField
                            name="endTime"
                            placeholder={t("aboutPage.endTimePlaceholder")}
                            icon={<GiAlarmClock size={12} />}
                            type="time"
                            value={contractFormValues.endTime}
                            onChange={handleContractInputChange}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div style={{ marginTop: "2rem" }}>
                      <Button
                        htmlType="submit"
                        type="primary"
                        text={t("Submit")}
                      />
                    </div> */}
                  </Form>
                  <h1 className={styles.contractHeading}>
                    {t("aboutPage.plan.billingInfo")}
                  </h1>
                  <Form
                    className={styles.customerForm}
                    onSubmit={handleBillingSubmit}
                    errors={billingFormErrors}
                    setErrors={setBillingFormErrors}
                  >
                    <div className={`${styles.formGrid}`}>
                      {/* Name Section */}
                      <div className={styles.label}>
                        {t("aboutPage.nameLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldRow}>
                          <InputField
                            name="firstName"
                            placeholder={t("aboutPage.firstNamePlaceholder")}
                            value={billingFormValues.firstName}
                            onChange={handleBillingInputChange}
                            validations={[{ type: "required" }]}
                            errorText={
                              billingFormErrors["firstName"] || undefined
                            }
                            icon={<FaUser size={12} />}
                            disabled
                          />
                          <InputField
                            name="fullNameKatakana"
                            placeholder={t(
                              "aboutPage.fullNameKatakanaPlaceholder"
                            )}
                            value={billingFormValues.fullNameKatakana}
                            onChange={handleBillingInputChange}
                            validations={[{ type: "required" }]}
                            errorText={
                              billingFormErrors["fullNameKatakana"] || undefined
                            }
                            icon={<FaUser size={12} />}
                            disabled
                          />
                        </div>
                      </div>

                      {/* Phone Section */}
                      <div className={styles.label}>
                        {t("aboutPage.phoneLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <InputField
                          name="phone1"
                          placeholder={t("aboutPage.phone1Placeholder")}
                          value={billingFormValues.phone1}
                          onChange={handleBillingInputChange}
                          validations={[{ type: "required" }]}
                          errorText={billingFormErrors["phone1"] || undefined}
                          icon={<FaPhone size={12} />}
                          disabled
                        />
                        <InputField
                          name="phone2"
                          placeholder={t("aboutPage.phone2Placeholder")}
                          value={billingFormValues.phone2}
                          onChange={handleBillingInputChange}
                          icon={<FaPhone size={12} />}
                          disabled
                        />
                        <InputField
                          name="phone3"
                          placeholder={t("aboutPage.phone3Placeholder")}
                          value={billingFormValues.phone3}
                          onChange={handleBillingInputChange}
                          icon={<FaPhone size={12} />}
                          disabled
                        />
                      </div>

                      {/* Email Section */}
                      <div className={styles.label}>
                        {t("aboutPage.emailLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <InputField
                          name="email1"
                          placeholder={t("aboutPage.email1Placeholder")}
                          type="email"
                          value={billingFormValues.email1}
                          onChange={handleBillingInputChange}
                          validations={[
                            { type: "required" },
                            { type: "email" },
                          ]}
                          errorText={billingFormErrors["email1"] || undefined}
                          icon={<MdOutlineAlternateEmail size={12} />}
                          disabled
                        />
                        <InputField
                          name="email2"
                          placeholder={t("aboutPage.email2Placeholder")}
                          type="email"
                          value={billingFormValues.email2}
                          onChange={handleBillingInputChange}
                          validations={[{ type: "email" }]}
                          errorText={billingFormErrors["email2"] || undefined}
                          icon={<MdOutlineAlternateEmail size={12} />}
                          disabled
                        />
                      </div>

                      {/* Address Section */}
                      <div className={styles.label}>
                        {t("aboutPage.addressLabel")}
                      </div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldRow}>
                          <InputField
                            name="postalCode"
                            placeholder={t("aboutPage.postalCodePlaceholder")}
                            value={billingFormValues.postalCode}
                            onChange={handleBillingInputChange}
                            validations={[{ type: "required" }]}
                            errorText={
                              billingFormErrors["postalCode"] || undefined
                            }
                            icon={<MdOutlineHomeWork size={12} />}
                            disabled
                          />
                          <SelectField
                            name="prefecture"
                            placeholder={t("aboutPage.prefecturePlaceholder")}
                            options={[
                              { label: "Hokkaido", value: "hokkaido" },
                              { label: "Aomori", value: "aomori" },
                              { label: "Iwate", value: "iwate" },
                              { label: "Miyagi", value: "miyagi" },
                            ]}
                            value={billingFormValues.prefecture}
                            onChange={handleBillingInputChange}
                            validations={[{ type: "required" }]}
                            errorText={
                              billingFormErrors["prefecture"] || undefined
                            }
                            icon={<BiHomeAlt2 size={12} />}
                            disabled
                          />
                        </div>
                        <InputField
                          name="address1"
                          placeholder={t("aboutPage.address1Placeholder")}
                          value={billingFormValues.address1}
                          onChange={handleBillingInputChange}
                          validations={[{ type: "required" }]}
                          errorText={billingFormErrors["address1"] || undefined}
                          icon={<BiHomeAlt2 size={12} />}
                          disabled
                        />
                        <InputField
                          name="address2"
                          placeholder={t("aboutPage.address2Placeholder")}
                          value={billingFormValues.address2}
                          onChange={handleBillingInputChange}
                          icon={<BiHomeAlt2 size={12} />}
                          disabled
                        />
                        <InputField
                          name="building"
                          placeholder={t("aboutPage.buildingPlaceholder")}
                          value={billingFormValues.building}
                          onChange={handleBillingInputChange}
                          icon={<BiHomeAlt2 size={12} />}
                          disabled
                        />
                      </div>
                    </div>
                    {/* <div style={{ marginTop: "2rem" }}>
                      <Button
                        htmlType="submit"
                        type="primary"
                        text={t("Submit")}
                      />
                    </div> */}
                  </Form>
                  <h1 className={styles.contractHeading}>
                    {t("aboutPage.plan.paymentInfo")}
                  </h1>
                  <Form
                    className={styles.customerForm}
                    onSubmit={handlePaymentSubmit}
                    setErrors={setPaymentFormErrors}
                    errors={paymentFormErrors}
                  >
                    <div className={`${styles.formGrid}`}>
                      {/* Payment Method Section */}
                      <div className={styles.label}>
                        {t("aboutPage.paymentMethodLabel")}
                      </div>
                      <RadioField
                        name="paymentMethod"
                        options={[
                          { label: t("aboutPage.bank"), value: "bank" },
                          { label: t("aboutPage.credit"), value: "credit" },
                          { label: t("aboutPage.invoice"), value: "invoice" },
                          {
                            label: t("aboutPage.convenience"),
                            value: "convenience",
                          },
                        ]}
                        selectedValue={paymentFormValues.paymentMethod}
                        onChange={handlePaymentInputChange}
                        className={styles.radioGroup}
                        disabled
                      />
                    </div>
                    {/* <div style={{ marginTop: "2rem" }}>
                      <Button
                        htmlType="submit"
                        type="primary"
                        text={t("Submit")}
                      />
                    </div> */}
                  </Form>
                </>
              ))}
          </div>
        </div>
      </ClientSection>

      {/* key in possession */}
      <ClientSection heading={t("aboutPage.keyPossession")}>
        <div className={styles.announcementContainer}>
          <Accordion page={1} totalPages={1} onPageChange={() => {}}>
            {POSSESSION.map((item, idx) => (
              <AccordionItem key={idx} heading={item.head} label="">
                <div className={styles.accordionContent}>
                  <ImageLabel
                    icon={<BiHomeAlt2 />}
                    label={t("aboutPage.keyName")}
                    className={styles.accordionLabel}
                  />
                  <p>{item.head}</p>

                  <ImageLabel
                    icon={<BiCalendar />}
                    label={t("aboutPage.dateOfReceived")}
                    className={styles.accordionLabel}
                  />
                  <p>{item.dateOfRecieved}</p>

                  <ImageLabel
                    icon={<BiCalendar />}
                    label={t("aboutPage.dateOfReturn")}
                    className={styles.accordionLabel}
                  />
                  <p>{item.dateOfReturn}</p>

                  <ImageLabel
                    icon={<FaRegAddressCard />}
                    label={t("aboutPage.staffName")}
                    className={styles.accordionLabel}
                  />
                  <p>{item.nameStaff}</p>

                  <ImageLabel
                    icon={<IoPricetagsOutline />}
                    label={t("aboutPage.receiptOfCustody")}
                    className={styles.accordionLabel}
                  />
                  <p>{item.receiptOfCustody}</p>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ClientSection>
    </div>
  );
}
