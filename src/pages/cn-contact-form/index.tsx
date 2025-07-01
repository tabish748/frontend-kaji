import Button from "@/components/button/button";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import ClientSection from "@/components/client-section/client-section";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import Toast from "@/components/toast/toast";
import { useLanguage } from "@/localization/LocalContext";
import React, { ChangeEvent, useState, useEffect } from "react";
import { FaPhone } from "react-icons/fa";
import styles from "@/styles/pages/cnabout.module.scss";
import {
  MdOutlineAlternateEmail,
  MdOutlineHomeWork,
  MdOutlineTrain,
} from "react-icons/md";
import { BiCalendar, BiHomeAlt2 } from "react-icons/bi";
import ClientLayout from "@/components/dashboard-layout/client-layout";
import styleHeader from "@/styles/pages/cnChangePaymentMethod.module.scss";
import styleNav from "@/styles/components/organisms/client-layout.module.scss";
import Image from "next/image";
import ApiHandler from "@/app/api-handler";
import GlobalLoader from "@/components/global-loader/global-loader";

// Define interfaces for API response
interface DropdownOption {
  value: number;
  label: string;
}

interface DropdownData {
  language: DropdownOption[];
  gender: DropdownOption[];
  phone_types: DropdownOption[];
  services: DropdownOption[];
  prefectures: DropdownOption[];
  newsletter: DropdownOption[];
}

