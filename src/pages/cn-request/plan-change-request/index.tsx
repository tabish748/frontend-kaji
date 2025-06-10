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

export default function PlanChangeRequest() {
  const { t } = useLanguage();

  // Previous contract values (static/from backend)
  const prevContractValues: ContractFormValues = {
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
  };

  // Current editable contract values
  const [contractFormValues, setContractFormValues] =
    useState<ContractFormValues>({
      contractType: "general",
      service: "",
      plan: "",
      timeRange: "with",
      timeExtension: "with",
      contractPeriod: "",
      contractdate: "",
      weekdays: ["monday"],
      startTime: "",
      endTime: "",
    });

  const [formErrors, setFormErrors] = useState<Record<string, string | null>>(
    {}
  );

  const handleWeekdaysChange = (values: string[]) => {
    setContractFormValues((prev) => ({
      ...prev,
      weekdays: values,
    }));
    setFormErrors((prev) => ({ ...prev, weekdays: null }));
  };

  const handleContractInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("handleContractInputChange - name:", name, "value:", value);

    setContractFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the specific error for this field
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    console.log("handleDateChange - name:", name, "value:", value);

    setContractFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the specific error for this field
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleContractSubmit = () => {
    console.log("Current form values:", contractFormValues);

    // The Form component will handle validation through its built-in system
    // If we reach this point, validation has passed
    console.log("Contract form submitted with values:", contractFormValues);
  };

  return (
    <ClientSection heading={t("planChangeRequest.heading")}>
      <h3 className={styles.subHeading}>{t("planChangeRequest.subHeading")}</h3>

      {/* Previous Contract Info */}
      <h1 className="cn-seperator-heading primary">
        {t("planChangeRequest.prev")}
      </h1>
      <Form
        className={`${styles.customerForm} ${styles.formSection} ${styles.prev}`}
        onSubmit={() => {}}
        errors={{}}
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
            selectedValue={prevContractValues.contractType}
            onChange={() => {}}
            className={styles.radioGroup}
            disabled
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
                value={prevContractValues.service}
                onChange={() => {}}
                disabled
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
                value={prevContractValues.plan}
                onChange={() => {}}
                disabled
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
            selectedValue={prevContractValues.timeRange}
            onChange={() => {}}
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
              { label: t("aboutPage.withTimeExtension"), value: "with" },
              { label: t("aboutPage.withoutTimeExtension"), value: "without" },
            ]}
            selectedValue={prevContractValues.timeExtension}
            onChange={() => {}}
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
              value={prevContractValues.contractPeriod}
              isRange={true}
              startPlaceholder={t("aboutPage.startDatePlaceholder")}
              endPlaceholder={t("aboutPage.endDatePlaceholder")}
              icon={<BiCalendar size={12} />}
              disabled
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
                selectedValues={prevContractValues.weekdays}
                onChange={() => {}}
                disabled
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
                value={prevContractValues.startTime}
                onChange={() => {}}
                disabled
              />
              <span className={styles.timeConnector}>~</span>
              <InputField
                name="endTime"
                placeholder={t("aboutPage.endTimePlaceholder")}
                icon={<GiAlarmClock size={12} />}
                type="time"
                value={prevContractValues.endTime}
                onChange={() => {}}
                disabled
              />
            </div>
          </div>
        </div>
      </Form>

      {/* Updated Contract Info */}
      <h1 className="cn-seperator-heading danger mt-3">
        {t("planChangeRequest.update")}
      </h1>
      <Form
        className={`${styles.customerForm} ${styles.formSection} ${styles.update}`}
        onSubmit={handleContractSubmit}
        errors={formErrors}
        setErrors={setFormErrors}
      >
        <div className={`${styles.formGrid}`}>
          {/* Same form fields as above but with handleContractInputChange and contractFormValues */}
          {/* Contract Type Section */}
          <div className={styles.label}>{t("aboutPage.contractTypeLabel")}</div>
          <RadioField
            name="contractType"
            options={[
              { label: t("aboutPage.general"), value: "general" },
              { label: t("aboutPage.affiliated"), value: "affiliated" },
            ]}
            selectedValue={contractFormValues.contractType}
            onChange={handleContractInputChange}
            className={styles.radioGroup}
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
                value={contractFormValues.service}
                onChange={handleContractInputChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["service"] || undefined}
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
                value={contractFormValues.plan}
                onChange={handleContractInputChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["plan"] || undefined}
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
            selectedValue={contractFormValues.timeRange}
            onChange={handleContractInputChange}
            className={styles.radioGroup}
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
            selectedValue={contractFormValues.timeExtension}
            onChange={handleContractInputChange}
            className={styles.radioGroup}
          />

          {/* Contract Period Section */}
          <div className={styles.label}>
            {t("aboutPage.contractPeriodLabel")}
          </div>
          <div className={styles.fieldGroup}>
            <InputDateField
              name="contractPeriod"
              value={contractFormValues.contractPeriod}
              onChange={handleDateChange}
              isRange={true}
              startPlaceholder={t("aboutPage.startDatePlaceholder")}
              endPlaceholder={t("aboutPage.endDatePlaceholder")}
              icon={<BiCalendar size={12} />}
              maxDate={false}
              validations={[{ type: "required" }]}
              errorText={formErrors["contractPeriod"] || undefined}
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
                selectedValues={contractFormValues.weekdays}
                onChange={handleWeekdaysChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["weekdays"] || undefined}
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
                value={contractFormValues.startTime}
                onChange={handleContractInputChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["startTime"] || undefined}
              />
              <span className={styles.timeConnector}>~</span>
              <InputField
                name="endTime"
                placeholder={t("aboutPage.endTimePlaceholder")}
                icon={<GiAlarmClock size={12} />}
                type="time"
                value={contractFormValues.endTime}
                onChange={handleContractInputChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["endTime"] || undefined}
              />
            </div>
          </div>
        </div>
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
      </Form>
    </ClientSection>
  );
}

// ⬇ Layout integration
PlanChangeRequest.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
