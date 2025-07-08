import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCustomerDropdowns } from "@/app/features/dropdowns/getCustomerDropdownsSlice";
import { changeBillingInfo, resetBillingChange } from "@/app/customer/changeBillingInfoSlice";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import aboutStyles from "@/styles/pages/cnabout.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import SelectField from "@/components/select-field/select-field";
import RadioField from "@/components/radio-field/radio-field";
import CustomSelectField from "@/components/custom-select/custom-select";
import ApiLoadingWrapper from "@/components/api-loading-wrapper/api-loading-wrapper";
import Toast from "@/components/toast/toast";
import SubRouteLayout from "../layout";
import { FaUser, FaPhone } from "react-icons/fa";
import { MdOutlineAlternateEmail, MdOutlineHomeWork } from "react-icons/md";
import { BiHomeAlt2 } from "react-icons/bi";

interface BillingFormValues {
  addressMode: string; // "existing" or "new"
  selectedAddressId: string;
  firstName: string;
  fullNameKatakana: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email1: string;
  email2: string;
  postalCode: string;
  prefecture: string;
  address1: string;
  address2: string;
  building: string;
}

interface BillingChangeRequestProps {
  activeContractIdx: number;
  activePlanIdx: number;
  onPlanTabClick: (planIdx: number) => void;
}

