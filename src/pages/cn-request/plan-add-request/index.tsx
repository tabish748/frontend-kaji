import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCustomerDropdowns } from "@/app/features/dropdowns/getCustomerDropdownsSlice";
import { addContractPlan, resetAddContractPlan } from "@/app/customer/addContractPlanSlice";
import { fetchCustomerBasicInfo } from "@/app/customer/getCustomerBasicInfoSliceAbout";
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
import { IoAdd } from "react-icons/io5";

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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { customerDropdowns, loading: dropdownsLoading, error: dropdownsError } = useSelector((state: RootState) => state.customerDropdowns);
  const addContractPlanState = useSelector((state: RootState) => state.addContractPlan);
  const customer = useSelector((state: RootState) => state.customerBasicInfoAbout.customer);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Fetch dropdowns on mount and reset state
  useEffect(() => {
    if (!customerDropdowns) {
      dispatch(fetchCustomerDropdowns());
    }
    if (!customer) {
      dispatch(fetchCustomerBasicInfo());
    }
    // Reset the add contract plan state when component mounts
    dispatch(resetAddContractPlan());
  }, [dispatch, customerDropdowns, customer]);

  // Cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetAddContractPlan());
    };
  }, [dispatch]);

  // Handle success/error states from addContractPlan
  useEffect(() => {
    if (addContractPlanState.success === true) {
      setToastMessage(addContractPlanState.message || t('Contract plan added successfully.'));
      setToastType("success");
      setShowToast(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const langParam = router.query.lang ? `?lang=${router.query.lang}` : '';
        router.replace(`/cn-request${langParam}`);
      }, 2000);
    } else if (addContractPlanState.success === false && addContractPlanState.error) {
      setToastMessage(addContractPlanState.error);
      setToastType("fail");
      setShowToast(true);
    }
  }, [addContractPlanState.success, addContractPlanState.error, addContractPlanState.message, router, t]);

  const handleToastClose = () => {
    setShowToast(false);
    if (addContractPlanState.success !== null || addContractPlanState.error) {
      dispatch(resetAddContractPlan());
    }
  };

  // Transform customer data into plan format
  const customerPlans: PlanData[] = React.useMemo(() => {
    if (!customer?.customer_contracts) return [];
    
    const plans: PlanData[] = [];
    
    customer.customer_contracts.forEach((contract, contractIdx) => {
      contract.customer_contract_plans?.forEach((plan, planIdx) => {
        const planData: PlanData = {
          id: plan.id,
          name: `PLAN ${plans.length + 1}`,
          prevFormValues: {
            contractType: contract.contract_type?.toString() || "general",
            service: plan.service_id?.toString() || "",
            plan: plan.contract_plan_id?.toString() || "",
            timeRange: plan.time_range ? "with" : "without",
            timeExtension: plan.extended_time ? "with" : "without",
            contractPeriod: plan.contract_period_start && plan.contract_period_end 
              ? `${plan.contract_period_start} to ${plan.contract_period_end}`
              : "",
            contractdate: plan.contract_period_start || "",
            weekdays: plan.days_of_week ? plan.days_of_week.split(',') : [],
            startTime: plan.service_hours_start || "",
            endTime: plan.service_hours_end || "",
          },
          updateFormValues: {
            contractType: contract.contract_type?.toString() || "general",
            service: plan.service_id?.toString() || "",
            plan: plan.contract_plan_id?.toString() || "",
            timeRange: plan.time_range ? "with" : "without",
            timeExtension: plan.extended_time ? "with" : "without",
            contractPeriod: plan.contract_period_start && plan.contract_period_end 
              ? `${plan.contract_period_start} to ${plan.contract_period_end}`
              : "",
            contractdate: plan.contract_period_start || "",
            weekdays: plan.days_of_week ? plan.days_of_week.split(',') : [],
            startTime: plan.service_hours_start || "",
            endTime: plan.service_hours_end || "",
          },
          formErrors: {},
        };
        plans.push(planData);
      });
    });
    
    return plans;
  }, [customer]);

  const [plans, setPlans] = useState<PlanData[]>([]);
  
  // Update plans when customer data changes
  useEffect(() => {
    setPlans(customerPlans);
  }, [customerPlans]);

  // Initialize active plan IDs - use first plan ID from customer data or default to 1
  const [activePrevPlanId, setActivePrevPlanId] = useState<number>(1);
  const [activeUpdatePlanId, setActiveUpdatePlanId] = useState<number>(1);
  
  // Update active plan IDs when customer plans load
  useEffect(() => {
    if (customerPlans.length > 0) {
      const firstPlanId = customerPlans[0].id;
      setActivePrevPlanId(firstPlanId);
      setActiveUpdatePlanId(firstPlanId);
    }
  }, [customerPlans]);

  // Dynamic new plan data based on existing plans
  const newPlanId = Math.max(...(plans.map(p => p.id).concat([0]))) + 1;
  const newPlanName = `PLAN ${plans.length + 1}`;
  
  // State for new plan form data
  const [newPlanFormData, setNewPlanFormData] = useState<ContractFormValues>({
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
  });
  
  const [newPlanErrors, setNewPlanErrors] = useState<Record<string, string | null>>({});
  
  const dynamicNewPlanData: PlanData = {
    id: newPlanId,
    name: newPlanName,
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
    updateFormValues: newPlanFormData,
    formErrors: newPlanErrors,
  };

  // Get currently active plans with safety check
  const activePrevPlan = plans.find((plan) => plan.id === activePrevPlanId);
  const activeUpdatePlan = activeUpdatePlanId === newPlanId ? dynamicNewPlanData : plans.find((plan) => plan.id === activeUpdatePlanId);

  // Return loading state if no active plans found
  if (!activePrevPlan && plans.length > 0) {
    return (
      <ClientSection heading={t("planChangeRequest.heading")}>
        <div>Loading...</div>
      </ClientSection>
    );
  }

  const handleWeekdaysChange = (values: string[]) => {
    if (activeUpdatePlanId === newPlanId) {
      setNewPlanFormData((prev) => ({
        ...prev,
        weekdays: values,
      }));
      setNewPlanErrors((prev) => ({ ...prev, weekdays: null }));
    }
  };

  const handleContractInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("handleContractInputChange - name:", name, "value:", value);

    if (activeUpdatePlanId === newPlanId) {
      setNewPlanFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setNewPlanErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    console.log("handleDateChange - name:", name, "value:", value);

    if (activeUpdatePlanId === newPlanId) {
      setNewPlanFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setNewPlanErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleContractSubmit = () => {
    if (!activeUpdatePlan || activeUpdatePlanId !== newPlanId) {
      console.error("No new plan to submit");
      return;
    }

    const formValues = newPlanFormData;
    
    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!formValues.service) {
      errors.service = "Service is required.";
    }
    if (!formValues.plan) {
      errors.plan = "Contract plan is required.";
    }
    if (!formValues.contractPeriod) {
      errors.contractPeriod = "Contract period is required.";
    }
    if (!formValues.startTime) {
      errors.startTime = "Start time is required.";
    }
    if (!formValues.endTime) {
      errors.endTime = "End time is required.";
    }
    if (formValues.weekdays.length === 0) {
      errors.weekdays = "At least one day of the week is required.";
    }

    // Validate time range
    if (formValues.startTime && formValues.endTime) {
      if (formValues.startTime >= formValues.endTime) {
        errors.endTime = "End time must be after start time.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setNewPlanErrors(errors);
      return;
    }

    // Parse contract period dates
    const [startDate, endDate] = formValues.contractPeriod.includes(' to ') 
      ? formValues.contractPeriod.split(' to ')
      : [formValues.contractPeriod, formValues.contractPeriod];

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

    // Map weekdays to numbers and day names
    const weekdayMapping: { [key: string]: { number: string, name: string } } = {
      "monday": { number: "1", name: "Monday" },
      "tuesday": { number: "2", name: "Tuesday" }, 
      "wednesday": { number: "3", name: "Wednesday" },
      "thursday": { number: "4", name: "Thursday" },
      "friday": { number: "5", name: "Friday" },
      "saturday": { number: "6", name: "Saturday" },
      "sunday": { number: "7", name: "Sunday" },
    };

    formValues.weekdays.forEach(day => {
      const dayInfo = weekdayMapping[day.toLowerCase()];
      if (dayInfo) {
        daysOfWeekMap[dayInfo.number] = dayInfo.name;
      }
    });

    const payload = {
      customer_contract_id: 3, // As specified in your example
      service_id: Number(formValues.service),
      contract_plan_id: Number(formValues.plan),
      time_range: formValues.timeRange === "with" ? 1 : 0,
      extended_time: formValues.timeExtension === "with" ? 1 : 0,
      contract_period_start: startDate.trim(),
      contract_period_end: endDate.trim(),
      service_hours_start: formValues.startTime,
      service_hours_end: formValues.endTime,
      recurrence_type: "",
      interval: "",
      days_of_week: daysOfWeekMap,
    };

    console.log("Submitting payload:", payload);
    dispatch(addContractPlan(payload));
    
    // Clear form errors
    setNewPlanErrors({});
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
              options={customerDropdowns?.services || []}
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
              options={customerDropdowns?.contract_plans || []}
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
        {addContractPlanState.success && (
          <div className="alert alert-success mb-3">
            <p>{addContractPlanState.message || t('Contract plan added successfully.')}</p>
            <p className="mb-0">{t('Redirecting back to requests...')}</p>
          </div>
        )}

        {/* Show loading, error from addContractPlan slice */}
        {addContractPlanState.loading && <div className="alert alert-info">{t('Loading...')}</div>}
        {addContractPlanState.error && <div className="alert alert-danger">{addContractPlanState.error}</div>}

        {/* Only show form if not successful */}
        {!addContractPlanState.success && (
          <>
            {/* Plan Tabs - Existing plans + Add Plan tab */}
            <div className={`${aboutStyles.tabContainer} my-2`}>
              {/* Existing plans */}
              {plans.map((plan) => (
                <button
                  key={`plan-${plan.id}`}
                  className={`${aboutStyles.tabButtonPlan} ${
                    activePrevPlanId === plan.id && activeUpdatePlanId !== newPlanId ? aboutStyles.active : ""
                  }`}
                  onClick={() => {
                    setActivePrevPlanId(plan.id);
                    setActiveUpdatePlanId(plan.id);
                  }}
                >
                  {plan.name}
                </button>
              ))}
              {/* Add new plan tab with conditional styling */}
              <button
                key="add-plan"
                className={`${activeUpdatePlanId === newPlanId ? aboutStyles.tabButtonPlan : aboutStyles.tabButtonPlanAdd} ${activeUpdatePlanId === newPlanId ? aboutStyles.active : ""}`}
                onClick={() => setActiveUpdatePlanId(newPlanId)}
              >
                {activeUpdatePlanId === newPlanId ? (
                  "New"
                ) : (
                  <>
                    <IoAdd className={aboutStyles.addPlanIcon} />
                    Add Plan
                  </>
                )}
              </button>
            </div>
            
            {/* Show form based on active tab */}
            {activeUpdatePlanId === newPlanId ? (
              // Show new plan form
              renderPlanForm(activeUpdatePlan?.updateFormValues || dynamicNewPlanData.updateFormValues, false, activeUpdatePlan || dynamicNewPlanData)
            ) : (
              // Show existing plan (read-only)
              activePrevPlan && renderPlanForm(activePrevPlan.prevFormValues, true)
            )}
          </>
        )}
      </ClientSection>
    </ApiLoadingWrapper>
  );
}

// ⬇ Layout integration
PlanAddRequest.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
