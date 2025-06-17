import React, { ChangeEvent, useState } from "react";
import { useLanguage } from "@/localization/LocalContext";
import ClientLayout from "@/components/dashboard-layout/client-layout";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import TextAreaField from "@/components/textarea-field/textarea-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import Button from "@/components/button/button";
import Toast from "@/components/toast/toast";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import styles from "@/styles/pages/cnabout.module.scss";
import styleHeader from "@/styles/pages/cnChangePaymentMethod.module.scss";
import styleNav from "@/styles/components/organisms/client-layout.module.scss";
import Image from "next/image";
import { FaUser, FaPhone, FaThermometerHalf, FaHospital, FaSchool, FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { BiHomeAlt2, BiHealth } from "react-icons/bi";
import { MdOutlineHomeWork, MdChildCare, MdFavorite, MdLocalHospital, MdMeetingRoom } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";
import { GiMedicines } from "react-icons/gi";
import { BsPersonWorkspace } from "react-icons/bs";
import { calculateAge } from "@/libs/utils";

export default function CnInfoChild() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);

  // Form errors state
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});

  // Child Information Form State
  const [childFormValues, setChildFormValues] = useState({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    age: "",
    gender: "male",
    language: "japanese",
    temperature: "",
    healthStatus: "",
    hasAllergies: "no",
    allergiesDetails: "",
    personality: "",
    favoriteActivities: "",
    roomsForSitting: "",
    firstAidKitLocation: "",
    sitterRequests: "",
    hasPrimaryDoctor: "no",
    primaryHospital: "",
    doctorPhone: "",
    primaryDoctor: "",
    hasSchool: "no",
    schoolName: "",
    schoolPhone: "",
    schoolPostalCode: "",
    schoolPrefecture: "",
    schoolAddress1: "",
    schoolAddress2: "",
    homeroom: "",
    grade: "",
    class: ""
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setChildFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleDateOfBirthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValues = { ...childFormValues, [name]: value };
    setChildFormValues(newValues);

    if (newValues.birthYear && newValues.birthMonth && newValues.birthDay) {
      const dob = `${newValues.birthYear}-${newValues.birthMonth.padStart(2, "0")}-${newValues.birthDay.padStart(2, "0")}`;
      const calculatedAge = calculateAge(dob);
      setChildFormValues(prev => ({
        ...prev,
        [name]: value,
        age: calculatedAge.toString()
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Add your submit logic here
      setToast({
        message: "Form submitted successfully",
        type: "success"
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Error submitting form",
        type: "error"
      });
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
        <h1 className={styleHeader.topHeading}>{t("cnInfo.childInfoForm")}</h1>
        <div className="d-flex flex-column gap-2">
          <Accordion>
            {/* Child Information Section */}
            <AccordionItem
              heading={t("cnInfo.childInfo")}
              label={t("cnInfo.required")}
            >
              <Form
                onSubmit={handleSubmit}
                setErrors={setErrors}
                errors={errors}
                className={styles.customerForm}
              >
                <div className={styles.formGrid}>
                  {/* Name Section */}
                  <div className={styles.label}>
                    {t("aboutPage.nameLabel")}{" "}
                    <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.fieldRow}>
                      <InputField
                        name="lastName"
                        placeholder={t("cncontactform.lastnamePlaceholder")}
                        value={childFormValues.lastName}
                        onChange={handleInputChange}
                        validations={[{ type: "required" }]}
                        icon={<FaUser size={12} />}
                      />
                      <InputField
                        name="firstName"
                        placeholder={t("aboutPage.firstNamePlaceholder")}
                        value={childFormValues.firstName}
                        onChange={handleInputChange}
                        validations={[{ type: "required" }]}
                        icon={<FaUser size={12} />}
                      />
                    </div>
                    <div className={styles.fieldRow}>
                      <InputField
                        name="lastNameKana"
                        placeholder={t("cncontactform.lastnamePlaceholder") + " (Kana)"}
                        value={childFormValues.lastNameKana}
                        onChange={handleInputChange}
                        validations={[{ type: "required" }]}
                        icon={<FaUser size={12} />}
                      />
                      <InputField
                        name="firstNameKana"
                        placeholder={t("aboutPage.firstNamePlaceholder") + " (Kana)"}
                        value={childFormValues.firstNameKana}
                        onChange={handleInputChange}
                        validations={[{ type: "required" }]}
                        icon={<FaUser size={12} />}
                      />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className={styles.label}>
                    {t("cnInfo.nickname")}
                  </div>
                  <InputField
                    name="nickname"
                    placeholder={t("cnInfo.nickname")}
                    value={childFormValues.nickname}
                    onChange={handleInputChange}
                    icon={<MdChildCare size={12} />}
                  />

                  {/* Date of Birth */}
                  <div className={styles.label}>
                    {t("cnInfo.dateOfBirth")}{" "}
                    <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                  </div>
                  <div className={styles.dateGroup}>
                    <SelectField
                      name="birthYear"
                      placeholder={t("aboutPage.yearPlaceholder")}
                      options={Array.from({ length: 20 }, (_, i) => ({
                        label: String(new Date().getFullYear() - i),
                        value: String(new Date().getFullYear() - i)
                      }))}
                      value={childFormValues.birthYear}
                      onChange={handleDateOfBirthChange}
                      icon={<SlCalender size={12} />}
                    />
                    <SelectField
                      name="birthMonth"
                      placeholder={t("aboutPage.monthPlaceholder")}
                      options={Array.from({ length: 12 }, (_, i) => ({
                        label: String(i + 1),
                        value: String(i + 1).padStart(2, "0")
                      }))}
                      value={childFormValues.birthMonth}
                      onChange={handleDateOfBirthChange}
                      icon={<SlCalender size={12} />}
                    />
                    <SelectField
                      name="birthDay"
                      placeholder={t("aboutPage.dayPlaceholder")}
                      options={Array.from({ length: 31 }, (_, i) => ({
                        label: String(i + 1),
                        value: String(i + 1).padStart(2, "0")
                      }))}
                      value={childFormValues.birthDay}
                      onChange={handleDateOfBirthChange}
                      icon={<SlCalender size={12} />}
                    />
                    <InputField
                      name="age"
                      placeholder={t("aboutPage.agePlaceholder")}
                      value={childFormValues.age}
                      onChange={handleInputChange}
                      icon={<SlCalender size={12} />}
                      disabled={true}
                    />
                  </div>

                  {/* Gender */}
                  <div className={styles.label}>
                    {t("cnInfo.gender")}{" "}
                    <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                  </div>
                  <RadioField
                    name="gender"
                    options={[
                      { label: t("cnInfo.male"), value: "male" },
                      { label: t("cnInfo.female"), value: "female" },
                      { label: t("cnInfo.other"), value: "other" }
                    ]}
                    selectedValue={childFormValues.gender}
                    onChange={handleInputChange}
                    className={styles.radioGroup}
                  />

                  {/* Language */}
                  <div className={styles.label}>
                    {t("cnInfo.language")}
                  </div>
                  <RadioField
                    name="language"
                    options={[
                      { label: t("cnInfo.japanese"), value: "japanese" },
                      { label: t("cnInfo.english"), value: "english" },
                      { label: t("cnInfo.both"), value: "both" }
                    ]}
                    selectedValue={childFormValues.language}
                    onChange={handleInputChange}
                    className={styles.radioGroup}
                  />

                  {/* Temperature */}
                  <div className={styles.label}>
                    {t("cnInfo.normalTemperature")}
                  </div>
                  <InputField
                    name="temperature"
                    placeholder="36.5"
                    value={childFormValues.temperature}
                    onChange={handleInputChange}
                    type="number"
                    icon={<FaThermometerHalf size={12} />}
                  />

                  {/* Health Status */}
                  <div className={styles.label}>
                    {t("cnInfo.healthStatus")}
                  </div>
                  <SelectField
                    name="healthStatus"
                    placeholder={t("cnInfo.healthStatus")}
                    options={[
                      { label: "Excellent", value: "excellent" },
                      { label: "Good", value: "good" },
                      { label: "Fair", value: "fair" }
                    ]}
                    value={childFormValues.healthStatus}
                    onChange={handleInputChange}
                    icon={<BiHealth size={12} />}
                  />

                  {/* Allergies */}
                  <div className={styles.label}>
                    {t("cnInfo.allergies")}
                  </div>
                  <div className={styles.fieldGroup}>
                    <RadioField
                      name="hasAllergies"
                      options={[
                        { label: t("cnInfo.hasAllergies"), value: "yes" },
                        { label: t("cnInfo.noAllergies"), value: "no" }
                      ]}
                      selectedValue={childFormValues.hasAllergies}
                      onChange={handleInputChange}
                      className={styles.radioGroup}
                    />
                    {childFormValues.hasAllergies === "yes" && (
                      <TextAreaField
                        name="allergiesDetails"
                        placeholder={t("cnInfo.allergiesDetails")}
                        value={childFormValues.allergiesDetails}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    )}
                  </div>

                  {/* Personality */}
                  <div className={styles.label}>
                    {t("cnInfo.personality")}
                  </div>
                  <TextAreaField
                    name="personality"
                    placeholder={t("cnInfo.personality")}
                    value={childFormValues.personality}
                    onChange={handleInputChange}
                    rows={4}
                    icon={<MdFavorite size={12} />}
                  />

                  {/* Favorite Activities */}
                  <div className={styles.label}>
                    {t("cnInfo.favoriteActivities")}
                  </div>
                  <TextAreaField
                    name="favoriteActivities"
                    placeholder={t("cnInfo.favoriteActivities")}
                    value={childFormValues.favoriteActivities}
                    onChange={handleInputChange}
                    rows={4}
                    icon={<BsPersonWorkspace size={12} />}
                  />

                  {/* Rooms for Sitting */}
                  <div className={styles.label}>
                    {t("cnInfo.roomsForSitting")}
                  </div>
                  <TextAreaField
                    name="roomsForSitting"
                    placeholder={t("cnInfo.roomsForSitting")}
                    value={childFormValues.roomsForSitting}
                    onChange={handleInputChange}
                    rows={4}
                    icon={<MdMeetingRoom size={12} />}
                  />

                  {/* First Aid Kit Location */}
                  <div className={styles.label}>
                    {t("cnInfo.firstAidKitLocation")}
                  </div>
                  <TextAreaField
                    name="firstAidKitLocation"
                    placeholder={t("cnInfo.firstAidKitLocation")}
                    value={childFormValues.firstAidKitLocation}
                    onChange={handleInputChange}
                    rows={4}
                    icon={<GiMedicines size={12} />}
                  />

                  {/* Sitter Requests */}
                  <div className={styles.label}>
                    {t("cnInfo.sitterRequests")}
                  </div>
                  <TextAreaField
                    name="sitterRequests"
                    placeholder={t("cnInfo.sitterRequests")}
                    value={childFormValues.sitterRequests}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-2">
                  <Button
                    htmlType="submit"
                    type="primary"
                    text={isSubmitting ? t("buttons.submitting") : t("buttons.submit")}
                    className="px-10"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </Form>
            </AccordionItem>

            {/* Family Doctor Information */}
            <AccordionItem
              heading={t("cnInfo.familyDoctor")}
              label={t("cnInfo.required")}
            >
              <Form
                onSubmit={handleSubmit}
                setErrors={setErrors}
                errors={errors}
                className={styles.customerForm}
              >
                <div className={styles.formGrid}>
                  <div className={styles.label}>
                    {t("cnInfo.familyDoctor")}
                  </div>
                  <RadioField
                    name="hasPrimaryDoctor"
                    options={[
                      { label: t("cnInfo.hasPrimaryDoctor"), value: "yes" },
                      { label: t("cnInfo.noPrimaryDoctor"), value: "no" }
                    ]}
                    selectedValue={childFormValues.hasPrimaryDoctor}
                    onChange={handleInputChange}
                    className={styles.radioGroup}
                  />

                  {childFormValues.hasPrimaryDoctor === "yes" && (
                    <>
                      <div className={styles.label}>
                        {t("cnInfo.primaryHospital")}
                      </div>
                      <InputField
                        name="primaryHospital"
                        placeholder={t("cnInfo.primaryHospital")}
                        value={childFormValues.primaryHospital}
                        onChange={handleInputChange}
                        icon={<FaHospital size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.doctorPhone")}
                      </div>
                      <InputField
                        name="doctorPhone"
                        placeholder={t("cnInfo.doctorPhone")}
                        value={childFormValues.doctorPhone}
                        onChange={handleInputChange}
                        icon={<FaPhone size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.primaryDoctor")}
                      </div>
                      <InputField
                        name="primaryDoctor"
                        placeholder={t("cnInfo.primaryDoctor")}
                        value={childFormValues.primaryDoctor}
                        onChange={handleInputChange}
                        icon={<FaUser size={12} />}
                      />
                    </>
                  )}
                </div>

                <div className="d-flex justify-content-center mt-4 mb-2">
                  <Button
                    htmlType="submit"
                    type="primary"
                    text={isSubmitting ? t("buttons.submitting") : t("buttons.submit")}
                    className="px-10"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </Form>
            </AccordionItem>

            {/* School Information */}
            <AccordionItem
              heading={t("cnInfo.schoolInfo")}
              label={t("cnInfo.required")}
            >
              <Form
                onSubmit={handleSubmit}
                setErrors={setErrors}
                errors={errors}
                className={styles.customerForm}
              >
                <div className={styles.formGrid}>
                  <div className={styles.label}>
                    {t("cnInfo.schoolInfo")}
                  </div>
                  <RadioField
                    name="hasSchool"
                    options={[
                      { label: t("cnInfo.hasSchool"), value: "yes" },
                      { label: t("cnInfo.noSchool"), value: "no" }
                    ]}
                    selectedValue={childFormValues.hasSchool}
                    onChange={handleInputChange}
                    className={styles.radioGroup}
                  />

                  {childFormValues.hasSchool === "yes" && (
                    <>
                      <div className={styles.label}>
                        {t("cnInfo.schoolName")}
                      </div>
                      <InputField
                        name="schoolName"
                        placeholder={t("cnInfo.schoolName")}
                        value={childFormValues.schoolName}
                        onChange={handleInputChange}
                        icon={<FaSchool size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.schoolPhone")}
                      </div>
                      <InputField
                        name="schoolPhone"
                        placeholder={t("cnInfo.schoolPhone")}
                        value={childFormValues.schoolPhone}
                        onChange={handleInputChange}
                        icon={<FaPhone size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.postalCode")}
                      </div>
                      <InputField
                        name="schoolPostalCode"
                        placeholder={t("cnInfo.postalCode")}
                        value={childFormValues.schoolPostalCode}
                        onChange={handleInputChange}
                        icon={<MdOutlineHomeWork size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.prefecture")}
                      </div>
                      <SelectField
                        name="schoolPrefecture"
                        placeholder={t("cnInfo.prefecture")}
                        options={[
                          { label: "Tokyo", value: "tokyo" },
                          { label: "Osaka", value: "osaka" },
                          { label: "Kyoto", value: "kyoto" }
                        ]}
                        value={childFormValues.schoolPrefecture}
                        onChange={handleInputChange}
                        icon={<BiHomeAlt2 size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.address1")}
                      </div>
                      <InputField
                        name="schoolAddress1"
                        placeholder={t("cnInfo.address1")}
                        value={childFormValues.schoolAddress1}
                        onChange={handleInputChange}
                        icon={<BiHomeAlt2 size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.address2")}
                      </div>
                      <InputField
                        name="schoolAddress2"
                        placeholder={t("cnInfo.address2")}
                        value={childFormValues.schoolAddress2}
                        onChange={handleInputChange}
                        icon={<BiHomeAlt2 size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.homeroom")}
                      </div>
                      <InputField
                        name="homeroom"
                        placeholder={t("cnInfo.homeroom")}
                        value={childFormValues.homeroom}
                        onChange={handleInputChange}
                        icon={<FaChalkboardTeacher size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.grade")}
                      </div>
                      <InputField
                        name="grade"
                        placeholder={t("cnInfo.grade")}
                        value={childFormValues.grade}
                        onChange={handleInputChange}
                        icon={<FaGraduationCap size={12} />}
                      />

                      <div className={styles.label}>
                        {t("cnInfo.class")}
                      </div>
                      <InputField
                        name="class"
                        placeholder={t("cnInfo.class")}
                        value={childFormValues.class}
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                </div>

                <div className="d-flex justify-content-center mt-4 mb-2">
                  <Button
                    htmlType="submit"
                    type="primary"
                    text={isSubmitting ? t("buttons.submitting") : t("buttons.submit")}
                    className="px-10"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </Form>
            </AccordionItem>
          </Accordion>

          {/* Add Child Button */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              type="secondary"
              text={t("cnInfo.addChild")}
              className="px-10"
              onClick={() => {/* Add logic to add another child */}}
            />
          </div>

          {/* Final Submit Button */}
          <div className="d-flex justify-content-center mt-4 mb-4">
            <Button
              type="primary"
              text={t("buttons.submit")}
              className="px-10"
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
            />
          </div>
        </div>
      </ClientLayout>
    </>
  );
} 