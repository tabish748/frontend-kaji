import Button from "@/components/button/button";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import InputField from "@/components/input-field/input-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import TextAreaField from "@/components/text-area/text-area";
import { useLanguage } from "@/localization/LocalContext";
import React, { ChangeEvent, useState } from "react";
import { SlCalender } from "react-icons/sl";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaTrain,
  FaGlobe,
  FaBell,
} from "react-icons/fa";
import styles from "@/styles/pages/cnabout.module.scss";

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
    contractType: "general",
    timeRange: "with",
    timeExtension: "with",
    monday: ["monday"],
    tuesday: [] as string[],
    wednesday: [] as string[],
    thursday: [] as string[],
    friday: [] as string[],
    saturday: [] as string[],
    sunday: [] as string[],
  });

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

  const handleCheckboxChange = (name: string, value: boolean) => {
    setFormValues((prev) => ({
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
    console.log("contract form submitted");
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
            <div className={styles.label}>Name</div>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <InputField
                  name="firstName"
                  placeholder="First Name"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["firstName"] || undefined}
                  icon={<FaUser size={12} />}
                  disabled
                />
                <InputField
                  name="fullNameKatakana"
                  placeholder="Full name in Katakana"
                  value={formValues.fullNameKatakana}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["fullNameKatakana"] || undefined}
                  icon={<FaUser size={12} />}
                  disabled
                />
              </div>
            </div>

            {/* Phone Section */}
            <div className={styles.label}>Phone</div>
            <div className={styles.fieldGroup}>
              <InputField
                name="phone1"
                placeholder="Phone 1"
                value={formValues.phone1}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["phone1"] || undefined}
                icon={<FaPhone size={12} />}
                disabled
              />
              <InputField
                name="phone2"
                placeholder="Phone 2"
                value={formValues.phone2}
                onChange={handleInputChange}
                icon={<FaPhone size={12} />}
                disabled
              />
              <InputField
                name="phone3"
                placeholder="Phone 3"
                value={formValues.phone3}
                onChange={handleInputChange}
                icon={<FaPhone size={12} />}
                disabled
              />
            </div>

            {/* Email Section */}
            <div className={styles.label}>E-mail</div>
            <div className={styles.fieldGroup}>
              <InputField
                name="email1"
                placeholder="Email 1"
                type="email"
                value={formValues.email1}
                onChange={handleInputChange}
                validations={[{ type: "required" }, { type: "email" }]}
                errorText={errors["email1"] || undefined}
                icon={<FaEnvelope size={12} />}
                disabled
              />
              <InputField
                name="email2"
                placeholder="Email 2"
                type="email"
                value={formValues.email2}
                onChange={handleInputChange}
                validations={[{ type: "email" }]}
                errorText={errors["email2"] || undefined}
                icon={<FaEnvelope size={12} />}
                disabled
              />
            </div>

            {/* Address Section */}
            <div className={styles.label}>Address</div>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldRow}>
                <InputField
                  name="postalCode"
                  placeholder="Postal code"
                  value={formValues.postalCode}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["postalCode"] || undefined}
                  icon={<FaHome size={12} />}
                  disabled
                />
                <SelectField
                  name="prefecture"
                  placeholder="Prefecture"
                  options={[
                    { label: "Hokkaido", value: "hokkaido" },
                    { label: "Aomori", value: "aomori" },
                    { label: "Iwate", value: "iwate" },
                    { label: "Miyagi", value: "miyagi" },
                    { label: "Akita", value: "akita" },
                    { label: "Yamagata", value: "yamagata" },
                    { label: "Fukushima", value: "fukushima" },
                    { label: "Ibaraki", value: "ibaraki" },
                    { label: "Tochigi", value: "tochigi" },
                    { label: "Gunma", value: "gunma" },
                    { label: "Saitama", value: "saitama" },
                    { label: "Chiba", value: "chiba" },
                    { label: "Tokyo", value: "tokyo" },
                    { label: "Kanagawa", value: "kanagawa" },
                    { label: "Niigata", value: "niigata" },
                    { label: "Toyama", value: "toyama" },
                    { label: "Ishikawa", value: "ishikawa" },
                    { label: "Fukui", value: "fukui" },
                    { label: "Yamanashi", value: "yamanashi" },
                    { label: "Nagano", value: "nagano" },
                    { label: "Gifu", value: "gifu" },
                    { label: "Shizuoka", value: "shizuoka" },
                    { label: "Aichi", value: "aichi" },
                    { label: "Mie", value: "mie" },
                    { label: "Shiga", value: "shiga" },
                    { label: "Kyoto", value: "kyoto" },
                    { label: "Osaka", value: "osaka" },
                    { label: "Hyogo", value: "hyogo" },
                    { label: "Nara", value: "nara" },
                    { label: "Wakayama", value: "wakayama" },
                    { label: "Tottori", value: "tottori" },
                    { label: "Shimane", value: "shimane" },
                    { label: "Okayama", value: "okayama" },
                    { label: "Hiroshima", value: "hiroshima" },
                    { label: "Yamaguchi", value: "yamaguchi" },
                    { label: "Tokushima", value: "tokushima" },
                    { label: "Kagawa", value: "kagawa" },
                    { label: "Ehime", value: "ehime" },
                    { label: "Kochi", value: "kochi" },
                    { label: "Fukuoka", value: "fukuoka" },
                    { label: "Saga", value: "saga" },
                    { label: "Nagasaki", value: "nagasaki" },
                    { label: "Kumamoto", value: "kumamoto" },
                    { label: "Oita", value: "oita" },
                    { label: "Miyazaki", value: "miyazaki" },
                    { label: "Kagoshima", value: "kagoshima" },
                    { label: "Okinawa", value: "okinawa" },
                  ]}
                  value={formValues.prefecture}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["prefecture"] || undefined}
                  icon={<FaHome size={12} />}
                  disabled
                />
              </div>
              <InputField
                name="address1"
                placeholder="Address 1"
                value={formValues.address1}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["address1"] || undefined}
                icon={<FaHome size={12} />}
                disabled
              />
              <InputField
                name="address2"
                placeholder="Address 2"
                value={formValues.address2}
                onChange={handleInputChange}
                icon={<FaHome size={12} />}
                disabled
              />
              <InputField
                name="building"
                placeholder="Building"
                value={formValues.building}
                onChange={handleInputChange}
                icon={<FaHome size={12} />}
                disabled
              />
            </div>

            {/* Train Station Section */}
            <div className={styles.label}>Train Station</div>
            <div className={styles.fieldGroup}>
              <div className={styles.stationGroup}>
                <InputField
                  name="railwayCompany1"
                  placeholder="Railway company 1"
                  value={formValues.railwayCompany1}
                  onChange={handleInputChange}
                  icon={<FaTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainLine1"
                  placeholder="Train line 1"
                  value={formValues.trainLine1}
                  onChange={handleInputChange}
                  icon={<FaTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainStation1"
                  placeholder="Train station 1"
                  value={formValues.trainStation1}
                  onChange={handleInputChange}
                  icon={<FaTrain size={12} />}
                  disabled
                />
              </div>
              <div className={styles.stationGroup}>
                <InputField
                  name="railwayCompany2"
                  placeholder="Railway company 2"
                  value={formValues.railwayCompany2}
                  onChange={handleInputChange}
                  icon={<FaTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainLine2"
                  placeholder="Train line 2"
                  value={formValues.trainLine2}
                  onChange={handleInputChange}
                  icon={<FaTrain size={12} />}
                  disabled
                />
                <InputField
                  name="trainStation2"
                  placeholder="Train station 2"
                  value={formValues.trainStation2}
                  onChange={handleInputChange}
                  icon={<FaTrain size={12} />}
                  disabled
                />
              </div>
            </div>

            {/* Gender Section */}
            <div className={styles.label}>Gender</div>
            <RadioField
              name="gender"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
              selectedValue={formValues.gender}
              onChange={handleInputChange}
              className={styles.radioGroup}
              disabled
            />

            {/* Date of Birth Section */}
            <div className={styles.label}>Date of birth</div>
            <div className={styles.dateGroup}>
              <SelectField
                name="birthYear"
                placeholder="Year"
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
                placeholder="Month"
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
                placeholder="Day"
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
                placeholder="Age"
                value={formValues.age}
                onChange={handleInputChange}
                icon={<SlCalender size={12} />}
                disabled
              />
            </div>

            {/* Language Section */}
            <div className={styles.label}>Language</div>
            <RadioField
              name="language"
              options={[
                { label: "Japanese", value: "japanese" },
                { label: "English", value: "english" },
                { label: "Both", value: "both" },
              ]}
              selectedValue={formValues.language}
              onChange={handleInputChange}
              className={styles.radioGroup}
              disabled
            />

            {/* Advertising Email Section */}
            <div className={styles.label}>Advertising email</div>
            <RadioField
              name="advertising"
              options={[
                { label: "Subscribe", value: "subscribe" },
                { label: "Unsubscribe", value: "unsubscribe" },
              ]}
              selectedValue={formValues.advertising}
              onChange={handleInputChange}
              className={styles.radioGroup}
              disabled
            />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Button
              htmlType="submit"
              type="primary"
              text={t("Submit")}
              disabled
            />
          </div>
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
                  <h1 className={styles.contractHeading}>{plan.name}</h1>

                  <Form
                    className={styles.customerForm}
                    onSubmit={handleContractSubmit}
                    errors={{}}
                    setErrors={() => {}}
                  >
                    <div className={`${styles.formGrid}`}>
                      {/* Contract Type Section */}
                      <div className={styles.label}>Contract Type</div>
                      <RadioField
                        name="contractType"
                        options={[
                          { label: "General", value: "general" },
                          {
                            label: "Affiliated corporation",
                            value: "affiliated",
                          },
                        ]}
                        selectedValue={formValues.contractType}
                        onChange={handleInputChange}
                        className={styles.radioGroup}
                      />

                      {/* Contract Plan Section */}
                      <div className={styles.label}>Contract Plan</div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldRow}>
                          <CustomSelectField
                            name="service"
                            placeholder="Service"
                            icon={<FaGlobe size={12} />}
                          />
                          <CustomSelectField
                            name="plan"
                            placeholder="Plan"
                            icon={<FaGlobe size={12} />}
                          />
                        </div>
                      </div>

                      {/* Time Range Section */}
                      <div className={styles.label}>Time Range</div>
                      <RadioField
                        name="timeRange"
                        options={[
                          { label: "With time range", value: "with" },
                          { label: "Without time range", value: "without" },
                        ]}
                        selectedValue={formValues.timeRange}
                        onChange={handleInputChange}
                        className={styles.radioGroup}
                      />

                      {/* Time Extension Section */}
                      <div className={styles.label}>Time Extension</div>
                      <RadioField
                        name="timeExtension"
                        options={[
                          { label: "With time extension", value: "with" },
                          { label: "Without time extension", value: "without" },
                        ]}
                        selectedValue={formValues.timeExtension}
                        onChange={handleInputChange}
                        className={styles.radioGroup}
                      />

                      {/* Contract Period Section */}
                      <div className={styles.label}>Contract Period</div>
                      <div className={styles.fieldGroup}>
                        <InputDateField
                          name="contractPeriod"
                          value="2025-04-14 to 2025-04-19"
                        />
                      </div>

                      {/* Day of the Week Section */}
                      <div className={styles.label}>Day of the Week</div>
                      <div className={styles.fieldGroup}>
                        <div
                          className={styles.weekdayCheckboxes}
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: "8px",
                          }}
                        >
                          <CheckboxField
                            name="monday"
                            options={[{ value: "monday", label: "Monday" }]}
                            selectedValues={formValues.monday}
                            onChange={(values) =>
                              setFormValues((prev) => ({
                                ...prev,
                                monday: values,
                              }))
                            }
                          />
                          <CheckboxField
                            name="tuesday"
                            options={[{ value: "tuesday", label: "Tuesday" }]}
                            selectedValues={formValues.tuesday}
                            onChange={(values) =>
                              setFormValues((prev) => ({
                                ...prev,
                                tuesday: values,
                              }))
                            }
                          />
                          <CheckboxField
                            name="wednesday"
                            options={[
                              { value: "wednesday", label: "Wednesday" },
                            ]}
                            selectedValues={formValues.wednesday}
                            onChange={(values) =>
                              setFormValues((prev) => ({
                                ...prev,
                                wednesday: values,
                              }))
                            }
                          />
                          <CheckboxField
                            name="thursday"
                            options={[{ value: "thursday", label: "Thursday" }]}
                            selectedValues={formValues.thursday}
                            onChange={(values) =>
                              setFormValues((prev) => ({
                                ...prev,
                                thursday: values,
                              }))
                            }
                          />
                          <CheckboxField
                            name="friday"
                            options={[{ value: "friday", label: "Friday" }]}
                            selectedValues={formValues.friday}
                            onChange={(values) =>
                              setFormValues((prev) => ({
                                ...prev,
                                friday: values,
                              }))
                            }
                          />
                          <CheckboxField
                            name="saturday"
                            options={[{ value: "saturday", label: "Saturday" }]}
                            selectedValues={formValues.saturday}
                            onChange={(values) =>
                              setFormValues((prev) => ({
                                ...prev,
                                saturday: values,
                              }))
                            }
                          />
                          <CheckboxField
                            name="sunday"
                            options={[{ value: "sunday", label: "Sunday" }]}
                            selectedValues={formValues.sunday}
                            onChange={(values) =>
                              setFormValues((prev) => ({
                                ...prev,
                                sunday: values,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Time Section */}
                      <div className={styles.label}>Time</div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldRow}>
                          <InputField
                            name="startTime"
                            placeholder="Start time"
                            icon={<SlCalender size={12} />}
                          />
                          <div className={styles.timeConnector}>~</div>
                          <InputField
                            name="endTime"
                            placeholder="End time"
                            icon={<SlCalender size={12} />}
                          />
                        </div>
                      </div>
                    </div>
                  </Form>
                </>
              ))}
          </div>
        </div>
      </ClientSection>
    </div>
  );
}
