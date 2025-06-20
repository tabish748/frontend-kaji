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

export default function CnInfo() {
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
  const [hasOpenedAccordions, setHasOpenedAccordions] = useState<
    Record<string, boolean>
  >({});
  const [loadingAccordion, setLoadingAccordion] = useState<number | null>(null);
  const [loadedSections, setLoadedSections] = useState<Record<string, boolean>>(
    {}
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [preFilledFields, setPreFilledFields] = useState<
    Record<string, boolean>
  >({});

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
    gender: "", // No default - only set if returned from API
    language: "", // No default - only set if returned from API
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    age: "",
    advertising: "", // No default - only set if returned from API
  });

  // Form 3 - Payment Information
  const [paymentFormValues, setPaymentFormValues] = useState({
    paymentMethod: "", // No default - only set if returned from API
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
    billingType: "2", // Default to "different_from_customer"
  });

  // Track billing info ID for update/create logic
  const [billingInfoId, setBillingInfoId] = useState<string | null>(null);

  // Store original fetched billing data
  const [originalBillingData, setOriginalBillingData] = useState({
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
  });

  // Track which billing fields were pre-filled from API
  const [preFilledBillingFields, setPreFilledBillingFields] = useState<
    Record<string, boolean>
  >({});

  // Add state for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    prefectures: [] as { label: string; value: string }[],
    languages: [] as { label: string; value: string }[],
    paymentMethods: [] as { label: string; value: string }[],
    genders: [] as { label: string; value: string }[],
    newsletter: [] as { label: string; value: string }[],
    billingContactType: [] as { label: string; value: string }[],
  });

  // Load all dropdown options once when page loads
  const loadAllDropdownOptions = async () => {
    try {
      const response = await ApiHandler.request(
        `/api/public-inquiry-form-dropdowns`,
        "GET",
        null,
        null,
        null,
        false
      );

      if (response.success && response.data) {
        // Transform API response to match expected dropdown format
        const transformedOptions = {
          prefectures:
            response.data.prefectures?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(),
            })) || [],
          languages:
            response.data.language?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(), // Use actual API value for form submission
            })) || [],
          genders:
            response.data.gender?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(), // Use actual API value for form submission
            })) || [],
          newsletter:
            response.data.newsletter?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(), // Keep numeric values as strings
            })) || [],
          billingContactType:
            response.data.billing_contact_info?.map((item: any) => ({
              label: item.label, // Use label directly from API response
              value: item.value.toString(), // Use actual API values
            })) || [],
          paymentMethods:
            response.data.payment_method?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(), // Use actual API value for form submission
            })) || [],
        };

        setDropdownOptions(transformedOptions);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error: any) {
      console.error("Error loading dropdown options:", error);
      setToast({
        message: error.message || "Error loading dropdown options",
        type: "error",
      });
    }
  };

  // Load dropdown options once when component mounts
  React.useEffect(() => {
    if (router.isReady) {
      loadAllDropdownOptions();
    }
  }, [router.isReady]);

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
          setHasOpenedAccordions((prev) => ({ ...prev, [sectionKey]: true }));

          // Load data only if not already loaded
          if (!loadedSections[sectionKey]) {
            setLoadingAccordion(index);
            try {
              switch (index) {
                case 0:
                  await fetchCustomerData();
                  setLoadedSections((prev) => ({ ...prev, customer: true }));
                  break;
                case 1:
                  await fetchBillingData();
                  setLoadedSections((prev) => ({ ...prev, billing: true }));
                  break;
                case 2:
                  await fetchPaymentData();
                  setLoadedSections((prev) => ({ ...prev, payment: true }));
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
              query: { section: "customer" },
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
    console.log(
      "handleAccordionToggle called with index:",
      index,
      "current accordionState:",
      accordionState
    );

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
          query: {},
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
    let needsDataLoad = !loadedSections[sectionName];

    // For billing section, also check if we actually have billing data stored
    if (sectionName === "billing" && loadedSections[sectionName]) {
      const hasBillingData =
        billingInfoId ||
        Object.values(originalBillingData).some((val) => val !== "");
      if (!hasBillingData) {
        console.log(
          "Billing section marked as loaded but no data found, forcing reload"
        );
        needsDataLoad = true;
        // Reset the loaded state
        setLoadedSections((prev) => ({ ...prev, billing: false }));
      }
    }

    console.log(
      `Section ${sectionName} needs data load:`,
      needsDataLoad,
      "loadedSections:",
      loadedSections
    );

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
            setLoadedSections((prev) => ({ ...prev, customer: true }));
            break;
          case 1:
            console.log("Loading billing data for accordion");
            await fetchBillingData();
            setLoadedSections((prev) => ({ ...prev, billing: true }));
            break;
          case 2:
            console.log("Loading payment data");
            await fetchPaymentData();
            setLoadedSections((prev) => ({ ...prev, payment: true }));
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
        query: { section: sectionName },
      },
      undefined,
      { shallow: true }
    );

    // Set accordion state and mark as opened
    setAccordionState(index);
    setHasOpenedAccordions((prev) => ({ ...prev, [sectionName]: true }));
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
                try {
                  await fetchBillingDataSilent();
                  setLoadedSections((prev) => ({ ...prev, billing: true }));
                  console.log(
                    "Billing data loaded successfully in openNextAccordion"
                  );
                } catch (error) {
                  console.error(
                    "Failed to load billing data in openNextAccordion:",
                    error
                  );
                  // Don't mark as loaded if fetch failed
                }
                break;
              case 2:
                console.log("Loading payment data for next accordion");
                await fetchPaymentDataSilent();
                setLoadedSections((prev) => ({ ...prev, payment: true }));
                break;
            }
          }

          // Update URL
          await router.push(
            {
              pathname: router.pathname,
              query: { section: nextSectionName },
            },
            undefined,
            { shallow: true }
          );

          // Set accordion state and mark as opened
          setAccordionState(nextIndex);
          setHasOpenedAccordions((prev) => ({
            ...prev,
            [nextSectionName]: true,
          }));
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
            query: {},
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
      // Get customer ID from localStorage
      const loggedInUser = localStorage.getItem("loggedInUser");
      let customerId;

      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        customerId = userData.id;
      }

      if (!customerId) {
        throw new Error("Customer ID not found in localStorage");
      }

      const response = await ApiHandler.request(
        `/api/customer/show/${customerId}`,
        "GET",
        null,
        null,
        null,
        true
      );

      if (response.success && response.data) {
        const customerData = response.data;

        // Map API response to form values
        const mappedData = {
          firstName: customerData.first_name || "",
          lastName: customerData.last_name || "",
          firstNameKana: customerData.first_name_kana || "",
          lastNameKana: customerData.last_name_kana || "",
          phone1: customerData.phone1 || "",
          phone2: customerData.phone2 || "",
          phone3: customerData.phone3 || "",
          email1: customerData.email1 || "",
          email2: customerData.email2 || "",
          postalCode: customerData.post_code || "",
          prefecture: customerData.prefecture_id
            ? customerData.prefecture_id.toString()
            : "",
          address1: customerData.address1 || "",
          address2: customerData.address2 || "",
          building: customerData.apartment_name || "",
          gender: customerData.gender ? customerData.gender.toString() : "",
          language: customerData.language
            ? customerData.language.toString()
            : "",
          birthYear: customerData.dob_year || "",
          birthMonth: customerData.dob_month || "",
          birthDay: customerData.dob_day || "",
          age: customerData.age ? customerData.age.toString() : "",
          advertising: customerData.newsletter_emails
            ? customerData.newsletter_emails.toString()
            : "",
          // Handle railway/train station data from customer_routes
          railwayCompany1: customerData.customer_routes?.[0]?.company || "",
          trainLine1: customerData.customer_routes?.[0]?.route_name || "",
          trainStation1:
            customerData.customer_routes?.[0]?.nearest_station || "",
          railwayCompany2: customerData.customer_routes?.[1]?.company || "",
          trainLine2: customerData.customer_routes?.[1]?.route_name || "",
          trainStation2:
            customerData.customer_routes?.[1]?.nearest_station || "",
        };

        setCustomerFormValues({
          ...customerFormValues,
          ...mappedData,
        });

        // Track which fields are pre-filled and should be read-only
        const filledFields: Record<string, boolean> = {};
        Object.keys(mappedData).forEach((key) => {
          if (mappedData[key as keyof typeof mappedData]) {
            filledFields[key] = true;
          }
        });
        setPreFilledFields(filledFields);

        setToast({
          message: "Customer data loaded successfully",
          type: "success",
        });
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error: any) {
      console.log("Error loading customer data:", error);
      setToast({
        message: error.message || "Error loading customer data",
        type: "error",
      });
    }
  };

  const fetchBillingData = async () => {
    console.log("fetchBillingData function called");
    try {
      // Get customer ID from localStorage
      const loggedInUser = localStorage.getItem("loggedInUser");
      console.log("loggedInUser from localStorage:", loggedInUser);
      let customerId;

      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        customerId = userData.id;
        console.log("Customer ID:", customerId);
      }

      if (!customerId) {
        throw new Error("Customer ID not found in localStorage");
      }

      const response = await ApiHandler.request(
        `/api/customer/show-billing-info/${customerId}`,
        "GET",
        null,
        null,
        null,
        true
      );

      if (response.success && response.data) {
        const billingData = response.data;

        // Store billing info ID for update logic
        setBillingInfoId(billingData.id ? billingData.id.toString() : null);

        // Map API response to form values
        const mappedData = {
          firstName: billingData.first_name || "",
          lastName: billingData.last_name || "",
          firstNameKana: billingData.first_name_kana || "",
          lastNameKana: billingData.last_name_kana || "",
          phone1: billingData.phone1 || "",
          phone2: billingData.phone2 || "",
          phone3: billingData.phone3 || "",
          email1: billingData.email1 || "",
          email2: billingData.email2 || "",
          postalCode: billingData.post_code || "",
          prefecture: billingData.prefecture_id
            ? billingData.prefecture_id.toString()
            : "",
          address1: billingData.address1 || "",
          address2: billingData.address2 || "",
          building: billingData.apartment_name || "",
          billingType: billingData.billing_contact_info
            ? billingData.billing_contact_info.toString()
            : "2",
        };

        setBillingFormValues({
          ...billingFormValues,
          ...mappedData,
        });

        // Store original billing data (excluding billingType)
        const originalData = {
          firstName: mappedData.firstName,
          lastName: mappedData.lastName,
          firstNameKana: mappedData.firstNameKana,
          lastNameKana: mappedData.lastNameKana,
          phone1: mappedData.phone1,
          phone2: mappedData.phone2,
          phone3: mappedData.phone3,
          email1: mappedData.email1,
          email2: mappedData.email2,
          postalCode: mappedData.postalCode,
          prefecture: mappedData.prefecture,
          address1: mappedData.address1,
          address2: mappedData.address2,
          building: mappedData.building,
        };
        setOriginalBillingData(originalData);

        // Track which billing fields were pre-filled from API
        const filledBillingFields: Record<string, boolean> = {};
        Object.keys(originalData).forEach((key) => {
          if (originalData[key as keyof typeof originalData]) {
            filledBillingFields[key] = true;
          }
        });

        // Also track if billingType was pre-filled from API
        if (billingData.billing_contact_info) {
          filledBillingFields.billingType = true;
        }

        setPreFilledBillingFields(filledBillingFields);

        setToast({
          message: "Billing data loaded successfully",
          type: "success",
        });
      } else {
        // No billing data found - this is normal for new customers
        console.log("No billing data found, using default values");
        setToast({
          message: "No existing billing data found",
          type: "info",
        });
      }
    } catch (error: any) {
      console.log("Error loading billing data:", error);
      // Don't show error toast for 404/not found cases as this is normal
      if (
        error.message &&
        !error.message.includes("404") &&
        !error.message.includes("not found")
      ) {
        setToast({
          message: error.message || "Error loading billing data",
          type: "error",
        });
      }
    }
  };

  const fetchPaymentData = async () => {
    try {
      // Get customer ID from localStorage
      const loggedInUser = localStorage.getItem("loggedInUser");
      let customerId;

      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        customerId = userData.id;
      }

      if (!customerId) {
        throw new Error("Customer ID not found in localStorage");
      }

      const response = await ApiHandler.request(
        `/api/customer/show-payment-info/${customerId}`,
        "GET",
        null,
        null,
        null,
        true
      );

      if (response.success && response.data) {
        const paymentData = response.data;

        // Map API response to form values
        const mappedData = {
          paymentMethod: paymentData.payment_method
            ? paymentData.payment_method.toString()
            : "", // No default - only set if returned from API
        };

        setPaymentFormValues({
          ...paymentFormValues,
          ...mappedData,
        });

        // Track which payment fields are pre-filled and should be read-only
        const filledPaymentFields: Record<string, boolean> = {};
        if (paymentData.payment_method) {
          filledPaymentFields.paymentMethod = true;
        }
        setPreFilledFields((prev) => ({ ...prev, ...filledPaymentFields }));

        setToast({
          message: "Payment data loaded successfully",
          type: "success",
        });
      } else {
        // No payment data found - use default
        console.log("No payment data found, using default values");
        setToast({
          message: "No existing payment data found",
          type: "info",
        });
      }
    } catch (error: any) {
      console.log("Error loading payment data:", error);
      // Don't show error toast for 404/not found cases as this is normal
      if (
        error.message &&
        !error.message.includes("404") &&
        !error.message.includes("not found")
      ) {
        setToast({
          message: error.message || "Error loading payment data",
          type: "error",
        });
      }
    }
  };

  // Silent data fetching functions (without loading state and toasts)
  const fetchBillingDataSilent = async () => {
    console.log("fetchBillingDataSilent function called");
    try {
      // Get customer ID from localStorage
      const loggedInUser = localStorage.getItem("loggedInUser");
      console.log(
        "Silent fetch - loggedInUser from localStorage:",
        loggedInUser
      );
      let customerId;

      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        customerId = userData.id;
      }

      if (!customerId) {
        throw new Error("Customer ID not found in localStorage");
      }

      const response = await ApiHandler.request(
        `/api/customer/show-billing-info/${customerId}`,
        "GET",
        null,
        null,
        null,
        true
      );

      if (response.success && response.data) {
        const billingData = response.data;

        // Store billing info ID for update logic
        setBillingInfoId(billingData.id ? billingData.id.toString() : null);

        // Map API response to form values
        const mappedData = {
          firstName: billingData.first_name || "",
          lastName: billingData.last_name || "",
          firstNameKana: billingData.first_name_kana || "",
          lastNameKana: billingData.last_name_kana || "",
          phone1: billingData.phone1 || "",
          phone2: billingData.phone2 || "",
          phone3: billingData.phone3 || "",
          email1: billingData.email1 || "",
          email2: billingData.email2 || "",
          postalCode: billingData.post_code || "",
          prefecture: billingData.prefecture_id
            ? billingData.prefecture_id.toString()
            : "",
          address1: billingData.address1 || "",
          address2: billingData.address2 || "",
          building: billingData.apartment_name || "",
          billingType: billingData.billing_contact_info
            ? billingData.billing_contact_info.toString()
            : "2",
        };

        setBillingFormValues({
          ...billingFormValues,
          ...mappedData,
        });

        // Store original billing data (excluding billingType)
        const originalData = {
          firstName: mappedData.firstName,
          lastName: mappedData.lastName,
          firstNameKana: mappedData.firstNameKana,
          lastNameKana: mappedData.lastNameKana,
          phone1: mappedData.phone1,
          phone2: mappedData.phone2,
          phone3: mappedData.phone3,
          email1: mappedData.email1,
          email2: mappedData.email2,
          postalCode: mappedData.postalCode,
          prefecture: mappedData.prefecture,
          address1: mappedData.address1,
          address2: mappedData.address2,
          building: mappedData.building,
        };
        setOriginalBillingData(originalData);

        // Track which billing fields were pre-filled from API
        const filledBillingFields: Record<string, boolean> = {};
        Object.keys(originalData).forEach((key) => {
          if (originalData[key as keyof typeof originalData]) {
            filledBillingFields[key] = true;
          }
        });

        // Also track if billingType was pre-filled from API
        if (billingData.billing_contact_info) {
          filledBillingFields.billingType = true;
        }

        setPreFilledBillingFields(filledBillingFields);
      } else {
        // No billing data found - this is normal for new customers
        console.log("No billing data found in silent fetch");
      }
    } catch (error: any) {
      console.log("Error loading billing data silently:", error);
    }
  };

  const fetchPaymentDataSilent = async () => {
    try {
      // Get customer ID from localStorage
      const loggedInUser = localStorage.getItem("loggedInUser");
      let customerId;

      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        customerId = userData.id;
      }

      if (!customerId) {
        throw new Error("Customer ID not found in localStorage");
      }

      const response = await ApiHandler.request(
        `/api/customer/show-payment-info/${customerId}`,
        "GET",
        null,
        null,
        null,
        true
      );

      if (response.success && response.data) {
        const paymentData = response.data;

        // Map API response to form values
        const mappedData = {
          paymentMethod: paymentData.payment_method
            ? paymentData.payment_method.toString()
            : "", // No default - only set if returned from API
        };

        setPaymentFormValues({
          ...paymentFormValues,
          ...mappedData,
        });

        // Track which payment fields are pre-filled and should be read-only (for silent fetch)
        const filledPaymentFields: Record<string, boolean> = {};
        if (paymentData.payment_method) {
          filledPaymentFields.paymentMethod = true;
        }
        setPreFilledFields((prev) => ({ ...prev, ...filledPaymentFields }));
      } else {
        // No payment data found - use default
        console.log("No payment data found in silent fetch");
      }
    } catch (error: any) {
      console.log("Error loading payment data silently:", error);
    }
  };

  const handleSubmit = async (formType: "customer" | "billing" | "payment") => {
    setIsSubmitting(true);
    try {
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

        // Get customer ID from localStorage
        const loggedInUser = localStorage.getItem("loggedInUser");
        let customerId;

        if (loggedInUser) {
          const userData = JSON.parse(loggedInUser);
          customerId = userData.id;
        }

        if (!customerId) {
          throw new Error("Customer ID not found in localStorage");
        }

        // Prepare form data for customer update API
        const formData = new FormData();
        formData.append("customer_id", customerId.toString());
        formData.append("first_name", customerFormValues.firstName);
        formData.append("last_name", customerFormValues.lastName);
        formData.append("first_name_kana", customerFormValues.firstNameKana);
        formData.append("last_name_kana", customerFormValues.lastNameKana);
        formData.append("represents_id", customerId.toString());
        formData.append("dob_year", customerFormValues.birthYear);
        formData.append("dob_month", customerFormValues.birthMonth);
        formData.append("dob_day", customerFormValues.birthDay);
        formData.append("age", customerFormValues.age);
        formData.append("gender", customerFormValues.gender);
        formData.append("phone1_type", "");
        formData.append("phone1", customerFormValues.phone1);
        formData.append("phone2_type", "");
        formData.append("phone2", customerFormValues.phone2);
        formData.append("phone3_type", "");
        formData.append("phone3", customerFormValues.phone3);
        formData.append("email1", customerFormValues.email1);
        formData.append("email2", customerFormValues.email2);
        formData.append("primary_contact_phone", "phone1");
        formData.append("primary_contact_email", "");
        formData.append("post_code", customerFormValues.postalCode);
        formData.append("prefecture_id", customerFormValues.prefecture);
        formData.append("address1", customerFormValues.address1);
        formData.append("address2", customerFormValues.address2);
        formData.append("apartment_name", customerFormValues.building);
        formData.append("language", customerFormValues.language);
        formData.append("newsletter_emails", customerFormValues.advertising);

        // Add station details
        if (customerFormValues.railwayCompany1) {
          formData.append(
            "station_details[0][company]",
            customerFormValues.railwayCompany1
          );
          formData.append(
            "station_details[0][route_name]",
            customerFormValues.trainLine1
          );
          formData.append(
            "station_details[0][nearest_station]",
            customerFormValues.trainStation1
          );
        }
        if (customerFormValues.railwayCompany2) {
          formData.append(
            "station_details[1][company]",
            customerFormValues.railwayCompany2
          );
          formData.append(
            "station_details[1][route_name]",
            customerFormValues.trainLine2
          );
          formData.append(
            "station_details[1][nearest_station]",
            customerFormValues.trainStation2
          );
        }

        const response = await ApiHandler.request(
          "/api/customer/first-time-info/update",
          "POST",
          formData,
          null,
          null,
          true
        );

        if (response.success) {
          // Mark all submitted fields as pre-filled after successful submission
          const submittedFields = Object.keys(customerFormValues).reduce(
            (acc, key) => {
              if (customerFormValues[key as keyof typeof customerFormValues]) {
                acc[key] = true;
              }
              return acc;
            },
            {} as Record<string, boolean>
          );
          setPreFilledFields((prev) => ({ ...prev, ...submittedFields }));

          setToast({
            message: "Customer information updated successfully",
            type: "success",
          });

          // Auto-open next accordion after successful save
          const currentIndex = 0;
          openNextAccordion(currentIndex);
        } else {
          throw new Error(response.message || "Update failed");
        }
      } else if (formType === "billing") {
        // Handle billing form submission
        // Get customer ID from localStorage
        const loggedInUser = localStorage.getItem("loggedInUser");
        let customerId;

        if (loggedInUser) {
          const userData = JSON.parse(loggedInUser);
          customerId = userData.id;
        }

        if (!customerId) {
          throw new Error("Customer ID not found in localStorage");
        }

        // Prepare form data for billing update API
        const formData = new FormData();
        formData.append("id", billingInfoId || "_new"); // Use existing ID or "_new" for new billing info
        formData.append("customer_id", customerId.toString());
        formData.append("reimbursement_payee", billingFormValues.billingType);

        // Only send billing details if "different from customer" is selected
        if (billingFormValues.billingType === "2") {
          formData.append("first_name", billingFormValues.firstName);
          formData.append("last_name", billingFormValues.lastName);
          formData.append("first_name_kana", billingFormValues.firstNameKana);
          formData.append("last_name_kana", billingFormValues.lastNameKana);
          formData.append("phone1_type", "");
          formData.append("phone1", billingFormValues.phone1);
          formData.append("phone2_type", "");
          formData.append("phone2", billingFormValues.phone2);
          formData.append("phone3_type", "");
          formData.append("phone3", billingFormValues.phone3);
          formData.append("email1", billingFormValues.email1);
          formData.append("email2", billingFormValues.email2);
          formData.append("primary_contact_phone", "phone1");
          formData.append("primary_contact_email", "");
          formData.append("post_code", billingFormValues.postalCode);
          formData.append("prefecture_id", billingFormValues.prefecture);
          formData.append("address1", billingFormValues.address1);
          formData.append("address2", billingFormValues.address2);
          formData.append("apartment_name", billingFormValues.building);
        }

        const response = await ApiHandler.request(
          "/api/customer/first-time-billing-info/update",
          "POST",
          formData,
          null,
          null,
          true
        );

        if (response.success) {
          // Mark submitted billing fields as pre-filled after successful submission
          const submittedBillingFields = Object.keys(billingFormValues).reduce(
            (acc, key) => {
              if (
                key !== "billingType" &&
                billingFormValues[key as keyof typeof billingFormValues]
              ) {
                acc[key] = true;
              }
              return acc;
            },
            {} as Record<string, boolean>
          );

          // Also mark billingType as pre-filled
          submittedBillingFields.billingType = true;

          setPreFilledBillingFields((prev) => ({
            ...prev,
            ...submittedBillingFields,
          }));

          setToast({
            message: "Billing information updated successfully",
            type: "success",
          });

          // Auto-open next accordion after successful save
          const currentIndex = 1;
          openNextAccordion(currentIndex);
        } else {
          throw new Error(response.message || "Billing update failed");
        }
      } else if (formType === "payment") {
        // Handle payment form submission
        // Get customer ID from localStorage
        const loggedInUser = localStorage.getItem("loggedInUser");
        let customerId;

        if (loggedInUser) {
          const userData = JSON.parse(loggedInUser);
          customerId = userData.id;
        }

        if (!customerId) {
          throw new Error("Customer ID not found in localStorage");
        }

        // Prepare form data for payment update API
        const formData = new FormData();
        formData.append("customer_id", customerId.toString());
        formData.append("payment_method", paymentFormValues.paymentMethod);

        const response = await ApiHandler.request(
          "/api/customer/first-time-payment-info/update",
          "POST",
          formData,
          null,
          null,
          true
        );

        if (response.success) {
          // Mark payment method as pre-filled after successful submission
          setPreFilledFields((prev) => ({ ...prev, paymentMethod: true }));

          setToast({
            message: "Payment information updated successfully",
            type: "success",
          });

          // Auto-open next accordion after successful save (or close if last)
          const currentIndex = 2;
          openNextAccordion(currentIndex);
        } else {
          throw new Error(response.message || "Payment update failed");
        }
      }
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

  // Update billing form when customer form changes if billing type is "same_as_customer"
  React.useEffect(() => {
    if (billingFormValues.billingType === "1") {
      // 1 = same_as_customer
      setBillingFormValues((prev) => ({
        ...customerFormValues,
        billingType: "1",
      }));
    }
  }, [customerFormValues, billingFormValues.billingType]);

  const handleBillingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "billingType") {
      if (value === "1") {
        // 1 = same_as_customer
        // Copy customer information to billing form but keep the billingType
        setBillingFormValues({
          ...customerFormValues,
          billingType: "1",
        });
      } else {
        // 2 = different_from_customer - always restore original billing data
        // Don't use customer data as fallback when switching radio buttons
        console.log(
          "Switching to different from customer - restoring original billing data:",
          originalBillingData
        );
        setBillingFormValues({
          ...originalBillingData,
          billingType: value,
        });
      }
    } else {
      // Only allow changes if billingType is "different_from_customer"
      if (billingFormValues.billingType === "2") {
        // 2 = different_from_customer
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

      <h1 className={styleHeader.topHeading}>{t("cnInfo.orderForm")}</h1>
      <div className="d-flex flex-column gap-2">
        <Accordion openIndex={accordionState} onToggle={handleAccordionToggle}>
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
                        readOnly={preFilledFields.lastName}
                      />
                      <InputField
                        name="firstName"
                        placeholder={t("aboutPage.firstNamePlaceholder")}
                        value={customerFormValues.firstName}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }]}
                        icon={<FaUser size={12} />}
                        readOnly={preFilledFields.firstName}
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
                        readOnly={preFilledFields.lastNameKana}
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
                        readOnly={preFilledFields.firstNameKana}
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
                      readOnly={preFilledFields.phone1}
                    />
                    <InputField
                      name="phone2"
                      placeholder={t("aboutPage.phone2Placeholder")}
                      value={customerFormValues.phone2}
                      onChange={(e) => handleInputChange("customer", e)}
                      icon={<FaPhone size={12} />}
                      readOnly={preFilledFields.phone2}
                    />
                    <InputField
                      name="phone3"
                      placeholder={t("aboutPage.phone3Placeholder")}
                      value={customerFormValues.phone3}
                      onChange={(e) => handleInputChange("customer", e)}
                      icon={<FaPhone size={12} />}
                      readOnly={preFilledFields.phone3}
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
                      readOnly={preFilledFields.email1}
                    />
                    <InputField
                      name="email2"
                      placeholder={t("aboutPage.email2Placeholder")}
                      type="email"
                      value={customerFormValues.email2}
                      onChange={(e) => handleInputChange("customer", e)}
                      validations={[{ type: "email" }]}
                      icon={<MdOutlineAlternateEmail size={12} />}
                      readOnly={preFilledFields.email2}
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
                        readOnly={preFilledFields.postalCode}
                      />
                      <SelectField
                        name="prefecture"
                        placeholder={t("aboutPage.prefecturePlaceholder")}
                        options={dropdownOptions.prefectures}
                        value={customerFormValues.prefecture}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }]}
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={preFilledFields.prefecture}
                      />
                    </div>
                    <InputField
                      name="address1"
                      placeholder={t("aboutPage.address1Placeholder")}
                      value={customerFormValues.address1}
                      onChange={(e) => handleInputChange("customer", e)}
                      validations={[{ type: "required" }]}
                      icon={<BiHomeAlt2 size={12} />}
                      readOnly={preFilledFields.address1}
                    />
                    <InputField
                      name="address2"
                      placeholder={t("aboutPage.address2Placeholder")}
                      value={customerFormValues.address2}
                      onChange={(e) => handleInputChange("customer", e)}
                      icon={<BiHomeAlt2 size={12} />}
                      readOnly={preFilledFields.address2}
                    />
                    <InputField
                      name="building"
                      placeholder={t("aboutPage.buildingPlaceholder")}
                      value={customerFormValues.building}
                      onChange={(e) => handleInputChange("customer", e)}
                      icon={<BiHomeAlt2 size={12} />}
                      readOnly={preFilledFields.building}
                      validations={[{ type: "required" }]}
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
                      <InputField
                        name="railwayCompany1"
                        placeholder={t("aboutPage.railwayCompany1Placeholder")}
                        value={customerFormValues.railwayCompany1}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }]}
                        icon={<MdOutlineTrain size={12} />}
                        readOnly={preFilledFields.railwayCompany1}
                      />
                      <InputField
                        name="trainLine1"
                        placeholder={t("aboutPage.trainLine1Placeholder")}
                        value={customerFormValues.trainLine1}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }]}
                        icon={<MdOutlineTrain size={12} />}
                        readOnly={preFilledFields.trainLine1}
                      />
                      <InputField
                        name="trainStation1"
                        placeholder={t("aboutPage.trainStation1Placeholder")}
                        value={customerFormValues.trainStation1}
                        onChange={(e) => handleInputChange("customer", e)}
                        validations={[{ type: "required" }]}
                        icon={<MdOutlineTrain size={12} />}
                        readOnly={preFilledFields.trainStation1}
                      />
                    </div>
                    <div className={styles.stationGroup}>
                      <InputField
                        name="railwayCompany2"
                        placeholder={t("aboutPage.railwayCompany2Placeholder")}
                        value={customerFormValues.railwayCompany2}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<MdOutlineTrain size={12} />}
                        readOnly={preFilledFields.railwayCompany2}
                      />
                      <InputField
                        name="trainLine2"
                        placeholder={t("aboutPage.trainLine2Placeholder")}
                        value={customerFormValues.trainLine2}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<MdOutlineTrain size={12} />}
                        readOnly={preFilledFields.trainLine2}
                      />
                      <InputField
                        name="trainStation2"
                        placeholder={t("aboutPage.trainStation2Placeholder")}
                        value={customerFormValues.trainStation2}
                        onChange={(e) => handleInputChange("customer", e)}
                        icon={<MdOutlineTrain size={12} />}
                        readOnly={preFilledFields.trainStation2}
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
                      options={
                        dropdownOptions.genders || [
                          { label: t("aboutPage.male"), value: "male" },
                          { label: t("aboutPage.female"), value: "female" },
                          { label: t("aboutPage.other"), value: "other" },
                        ]
                      }
                      selectedValue={customerFormValues.gender}
                      onChange={(e) => handleInputChange("customer", e)}
                      className={styles.radioGroup}
                      disabled={preFilledFields.gender}
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
                      disabled={preFilledFields.birthYear}
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
                      disabled={preFilledFields.birthMonth}
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
                      disabled={preFilledFields.birthDay}
                    />
                    <InputField
                      name="age"
                      placeholder={t("aboutPage.agePlaceholder")}
                      value={customerFormValues.age}
                      onChange={(e) => handleInputChange("customer", e)}
                      icon={<SlCalender size={12} />}
                      disabled={true}
                      readOnly={preFilledFields.age}
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
                    disabled={preFilledFields.language}
                  />
                  {/* Advertising Email Section */}
                  <div className={styles.label}>
                    {t("aboutPage.advertisingEmailLabel")}
                  </div>
                  <RadioField
                    name="advertising"
                    options={
                      dropdownOptions.newsletter.length > 0
                        ? dropdownOptions.newsletter
                        : [
                            {
                              label: t("aboutPage.subscribe"),
                              value: "subscribe",
                            },
                            {
                              label: t("aboutPage.unsubscribe"),
                              value: "unsubscribe",
                            },
                          ]
                    }
                    selectedValue={customerFormValues.advertising}
                    onChange={(e) => handleInputChange("customer", e)}
                    className={styles.radioGroup}
                    disabled={preFilledFields.advertising}
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
                      options={
                        dropdownOptions.billingContactType.length > 0
                          ? dropdownOptions.billingContactType
                          : [
                              {
                                label: t("cnInfo.same_as_customer"),
                                value: "1",
                              },
                              {
                                label: t("cnInfo.different_from_customer"),
                                value: "2",
                              },
                            ]
                      }
                      selectedValue={billingFormValues.billingType}
                      onChange={handleBillingInputChange}
                      className={styles.radioGroup}
                      disabled={preFilledBillingFields.billingType}
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
                        validations={
                          billingFormValues.billingType === "2"
                            ? [{ type: "required" }]
                            : undefined
                        }
                        icon={<FaUser size={12} />}
                        readOnly={
                          billingFormValues.billingType === "1" ||
                          (billingFormValues.billingType === "2" &&
                            preFilledBillingFields.lastName)
                        }
                      />
                      <InputField
                        name="firstName"
                        placeholder={t("aboutPage.firstNamePlaceholder")}
                        value={billingFormValues.firstName}
                        onChange={handleBillingInputChange}
                        validations={
                          billingFormValues.billingType === "2"
                            ? [{ type: "required" }]
                            : undefined
                        }
                        icon={<FaUser size={12} />}
                        readOnly={
                          billingFormValues.billingType === "1" ||
                          (billingFormValues.billingType === "2" &&
                            preFilledBillingFields.firstName)
                        }
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
                        validations={
                          billingFormValues.billingType === "2"
                            ? [{ type: "required" }]
                            : undefined
                        }
                        icon={<FaUser size={12} />}
                        readOnly={
                          billingFormValues.billingType === "1" ||
                          (billingFormValues.billingType === "2" &&
                            preFilledBillingFields.lastNameKana)
                        }
                      />
                      <InputField
                        name="firstNameKana"
                        placeholder={
                          t("aboutPage.firstNamePlaceholder") + " (Kana)"
                        }
                        value={billingFormValues.firstNameKana}
                        onChange={handleBillingInputChange}
                        validations={
                          billingFormValues.billingType === "2"
                            ? [{ type: "required" }]
                            : undefined
                        }
                        icon={<FaUser size={12} />}
                        readOnly={
                          billingFormValues.billingType === "1" ||
                          (billingFormValues.billingType === "2" &&
                            preFilledBillingFields.firstNameKana)
                        }
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
                      validations={
                        billingFormValues.billingType === "2"
                          ? [{ type: "required" }]
                          : undefined
                      }
                      icon={<FaPhone size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.phone1)
                      }
                    />
                    <InputField
                      name="phone2"
                      placeholder={t("aboutPage.phone2Placeholder")}
                      value={billingFormValues.phone2}
                      onChange={handleBillingInputChange}
                      icon={<FaPhone size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.phone2)
                      }
                    />
                    <InputField
                      name="phone3"
                      placeholder={t("aboutPage.phone3Placeholder")}
                      value={billingFormValues.phone3}
                      onChange={handleBillingInputChange}
                      icon={<FaPhone size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.phone3)
                      }
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
                      validations={
                        billingFormValues.billingType === "2"
                          ? [{ type: "required" }, { type: "email" }]
                          : undefined
                      }
                      icon={<MdOutlineAlternateEmail size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.email1)
                      }
                    />
                    <InputField
                      name="email2"
                      placeholder={t("aboutPage.email2Placeholder")}
                      type="email"
                      value={billingFormValues.email2}
                      onChange={handleBillingInputChange}
                      validations={
                        billingFormValues.billingType === "2"
                          ? [{ type: "email" }]
                          : undefined
                      }
                      icon={<MdOutlineAlternateEmail size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.email2)
                      }
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
                        validations={
                          billingFormValues.billingType === "2"
                            ? [{ type: "required" }]
                            : undefined
                        }
                        icon={<MdOutlineHomeWork size={12} />}
                        readOnly={
                          billingFormValues.billingType === "1" ||
                          (billingFormValues.billingType === "2" &&
                            preFilledBillingFields.postalCode)
                        }
                      />
                      <SelectField
                        name="prefecture"
                        placeholder={t("aboutPage.prefecturePlaceholder")}
                        options={dropdownOptions.prefectures}
                        value={billingFormValues.prefecture}
                        onChange={handleBillingInputChange}
                        validations={
                          billingFormValues.billingType === "2"
                            ? [{ type: "required" }]
                            : undefined
                        }
                        icon={<BiHomeAlt2 size={12} />}
                        disabled={
                          billingFormValues.billingType === "1" ||
                          (billingFormValues.billingType === "2" &&
                            preFilledBillingFields.prefecture)
                        }
                      />
                    </div>
                    <InputField
                      name="address1"
                      placeholder={t("aboutPage.address1Placeholder")}
                      value={billingFormValues.address1}
                      onChange={handleBillingInputChange}
                      validations={
                        billingFormValues.billingType === "2"
                          ? [{ type: "required" }]
                          : undefined
                      }
                      icon={<BiHomeAlt2 size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.address1)
                      }
                    />
                    <InputField
                      name="address2"
                      placeholder={t("aboutPage.address2Placeholder")}
                      value={billingFormValues.address2}
                      onChange={handleBillingInputChange}
                      icon={<BiHomeAlt2 size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.address2)
                      }
                    />
                    <InputField
                      name="building"
                      placeholder={t("aboutPage.buildingPlaceholder")}
                      value={billingFormValues.building}
                      onChange={handleBillingInputChange}
                      icon={<BiHomeAlt2 size={12} />}
                      readOnly={
                        billingFormValues.billingType === "1" ||
                        (billingFormValues.billingType === "2" &&
                          preFilledBillingFields.building)
                      }
                      validations={
                        billingFormValues.billingType === "2"
                          ? [{ type: "required" }]
                          : undefined
                      }
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
                      options={dropdownOptions.paymentMethods}
                      selectedValue={paymentFormValues.paymentMethod}
                      onChange={(e) => handleInputChange("payment", e)}
                      className={styles.radioGroup}
                      disabled={preFilledFields.paymentMethod}
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
    </>
  );
}
