import Button from "@/components/button/button";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import Toast from "@/components/toast/toast";
import { useLanguage } from "@/localization/LocalContext";
import React, { ChangeEvent, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { FaUser, FaPhone } from "react-icons/fa";
import styles from "@/styles/pages/cnabout.module.scss";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import {
  MdOutlineAlternateEmail,
  MdOutlineHomeWork,
  MdOutlineTrain,
} from "react-icons/md";
import { BiHomeAlt2 } from "react-icons/bi";
import ClientLayout from "@/components/dashboard-layout/client-layout";
import styleHeader from "@/styles/pages/cnChangePaymentMethod.module.scss";
import styleNav from "@/styles/components/organisms/client-layout.module.scss";
import Image from "next/image";
import ApiHandler from "@/app/api-handler";
import { calculateAge } from "@/libs/utils";
import { useRouter } from "next/router";

// Define contract and plan structure
interface Plan {
  id: number;
  name: string;
  content: string;
}

export default function CnAbout() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);

  // Accordion state management
  const [accordionState, setAccordionState] = useState<number | null>(null);
  const [hasOpenedAccordions, setHasOpenedAccordions] = useState<Record<string, boolean>>({});
  const [loadingAccordion, setLoadingAccordion] = useState<number | null>(null);
  const [loadedSections, setLoadedSections] = useState<Record<string, boolean>>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Form errors state
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [billingFormErrors, setBillingFormErrors] = React.useState<
    Record<string, string | null>
  >({});
  const [paymentFormErrors, setPaymentFormErrors] = React.useState<
    Record<string, string | null>
  >({});

  // Form 1 - Customer Information
  const [customerFormValues, setCustomerFormValues] = useState({
    firstName: "",
    lastName: "",
    firstNameKana: "",
    lastNameKana: "",
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
    language: "japanese",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    age: "",
    advertising: "subscribe",
  });

  // Form 3 - Payment Information
  const [paymentFormValues, setPaymentFormValues] = useState({
    paymentMethod: "credit",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Billing Information Form State
  const [billingFormValues, setBillingFormValues] = useState({
    firstName: "",
    lastName: "",
    firstNameKana: "",
    lastNameKana: "",
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
    billingType: "different" as "same" | "different"
  });

  // Add state for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    prefectures: [] as { label: string; value: string }[],
    railwayCompanies: [] as { label: string; value: string }[],
    trainLines: [] as { label: string; value: string }[],
    trainStations: [] as { label: string; value: string }[],
    languages: [] as { label: string; value: string }[],
  });

  // Load initial data and set accordion state from URL
  React.useEffect(() => {
    const loadInitialData = async () => {
      const section = router.query.section as string | undefined;
      let index = 0; // Default to first accordion

      if (section) {
        if (section === "billing") {
          index = 1;
        } else if (section === "payment") {
          index = 2;
        }
        
        const sectionKey = section;

        // Only set accordion state and load data if it's different from current state
        if (accordionState !== index) {
          setAccordionState(index);
          setHasOpenedAccordions(prev => ({ ...prev, [sectionKey]: true }));

          // Load data only if not already loaded
          if (!loadedSections[sectionKey]) {
            setLoadingAccordion(index);
            try {
              switch (index) {
                case 0:
                  await fetchCustomerData();
                  setLoadedSections(prev => ({ ...prev, customer: true }));
                  break;
                case 1:
                  await fetchBillingData();
                  setLoadedSections(prev => ({ ...prev, billing: true }));
                  break;
                case 2:
                  await fetchPaymentData();
                  setLoadedSections(prev => ({ ...prev, payment: true }));
                  break;
              }
            } catch (error) {
              console.error("Error loading initial data:", error);
            } finally {
              setLoadingAccordion(null);
            }
          }
        }
        
        // Mark that initial load is complete
        setIsInitialLoad(false);
      } else {
        // Only default to customer section on the very first load
        if (isInitialLoad) {
          // First time loading the page - default to customer section
          await router.push(
            {
              pathname: router.pathname,
              query: { section: "customer" }
            },
            undefined,
            { shallow: true }
          );
          // Don't set accordion state here, let the effect run again with the new URL
        } else {
          // User has previously interacted with accordions and closed them all
          // Keep all accordions closed (don't default to customer)
          setAccordionState(null);
        }
      }
    };

    if (router.isReady) {
      loadInitialData();
    }
  }, [router.isReady, router.query.section]); // Only depend on section, not entire query

  // Update URL and handle data loading
  const handleAccordionToggle = async (index: number) => {
    console.log("handleAccordionToggle called with index:", index, "current accordionState:", accordionState);

    // Mark that initial load is complete since user is interacting
    setIsInitialLoad(false);

    // If clicking the same accordion that's open, close it
    if (index === accordionState) {
      console.log("Closing accordion");
      setAccordionState(null);
      setLoadingAccordion(null); // Clear any loading state
      
      // Clear URL query parameters when closing accordion
      await router.push(
        {
          pathname: router.pathname,
          query: {}
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    // Get section names
    const sectionNames = ["customer", "billing", "payment"];
    const sectionName = sectionNames[index];

    // Check if data needs to be loaded
    const needsDataLoad = !loadedSections[sectionName];

    if (needsDataLoad) {
      // Set loading state for specific accordion
      setLoadingAccordion(index);
      console.log("Loading state set for accordion:", index);

      try {
        // Load data for the section only if not loaded before
        switch (index) {
          case 0:
            console.log("Loading customer data");
            await fetchCustomerData();
            setLoadedSections(prev => ({ ...prev, customer: true }));
            break;
          case 1:
            console.log("Loading billing data");
            await fetchBillingData();
            setLoadedSections(prev => ({ ...prev, billing: true }));
            break;
          case 2:
            console.log("Loading payment data");
            await fetchPaymentData();
            setLoadedSections(prev => ({ ...prev, payment: true }));
            break;
        }
      } catch (error) {
        console.error("Error loading section data:", error);
        setToast({
          message: "Error loading section data",
          type: "error",
        });
        setLoadingAccordion(null);
        return;
      } finally {
        setLoadingAccordion(null);
        console.log("Loading complete");
      }
    }

    // Update URL with the section
    await router.push(
      {
        pathname: router.pathname,
        query: { section: sectionName }
      },
      undefined,
      { shallow: true }
    );

    // Set accordion state and mark as opened
    setAccordionState(index);
    setHasOpenedAccordions(prev => ({ ...prev, [sectionName]: true }));
  };

  // Auto-open next accordion after successful save
  const openNextAccordion = async (currentIndex: number) => {
    // Mark that initial load is complete
    setIsInitialLoad(false);
    
    const nextIndex = currentIndex + 1;
    const sectionNames = ["customer", "billing", "payment"];
    
    if (nextIndex < sectionNames.length) {
      const nextSectionName = sectionNames[nextIndex];
      
      // Always auto-open next accordion after save, regardless of previous state
      setTimeout(async () => {
        try {
          // Check if data needs to be loaded for next section
          const needsDataLoad = !loadedSections[nextSectionName];
          
          if (needsDataLoad) {
            // Set loading state for next accordion
            setLoadingAccordion(nextIndex);
            
            // Load data for the next section silently
            switch (nextIndex) {
              case 1:
                console.log("Loading billing data for next accordion");
                await fetchBillingDataSilent();
                setLoadedSections(prev => ({ ...prev, billing: true }));
                break;
              case 2:
                console.log("Loading payment data for next accordion");
                await fetchPaymentDataSilent();
                setLoadedSections(prev => ({ ...prev, payment: true }));
                break;
            }
          }

          // Update URL
          await router.push(
            {
              pathname: router.pathname,
              query: { section: nextSectionName }
            },
            undefined,
            { shallow: true }
          );

          // Set accordion state and mark as opened
          setAccordionState(nextIndex);
          setHasOpenedAccordions(prev => ({ ...prev, [nextSectionName]: true }));

        } catch (error) {
          console.error("Error loading next section data:", error);
          setToast({
            message: "Error loading section data",
            type: "error",
          });
        } finally {
          setLoadingAccordion(null);
        }
      }, 500);
    } else {
      // Close current accordion if it's the last one (payment section)
      setTimeout(async () => {
        setAccordionState(null);
        await router.push(
          {
            pathname: router.pathname,
            query: {}
          },
          undefined,
          { shallow: true }
        );
      }, 500);
    }
  };

  const simulateApiDelay = () =>
    new Promise((resolve) => setTimeout(resolve, 1000));

  const fetchCustomerData = async () => {
    try {
      // Dummy API call with delay
      await simulateApiDelay();

      // Mock API call - replace with real endpoint later
      // const response = await ApiHandler.request(
      //   `/api/test/customer-data`,
      //   "GET",
      //   null,
      //   null,
      //   null,
      //   false
      // );

      // For now, use mock data since API is dummy
      const mockData = {
        formValues: {
          firstName: "Test",
          lastName: "User",
          firstNameKana: "テスト",
          lastNameKana: "ユーザー",
          phone1: "090-1234-5678",
          email1: "test@example.com",
          postalCode: "160-0023",
          prefecture: "13",
          address1: "Shinjuku",
          gender: "male",
          language: "japanese",
        },
        options: {
          prefectures: [
            { label: "Tokyo", value: "13" },
            { label: "Osaka", value: "27" },
            { label: "Kanagawa", value: "14" },
          ],
          railwayCompanies: [
            { label: "JR East", value: "jr_east" },
            { label: "Tokyo Metro", value: "tokyo_metro" },
          ],
          trainLines: [
            { label: "Yamanote Line", value: "yamanote" },
            { label: "Chuo Line", value: "chuo" },
          ],
          trainStations: [
            { label: "Shinjuku", value: "shinjuku" },
            { label: "Shibuya", value: "shibuya" },
          ],
          languages: [
            { label: t("aboutPage.japanese"), value: "japanese" },
            { label: t("aboutPage.english"), value: "english" },
            { label: t("aboutPage.both"), value: "both" },
          ],
        },
      };

      setCustomerFormValues({
        ...customerFormValues,
        ...mockData.formValues,
      });

      setDropdownOptions((prev) => ({
        ...prev,
        ...mockData.options,
      }));

      setToast({
        message: "Customer data loaded successfully",
        type: "success",
      });
    } catch (error: any) {
      console.log("Error loading customer data:", error);
      setToast({
        message: "Error loading customer data",
        type: "error",
      });
    }
  };

  const fetchBillingData = async () => {
    try {
      await simulateApiDelay();

      // Mock API call - replace with real endpoint later
      // const response = await ApiHandler.request(
      //   `/api/test/billing-data`,
      //   "GET",
      //   null,
      //   null,
      //   null,
      //   false
      // );

      // For now, use mock data since API is dummy
      const mockData = {
        formValues: {
          firstName: "Billing",
          lastName: "Contact",
          firstNameKana: "ビリング",
          lastNameKana: "コンタクト",
          phone1: "090-8765-4321",
          email1: "billing@example.com",
          postalCode: "160-0023",
          prefecture: "13",
          address1: "Shibuya",
          billingType: "different" as "same" | "different",
        },
      };

      setBillingFormValues({
        ...billingFormValues,
        ...mockData.formValues,
      });

      setToast({
        message: "Billing data loaded successfully",
        type: "success",
      });
    } catch (error: any) {
      console.log("Error loading billing data:", error);
      setToast({
        message: "Error loading billing data",
        type: "error",
      });
    }
  };

  const fetchPaymentData = async () => {
    try {
      await simulateApiDelay();

      // Mock API call - replace with real endpoint later
      // const response = await ApiHandler.request(
      //   `/api/test/payment-data`,
      //   "GET",
      //   null,
      //   null,
      //   null,
      //   false
      // );

      // For now, use mock data since API is dummy
      const mockData = {
        formValues: {
          paymentMethod: "credit",
        },
      };

      setPaymentFormValues({
        ...paymentFormValues,
        ...mockData.formValues,
      });

      setToast({
        message: "Payment data loaded successfully",
        type: "success",
      });
    } catch (error: any) {
      console.log("Error loading payment data:", error);
      setToast({
        message: "Error loading payment data",
        type: "error",
      });
    }
  };

  // Silent data fetching functions (without loading state and toasts)
  const fetchBillingDataSilent = async () => {
    try {
      await simulateApiDelay();

      // Mock API call - replace with real endpoint later
      // const response = await ApiHandler.request(
      //   `/api/test/billing-data`,
      //   "GET",
      //   null,
      //   null,
      //   null,
      //   false
      // );

      // For now, use mock data since API is dummy
      const mockData = {
        formValues: {
          firstName: "Billing",
          lastName: "Contact",
          firstNameKana: "ビリング",
          lastNameKana: "コンタクト",
          phone1: "090-8765-4321",
          email1: "billing@example.com",
          postalCode: "160-0023",
          prefecture: "13",
          address1: "Shibuya",
          billingType: "different" as "same" | "different",
        },
      };

      setBillingFormValues({
        ...billingFormValues,
        ...mockData.formValues,
      });
    } catch (error: any) {
      console.log("Error loading billing data:", error);
    }
  };

  const fetchPaymentDataSilent = async () => {
    try {
      await simulateApiDelay();

      // Mock API call - replace with real endpoint later
      // const response = await ApiHandler.request(
      //   `/api/test/payment-data`,
      //   "GET",
      //   null,
      //   null,
      //   null,
      //   false
      // );

      // For now, use mock data since API is dummy
      const mockData = {
        formValues: {
          paymentMethod: "credit",
        },
      };

      setPaymentFormValues({
        ...paymentFormValues,
        ...mockData.formValues,
      });
    } catch (error: any) {
      console.log("Error loading payment data:", error);
    }
  };

  const handleSubmit = async (formType: "customer" | "billing" | "payment") => {
    setIsSubmitting(true);
    try {
      const formData =
        formType === "customer"
          ? customerFormValues
          : formType === "billing"
          ? billingFormValues
          : paymentFormValues;

      // Validate customer form
      if (formType === "customer") {
        const newErrors: Record<string, string | null> = {};
        if (!customerFormValues.gender) {
          newErrors.gender = "Gender is required";
        }
        if (!customerFormValues.railwayCompany1) {
          newErrors.railwayCompany1 = "Railway company is required";
        }
        if (!customerFormValues.trainLine1) {
          newErrors.trainLine1 = "Train line is required";
        }
        if (!customerFormValues.trainStation1) {
          newErrors.trainStation1 = "Train station is required";
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setToast({
            message: "Please fill in all required fields",
            type: "error",
          });
          return;
        }
      }

      // Add delay to simulate API call
      await simulateApiDelay();

      // Mock API call - replace with real endpoint later
      // const response = await ApiHandler.request(
      //   `/api/test/${formType}-submit`,
      //   "POST",
      //   formData,
      //   null,
      //   null,
      //   false
      // );

      console.log(`${formType} form submitted:`, formData);
      setToast({
        message: "Submission successful",
        type: "success",
      });

      // Auto-open next accordion after successful save
      const currentIndex = formType === "customer" ? 0 : formType === "billing" ? 1 : 2;
      openNextAccordion(currentIndex);

    } catch (error: any) {
      console.error(`Error submitting ${formType} form:`, error);
      setToast({
        message: error.message || "Submission failed",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    formType: string,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (formType) {
      case "customer":
        setCustomerFormValues((prev) => ({ ...prev, [name]: value }));
        break;
      case "billing":
        setBillingFormValues((prev) => ({ ...prev, [name]: value }));
        break;
      case "payment":
        setPaymentFormValues((prev) => ({ ...prev, [name]: value }));
        break;
    }
  };

  // Update billing form when customer form changes if billing type is "same"
  React.useEffect(() => {
    if (billingFormValues.billingType === "same") {
      setBillingFormValues(prev => ({
        ...customerFormValues,
        billingType: "same"
      }));
    }
  }, [customerFormValues, billingFormValues.billingType]);

  const handleBillingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "billingType") {
      if (value === "same") {
        // Copy customer information to billing form but keep the billingType
        setBillingFormValues({
          ...customerFormValues,
          billingType: "same"
        });
      } else {
        // Keep existing values when switching to different
        setBillingFormValues((prev) => ({
          ...prev,
          billingType: "different"
        }));
      }
    } else {
      // Only allow changes if billingType is "different"
      if (billingFormValues.billingType === "different") {
        setBillingFormValues((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleDateOfBirthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValues = { ...customerFormValues, [name]: value };

    // Update the form values
    setCustomerFormValues(newValues);

    // Calculate age if we have all date components
    if (newValues.birthYear && newValues.birthMonth && newValues.birthDay) {
      const dob = `${newValues.birthYear}-${newValues.birthMonth.padStart(
        2,
        "0"
      )}-${newValues.birthDay.padStart(2, "0")}`;
      const calculatedAge = calculateAge(dob);
      setCustomerFormValues((prev) => ({
        ...prev,
        [name]: value,
        age: calculatedAge.toString(),
      }));
    }
  };

  const handleFormSubmit =
    (formType: "customer" | "billing" | "payment") => () => {
      handleSubmit(formType);
    };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header className={styleNav.clientHeader}>
        <div className="d-flex">
          <Image
            className={styleNav.logo}
            src="/assets/images/client-dashboard-logo.svg"
            width={40}
            height={40}
            alt="Logo"
          />
          <Image
            className={`${styleNav.logoMobile}`}
            src="/assets/svg/logo-mobile.svg"
            width={40}
            height={40}
            alt="Logo"
          />
        </div>
      </header>
      <ClientLayout header={false} nav={false}>
        <h1 className={styleHeader.topHeading}>{t("cnInfo.orderForm")}</h1>
        <div className="d-flex flex-column gap-2">
          <Accordion
            openIndex={accordionState}
            onToggle={handleAccordionToggle}
          >
            {/* Customer Information Accordion */}
            <AccordionItem
              heading={t("aboutPage.customerInfo")}
              label={t("cnInfo.required")}
            >
              {loadingAccordion === 0 ? (
                <div className="d-flex justify-content-center py-4">
                  Loading customer data...
                </div>
              ) : (
                <Form
                  onSubmit={handleFormSubmit("customer")}
                  setErrors={setErrors}
                  errors={errors}
                  className={styles.customerForm}
                >
                  <div className={styles.formGrid}>
                    {/* Name Section */}
                    <div className={styles.label}>
                      {t("aboutPage.nameLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldRow}>
                        <InputField
                          name="lastName"
                          placeholder={t("cncontactform.lastnamePlaceholder")}
                          value={customerFormValues.lastName}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          icon={<FaUser size={12} />}
                        />
                        <InputField
                          name="firstName"
                          placeholder={t("aboutPage.firstNamePlaceholder")}
                          value={customerFormValues.firstName}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          icon={<FaUser size={12} />}
                        />
                      </div>
                      <div className={styles.fieldRow}>
                        <InputField
                          name="lastNameKana"
                          placeholder={
                            t("cncontactform.lastnamePlaceholder") + " (Kana)"
                          }
                          value={customerFormValues.lastNameKana}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          icon={<FaUser size={12} />}
                        />
                        <InputField
                          name="firstNameKana"
                          placeholder={
                            t("aboutPage.firstNamePlaceholder") + " (Kana)"
                          }
                          value={customerFormValues.firstNameKana}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          icon={<FaUser size={12} />}
                        />
                      </div>
                    </div>
                    {/* Phone Section */}
                    <div className={styles.label}>
                      {t("aboutPage.phoneLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <InputField
                        name="phone1"
                        placeholder={t("aboutPage.phone1Placeholder")}
                        value={customerFormValues.phone1}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }]}
                        icon={<FaPhone size={12} />}
                      />
                      <InputField
                        name="phone2"
                        placeholder={t("aboutPage.phone2Placeholder")}
                        value={customerFormValues.phone2}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<FaPhone size={12} />}
                      />
                      <InputField
                        name="phone3"
                        placeholder={t("aboutPage.phone3Placeholder")}
                        value={customerFormValues.phone3}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<FaPhone size={12} />}
                      />
                    </div>
                    {/* Email Section */}
                    <div className={styles.label}>
                      {t("aboutPage.emailLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <InputField
                        name="email1"
                        placeholder={t("aboutPage.email1Placeholder")}
                        type="email"
                        value={customerFormValues.email1}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }, { type: "email" }]}
                        icon={<MdOutlineAlternateEmail size={12} />}
                      />
                      <InputField
                        name="email2"
                        placeholder={t("aboutPage.email2Placeholder")}
                        type="email"
                        value={customerFormValues.email2}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "email" }]}
                        icon={<MdOutlineAlternateEmail size={12} />}
                      />
                    </div>
                    {/* Address Section */}
                    <div className={styles.label}>
                      {t("aboutPage.addressLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldRow}>
                        <InputField
                          name="postalCode"
                          placeholder={t("aboutPage.postalCodePlaceholder")}
                          value={customerFormValues.postalCode}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          icon={<MdOutlineHomeWork size={12} />}
                        />
                        <SelectField
                          name="prefecture"
                          placeholder={t("aboutPage.prefecturePlaceholder")}
                          options={dropdownOptions.prefectures}
                          value={customerFormValues.prefecture}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          icon={<BiHomeAlt2 size={12} />}
                        />
                      </div>
                      <InputField
                        name="address1"
                        placeholder={t("aboutPage.address1Placeholder")}
                        value={customerFormValues.address1}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }]}
                        icon={<BiHomeAlt2 size={12} />}
                      />
                      <InputField
                        name="address2"
                        placeholder={t("aboutPage.address2Placeholder")}
                        value={customerFormValues.address2}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<BiHomeAlt2 size={12} />}
                      />
                      <InputField
                        name="building"
                        placeholder={t("aboutPage.buildingPlaceholder")}
                        value={customerFormValues.building}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<BiHomeAlt2 size={12} />}
                      />
                    </div>
                    {/* Train Station Section */}
                    <div className={styles.label}>
                      {t("aboutPage.trainStationLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.stationGroup}>
                        <SelectField
                          name="railwayCompany1"
                          placeholder={t(
                            "aboutPage.railwayCompany1Placeholder"
                          )}
                          options={dropdownOptions.railwayCompanies}
                          value={customerFormValues.railwayCompany1}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          errorText={errors.railwayCompany1 || undefined}
                          icon={<MdOutlineTrain size={12} />}
                        />
                        <SelectField
                          name="trainLine1"
                          placeholder={t("aboutPage.trainLine1Placeholder")}
                          options={dropdownOptions.trainLines}
                          value={customerFormValues.trainLine1}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          errorText={errors.trainLine1 || undefined}
                          icon={<MdOutlineTrain size={12} />}
                        />
                        <SelectField
                          name="trainStation1"
                          placeholder={t("aboutPage.trainStation1Placeholder")}
                          options={dropdownOptions.trainStations}
                          value={customerFormValues.trainStation1}
                          onChange={(e) => handleInputChange("customer", e)}
                          validations={[{ type: "required" }]}
                          errorText={errors.trainStation1 || undefined}
                          icon={<MdOutlineTrain size={12} />}
                        />
                      </div>
                      <div className={styles.stationGroup}>
                        <InputField
                          name="railwayCompany2"
                          placeholder={t(
                            "aboutPage.railwayCompany2Placeholder"
                          )}
                          value={customerFormValues.railwayCompany2}
                          onChange={(e) => handleInputChange("customer", e)}
                          icon={<MdOutlineTrain size={12} />}
                        />
                        <InputField
                          name="trainLine2"
                          placeholder={t("aboutPage.trainLine2Placeholder")}
                          value={customerFormValues.trainLine2}
                          onChange={(e) => handleInputChange("customer", e)}
                          icon={<MdOutlineTrain size={12} />}
                        />
                        <InputField
                          name="trainStation2"
                          placeholder={t("aboutPage.trainStation2Placeholder")}
                          value={customerFormValues.trainStation2}
                          onChange={(e) => handleInputChange("customer", e)}
                          icon={<MdOutlineTrain size={12} />}
                        />
                      </div>
                    </div>
                    {/* Gender Section */}
                    <div className={styles.label}>
                      {t("aboutPage.genderLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div>
                      <RadioField
                        name="gender"
                        options={[
                          { label: t("aboutPage.male"), value: "male" },
                          { label: t("aboutPage.female"), value: "female" },
                          { label: t("aboutPage.other"), value: "other" },
                        ]}
                        selectedValue={customerFormValues.gender}
                        onChange={(e) => handleInputChange("customer", e)}
                        className={styles.radioGroup}
                      />
                      {errors.gender && (
                        <div className="text-danger mt-1">{errors.gender}</div>
                      )}
                    </div>
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
                        value={customerFormValues.birthYear}
                        onChange={handleDateOfBirthChange}
                        icon={<SlCalender size={12} />}
                      />
                      <SelectField
                        name="birthMonth"
                        placeholder={t("aboutPage.monthPlaceholder")}
                        options={Array.from({ length: 12 }, (_, i) => ({
                          label: String(i + 1),
                          value: String(i + 1).padStart(2, "0"),
                        }))}
                        value={customerFormValues.birthMonth}
                        onChange={handleDateOfBirthChange}
                        icon={<SlCalender size={12} />}
                      />
                      <SelectField
                        name="birthDay"
                        placeholder={t("aboutPage.dayPlaceholder")}
                        options={Array.from({ length: 31 }, (_, i) => ({
                          label: String(i + 1),
                          value: String(i + 1).padStart(2, "0"),
                        }))}
                        value={customerFormValues.birthDay}
                        onChange={handleDateOfBirthChange}
                        icon={<SlCalender size={12} />}
                      />
                      <InputField
                        name="age"
                        placeholder={t("aboutPage.agePlaceholder")}
                        value={customerFormValues.age}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<SlCalender size={12} />}
                        disabled={true}
                      />
                    </div>
                    {/* Language Section */}
                    <div className={styles.label}>
                      {t("aboutPage.languageLabel")}
                    </div>
                    <RadioField
                      name="language"
                      options={dropdownOptions.languages}
                      selectedValue={customerFormValues.language}
                      onChange={(e) => handleInputChange("customer", e)}
                      className={styles.radioGroup}
                    />
                    {/* Advertising Email Section */}
                    <div className={styles.label}>
                      {t("aboutPage.advertisingEmailLabel")}
                    </div>
                    <RadioField
                      name="advertising"
                      options={[
                        { label: t("aboutPage.subscribe"), value: "subscribe" },
                        {
                          label: t("aboutPage.unsubscribe"),
                          value: "unsubscribe",
                        },
                      ]}
                      selectedValue={customerFormValues.advertising}
                      onChange={(e) => handleInputChange("customer", e)}
                      className={styles.radioGroup}
                    />
                  </div>
                  <div className="d-flex justify-content-center mt-4 mb-2">
                    <Button
                      htmlType="submit"
                      type="primary"
                      text={
                        isSubmitting
                          ? t("buttons.submitting")
                          : t("buttons.submit")
                      }
                      className="px-10"
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                </Form>
              )}
            </AccordionItem>

            {/* Billing Information Accordion */}
            <AccordionItem
              heading={t("aboutPage.billingInfoHeading")}
              label={t("cnInfo.required")}
            >
              {loadingAccordion === 1 ? (
                <div className="d-flex justify-content-center py-4">
                  Loading billing data...
                </div>
              ) : (
                <Form
                  onSubmit={handleFormSubmit("billing")}
                  setErrors={setBillingFormErrors}
                  errors={billingFormErrors}
                  className={styles.customerForm}
                >
                  <div className={styles.formGrid}>
                    {/* Billing Contact Type Selection */}
                    <div className={styles.label}>
                      {t("cnInfo.billingContact")}
                    </div>
                    <div className={styles.billingTypeSelection}>
                      <RadioField
                        name="billingType"
                        options={[
                          { label: t("cnInfo.sameAsCustomer"), value: "same" },
                          { label: t("cnInfo.differentFromCustomer"), value: "different" }
                        ]}
                        selectedValue={billingFormValues.billingType}
                        onChange={handleBillingInputChange}
                        className={styles.radioGroup}
                      />
                    </div>

                    {/* Name Section */}
                    <div className={styles.label}>
                      {t("aboutPage.nameLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldRow}>
                        <InputField
                          name="lastName"
                          placeholder={t("cncontactform.lastnamePlaceholder")}
                          value={billingFormValues.lastName}
                          onChange={handleBillingInputChange}
                          validations={billingFormValues.billingType === "different" ? [{ type: "required" }] : undefined}
                          icon={<FaUser size={12} />}
                          readOnly={billingFormValues.billingType === "same"}
                        />
                        <InputField
                          name="firstName"
                          placeholder={t("aboutPage.firstNamePlaceholder")}
                          value={billingFormValues.firstName}
                          onChange={handleBillingInputChange}
                          validations={billingFormValues.billingType === "different" ? [{ type: "required" }] : undefined}
                          icon={<FaUser size={12} />}
                          readOnly={billingFormValues.billingType === "same"}
                        />
                      </div>
                      <div className={styles.fieldRow}>
                        <InputField
                          name="lastNameKana"
                          placeholder={
                            t("cncontactform.lastnamePlaceholder") + " (Kana)"
                          }
                          value={billingFormValues.lastNameKana}
                          onChange={handleBillingInputChange}
                          validations={billingFormValues.billingType === "different" ? [{ type: "required" }] : undefined}
                          icon={<FaUser size={12} />}
                          readOnly={billingFormValues.billingType === "same"}
                        />
                        <InputField
                          name="firstNameKana"
                          placeholder={
                            t("aboutPage.firstNamePlaceholder") + " (Kana)"
                          }
                          value={billingFormValues.firstNameKana}
                          onChange={handleBillingInputChange}
                          validations={billingFormValues.billingType === "different" ? [{ type: "required" }] : undefined}
                          icon={<FaUser size={12} />}
                          readOnly={billingFormValues.billingType === "same"}
                        />
                      </div>
                    </div>
                    {/* Phone Section */}
                    <div className={styles.label}>
                      {t("aboutPage.phoneLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <InputField
                        name="phone1"
                        placeholder={t("aboutPage.phone1Placeholder")}
                        value={billingFormValues.phone1}
                        onChange={handleBillingInputChange}
                        validations={billingFormValues.billingType === "different" ? [{ type: "required" }] : undefined}
                        icon={<FaPhone size={12} />}
                        readOnly={billingFormValues.billingType === "same"}
                      />
                      <InputField
                        name="phone2"
                        placeholder={t("aboutPage.phone2Placeholder")}
                        value={billingFormValues.phone2}
                        onChange={handleBillingInputChange}
                        icon={<FaPhone size={12} />}
                        readOnly={billingFormValues.billingType === "same"}
                      />
                      <InputField
                        name="phone3"
                        placeholder={t("aboutPage.phone3Placeholder")}
                        value={billingFormValues.phone3}
                        onChange={handleBillingInputChange}
                        icon={<FaPhone size={12} />}
                        readOnly={billingFormValues.billingType === "same"}
                      />
                    </div>
                    {/* Email Section */}
                    <div className={styles.label}>
                      {t("aboutPage.emailLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <InputField
                        name="email1"
                        placeholder={t("aboutPage.email1Placeholder")}
                        type="email"
                        value={billingFormValues.email1}
                        onChange={handleBillingInputChange}
                        validations={billingFormValues.billingType === "different" ? [{ type: "required" }, { type: "email" }] : undefined}
                        icon={<MdOutlineAlternateEmail size={12} />}
                        readOnly={billingFormValues.billingType === "same"}
                      />
                      <InputField
                        name="email2"
                        placeholder={t("aboutPage.email2Placeholder")}
                        type="email"
                        value={billingFormValues.email2}
                        onChange={handleBillingInputChange}
                        validations={billingFormValues.billingType === "different" ? [{ type: "email" }] : undefined}
                        icon={<MdOutlineAlternateEmail size={12} />}
                        readOnly={billingFormValues.billingType === "same"}
                      />
                    </div>
                    {/* Address Section */}
                    <div className={styles.label}>
                      {t("aboutPage.addressLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldRow}>
                        <InputField
                          name="postalCode"
                          placeholder={t("aboutPage.postalCodePlaceholder")}
                          value={billingFormValues.postalCode}
                          onChange={handleBillingInputChange}
                          validations={billingFormValues.billingType === "different" ? [{ type: "required" }] : undefined}
                          icon={<MdOutlineHomeWork size={12} />}
                          readOnly={billingFormValues.billingType === "same"}
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
                          icon={<BiHomeAlt2 size={12} />}
                          disabled={billingFormValues.billingType === "same"}
                        />
                      </div>
                      <InputField
                        name="address1"
                        placeholder={t("aboutPage.address1Placeholder")}
                        value={billingFormValues.address1}
                        onChange={handleBillingInputChange}
                        validations={[{ type: "required" }]}
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={billingFormValues.billingType === "same"}
                      />
                      <InputField
                        name="address2"
                        placeholder={t("aboutPage.address2Placeholder")}
                        value={billingFormValues.address2}
                        onChange={handleBillingInputChange}
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={billingFormValues.billingType === "same"}
                      />
                      <InputField
                        name="building"
                        placeholder={t("aboutPage.buildingPlaceholder")}
                        value={billingFormValues.building}
                        onChange={handleBillingInputChange}
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={billingFormValues.billingType === "same"}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-4 mb-2">
                    <Button
                      htmlType="submit"
                      type="primary"
                      text={
                        isSubmitting
                          ? t("buttons.submitting")
                          : t("buttons.submit")
                      }
                      className="px-10"
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                </Form>
              )}
            </AccordionItem>

            {/* Payment Information Accordion */}
            <AccordionItem
              heading={t("aboutPage.paymentInfoHeading")}
              label={t("cnInfo.required")}
            >
              {loadingAccordion === 2 ? (
                <div className="d-flex justify-content-center py-4">
                  Loading payment data...
                </div>
              ) : (
                <Form
                  onSubmit={handleFormSubmit("payment")}
                  setErrors={setPaymentFormErrors}
                  errors={paymentFormErrors}
                  className={styles.customerForm}
                >
                  <div className={styles.formGrid}>
                    {/* Payment Method */}
                    <div className={styles.label}>
                      {t("aboutPage.paymentMethodLabel")}{" "}
                      <span className="cn-labelWarn">
                        {" "}
                        {t("cnInfo.required")}{" "}
                      </span>
                    </div>
                    <div>
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
                        onChange={(e) => handleInputChange("payment", e)}
                        className={styles.radioGroup}
                      />
                      {paymentFormErrors.paymentMethod && (
                        <div className="text-danger mt-1">
                          {paymentFormErrors.paymentMethod}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-4 mb-2">
                    <Button
                      htmlType="submit"
                      type="primary"
                      text={
                        isSubmitting
                          ? t("buttons.submitting")
                          : t("buttons.submit")
                      }
                      className="px-10"
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                </Form>
              )}
            </AccordionItem>
          </Accordion>
        </div>
      </ClientLayout>
    </>
  );
}