export default function CnAbout() {
  const { t } = useLanguage();

  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);
  
  // State for dynamic dropdown options
  const [dropdownOptions, setDropdownOptions] = useState<DropdownData>({
    language: [],
    gender: [],
    phone_types: [],
    services: [],
    prefectures: [],
    newsletter: []
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastname: "",
    phone1: "",
    phone2: "",
    phoneType1: "1", // Default to first phone type
    phoneType2: "2", // Default to second phone type
    email1: "",
    postalCode: "",
    prefecture: "",
    address1: "",
    building: "",
    railwayCompany1: "",
    trainLine1: "",
    trainStation1: "",
    gender: "1", // Default to first gender option
    language: "1", // Default to first language option
    advertising: "1", // Default to first newsletter option
    firstServiceDate: "",
    selectedServices: [] as number[],
    otherRequests: "",
    newsletterEmails: "1",
    discoveredChev: "",
  });

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const response = await ApiHandler.request(
          '/api/public-inquiry-form-dropdowns',
          'GET',
          null,
          null,
          null,
          false // This is a public endpoint
        );
        
        if (response.success && response.data) {
          setDropdownOptions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown options:", error);
        setToast({
          message: "Failed to load form options. Please refresh the page.",
          type: "fail"
        });
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchDropdownOptions();
  }, []);

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

  // Handle service selection
  const handleServiceChange = (selectedValues: string[]) => {
    const serviceNumbers = selectedValues.map(value => parseInt(value));
    setFormValues(prev => ({ ...prev, selectedServices: serviceNumbers }));
  };

  // Handle advertising radio change
  const handleAdvertisingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormValues(prev => ({ ...prev, advertising: value, newsletterEmails: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Map form data to API structure
      const apiData = {
        first_name: formValues.firstName,
        last_name: formValues.lastname,
        first_service_requested_date: formValues.firstServiceDate,
        post_code: formValues.postalCode,
        prefecture_id: parseInt(formValues.prefecture) || 1,
        address1: formValues.address1,
        apartment_name: formValues.building,
        phone_type1: formValues.phoneType1,
        phone1: formValues.phone1,
        phone_type2: formValues.phoneType2,
        phone2: formValues.phone2,
        email1: formValues.email1,
        services: {
          1: formValues.selectedServices.includes(1) ? 1 : "",
          2: formValues.selectedServices.includes(2) ? 2 : "",
          3: formValues.selectedServices.includes(3) ? 3 : "",
          4: formValues.selectedServices.includes(4) ? 4 : "",
          5: formValues.selectedServices.includes(5) ? 5 : "",
          6: formValues.selectedServices.includes(6) ? 6 : "",
        },
        station_company: formValues.railwayCompany1,
        route_name: formValues.trainLine1,
        nearest_station: formValues.trainStation1,
        other_service_requests: formValues.otherRequests,
        newsletter_emails: formValues.newsletterEmails,
        discovered_chev: formValues.discoveredChev,
      };

      const response = await ApiHandler.request(
        '/api/customer/first-inquiry',
        'POST',
        apiData,
        null,
        null,
        false // Set to false if this endpoint doesn't require authentication
      );

      setToast({
        message: response.message || "Inquiry submitted successfully!",
        type: "success"
      });

      // Reset form after successful submission
      setFormValues({
        firstName: "",
        lastname: "",
        phone1: "",
        phone2: "",
        phoneType1: "1",
        phoneType2: "2",
        email1: "",
        postalCode: "",
        prefecture: "",
        address1: "",
        building: "",
        railwayCompany1: "",
        trainLine1: "",
        trainStation1: "",
        gender: "1",
        language: "1",
        advertising: "1",
        firstServiceDate: "",
        selectedServices: [],
        otherRequests: "",
        newsletterEmails: "1",
        discoveredChev: "",
      });

    } catch (error: any) {
      console.error("Submission error:", error);
      
      if (error.errors) {
        // Handle validation errors from API
        setErrors(error.errors);
        setToast({
          message: Array.isArray(error.errors) ? error.errors : [error.message || "Please check the form for errors"],
          type: "fail"
        });
      } else {
        setToast({
          message: error.message || "An error occurred while submitting the inquiry",
          type: "fail"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className={styleHeader.topHeading}> {t("cncontactform.contactForm")} </h1>
        <Form
          onSubmit={handleSubmit}
          setErrors={setErrors}
          errors={errors}
          className="d-flex flex-column gap-2"
        >
          <ClientSection heading={t("aboutPage.customerInfo")}>
            <div className={`${styles.formGrid} ${styles.customerForm}`}>
              {/* Name Section */}
              <div className={styles.label}>{t("aboutPage.nameLabel")} <span className="cn-labelWarn"> {t("cncontactform.required")} </span> </div>
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
                  />
                  <InputField
                    name="lastname"
                    placeholder={t("cncontactform.lastnamePlaceholder")}
                    value={formValues.lastname}
                    onChange={handleInputChange}
                    validations={[{ type: "required" }]}
                    errorText={errors["lastname"] || undefined}
                    icon={"abc"}
                  />
                </div>
              </div>

              {/* Phone Section */}
              <div className={styles.label}>{t("aboutPage.phoneLabel")} <span className="cn-labelWarn"> {t("cncontactform.required")} </span> </div>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldRow}>
                  <SelectField
                    name="phoneType1"
                    placeholder="Phone Type"
                    options={dropdownOptions.phone_types.map(type => ({
                      label: type.label,
                      value: type.value.toString()
                    }))}
                    value={formValues.phoneType1}
                    onChange={handleInputChange}
                    icon={<FaPhone size={12} />}
                  />
                  <InputField
                    name="phone1"
                    placeholder={t("aboutPage.phone1Placeholder")}
                    value={formValues.phone1}
                    onChange={handleInputChange}
                    validations={[{ type: "required" }]}
                    errorText={errors["phone1"] || undefined}
                    icon={<FaPhone size={12} />}
                  />
                </div>
                <div className={styles.fieldRow}>
                  <SelectField
                    name="phoneType2"
                    placeholder="Phone Type"
                    options={dropdownOptions.phone_types.map(type => ({
                      label: type.label,
                      value: type.value.toString()
                    }))}
                    value={formValues.phoneType2}
                    onChange={handleInputChange}
                    icon={<FaPhone size={12} />}
                  />
                  <InputField
                    name="phone2"
                    placeholder={t("aboutPage.phone2Placeholder")}
                    value={formValues.phone2}
                    onChange={handleInputChange}
                    icon={<FaPhone size={12} />}
                  />
                </div>
              </div>

              {/* Email Section */}
              <div className={styles.label}>{t("aboutPage.emailLabel")} <span className="cn-labelWarn"> {t("cncontactform.required")} </span> </div>
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
                />
              </div>

              {/* Address Section */}
              <div className={styles.label}>{t("aboutPage.addressLabel")} <span className="cn-labelWarn"> {t("cncontactform.required")} </span> </div>
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
                  />
                  <SelectField
                    name="prefecture"
                    placeholder={t("aboutPage.prefecturePlaceholder")}
                    options={dropdownOptions.prefectures.map(pref => ({
                      label: pref.label,
                      value: pref.value.toString()
                    }))}
                    value={formValues.prefecture}
                    onChange={handleInputChange}
                    validations={[{ type: "required" }]}
                    errorText={errors["prefecture"] || undefined}
                    icon={<BiHomeAlt2 size={12} />}
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
                />
                <InputField
                  name="building"
                  placeholder={t("aboutPage.buildingPlaceholder")}
                  value={formValues.building}
                  onChange={handleInputChange}
                  icon={<BiHomeAlt2 size={12} />}
                  validations={[{ type: "required" }]}
                  errorText={errors["building"] || undefined}
                />
              </div>

              {/* Train Station Section */}
              <div className={styles.label}>
                {t("aboutPage.trainStationLabel")} <span className="cn-labelWarn"> {t("cncontactform.required")} </span>
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.stationGroup}>
                  <InputField
                    name="railwayCompany1"
                    placeholder={t("aboutPage.railwayCompany1Placeholder")}
                    value={formValues.railwayCompany1}
                    onChange={handleInputChange}
                    validations={[{ type: "required" }]}
                    errorText={errors["railwayCompany1"] || undefined}
                    icon={<MdOutlineTrain size={12} />}
                  />
                  <InputField
                    name="trainLine1"
                    placeholder={t("aboutPage.trainLine1Placeholder")}
                    value={formValues.trainLine1}
                    onChange={handleInputChange}
                    validations={[{ type: "required" }]}
                    errorText={errors["trainLine1"] || undefined}
                    icon={<MdOutlineTrain size={12} />}
                  />
                  <InputField
                    name="trainStation1"
                    placeholder={t("aboutPage.trainStation1Placeholder")}
                    value={formValues.trainStation1}
                    onChange={handleInputChange}
                    validations={[{ type: "required" }]}
                    errorText={errors["trainStation1"] || undefined}
                    icon={<MdOutlineTrain size={12} />}
                  />
                </div>
              </div>

              {/* Gender Section */}
              <div className={styles.label}>{t("aboutPage.genderLabel")} <span className="cn-labelWarn"> {t("cncontactform.required")} </span> </div>
              <RadioField
                name="gender"
                options={dropdownOptions.gender.map(gender => ({
                  label: gender.label,
                  value: gender.value.toString()
                }))}
                selectedValue={formValues.gender}
                onChange={handleInputChange}
                className={styles.radioGroup}
              />

              {/* Language Section */}
              <div className={styles.label}>{t("aboutPage.languageLabel")} <span className="cn-labelWarn"> {t("cncontactform.required")} </span> </div>
              <div className={styles.fieldGroup}>
                <SelectField
                  name="language"
                  placeholder={t("aboutPage.languagePlaceholder")}
                  options={dropdownOptions.language.map(lang => ({
                    label: lang.label,
                    value: lang.value.toString()
                  }))}
                  value={formValues.language}
                  onChange={handleInputChange}
                  validations={[{ type: "required" }]}
                  errorText={errors["language"] || undefined}
                  icon={<BiHomeAlt2 size={12} />}
                />
              </div>
            </div>
          </ClientSection>

          {/* Preferred Service Section */}
          <ClientSection heading={t("cncontactform.preferredService")}>
            <div className={`${styles.formGrid} ${styles.customerForm}`}>
              {/* First Preferred Service Date */}
              <div className={styles.label}>
                {t("cncontactform.firstPreferredServiceDate")}
              </div>
              <div className={styles.fieldGroup}>
                <InputField
                  name="firstServiceDate"
                  type="date"
                  value={formValues.firstServiceDate}
                  onChange={handleInputChange}
                  icon={<BiCalendar size={12} />}
                />
              </div>

              {/* Service Selection */}
              <div className={styles.label}>{t("cncontactform.service")}</div>
              <div className={styles.fieldGroup}>
                <div className={styles.weekdayCheckboxes}>
                  <CheckboxField
                    name="preferredServices"
                    options={dropdownOptions.services.map(service => ({
                      value: service.value.toString(),
                      label: service.label
                    }))}
                    selectedValues={formValues.selectedServices.map(num => num.toString())}
                    onChange={handleServiceChange}
                    validations={[{ type: "required" }]}
                  />
                </div>
              </div>

              {/* Other Requests */}
              <div className={styles.label}>
                {t("cncontactform.otherRequests")}
              </div>
              <div className={styles.fieldGroup}>
                <InputField
                  name="otherRequests"
                  placeholder={t("cncontactform.otherRequests")}
                  value={formValues.otherRequests}
                  onChange={handleInputChange}
                  icon="abc"
                />
              </div>
            </div>
          </ClientSection>

          {/* Others Section */}
          <ClientSection heading={t("cncontactform.others")}>
            <div className={`${styles.formGrid} ${styles.customerForm}`}>
              {/* Advertising Email */}
              <div className={styles.label}>
                {t("cncontactform.advertisingEmail")}
              </div>
              <RadioField
                name="advertisingEmail"
                options={dropdownOptions.newsletter.map(option => ({
                  label: option.label,
                  value: option.value.toString()
                }))}
                selectedValue={formValues.advertising}
                onChange={handleAdvertisingChange}
                className={styles.radioGroup}
              />

              {/* How did you hear about Chez Vous */}
              <div className={styles.label}>
                {t("cncontactform.howDidYouHear")}
              </div>
              <div className={styles.fieldGroup}>
                <InputField
                  name="discoveredChev"
                  placeholder={t("cncontactform.howDidYouHearPlaceholder")}
                  value={formValues.discoveredChev}
                  onChange={handleInputChange}
                  icon="abc"
                />
              </div>
            </div>
          </ClientSection>

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <Button
              htmlType="submit"
              type="primary"
              text={isSubmitting ? t("buttons.submitting") || "Submitting..." : t("buttons.submit")}
              className="px-10"
              disabled={isSubmitting}
            />
          </div>
        </Form>
      </ClientLayout>
    </>
  );
}
