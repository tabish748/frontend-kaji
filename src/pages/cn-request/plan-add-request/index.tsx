import React, { useState, ChangeEvent } from "react";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import RadioField from "@/components/radio-field/radio-field";
import CustomSelectField from "@/components/custom-select/custom-select";
import InputDateField from "@/components/input-date/input-date";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import InputField from "@/components/input-field/input-field";
import SubRouteLayout from "../layout";
import { BsFileEarmarkText } from "react-icons/bs";
import { BiCalendar } from "react-icons/bi";
import { GiAlarmClock } from "react-icons/gi";

interface ContractFormValues {
  contractType: string;
  service: string;
  plan: string;
  timeRange: string;
  timeExtension: string;
  contractPeriod: string;
  contractdate: string;
  weekdays: string[];
  startTime: string;
  endTime: string;
}

interface PlanData {
  id: number;
  name: string;
  prevFormValues: ContractFormValues; // Current plan
  updateFormValues: ContractFormValues; // New plan to be added
  formErrors: Record<string, string | null>;
}

export default function PlanAddRequest() {
  const { t } = useLanguage();

  // Initialize three existing plans + one new plan to be added
  const initialPlans: PlanData[] = [
    {
      id: 1,
      name: "PLAN 1",
      prevFormValues: {
        contractType: "general",
        service: "basic",
        plan: "monthly",
        timeRange: "with",
        timeExtension: "with",
        contractPeriod: "2025-04-14 to 2025-04-19",
        contractdate: "2025-04-14",
        weekdays: ["monday"],
        startTime: "09:00",
        endTime: "17:00",
      },
      updateFormValues: {
        contractType: "general",
        service: "basic",
        plan: "monthly",
        timeRange: "with",
        timeExtension: "with",
        contractPeriod: "2025-04-14 to 2025-04-19",
        contractdate: "2025-04-14",
        weekdays: ["monday"],
        startTime: "09:00",
        endTime: "17:00",
      },
      formErrors: {},
    },
    {
      id: 2,
      name: "PLAN 2",
      prevFormValues: {
        contractType: "general",
        service: "premium",
        plan: "quarterly",
        timeRange: "with",
        timeExtension: "without",
        contractPeriod: "2025-05-01 to 2025-07-31",
        contractdate: "2025-05-01",
        weekdays: ["tuesday", "wednesday"],
        startTime: "10:00",
        endTime: "18:00",
      },
      updateFormValues: {
        contractType: "general",
        service: "premium",
        plan: "quarterly",
        timeRange: "with",
        timeExtension: "without",
        contractPeriod: "2025-05-01 to 2025-07-31",
        contractdate: "2025-05-01",
        weekdays: ["tuesday", "wednesday"],
        startTime: "10:00",
        endTime: "18:00",
      },
      formErrors: {},
    },
    {
      id: 3,
      name: "PLAN 3",
      prevFormValues: {
        contractType: "affiliated",
        service: "enterprise",
        plan: "annual",
        timeRange: "without",
        timeExtension: "with",
        contractPeriod: "2025-01-01 to 2025-12-31",
        contractdate: "2025-01-01",
        weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        startTime: "08:00",
        endTime: "20:00",
      },
      updateFormValues: {
        contractType: "affiliated",
        service: "enterprise",
        plan: "annual",
        timeRange: "without",
        timeExtension: "with",
        contractPeriod: "2025-01-01 to 2025-12-31",
        contractdate: "2025-01-01",
        weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        startTime: "08:00",
        endTime: "20:00",
      },
      formErrors: {},
    },
  ];

  // New plan to be added (empty/default values)
  const newPlan: PlanData = {
    id: 4,
    name: "PLAN 4",
    prevFormValues: {
      contractType: "general",
      service: "",
      plan: "",
      timeRange: "with",
      timeExtension: "with",
      contractPeriod: "",
      contractdate: "",
      weekdays: [],
      startTime: "",
      endTime: "",
    },
    updateFormValues: {
      contractType: "general",
      service: "",
      plan: "",
      timeRange: "with",
      timeExtension: "with",
      contractPeriod: "",
      contractdate: "",
      weekdays: [],
      startTime: "",
      endTime: "",
    },
    formErrors: {},
  };

  const [plans, setPlans] = useState<PlanData[]>(initialPlans);
  const [newPlanData, setNewPlanData] = useState<PlanData>(newPlan);
  const [activePrevPlanId, setActivePrevPlanId] = useState<number>(1); // For previous information section
  const [activeUpdatePlanId, setActiveUpdatePlanId] = useState<number>(4); // Fixed to new plan

  // Get currently active plans with safety check
  const activePrevPlan = plans.find((plan) => plan.id === activePrevPlanId);
  const activeUpdatePlan = activeUpdatePlanId === 4 ? newPlanData : plans.find((plan) => plan.id === activeUpdatePlanId);

  // Return loading state if no active plans found
  if (!activePrevPlan || !activeUpdatePlan) {
    return (
      <ClientSection heading={t("planChangeRequest.heading")}>
        <div>Loading...</div>
      </ClientSection>
    );
  }

  const handleWeekdaysChange = (values: string[]) => {
    if (activeUpdatePlanId === 4) {
      setNewPlanData((prev) => ({
        ...prev,
        updateFormValues: { ...prev.updateFormValues, weekdays: values },
        formErrors: { ...prev.formErrors, weekdays: null },
      }));
    }
  };

  const handleContractInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("handleContractInputChange - name:", name, "value:", value);

    if (activeUpdatePlanId === 4) {
      setNewPlanData((prev) => ({
        ...prev,
        updateFormValues: { ...prev.updateFormValues, [name]: value },
        formErrors: { ...prev.formErrors, [name]: null },
      }));
    }
  };

  const handleDateChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    console.log("handleDateChange - name:", name, "value:", value);

    if (activeUpdatePlanId === 4) {
      setNewPlanData((prev) => ({
        ...prev,
        updateFormValues: { ...prev.updateFormValues, [name]: value },
        formErrors: { ...prev.formErrors, [name]: null },
      }));
    }
  };

  const handleContractSubmit = () => {
    console.log("Previous plan being viewed:", activePrevPlan.name);
    console.log("New plan to be added for:", activeUpdatePlan.name);
    console.log("New plan data:", activeUpdatePlan.updateFormValues);
    console.log("All plans:", plans);
  };

  const renderPlanForm = (formValues: ContractFormValues, isReadOnly: boolean = false, planForErrors?: PlanData) => (
    <Form
      className={`${styles.customerForm} ${styles.formSection} ${
        isReadOnly ? styles.prev : styles.update
      }`}
      onSubmit={isReadOnly ? () => {} : handleContractSubmit}
      errors={isReadOnly ? {} : (planForErrors?.formErrors || {})}
      setErrors={() => {}}
    >
      <div className={`${styles.formGrid}`}>
        {/* Contract Type Section */}
        <div className={styles.label}>{t("aboutPage.contractTypeLabel")}</div>
        <RadioField
          name="contractType"
          options={[
            { label: t("aboutPage.general"), value: "general" },
            { label: t("aboutPage.affiliated"), value: "affiliated" },
          ]}
          selectedValue={formValues.contractType}
          onChange={isReadOnly ? () => {} : handleContractInputChange}
          className={styles.radioGroup}
          disabled={isReadOnly}
        />

        {/* Contract Plan Section */}
        <div className={styles.label}>{t("aboutPage.contractPlanLabel")}</div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
            <CustomSelectField
              name="service"
              placeholder={t("aboutPage.servicePlaceholder")}
              options={[
                { label: t("aboutPage.basic"), value: "basic" },
                { label: t("aboutPage.premium"), value: "premium" },
                { label: t("aboutPage.enterprise"), value: "enterprise" },
              ]}
              icon={<BsFileEarmarkText size={12} />}
              value={formValues.service}
              onChange={isReadOnly ? () => {} : handleContractInputChange}
              disabled={isReadOnly}
              validations={!isReadOnly ? [{ type: "required" }] : undefined}
              errorText={!isReadOnly ? planForErrors?.formErrors["service"] || undefined : undefined}
            />
            <CustomSelectField
              name="plan"
              placeholder={t("aboutPage.planPlaceholder")}
              options={[
                { label: t("aboutPage.monthly"), value: "monthly" },
                { label: t("aboutPage.quarterly"), value: "quarterly" },
                { label: t("aboutPage.annual"), value: "annual" },
              ]}
              icon={<BsFileEarmarkText size={12} />}
              value={formValues.plan}
              onChange={isReadOnly ? () => {} : handleContractInputChange}
              disabled={isReadOnly}
              validations={!isReadOnly ? [{ type: "required" }] : undefined}
              errorText={!isReadOnly ? planForErrors?.formErrors["plan"] || undefined : undefined}
            />
          </div>
        </div>

        {/* Time Range Section */}
        <div className={styles.label}>{t("aboutPage.timeRangeLabel")}</div>
        <RadioField
          name="timeRange"
          options={[
            { label: t("aboutPage.withTimeRange"), value: "with" },
            { label: t("aboutPage.withoutTimeRange"), value: "without" },
          ]}
          selectedValue={formValues.timeRange}
          onChange={isReadOnly ? () => {} : handleContractInputChange}
          className={styles.radioGroup}
          disabled={isReadOnly}
        />

        {/* Time Extension Section */}
        <div className={styles.label}>
          {t("aboutPage.timeExtensionLabel")}
        </div>
        <RadioField
          name="timeExtension"
          options={[
            { label: t("aboutPage.withTimeExtension"), value: "with" },
            { label: t("aboutPage.withoutTimeExtension"), value: "without" },
          ]}
          selectedValue={formValues.timeExtension}
          onChange={isReadOnly ? () => {} : handleContractInputChange}
          className={styles.radioGroup}
          disabled={isReadOnly}
        />

        {/* Contract Period Section */}
        <div className={styles.label}>
          {t("aboutPage.contractPeriodLabel")}
        </div>
        <div className={styles.fieldGroup}>
          <InputDateField
            name="contractPeriod"
            value={formValues.contractPeriod}
            onChange={isReadOnly ? undefined : handleDateChange}
            isRange={true}
            startPlaceholder={t("aboutPage.startDatePlaceholder")}
            endPlaceholder={t("aboutPage.endDatePlaceholder")}
            icon={<BiCalendar size={12} />}
            disabled={isReadOnly}
            maxDate={!isReadOnly ? false : undefined}
            validations={!isReadOnly ? [{ type: "required" }] : undefined}
            errorText={!isReadOnly ? planForErrors?.formErrors["contractPeriod"] || undefined : undefined}
          />
        </div>

        {/* Day of the Week Section */}
        <div className={styles.label}>{t("aboutPage.dayOfWeekLabel")}</div>
        <div className={styles.fieldGroup}>
          <div className={styles.weekdayCheckboxes}>
            <CheckboxField
              name="weekdays"
              options={[
                { value: "monday", label: t("aboutPage.monday") },
                { value: "tuesday", label: t("aboutPage.tuesday") },
                { value: "wednesday", label: t("aboutPage.wednesday") },
                { value: "thursday", label: t("aboutPage.thursday") },
                { value: "friday", label: t("aboutPage.friday") },
                { value: "saturday", label: t("aboutPage.saturday") },
                { value: "sunday", label: t("aboutPage.sunday") },
              ]}
              selectedValues={formValues.weekdays}
              onChange={isReadOnly ? () => {} : handleWeekdaysChange}
              disabled={isReadOnly}
              validations={!isReadOnly ? [{ type: "required" }] : undefined}
              errorText={!isReadOnly ? planForErrors?.formErrors["weekdays"] || undefined : undefined}
            />
          </div>
        </div>

        {/* Time Section */}
        <div className={styles.label}>{t("aboutPage.timeLabel")}</div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
            <InputField
              name="startTime"
              placeholder={t("aboutPage.startTimePlaceholder")}
              icon={<GiAlarmClock size={12} />}
              type="time"
              value={formValues.startTime}
              onChange={isReadOnly ? () => {} : handleContractInputChange}
              disabled={isReadOnly}
              validations={!isReadOnly ? [{ type: "required" }] : undefined}
              errorText={!isReadOnly ? planForErrors?.formErrors["startTime"] || undefined : undefined}
            />
            <span className={styles.timeConnector}>~</span>
            <InputField
              name="endTime"
              placeholder={t("aboutPage.endTimePlaceholder")}
              icon={<GiAlarmClock size={12} />}
              type="time"
              value={formValues.endTime}
              onChange={isReadOnly ? () => {} : handleContractInputChange}
              disabled={isReadOnly}
              validations={!isReadOnly ? [{ type: "required" }] : undefined}
              errorText={!isReadOnly ? planForErrors?.formErrors["endTime"] || undefined : undefined}
            />
          </div>
        </div>
      </div>
      {!isReadOnly && (
        <div className="d-flex justify-content-between mt-2 gap-1 false">
          <span></span>
          <div className="d-flex justify-content-between gap-1">
            <Button
              className="px-10"
              htmlType="submit"
              type="primary"
              text={t("planChangeRequest.submit")}
            />
          </div>
          <span></span>
        </div>
      )}
    </Form>
  );

  return (
    <ClientSection heading={t("planChangeRequest.heading")}>
      <h3 className={styles.subHeading}>{t("planChangeRequest.subHeading")}</h3>

      {/* Previous Information Section */}
      <h1 className="cn-seperator-heading primary">
        {t("planChangeRequest.prev")}
      </h1>
      
      {/* Plan Tabs for Previous Information - Only existing plans (3 tabs) */}
      <div className={`${styles.tabContainer} my-2`}>
        {plans.map((plan) => (
          <button
            key={`prev-${plan.id}`}
            className={`${styles.tabButtonContract} ${
              activePrevPlanId === plan.id ? styles.active : ""
            }`}
            onClick={() => setActivePrevPlanId(plan.id)}
          >
            {plan.name}
          </button>
        ))}
      </div>
      
      {renderPlanForm(activePrevPlan.prevFormValues, true)}

      {/* Updated Information Section */}
      <h1 className="cn-seperator-heading danger mt-3">
        {t("planChangeRequest.update")}
      </h1>
      
      {/* Plan Tabs for Updated Information - Existing plans (disabled) + Add Plan (active) */}
      <div className={`${styles.tabContainer} my-2`}>
        {/* Existing plans - disabled */}
        {plans.map((plan) => (
          <button
            key={`update-${plan.id}`}
            className={`${styles.tabButtonContract}`}
            disabled
            style={{ cursor: 'not-allowed', opacity: 0.5 }}
          >
            {plan.name}
          </button>
        ))}
        {/* Add new plan tab - active */}
        <button
          key="update-add"
          className={`${styles.tabButtonContract} ${styles.active}`}
        >
          {newPlanData.name}
        </button>
      </div>
      
      {renderPlanForm(activeUpdatePlan.updateFormValues, false, activeUpdatePlan)}
    </ClientSection>
  );
}

// ⬇ Layout integration
PlanAddRequest.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