export default function BillingChangeRequest({ activeContractIdx, activePlanIdx, onPlanTabClick }: BillingChangeRequestProps) {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { customerDropdowns, loading: dropdownsLoading, error: dropdownsError } = useSelector((state: RootState) => state.customerDropdowns);
  const customer = useSelector((state: RootState) => state.customerBasicInfo.customer);
  const changeBillingState = useSelector((state: RootState) => state.changeBillingInfo);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Fetch dropdowns on mount and reset state
  useEffect(() => {
    if (!customerDropdowns) {
      dispatch(fetchCustomerDropdowns());
    }
    // Reset the billing change state when component mounts
    dispatch(resetBillingChange());
  }, [dispatch, customerDropdowns]);

  // Cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetBillingChange());
    };
  }, [dispatch]);

  // Handle success/error states from changeBillingInfo
  useEffect(() => {
    if (changeBillingState.success === true) {
      setToastMessage(changeBillingState.message || t('Billing information change request submitted successfully.'));
      setToastType("success");
      setShowToast(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const langParam = router.query.lang ? `?lang=${router.query.lang}` : '';
        router.replace(`/cn-request${langParam}`);
      }, 2000);
    } else if (changeBillingState.success === false && changeBillingState.error) {
      setToastMessage(changeBillingState.error);
      setToastType("fail");
      setShowToast(true);
    }
  }, [changeBillingState.success, changeBillingState.error, changeBillingState.message, router, t]);

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

  // Get all unique billing addresses from all contract plans across all contracts
  const availableBillingAddresses = React.useMemo(() => {
    if (!customer?.customer_contracts) return [];
    
    const billingInfos: Array<{
      id: string;
      name: string;
      name_kana: string;
      phone1: string;
      phone2?: string;
      phone3?: string;
      email1: string;
      email2?: string;
      post_code: string;
      prefecture_id: number;
      prefecture_name: string;
      address1: string;
      address2?: string;
      apartment_name?: string;
      contractName: string;
      planName: string;
    }> = [];

    customer.customer_contracts.forEach((contract, contractIdx) => {
      contract.customer_contract_plans?.forEach((plan, planIdx) => {
        if (plan.contract_plan_billing_info) {
          const billingInfo = plan.contract_plan_billing_info;
          // Find prefecture name
          const prefecture = customerDropdowns?.prefectures?.find(p => p.value === billingInfo.prefecture_id);
          
          billingInfos.push({
            id: `${contract.id}-${plan.id}`,
            name: billingInfo.name || "",
            name_kana: billingInfo.name_kana || "",
            phone1: billingInfo.phone1 || "",
            phone2: billingInfo.phone2 || "",
            phone3: billingInfo.phone3 || "",
            email1: billingInfo.email1 || "",
            email2: billingInfo.email2 || "",
            post_code: billingInfo.post_code || "",
            prefecture_id: Number(billingInfo.prefecture_id) || 0,
            prefecture_name: prefecture?.label || "",
            address1: billingInfo.address1 || "",
            address2: billingInfo.address2 || "",
            apartment_name: billingInfo.apartment_name || "",
            contractName: `Contract ${contractIdx + 1}`,
            planName: `Plan ${planIdx + 1}`,
          });
        }
      });
    });

    // Remove duplicates based on a combination of key fields
    const uniqueBillingInfos = billingInfos.filter((info, index, self) => 
      index === self.findIndex(t => 
        t.name === info.name && 
        t.post_code === info.post_code && 
        t.address1 === info.address1
      )
    );

    return uniqueBillingInfos;
  }, [customer, customerDropdowns]);

  // Previous billing values from current plan billing data
  const prevBillingValues = {
    firstName: activePlan?.contract_plan_billing_info?.name || "",
    fullNameKatakana: activePlan?.contract_plan_billing_info?.name_kana || "",
    phone1: activePlan?.contract_plan_billing_info?.phone1 || "",
    phone2: activePlan?.contract_plan_billing_info?.phone2 || "",
    phone3: activePlan?.contract_plan_billing_info?.phone3 || "",
    email1: activePlan?.contract_plan_billing_info?.email1 || "",
    email2: activePlan?.contract_plan_billing_info?.email2 || "",
    postalCode: activePlan?.contract_plan_billing_info?.post_code || "",
    prefecture: activePlan?.contract_plan_billing_info?.prefecture_id?.toString() || "",
    address1: activePlan?.contract_plan_billing_info?.address1 || "",
    address2: activePlan?.contract_plan_billing_info?.address2 || "",
    building: activePlan?.contract_plan_billing_info?.apartment_name || "",
  };

  // Current editable billing values
  const [billingFormValues, setBillingFormValues] = useState<BillingFormValues>({
    addressMode: "new",
    selectedAddressId: "",
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

  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingFormValues((prev) => ({
        ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
    // Reset toast and state when user makes changes
    setShowToast(false);
    if (changeBillingState.success !== null || changeBillingState.error) {
      dispatch(resetBillingChange());
    }
  };

  // Handle address selection from dropdown
  const handleAddressSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAddressId = e.target.value;
    const selectedAddress = availableBillingAddresses.find(addr => addr.id === selectedAddressId);
    
    if (selectedAddress) {
      setBillingFormValues((prev) => ({
        ...prev,
        selectedAddressId: selectedAddressId,
        firstName: selectedAddress.name,
        fullNameKatakana: selectedAddress.name_kana,
        phone1: selectedAddress.phone1,
        phone2: selectedAddress.phone2 || "",
        phone3: selectedAddress.phone3 || "",
        email1: selectedAddress.email1,
        email2: selectedAddress.email2 || "",
        postalCode: selectedAddress.post_code,
        prefecture: selectedAddress.prefecture_id.toString(),
        address1: selectedAddress.address1,
        address2: selectedAddress.address2 || "",
        building: selectedAddress.apartment_name || "",
      }));
      // Clear any previous errors
      setFormErrors({});
    }
  };

  // Handle address mode change (existing vs new)
  const handleAddressModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const mode = e.target.value;
    setBillingFormValues((prev) => ({
        ...prev,
      addressMode: mode,
      selectedAddressId: "",
      // Clear form if switching to new mode
      ...(mode === "new" && {
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
      })
    }));
    setFormErrors({});
  };

  const handleBillingSubmit = () => {
    if (!activeContract || !activePlan) {
      setToastMessage("Contract or plan data is missing.");
      setToastType("fail");
      setShowToast(true);
      return;
    }

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!billingFormValues.addressMode) {
      errors.addressMode = "Please select address mode.";
    }
    
    if (billingFormValues.addressMode === "existing" && !billingFormValues.selectedAddressId) {
      errors.selectedAddressId = "Please select an address.";
    }
    
    // Validate all fields since they're now always editable
    if (!billingFormValues.firstName.trim()) {
      errors.firstName = "First name is required.";
    }
    if (!billingFormValues.fullNameKatakana.trim()) {
      errors.fullNameKatakana = "Full name (Katakana) is required.";
    }
    if (!billingFormValues.phone1.trim()) {
      errors.phone1 = "Phone number is required.";
    }
    if (!billingFormValues.email1.trim()) {
      errors.email1 = "Email is required.";
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(billingFormValues.email1)) {
        errors.email1 = "Please enter a valid email address.";
      }
    }
    if (!billingFormValues.postalCode.trim()) {
      errors.postalCode = "Postal code is required.";
    }
    if (!billingFormValues.prefecture) {
      errors.prefecture = "Prefecture is required.";
    }
    if (!billingFormValues.address1.trim()) {
      errors.address1 = "Address is required.";
    }

    // Validate email2 if provided
    if (billingFormValues.email2.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(billingFormValues.email2)) {
        errors.email2 = "Please enter a valid email address.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToastMessage("Please fix the validation errors.");
      setToastType("fail");
      setShowToast(true);
      return;
    }

    const payload = {
      customer_contract_plan_id: activePlan.id,
      name: billingFormValues.firstName,
      name_kana: billingFormValues.fullNameKatakana,
      phone1: billingFormValues.phone1,
      phone2: billingFormValues.phone2 || undefined,
      phone3: billingFormValues.phone3 || undefined,
      email1: billingFormValues.email1,
      email2: billingFormValues.email2 || undefined,
      post_code: billingFormValues.postalCode,
      prefecture_id: Number(billingFormValues.prefecture),
      address1: billingFormValues.address1,
      address2: billingFormValues.address2 || undefined,
      apartment_name: billingFormValues.building || undefined,
    };

    dispatch(changeBillingInfo(payload));
    setFormErrors({});
  };

  const handleToastClose = () => {
    setShowToast(false);
    if (changeBillingState.success !== null || changeBillingState.error) {
      dispatch(resetBillingChange());
    }
  };

  return (
    <ApiLoadingWrapper
      loading={dropdownsLoading}
      error={dropdownsError}
      onRetry={() => dispatch(fetchCustomerDropdowns())}
      errorTitle="Error loading billing data"
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

      <ClientSection heading={t("billingChangeRequest.heading")}>
        <h3 className={styles.subHeading}>{t("billingChangeRequest.subHeading")}</h3>

        {/* Show success message */}
        {changeBillingState.success && (
          <div className="alert alert-success mb-3">
            <p>{changeBillingState.message || t('Billing information change request submitted successfully.')}</p>
            <p className="mb-0">{t('Redirecting back to requests...')}</p>
          </div>
        )}

        {/* Show loading, error from changeBillingInfo slice */}
        {changeBillingState.loading && <div className="alert alert-info">{t('Loading...')}</div>}
        {changeBillingState.error && <div className="alert alert-danger">{changeBillingState.error}</div>}

        {/* Only show form if not successful */}
        {!changeBillingState.success && (
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

            {/* Previous Billing Info */}
            <h1 className="cn-seperator-heading primary">
              {t("billingChangeRequest.prev")}
            </h1>
    <Form
              className={`${styles.customerForm} ${styles.formSection} ${styles.prev}`}
              onSubmit={() => {}}
              errors={{}}
      setErrors={() => {}}
    >
      <div className={`${styles.formGrid}`}>
                {/* Name Section */}
                <div className={styles.label}>{t("aboutPage.nameLabel")}</div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
                    <InputField
                      name="prev_firstName"
                      placeholder={t("aboutPage.firstNamePlaceholder")}
                      value={prevBillingValues.firstName}
                      onChange={() => {}}
                      icon={<FaUser size={12} />}
                      disabled
                    />
                    <InputField
                      name="prev_fullNameKatakana"
                      placeholder={t("aboutPage.fullNameKatakanaPlaceholder")}
                      value={prevBillingValues.fullNameKatakana}
                      onChange={() => {}}
                      icon={<FaUser size={12} />}
                      disabled
            />
          </div>
        </div>

                {/* Phone Section */}
                <div className={styles.label}>{t("aboutPage.phoneLabel")}</div>
                <div className={styles.fieldGroup}>
                  <InputField
                    name="prev_phone1"
                    placeholder={t("aboutPage.phone1Placeholder")}
                    value={prevBillingValues.phone1}
                    onChange={() => {}}
                    icon={<FaPhone size={12} />}
                    disabled
                  />
                  <InputField
                    name="prev_phone2"
                    placeholder={t("aboutPage.phone2Placeholder")}
                    value={prevBillingValues.phone2}
                    onChange={() => {}}
                    icon={<FaPhone size={12} />}
                    disabled
                  />
                  <InputField
                    name="prev_phone3"
                    placeholder={t("aboutPage.phone3Placeholder")}
                    value={prevBillingValues.phone3}
                    onChange={() => {}}
                    icon={<FaPhone size={12} />}
                    disabled
                  />
                </div>

                {/* Email Section */}
                <div className={styles.label}>{t("aboutPage.emailLabel")}</div>
                <div className={styles.fieldGroup}>
                  <InputField
                    name="prev_email1"
                    placeholder={t("aboutPage.email1Placeholder")}
                    type="email"
                    value={prevBillingValues.email1}
                    onChange={() => {}}
                    icon={<MdOutlineAlternateEmail size={12} />}
                    disabled
                  />
                  <InputField
                    name="prev_email2"
                    placeholder={t("aboutPage.email2Placeholder")}
                    type="email"
                    value={prevBillingValues.email2}
                    onChange={() => {}}
                    icon={<MdOutlineAlternateEmail size={12} />}
                    disabled
                  />
                </div>

                {/* Address Section */}
                <div className={styles.label}>{t("aboutPage.addressLabel")}</div>
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldRow}>
                    <InputField
                      name="prev_postalCode"
                      placeholder={t("aboutPage.postalCodePlaceholder")}
                      value={prevBillingValues.postalCode}
                      onChange={() => {}}
                      icon={<MdOutlineHomeWork size={12} />}
                      disabled
                    />
                    <SelectField
                      name="prev_prefecture"
                      placeholder={t("aboutPage.prefecturePlaceholder")}
                      options={customerDropdowns?.prefectures || []}
                      value={prevBillingValues.prefecture}
                      onChange={() => {}}
                      icon={<BiHomeAlt2 size={12} />}
                      disabled
                    />
                  </div>
                  <InputField
                    name="prev_address1"
                    placeholder={t("aboutPage.address1Placeholder")}
                    value={prevBillingValues.address1}
                    onChange={() => {}}
                    icon={<BiHomeAlt2 size={12} />}
                    disabled
                  />
                  <InputField
                    name="prev_address2"
                    placeholder={t("aboutPage.address2Placeholder")}
                    value={prevBillingValues.address2}
                    onChange={() => {}}
                    icon={<BiHomeAlt2 size={12} />}
                    disabled
                  />
                  <InputField
                    name="prev_building"
                    placeholder={t("aboutPage.buildingPlaceholder")}
                    value={prevBillingValues.building}
                    onChange={() => {}}
                    icon={<BiHomeAlt2 size={12} />}
                    disabled
                  />
                </div>
        </div>
            </Form>

            {/* Updated Billing Info */}
            <h1 className="cn-seperator-heading danger mt-3">
              {t("billingChangeRequest.update")}
            </h1>
            <Form
              className={`${styles.customerForm} ${styles.formSection} ${styles.update}`}
              onSubmit={handleBillingSubmit}
              errors={formErrors}
              setErrors={setFormErrors}
            >
              <div className={`${styles.formGrid}`}>
                {/* Address Mode Selection */}
                <div className={styles.label}>{t("billingChangeRequest.addressMode")}</div>
        <RadioField
                  name="addressMode"
          options={[
                    { label: t("billingChangeRequest.selectExisting"), value: "existing" },
                    { label: t("billingChangeRequest.addNew"), value: "new" },
          ]}
                  selectedValue={billingFormValues.addressMode}
                  onChange={handleAddressModeChange}
          className={styles.radioGroup}
                  disabled={changeBillingState.loading}
                  validations={[{ type: "required" }]}
                  errorText={formErrors["addressMode"] || undefined}
                />

                {/* Address Selection Dropdown (only show when existing is selected and there are addresses) */}
                {billingFormValues.addressMode === "existing" && availableBillingAddresses.length > 0 && (
                  <>
                    <div className={styles.label}>{t("billingChangeRequest.selectAddress")}</div>
        <div className={styles.fieldGroup}>
                      <CustomSelectField
                        name="selectedAddressId"
                        placeholder={t("billingChangeRequest.selectAddressPlaceholder")}
                        options={availableBillingAddresses.map(addr => ({
                          label: `${addr.name} - ${addr.address1}, ${addr.prefecture_name} (${addr.contractName} ${addr.planName})`,
                          value: addr.id
                        }))}
                        value={billingFormValues.selectedAddressId}
                        onChange={handleAddressSelection}
                        validations={[{ type: "required" }]}
                        errorText={formErrors["selectedAddressId"] || undefined}
                        disabled={changeBillingState.loading}
          />
        </div>
                  </>
                )}

                {/* Show message if no existing addresses available */}
                {billingFormValues.addressMode === "existing" && availableBillingAddresses.length === 0 && (
                  <div className="alert alert-info">
                    {t("billingChangeRequest.noExistingAddresses")}
                  </div>
                )}

                {/* Name Section - only show when adding new or when existing is selected */}
                {(billingFormValues.addressMode === "new" || billingFormValues.selectedAddressId) && (
                  <>
                    <div className={styles.label}>{t("aboutPage.nameLabel")}</div>
        <div className={styles.fieldGroup}>
                      <div className={styles.fieldRow}>
                        <InputField
                          name="firstName"
                          placeholder={t("aboutPage.firstNamePlaceholder")}
                          value={billingFormValues.firstName}
                          onChange={handleChange}
                          validations={[{ type: "required" }]}
                          errorText={formErrors["firstName"] || undefined}
                          icon={<FaUser size={12} />}
                          disabled={changeBillingState.loading}
                        />
                        <InputField
                          name="fullNameKatakana"
                          placeholder={t("aboutPage.fullNameKatakanaPlaceholder")}
                          value={billingFormValues.fullNameKatakana}
                          onChange={handleChange}
                          validations={[{ type: "required" }]}
                          errorText={formErrors["fullNameKatakana"] || undefined}
                          icon={<FaUser size={12} />}
                          disabled={changeBillingState.loading}
            />
          </div>
        </div>
                  </>
                )}

                {/* Phone Section - only show when adding new or when existing is selected */}
                {(billingFormValues.addressMode === "new" || billingFormValues.selectedAddressId) && (
                  <>
                    <div className={styles.label}>{t("aboutPage.phoneLabel")}</div>
                    <div className={styles.fieldGroup}>
                      <InputField
                        name="phone1"
                        placeholder={t("aboutPage.phone1Placeholder")}
                        value={billingFormValues.phone1}
                        onChange={handleChange}
                        validations={[{ type: "required" }]}
                        errorText={formErrors["phone1"] || undefined}
                        icon={<FaPhone size={12} />}
                        disabled={changeBillingState.loading}
                      />
                      <InputField
                        name="phone2"
                        placeholder={t("aboutPage.phone2Placeholder")}
                        value={billingFormValues.phone2}
                        onChange={handleChange}
                        icon={<FaPhone size={12} />}
                        disabled={changeBillingState.loading}
                      />
                      <InputField
                        name="phone3"
                        placeholder={t("aboutPage.phone3Placeholder")}
                        value={billingFormValues.phone3}
                        onChange={handleChange}
                        icon={<FaPhone size={12} />}
                        disabled={changeBillingState.loading}
                      />
                    </div>
                  </>
                )}

                {/* Email Section - only show when adding new or when existing is selected */}
                {(billingFormValues.addressMode === "new" || billingFormValues.selectedAddressId) && (
                  <>
                    <div className={styles.label}>{t("aboutPage.emailLabel")}</div>
                    <div className={styles.fieldGroup}>
                      <InputField
                        name="email1"
                        placeholder={t("aboutPage.email1Placeholder")}
                        type="email"
                        value={billingFormValues.email1}
                        onChange={handleChange}
                        validations={[{ type: "required" }, { type: "email" }]}
                        errorText={formErrors["email1"] || undefined}
                        icon={<MdOutlineAlternateEmail size={12} />}
                        disabled={changeBillingState.loading}
                      />
                      <InputField
                        name="email2"
                        placeholder={t("aboutPage.email2Placeholder")}
                        type="email"
                        value={billingFormValues.email2}
                        onChange={handleChange}
                        validations={[{ type: "email" }]}
                        errorText={formErrors["email2"] || undefined}
                        icon={<MdOutlineAlternateEmail size={12} />}
                        disabled={changeBillingState.loading}
                      />
                    </div>
                  </>
                )}

                {/* Address Section - only show when adding new or when existing is selected */}
                {(billingFormValues.addressMode === "new" || billingFormValues.selectedAddressId) && (
                  <>
                    <div className={styles.label}>{t("aboutPage.addressLabel")}</div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
            <InputField
                          name="postalCode"
                          placeholder={t("aboutPage.postalCodePlaceholder")}
                          value={billingFormValues.postalCode}
                          onChange={handleChange}
                          validations={[{ type: "required" }]}
                          errorText={formErrors["postalCode"] || undefined}
                          icon={<MdOutlineHomeWork size={12} />}
                          disabled={changeBillingState.loading}
                        />
                        <SelectField
                          name="prefecture"
                          placeholder={t("aboutPage.prefecturePlaceholder")}
                          options={customerDropdowns?.prefectures || []}
                          value={billingFormValues.prefecture}
                          onChange={handleChange}
                          validations={[{ type: "required" }]}
                          errorText={formErrors["prefecture"] || undefined}
                          icon={<BiHomeAlt2 size={12} />}
                          disabled={changeBillingState.loading}
                        />
                      </div>
                      <InputField
                        name="address1"
                        placeholder={t("aboutPage.address1Placeholder")}
                        value={billingFormValues.address1}
                        onChange={handleChange}
                        validations={[{ type: "required" }]}
                        errorText={formErrors["address1"] || undefined}
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={changeBillingState.loading}
                      />
                      <InputField
                        name="address2"
                        placeholder={t("aboutPage.address2Placeholder")}
                        value={billingFormValues.address2}
                        onChange={handleChange}
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={changeBillingState.loading}
                      />
            <InputField
                        name="building"
                        placeholder={t("aboutPage.buildingPlaceholder")}
                        value={billingFormValues.building}
                        onChange={handleChange}
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={changeBillingState.loading}
            />
          </div>
                  </>
                )}
      </div>
        <div className="d-flex justify-content-between mt-2 gap-1 false">
          <span></span>
          <div className="d-flex justify-content-between gap-1">
            <Button
              className="px-10"
              htmlType="submit"
              type="primary"
                    text={changeBillingState.loading ? t("Loading...") : t("billingChangeRequest.submit")}
                    disabled={changeBillingState.loading}
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
BillingChangeRequest.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
