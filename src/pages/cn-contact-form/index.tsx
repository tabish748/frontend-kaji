import Button from "@/components/button/button";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import InputField from "@/components/input-field/input-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import Toast from "@/components/toast/toast";
import { useLanguage } from "@/localization/LocalContext";
import React, { ChangeEvent, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { FaUser, FaPhone, FaRegAddressCard } from "react-icons/fa";
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
import ClientLayout from "@/components/dashboard-layout/client-layout";
import styleHeader from "@/styles/pages/cnChangePaymentMethod.module.scss";
import styleNav from "@/styles/components/organisms/client-layout.module.scss";
import Image from "next/image";
import ApiHandler from "@/app/api-handler";

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
  const [billingFormErrors, setBillingFormErrors] = React.useState<
    Record<string, string | null>
  >({});
  const [paymentFormErrors, setPaymentFormErrors] = React.useState<
    Record<string, string | null>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);
  
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastname: "",
    phone1: "",
    phone2: "",
    phone3: "",
    phoneType1: "mobile",
    phoneType2: "landline",
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
    firstServiceDate: "",
    selectedServices: [] as number[],
    otherRequests: "",
    newsletterEmails: "1",
    discoveredChev: "",
  });

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
    const serviceNumbers = selectedValues.map(value => {
      switch(value) {
        case "housekeeping": return 1;
        case "babysitting": return 2;
        case "housecleaningPro": return 3;
        case "fulltime": return 4;
        case "others": return 5;
        default: return 0;
      }
    });
    setFormValues(prev => ({ ...prev, selectedServices: serviceNumbers }));
  };

  // Handle advertising radio change
  const handleAdvertisingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormValues(prev => ({ ...prev, advertising: value, newsletterEmails: value === "subscribe" ? "1" : "0" }));
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
          6: "",
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
        phone3: "",
        phoneType1: "mobile",
        phoneType2: "landline",
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
          type: "error"
        });
      } else {
        setToast({
          message: error.message || "An error occurred while submitting the inquiry",
          type: "error"
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
              <div className={styles.label}>{t("aboutPage.nameLabel")} <span className="cn-labelWarn"> Required </span> </div>
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
                />
                <InputField
                  name="phone2"
                  placeholder={t("aboutPage.phone2Placeholder")}
                  value={formValues.phone2}
                  onChange={handleInputChange}
                  icon={<FaPhone size={12} />}
                />
                <InputField
                  name="phone3"
                  placeholder={t("aboutPage.phone3Placeholder")}
                  value={formValues.phone3}
                  onChange={handleInputChange}
                  icon={<FaPhone size={12} />}
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
                  />
                  <SelectField
                    name="prefecture"
                    placeholder={t("aboutPage.prefecturePlaceholder")}
                    options={[
                      { label: "Hokkaido", value: "1" },
                      { label: "Aomori", value: "2" },
                      { label: "Iwate", value: "3" },
                      { label: "Miyagi", value: "4" },
                    ]}
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
                  name="address2"
                  placeholder={t("aboutPage.address2Placeholder")}
                  value={formValues.address2}
                  onChange={handleInputChange}
                  icon={<BiHomeAlt2 size={12} />}
                />
                <InputField
                  name="building"
                  placeholder={t("aboutPage.buildingPlaceholder")}
                  value={formValues.building}
                  onChange={handleInputChange}
                  icon={<BiHomeAlt2 size={12} />}
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
                  />
                  <InputField
                    name="trainLine1"
                    placeholder={t("aboutPage.trainLine1Placeholder")}
                    value={formValues.trainLine1}
                    onChange={handleInputChange}
                    icon={<MdOutlineTrain size={12} />}
                  />
                  <InputField
                    name="trainStation1"
                    placeholder={t("aboutPage.trainStation1Placeholder")}
                    value={formValues.trainStation1}
                    onChange={handleInputChange}
                    icon={<MdOutlineTrain size={12} />}
                  />
                </div>
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
                    options={[
                      {
                        value: "housekeeping",
                        label: t("cncontactform.services.housekeeping"),
                      },
                      {
                        value: "babysitting",
                        label: t("cncontactform.services.babysitting"),
                      },
                      {
                        value: "housecleaningPro",
                        label: t("cncontactform.services.housecleaningPro"),
                      },
                      {
                        value: "fulltime",
                        label: t("cncontactform.services.fulltime"),
                      },
                      {
                        value: "others",
                        label: t("cncontactform.services.others"),
                      },
                    ]}
                    selectedValues={formValues.selectedServices.map(num => {
                      switch(num) {
                        case 1: return "housekeeping";
                        case 2: return "babysitting";
                        case 3: return "housecleaningPro";
                        case 4: return "fulltime";
                        case 5: return "others";
                        default: return "";
                      }
                    }).filter(Boolean)}
                    onChange={handleServiceChange}
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
                options={[
                  {
                    label: t("cncontactform.subscribe"),
                    value: "subscribe",
                  },
                  {
                    label: t("cncontactform.unsubscribe"),
                    value: "unsubscribe",
                  },
                ]}
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
