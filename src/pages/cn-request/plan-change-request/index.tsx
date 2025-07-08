import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCustomerDropdowns } from "@/app/features/dropdowns/getCustomerDropdownsSlice";
import { changePlanRequest, resetChangePlanRequest } from "@/app/customer/changePlanRequestSlice";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import aboutStyles from "@/styles/pages/cnabout.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import RadioField from "@/components/radio-field/radio-field";
import CustomSelectField from "@/components/custom-select/custom-select";
import InputDateField from "@/components/input-date/input-date";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import InputField from "@/components/input-field/input-field";
import ApiLoadingWrapper from "@/components/api-loading-wrapper/api-loading-wrapper";
import Toast from "@/components/toast/toast";
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
  weekdays: string[];
  startTime: string;
  endTime: string;
}

interface PlanChangeRequestProps {
  activeContractIdx: number;
  activePlanIdx: number;
  onPlanTabClick: (planIdx: number) => void;
}

export default function PlanChangeRequest({ activeContractIdx, activePlanIdx, onPlanTabClick }: PlanChangeRequestProps) {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { customerDropdowns, loading: dropdownsLoading, error: dropdownsError } = useSelector((state: RootState) => state.customerDropdowns);
  const customer = useSelector((state: RootState) => state.customerBasicInfo.customer);
  const changePlanState = useSelector((state: RootState) => state.changePlanRequest);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Fetch dropdowns on mount and reset state
  useEffect(() => {
    if (!customerDropdowns) {
      dispatch(fetchCustomerDropdowns());
    }
    // Reset the change plan state when component mounts
    dispatch(resetChangePlanRequest());
  }, [dispatch, customerDropdowns]);

  // Cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetChangePlanRequest());
    };
  }, [dispatch]);

  // Handle success/error states from changePlanRequest
  useEffect(() => {
    if (changePlanState.success === true) {
      setToastMessage(changePlanState.message || t('Plan change request submitted successfully.'));
      setToastType("success");
      setShowToast(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const langParam = router.query.lang ? `?lang=${router.query.lang}` : '';
        router.replace(`/cn-request${langParam}`);
      }, 2000);
    } else if (changePlanState.success === false && changePlanState.error) {
      setToastMessage(changePlanState.error);
      setToastType("fail");
      setShowToast(true);
    }
  }, [changePlanState.success, changePlanState.error, changePlanState.message, router, t]);

  // Get active contract and plans by index
  const contracts = customer?.customer_contracts || [];
  const activeContract = contracts[activeContractIdx];
  const plans = activeContract?.customer_contract_plans || [];
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(activePlanIdx);
  const activePlan = plans[selectedPlanIdx];

  // Keep local selectedPlanIdx in sync with prop
  useEffect(() => {
    setSelectedPlanIdx(activePlanIdx);
  }, [activePlanIdx]);

  // Previous contract values from current plan data
  const prevContractValues: ContractFormValues = {
    contractType: activeContract?.contract_type?.toString() || "1",
    service: activePlan?.service_id?.toString() || "",
    plan: activePlan?.contract_plan_id?.toString() || "",
    timeRange: activePlan?.time_range ? "with" : "without",
    timeExtension: activePlan?.extended_time ? "with" : "without",
    contractPeriod: activePlan?.contract_period_start && activePlan?.contract_period_end 
      ? `${activePlan.contract_period_start} to ${activePlan.contract_period_end}`
      : "",
    weekdays: activePlan?.days_of_week ? activePlan.days_of_week.split(',') : [],
    startTime: activePlan?.service_hours_start || "",
    endTime: activePlan?.service_hours_end || "",
  };

  // Current editable contract values
  const [contractFormValues, setContractFormValues] = useState<ContractFormValues>({
    contractType: "",
      service: "",
      plan: "",
    timeRange: "",
    timeExtension: "",
      contractPeriod: "",
    weekdays: [],
      startTime: "",
      endTime: "",
    });



  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  const handleWeekdaysChange = (values: string[]) => {
    setContractFormValues((prev) => ({
      ...prev,
      weekdays: values,
    }));
    setFormErrors((prev) => ({ ...prev, weekdays: null }));
    // Reset toast and state when user makes changes
    setShowToast(false);
    if (changePlanState.success !== null || changePlanState.error) {
      dispatch(resetChangePlanRequest());
    }
  };

  // Handle input and radio changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContractFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
    // Reset toast and state when user makes changes
    setShowToast(false);
    if (changePlanState.success !== null || changePlanState.error) {
      dispatch(resetChangePlanRequest());
    }
  };

  const handleDateChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setContractFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
    // Reset toast and state when user makes changes
    setShowToast(false);
    if (changePlanState.success !== null || changePlanState.error) {
      dispatch(resetChangePlanRequest());
    }
  };

  const handleContractSubmit = () => {
    if (!activeContract || !activePlan) {
      setToastMessage("Contract or plan data is missing.");
      setToastType("fail");
      setShowToast(true);
      return;
    }

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!contractFormValues.contractType) {
      errors.contractType = "Contract type is required.";
    }
    if (!contractFormValues.service) {
      errors.service = "Service is required.";
    }
    if (!contractFormValues.plan) {
      errors.plan = "Contract plan is required.";
    }
    if (!contractFormValues.timeRange) {
      errors.timeRange = "Time range is required.";
    }
    if (!contractFormValues.timeExtension) {
      errors.timeExtension = "Time extension is required.";
    }
    if (!contractFormValues.contractPeriod) {
      errors.contractPeriod = "Contract period is required.";
    }
    if (!contractFormValues.startTime) {
      errors.startTime = "Start time is required.";
    }
    if (!contractFormValues.endTime) {
      errors.endTime = "End time is required.";
    }
    if (contractFormValues.weekdays.length === 0) {
      errors.weekdays = "At least one day of the week is required.";
    }

    // Validate time range
    if (contractFormValues.startTime && contractFormValues.endTime) {
      if (contractFormValues.startTime >= contractFormValues.endTime) {
        errors.endTime = "End time must be after start time.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToastMessage("Please fix the validation errors.");
      setToastType("fail");
      setShowToast(true);
      return;
    }

    // Parse contract period dates
    const [startDate, endDate] = contractFormValues.contractPeriod.includes(' to ') 
      ? contractFormValues.contractPeriod.split(' to ')
      : [contractFormValues.contractPeriod, contractFormValues.contractPeriod];

    // Map weekdays to the required format
    const daysOfWeekMap: { [key: string]: string } = {
      "1": "",
      "2": "",
      "3": "",
      "4": "",
      "5": "",
      "6": "",
      "7": "",
    };

    // Map weekdays to numbers (Monday=1, Tuesday=2, etc.)
    const weekdayMapping: { [key: string]: string } = {
      "monday": "1",
      "tuesday": "2", 
      "wednesday": "3",
      "thursday": "4",
      "friday": "5",
      "saturday": "6",
      "sunday": "7",
    };

    contractFormValues.weekdays.forEach(day => {
      const dayNumber = weekdayMapping[day.toLowerCase()];
      if (dayNumber) {
        daysOfWeekMap[dayNumber] = day.charAt(0).toUpperCase() + day.slice(1);
      }
    });

    const payload = {
      customer_contract_id: activeContract.id,
      customer_contract_plan_id: activePlan.id,
      service_id: Number(contractFormValues.service),
      contract_plan_id: Number(contractFormValues.plan),
      time_range: contractFormValues.timeRange === "with" ? 1 : 0,
      extended_time: contractFormValues.timeExtension === "with" ? 1 : 0,
      contract_period_start: startDate.trim(),
      contract_period_end: endDate.trim(),
      service_hours_start: contractFormValues.startTime,
      service_hours_end: contractFormValues.endTime,
      recurrence_type: "",
      interval: "",
      days_of_week: daysOfWeekMap,
    };

    dispatch(changePlanRequest(payload));
    setFormErrors({});
  };

  const handleToastClose = () => {
    setShowToast(false);
    if (changePlanState.success !== null || changePlanState.error) {
      dispatch(resetChangePlanRequest());
    }
  };



  return (
    <ApiLoadingWrapper
      loading={dropdownsLoading}
      error={dropdownsError}
      onRetry={() => dispatch(fetchCustomerDropdowns())}
      errorTitle="Error loading plan data"
    >
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={handleToastClose}
          duration={5000}
        />
      )}

    <ClientSection heading={t("planChangeRequest.heading")}>
      <h3 className={styles.subHeading}>{t("planChangeRequest.subHeading")}</h3>

        {/* Show success message */}
        {changePlanState.success && (
          <div className="alert alert-success mb-3">
            <p>{changePlanState.message || t('Plan change request submitted successfully.')}</p>
            <p className="mb-0">{t('Redirecting back to requests...')}</p>
          </div>
        )}

        {/* Show loading, error from changePlanRequest slice */}
        {changePlanState.loading && <div className="alert alert-info">{t('Loading...')}</div>}
        {changePlanState.error && <div className="alert alert-danger">{changePlanState.error}</div>}

        {/* Only show form if not successful */}
        {!changePlanState.success && (
          <>
            {/* Plan Tabs */}
            {plans.length > 0 && (
              <div className={`${aboutStyles.tabContainer} mb-2`}>
                {plans.map((plan, idx) => (
                  <button
                    key={plan.id}
                    className={`${aboutStyles.tabButtonPlan} ${selectedPlanIdx === idx ? aboutStyles.active : ""}`}
                    onClick={() => {
                      setSelectedPlanIdx(idx);
                      onPlanTabClick(idx);
                    }}
                  >
                    {`Plan ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

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
            name="prev_contractType"
            options={customerDropdowns?.customer_contract_types?.map(option => ({
              label: option.label,
              value: option.value.toString()
            })) || []}
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
                name="prev_service"
                placeholder={t("aboutPage.servicePlaceholder")}
                options={customerDropdowns?.services || []}
                icon={<BsFileEarmarkText size={12} />}
                value={prevContractValues.service}
                onChange={() => {}}
                disabled
              />
              <CustomSelectField
                name="prev_plan"
                placeholder={t("aboutPage.planPlaceholder")}
                options={customerDropdowns?.contract_plans || []}
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
            name="prev_timeRange"
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
            name="prev_timeExtension"
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
              name="prev_contractPeriod"
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
                name="prev_weekdays"
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
                name="prev_startTime"
                placeholder={t("aboutPage.startTimePlaceholder")}
                icon={<GiAlarmClock size={12} />}
                type="time"
                value={prevContractValues.startTime}
                onChange={() => {}}
                disabled
              />
              <span className={styles.timeConnector}>~</span>
              <InputField
                name="prev_endTime"
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
          {/* Contract Type Section */}
          <div className={styles.label}>{t("aboutPage.contractTypeLabel")}</div>
          <RadioField
            name="contractType"
            options={customerDropdowns?.customer_contract_types?.map(option => ({
              label: option.label,
              value: option.value.toString()
            })) || []}
            selectedValue={contractFormValues.contractType}
            onChange={(e) => {
              setContractFormValues(prev => ({
                ...prev,
                contractType: e.target.value
              }));
              setFormErrors(prev => ({ ...prev, contractType: null }));
            }}
            className={styles.radioGroup}
            disabled={changePlanState.loading}
            validations={[{ type: "required" }]}
            errorText={formErrors["contractType"] || undefined}
          />

          {/* Contract Plan Section */}
          <div className={styles.label}>{t("aboutPage.contractPlanLabel")}</div>
          <div className={styles.fieldGroup}>
            <div className={styles.fieldRow}>
              <CustomSelectField
                name="service"
                placeholder={t("aboutPage.servicePlaceholder")}
                options={customerDropdowns?.services || []}
                icon={<BsFileEarmarkText size={12} />}
                value={contractFormValues.service}
                onChange={handleChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["service"] || undefined}
                disabled={changePlanState.loading}
              />
              <CustomSelectField
                name="plan"
                placeholder={t("aboutPage.planPlaceholder")}
                options={customerDropdowns?.contract_plans || []}
                icon={<BsFileEarmarkText size={12} />}
                value={contractFormValues.plan}
                onChange={handleChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["plan"] || undefined}
                disabled={changePlanState.loading}
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
            onChange={(e) => {
              setContractFormValues(prev => ({
                ...prev,
                timeRange: e.target.value
              }));
              setFormErrors(prev => ({ ...prev, timeRange: null }));
            }}
            className={styles.radioGroup}
            disabled={changePlanState.loading}
            validations={[{ type: "required" }]}
            errorText={formErrors["timeRange"] || undefined}
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
            onChange={(e) => {
              setContractFormValues(prev => ({
                ...prev,
                timeExtension: e.target.value
              }));
              setFormErrors(prev => ({ ...prev, timeExtension: null }));
            }}
            className={styles.radioGroup}
            disabled={changePlanState.loading}
            validations={[{ type: "required" }]}
            errorText={formErrors["timeExtension"] || undefined}
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
              disabled={changePlanState.loading}
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
                disabled={changePlanState.loading}
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
                onChange={handleChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["startTime"] || undefined}
                disabled={changePlanState.loading}
              />
              <span className={styles.timeConnector}>~</span>
              <InputField
                name="endTime"
                placeholder={t("aboutPage.endTimePlaceholder")}
                icon={<GiAlarmClock size={12} />}
                type="time"
                value={contractFormValues.endTime}
                onChange={handleChange}
                validations={[{ type: "required" }]}
                errorText={formErrors["endTime"] || undefined}
                disabled={changePlanState.loading}
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
              text={changePlanState.loading ? t("Loading...") : t("planChangeRequest.submit")}
              disabled={changePlanState.loading}
            />
          </div>
          <span></span>
        </div>
      </Form>
          </>
        )}
    </ClientSection>
    </ApiLoadingWrapper>
  );
}

// ⬇ Layout integration
PlanChangeRequest.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
