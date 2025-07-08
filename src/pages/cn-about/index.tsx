// import Button from "@/components/button/button";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import InputField from "@/components/input-field/input-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import { useLanguage } from "@/localization/LocalContext";
import React, { ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerBasicInfo } from '@/app/customer/getCustomerBasicInfoSlice';
import { fetchCustomerDropdowns } from '@/app/features/dropdowns/getCustomerDropdownsSlice';
import { RootState, AppDispatch } from '@/app/store';
import ApiLoadingWrapper from "@/components/api-loading-wrapper/api-loading-wrapper";
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

// Add interface for key information
interface KeyInformation {
  status: string;
  receipt: string[];
  user_id: string;
  date_added: string;
  date_returned: string;
}

// Add interface for possession item
interface PossessionItem {
  head: string;
  dateOfRecieved: string;
  dateOfReturn: string;
  nameStaff: string;
  receiptOfCustody: React.ReactNode;
  status?: string;
  receipt?: string[];
}

export default function CnAbout() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { customer, loading, error } = useSelector((state: RootState) => state.customerBasicInfo);
  const { customerDropdowns, loading: dropdownsLoading, error: dropdownsError } = useSelector((state: RootState) => state.customerDropdowns);

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
    gender: "1",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    age: "",
    language: "1",
    advertising: "0",
  });

  // Fetch customer data and dropdowns on component mount
  useEffect(() => {
    dispatch(fetchCustomerBasicInfo());
    dispatch(fetchCustomerDropdowns());
  }, [dispatch]);

  // Update form values when customer data is loaded
  useEffect(() => {
    if (customer) {
      setFormValues({
        firstName: `${customer.first_name} ${customer.last_name}`,
        fullNameKatakana: `${customer.first_name_kana} ${customer.last_name_kana}`,
        phone1: customer.phone1 || "",
        phone2: customer.phone2 || "",
        phone3: customer.phone3 || "",
        email1: customer.email1 || "",
        email2: customer.email2 || "",
        postalCode: customer.post_code || "",
        prefecture: customer.prefecture_id.toString() || "",
        address1: customer.address1 || "",
        address2: customer.address2 || "",
        building: customer.apartment_name || "",
        railwayCompany1: customer.customer_routes[0]?.company || "",
        trainLine1: customer.customer_routes[0]?.route_name || "",
        trainStation1: customer.customer_routes[0]?.nearest_station || "",
        railwayCompany2: customer.customer_routes[1]?.company || "",
        trainLine2: customer.customer_routes[1]?.route_name || "",
        trainStation2: customer.customer_routes[1]?.nearest_station || "",
        gender: customer.gender.toString() || "1",
        birthYear: customer.dob_year || "",
        birthMonth: customer.dob_month || "",
        birthDay: customer.dob_day || "",
        age: customer.age.toString() || "",
        language: customer.language.toString() || "1",
        advertising: customer.newsletter_emails.toString() || "0",
      });
    }
  }, [customer]);

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

  // Update contract form values when customer data is loaded
  useEffect(() => {
    if (customer && customer.customer_contracts.length > 0) {
      const contract = customer.customer_contracts[0];
      const contractPlan = contract.customer_contract_plans[0];
      
      if (contract && contractPlan) {
        setContractFormValues(prev => ({
          ...prev,
          contractType: contract.contract_type || "general",
          service: contractPlan.service_id.toString() || "",
          plan: contractPlan.contract_plan_id?.toString() || "",
          timeRange: contractPlan.time_range ? "with" : "without",
          timeExtension: contractPlan.extended_time ? "with" : "without",
          contractPeriod: contractPlan.contract_period_start && contractPlan.contract_period_end 
            ? `${contractPlan.contract_period_start} to ${contractPlan.contract_period_end}`
            : "2025-04-14 to 2025-04-19",
          startTime: contractPlan.service_hours_start || "",
          endTime: contractPlan.service_hours_end || "",
          weekdays: contractPlan.days_of_week ? contractPlan.days_of_week.split(',') : ["monday"],
        }));
      }
    }
  }, [customer]);

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

  // Update billing form values when customer data is loaded
  useEffect(() => {
    if (customer && customer.customer_contracts.length > 0) {
      const billingInfo = customer.customer_contracts[0]?.customer_contract_plans[0]?.contract_plan_billing_info;
      if (billingInfo) {
        setBillingFormValues({
          firstName: billingInfo.name || "",
          fullNameKatakana: billingInfo.name_kana || "",
          phone1: billingInfo.phone1 || "",
          phone2: billingInfo.phone2 || "",
          phone3: billingInfo.phone3 || "",
          email1: billingInfo.email1 || "",
          email2: billingInfo.email2 || "",
          postalCode: billingInfo.post_code || "",
          prefecture: billingInfo.prefecture_id || "",
          address1: billingInfo.address1 || "",
          address2: billingInfo.address2 || "",
          building: billingInfo.apartment_name || "",
        });
      }
    }
  }, [customer]);

  const [paymentFormValues, setPaymentFormValues] = useState({
    paymentMethod: "2",
  });

  // Update payment form values when customer data is loaded
  useEffect(() => {
    if (customer && customer.customer_contracts.length > 0) {
      const contractPlan = customer.customer_contracts[0]?.customer_contract_plans[0];
      if (contractPlan) {
        setPaymentFormValues({
          paymentMethod: contractPlan.payment_method.toString() || "1",
        });
      }
    }
  }, [customer]);

  // Handle receipt download
  const handleReceiptDownload = (receipt: string[]) => {
    if (receipt && receipt.length > 0) {
      // Download the first receipt file
      const link = document.createElement('a');
      link.href = receipt[0]; // Use first receipt file
      link.download = receipt[0].split('/').pop() || 'receipt.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Use real key information from customer data instead of hardcoded data
  const POSSESSION: PossessionItem[] = (() => {
    if (!customer?.key_information) return [
      {
        head: "key 0",
        dateOfRecieved: "2025-04-14",
        dateOfReturn: "2025-04-19",
        nameStaff: "John Doe",
        receiptOfCustody: <BsPaperclip size={16} />,
      },
      {
        head: "key 1",
        dateOfRecieved: "2025-04-14",
        dateOfReturn: "2025-04-19",
        nameStaff: "Jane Smith",
        receiptOfCustody: <BsPaperclip size={16} />,
      },
      {
        head: "key 2",
        dateOfRecieved: "2025-04-14",
        dateOfReturn: "2025-04-19",
        nameStaff: "Alice Johnson",
        receiptOfCustody: <BsPaperclip size={16} />,
      },
    ];

    // Handle both string and array cases
    let keyInfoArray: KeyInformation[] = [];
    try {
      if (typeof customer.key_information === 'string') {
        keyInfoArray = JSON.parse(customer.key_information);
      } else {
        keyInfoArray = customer.key_information as KeyInformation[];
      }
    } catch (error) {
      console.error('Error parsing key_information:', error);
      return [
        {
          head: "key 0",
          dateOfRecieved: "2025-04-14",
          dateOfReturn: "2025-04-19",
          nameStaff: "John Doe",
          receiptOfCustody: <BsPaperclip size={16} />,
        },
      ];
    }

    return keyInfoArray.map((keyInfo: KeyInformation, index: number) => ({
      head: `key ${index}`, // Use 0-based indexing
      dateOfRecieved: keyInfo.date_added,
      dateOfReturn: keyInfo.date_returned,
      nameStaff: keyInfo.user_id,
      receiptOfCustody: (
        <button 
          onClick={() => handleReceiptDownload(keyInfo.receipt)}
          className={styles.receiptButton}
          title="Download receipt"
        >
          <BsPaperclip size={16} />
        </button>
      ),
      status: keyInfo.status,
      receipt: keyInfo.receipt,
    }));
  })();

  // Contract and plan data - now using customer data or fallback to default
  const contracts: Contract[] = customer && customer.customer_contracts && customer.customer_contracts.length > 0 
    ? customer.customer_contracts.map((contract, contractIndex) => ({
        id: contract.id,
        name: `Contract ${contractIndex + 1}`,
        plans: contract.customer_contract_plans ? contract.customer_contract_plans.map((plan, planIndex) => ({
          id: plan.id,
          name: `Plan ${planIndex + 1}`,
          content: `Service ID: ${plan.service_id}, Payment Method: ${plan.payment_method}`,
        })) : []
      }))
    : [
        {
          id: 1,
          name: "Contract 1",
          plans: [
            {
              id: 1,
              name: "Plan 1",
              content: "This is the content for Contract 1, Plan 1",
            },
          ],
        },
      ];

  // State for active contract and plan
  const [activeContractId, setActiveContractId] = useState(1);
  const [activePlanId, setActivePlanId] = useState(1);

  // Update active contract and plan when customer data loads
  useEffect(() => {
    if (customer && customer.customer_contracts && customer.customer_contracts.length > 0) {
      const firstContract = customer.customer_contracts[0];
      setActiveContractId(firstContract.id);
      if (firstContract.customer_contract_plans && firstContract.customer_contract_plans.length > 0) {
        setActivePlanId(firstContract.customer_contract_plans[0].id);
      }
    }
  }, [customer]);

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
    <ApiLoadingWrapper
      loading={loading || dropdownsLoading}
      error={error || dropdownsError}
      onRetry={() => {
        dispatch(fetchCustomerBasicInfo());
        dispatch(fetchCustomerDropdowns());
      }}
      errorTitle="Error loading customer data"
    >
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
                  options={customerDropdowns?.prefectures || []}
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
              options={customerDropdowns?.gender?.map(option => ({
                label: option.label,
                value: option.value.toString()
              })) || []}
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
              options={customerDropdowns?.language?.map(option => ({
                label: option.label,
                value: option.value.toString()
              })) || []}
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
              options={customerDropdowns?.newsletter?.map(option => ({
                label: option.label,
                value: option.value.toString()
              })) || []}
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
                        options={customerDropdowns?.customer_contract_types?.map(option => ({
                          label: option.label,
                          value: option.value.toString()
                        })) || []}
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
                            options={customerDropdowns?.services || []}
                            icon={<BsFileEarmarkText size={12} />}
                            value={contractFormValues.service}
                            onChange={handleContractInputChange}
                            disabled
                          />
                          <CustomSelectField
                            name="plan"
                            placeholder={t("aboutPage.planPlaceholder")}
                            options={customerDropdowns?.contract_plans || []}
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
                          { label: t("aboutPage.withTimeRange"), value: "with" },
                          { label: t("aboutPage.withoutTimeRange"), value: "without" },
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
                          { label: t("aboutPage.withTimeExtension"), value: "with" },
                          { label: t("aboutPage.withoutTimeExtension"), value: "without" },
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
                              { value: "tuesday", label: t("aboutPage.tuesday") },
                              { value: "wednesday", label: t("aboutPage.wednesday") },
                              { value: "thursday", label: t("aboutPage.thursday") },
                              { value: "friday", label: t("aboutPage.friday") },
                              { value: "saturday", label: t("aboutPage.saturday") },
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
                            options={customerDropdowns?.prefectures || []}
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
                        options={customerDropdowns?.payment_method?.map(option => ({
                          label: option.label,
                          value: option.value.toString()
                        })) || []}
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
            {POSSESSION.map((item: PossessionItem, idx: number) => (
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
    </ApiLoadingWrapper>
  );
}
