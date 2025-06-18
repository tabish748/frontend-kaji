import React, { ChangeEvent, useState, useEffect, useRef } from "react";
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
import { FaUser, FaPhone, FaThermometerHalf, FaHospital, FaSchool, FaGraduationCap, FaChalkboardTeacher, FaSmile, FaBook, FaPlus } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { BiHomeAlt2, BiHealth } from "react-icons/bi";
import { MdOutlineHomeWork, MdChildCare, MdFavorite, MdLocalHospital, MdMeetingRoom, MdLocationOn } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";
import { GiMedicines } from "react-icons/gi";
import { BsPersonWorkspace } from "react-icons/bs";
import { calculateAge } from "@/libs/utils";

// Define interfaces for the data structure
interface Doctor {
  id?: string;
  primaryHospital: string;
  doctorPhone: string;
  primaryDoctor: string;
}

interface School {
  id?: string;
  schoolName: string;
  schoolPhone: string;
  schoolPostalCode: string;
  schoolPrefecture: string;
  schoolAddress1: string;
  schoolAddress2: string;
  homeroom: string;
  grade: string;
  class: string;
}

interface Child {
  id?: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  nickname: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  age: string;
  gender: string;
  language: string;
  temperature: string;
  healthStatus: string;
  hasAllergies: string;
  allergiesDetails: string;
  personality: string;
  personalityOther: string;
  favoriteActivities: string;
  roomsForSitting: string;
  firstAidKitLocation: string;
  sitterRequests: string;
  hasPrimaryDoctor: string;
  doctors: Doctor[];
  hasSchool: string;
  schools: School[];
}

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

  // Accordion state management for tracking which accordions have been opened
  const [hasOpenedAccordions, setHasOpenedAccordions] = useState<Record<string, boolean>>({});
  const [forceOpenAccordion, setForceOpenAccordion] = useState<string | null>(null);
  const [accordionStates, setAccordionStates] = useState<Record<string, number | null>>({});
  
  // Refs for focus management
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Track original/fetched data to distinguish from user input
  const [originalData, setOriginalData] = useState<Child[]>([]);

  // Helper function to check if field has original/fetched data
  const isOriginalData = (childIndex: number, fieldName: string, value: any): boolean => {
    if (!originalData[childIndex]) return false;
    const originalChild = originalData[childIndex];
    return originalChild[fieldName as keyof Child] === value && !!value;
  };

  // Helper function for doctor original data
  const isOriginalDoctorData = (childIndex: number, doctorIndex: number, fieldName: string, value: any): boolean => {
    if (!originalData[childIndex] || !originalData[childIndex].doctors[doctorIndex]) return false;
    const originalDoctor = originalData[childIndex].doctors[doctorIndex];
    return originalDoctor[fieldName as keyof Doctor] === value && !!value;
  };

  // Helper function for school original data
  const isOriginalSchoolData = (childIndex: number, schoolIndex: number, fieldName: string, value: any): boolean => {
    if (!originalData[childIndex] || !originalData[childIndex].schools[schoolIndex]) return false;
    const originalSchool = originalData[childIndex].schools[schoolIndex];
    return originalSchool[fieldName as keyof School] === value && !!value;
  };

  // Children state - array of children
  const [children, setChildren] = useState<Child[]>([
    {
      id: "child-1",
      lastName: "Smith",
      firstName: "Emma",
      lastNameKana: "スミス",
      firstNameKana: "エマ",
      nickname: "Emmy",
      birthYear: "2018",
      birthMonth: "03",
      birthDay: "15",
      age: "5",
      gender: "female",
      language: "both",
      temperature: "36.5",
      healthStatus: "excellent",
      hasAllergies: "yes",
      allergiesDetails: "Peanuts, shellfish",
      personality: "personality2",
      personalityOther: "",
      favoriteActivities: "Drawing, reading books",
      roomsForSitting: "Living room, playroom",
      firstAidKitLocation: "Kitchen cabinet, second shelf",
      sitterRequests: "Likes bedtime stories, prefers quiet activities",
      hasPrimaryDoctor: "yes",
      doctors: [
        {
          id: "doctor-1",
          primaryHospital: "Tokyo Children's Hospital",
          doctorPhone: "03-1234-5678",
          primaryDoctor: "Dr. Tanaka Hiroshi"
        },
        {
          id: "doctor-2", 
          primaryHospital: "Shibuya Medical Center",
          doctorPhone: "03-8765-4321",
          primaryDoctor: "Dr. Sato Yuki"
        }
      ],
      hasSchool: "yes",
      schools: [
        {
          id: "school-1",
          schoolName: "Sunshine Kindergarten",
          schoolPhone: "03-2222-3333",
          schoolPostalCode: "150-0001",
          schoolPrefecture: "tokyo",
          schoolAddress1: "1-2-3 Shibuya",
          schoolAddress2: "Building A",
          homeroom: "Ms. Yamada",
          grade: "K2",
          class: "Sakura Class"
        }
      ]
    },
    {
      id: "child-2",
      lastName: "Smith",
      firstName: "Liam",
      lastNameKana: "スミス", 
      firstNameKana: "リアム",
      nickname: "Lee",
      birthYear: "2020",
      birthMonth: "07",
      birthDay: "22",
      age: "3",
      gender: "male",
      language: "english",
      temperature: "36.8",
      healthStatus: "good",
      hasAllergies: "no",
      allergiesDetails: "",
      personality: "personality1",
      personalityOther: "",
      favoriteActivities: "Playing with cars, outdoor activities",
      roomsForSitting: "Living room, bedroom",
      firstAidKitLocation: "Bathroom medicine cabinet",
      sitterRequests: "Needs afternoon nap, loves music",
      hasPrimaryDoctor: "yes",
      doctors: [
        {
          id: "doctor-3",
          primaryHospital: "Tokyo Children's Hospital", 
          doctorPhone: "03-1234-5678",
          primaryDoctor: "Dr. Tanaka Hiroshi"
        }
      ],
      hasSchool: "no",
      schools: []
    },
    {
      id: undefined, // New child template
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
      personalityOther: "",
      favoriteActivities: "",
      roomsForSitting: "",
      firstAidKitLocation: "",
      sitterRequests: "",
      hasPrimaryDoctor: "no",
      doctors: [],
      hasSchool: "no",
      schools: []
    }
  ]);

  // Load children data from API
  useEffect(() => {
    loadChildrenData();
  }, []);

  // Open first child's first accordion by default after data is loaded
  useEffect(() => {
    if (children.length > 0 && !isLoading) {
      // Check if no accordions are currently open
      const hasAnyOpenAccordion = Object.values(accordionStates).some(state => state !== null);
      
      if (!hasAnyOpenAccordion) {
        // Open the first child's first accordion by default
        setAccordionStates(prev => ({
          ...prev,
          "0-child": 0 // Open first child's child info accordion
        }));
        setHasOpenedAccordions(prev => ({ ...prev, "0-child": true }));
      }
    }
  }, [children, isLoading]);

  // Handle force open accordion effect
  useEffect(() => {
    if (forceOpenAccordion) {
      // Close all other accordions for this child first
      const [childIndex, accordionType] = forceOpenAccordion.split('-');
      const childKey = childIndex;
      
      // Set all accordion states for this child to closed, except the target one
      setAccordionStates(prev => ({
        ...prev,
        [`${childKey}-child`]: forceOpenAccordion === `${childKey}-child` ? 0 : null,
        [`${childKey}-doctor`]: forceOpenAccordion === `${childKey}-doctor` ? 0 : null,
        [`${childKey}-school`]: forceOpenAccordion === `${childKey}-school` ? 0 : null,
      }));
      
      // Ensure the force-opened accordion is marked as opened
      setHasOpenedAccordions(prev => ({ ...prev, [forceOpenAccordion]: true }));
      
      // Clear the force open state after a short delay
      setTimeout(() => {
        setForceOpenAccordion(null);
      }, 100);
    }
  }, [forceOpenAccordion]);

  const loadChildrenData = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      // const response = await ApiHandler.request('/api/children', 'GET');
      // setChildren(response.data || [defaultChild]);
      // setOriginalData(response.data || [defaultChild]); // Store original data
      
      // Mock data for now - store as original data
      setOriginalData([...children]); // Store current mock data as original
      
      console.log("Loading children data...");
    } catch (error) {
      console.error("Error loading children data:", error);
      setToast({
        message: "Error loading children data",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildInputChange = (
    childIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Extract the actual field name from radio button names (e.g., "gender-0" -> "gender")
    const fieldName = name.includes('-') ? name.split('-')[0] : name;
    
    setChildren(prev => prev.map((child, index) => {
      if (index === childIndex) {
        const updatedChild = { ...child, [fieldName]: value };
        
        // Auto-add first doctor when selecting "yes" for hasPrimaryDoctor
        if (fieldName === "hasPrimaryDoctor" && value === "yes" && child.doctors.length === 0) {
          updatedChild.doctors = [{
            id: undefined,
            primaryHospital: "",
            doctorPhone: "",
            primaryDoctor: ""
          }];
        }
        
        // Auto-add first school when selecting "yes" for hasSchool
        if (fieldName === "hasSchool" && value === "yes" && child.schools.length === 0) {
          updatedChild.schools = [{
            id: undefined,
            schoolName: "",
            schoolPhone: "",
            schoolPostalCode: "",
            schoolPrefecture: "",
            schoolAddress1: "",
            schoolAddress2: "",
            homeroom: "",
            grade: "",
            class: ""
          }];
        }
        
        return updatedChild;
      }
      return child;
    }));
  };

  const handleDateOfBirthChange = (childIndex: number, e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedChildren = [...children];
    updatedChildren[childIndex] = { ...updatedChildren[childIndex], [name]: value };

    const child = updatedChildren[childIndex];
    if (child.birthYear && child.birthMonth && child.birthDay) {
      const dob = `${child.birthYear}-${child.birthMonth.padStart(2, "0")}-${child.birthDay.padStart(2, "0")}`;
      const calculatedAge = calculateAge(dob);
      updatedChildren[childIndex].age = calculatedAge.toString();
    }

    setChildren(updatedChildren);
  };

  // Add new child
  const addNewChild = () => {
    const newChild: Child = {
      id: undefined,
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
      personalityOther: "",
      favoriteActivities: "",
      roomsForSitting: "",
      firstAidKitLocation: "",
      sitterRequests: "",
      hasPrimaryDoctor: "no",
      doctors: [],
      hasSchool: "no",
      schools: []
    };
    setChildren(prev => [...prev, newChild]);
  };

  // Add new doctor to specific child
  const addDoctorToChild = (childIndex: number) => {
    const newDoctor: Doctor = {
      id: undefined,
      primaryHospital: "",
      doctorPhone: "",
      primaryDoctor: ""
    };
    setChildren(prev => prev.map((child, index) => 
      index === childIndex 
        ? { ...child, doctors: [...child.doctors, newDoctor] }
        : child
    ));
  };

  // Add new school to specific child
  const addSchoolToChild = (childIndex: number) => {
    const newSchool: School = {
      id: undefined,
      schoolName: "",
      schoolPhone: "",
      schoolPostalCode: "",
      schoolPrefecture: "",
      schoolAddress1: "",
      schoolAddress2: "",
      homeroom: "",
      grade: "",
      class: ""
    };
    setChildren(prev => prev.map((child, index) => 
      index === childIndex 
        ? { ...child, schools: [...child.schools, newSchool] }
        : child
    ));
  };

  // Handle doctor input changes
  const handleDoctorInputChange = (
    childIndex: number,
    doctorIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setChildren(prev => prev.map((child, cIndex) => 
      cIndex === childIndex 
        ? {
            ...child,
            doctors: child.doctors.map((doctor, dIndex) => 
              dIndex === doctorIndex ? { ...doctor, [name]: value } : doctor
            )
          }
        : child
    ));
  };

  // Handle school input changes
  const handleSchoolInputChange = (
    childIndex: number,
    schoolIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setChildren(prev => prev.map((child, cIndex) => 
      cIndex === childIndex 
        ? {
            ...child,
            schools: child.schools.map((school, sIndex) => 
              sIndex === schoolIndex ? { ...school, [name]: value } : school
            )
          }
        : child
    ));
  };

  // Handle accordion toggle
  const handleAccordionToggle = (childIndex: number, accordionType: 'child' | 'doctor' | 'school', accordionIndex: number) => {
    try {
      const key = `${childIndex}-${accordionType}`;
      console.log(`🚀 handleAccordionToggle called:`, { childIndex, accordionType, accordionIndex, key });
      
      // Check if this accordion is currently open
      const isCurrentlyOpen = accordionStates[key] === accordionIndex;
      
      if (isCurrentlyOpen) {
        console.log(`Closing accordion: ${key}`);
        // Close this accordion
        setAccordionStates(prev => ({
          ...prev,
          [key]: null
        }));
      } else {
        console.log(`Opening accordion: ${key}`);
        // Close all other accordions for this child and open the target one
        setAccordionStates(prev => ({
          ...prev,
          [`${childIndex}-child`]: accordionType === 'child' ? accordionIndex : null,
          [`${childIndex}-doctor`]: accordionType === 'doctor' ? accordionIndex : null,
          [`${childIndex}-school`]: accordionType === 'school' ? accordionIndex : null,
        }));
      }
      
      // Mark as opened
      setHasOpenedAccordions(prev => ({ ...prev, [key]: true }));
      
      // Clear force open state
      if (forceOpenAccordion === key) {
        setForceOpenAccordion(null);
      }
    } catch (error) {
      console.error(`Error in handleAccordionToggle:`, error);
    }
  };

  // Save child information
  const saveChildInfo = async (childIndex: number) => {
    setIsSubmitting(true);
    try {
      const childData = children[childIndex];
      // Replace with actual API call
      // const response = await ApiHandler.request('/api/children', 'POST', childData);
      // Update child with returned ID
      // setChildren(prev => prev.map((child, index) => 
      //   index === childIndex ? { ...child, id: response.data.id } : child
      // ));
      
      console.log("Saving child info:", childData);
      setToast({
        message: "Child information saved successfully",
        type: "success"
      });
      
      // Auto-open next accordion (doctor) after successful save
      setTimeout(() => {
        const nextAccordionKey = `${childIndex}-doctor`;
        setForceOpenAccordion(nextAccordionKey);
        setHasOpenedAccordions(prev => ({ ...prev, [nextAccordionKey]: true }));
      }, 500);
    } catch (error: any) {
      setToast({
        message: error.message || "Error saving child information",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save doctor information
  const saveDoctorInfo = async (childIndex: number) => {
    setIsSubmitting(true);
    try {
      const childData = children[childIndex];
      const doctorsData = {
        childId: childData.id,
        doctors: childData.doctors
      };
      // Replace with actual API call
      // const response = await ApiHandler.request('/api/children/doctors', 'POST', doctorsData);
      
      console.log("Saving doctor info:", doctorsData);
      setToast({
        message: "Doctor information saved successfully",
        type: "success"
      });
      
      // Auto-open next accordion (school) after successful save
      setTimeout(() => {
        const nextAccordionKey = `${childIndex}-school`;
        setForceOpenAccordion(nextAccordionKey);
        setHasOpenedAccordions(prev => ({ ...prev, [nextAccordionKey]: true }));
      }, 500);
    } catch (error: any) {
      setToast({
        message: error.message || "Error saving doctor information",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save school information
  const saveSchoolInfo = async (childIndex: number) => {
    setIsSubmitting(true);
    try {
      const childData = children[childIndex];
      const schoolsData = {
        childId: childData.id,
        schools: childData.schools
      };
      // Replace with actual API call
      // const response = await ApiHandler.request('/api/children/schools', 'POST', schoolsData);
      
      console.log("Saving school info:", schoolsData);
      setToast({
        message: "School information saved successfully",
        type: "success"
      });
      
      // Close current accordion since this is the last one
      setTimeout(() => {
        setAccordionStates(prev => ({
          ...prev,
          [`${childIndex}-school`]: null
        }));
      }, 500);
    } catch (error: any) {
      setToast({
        message: error.message || "Error saving school information",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit all data
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Replace with actual API call to submit all children data
      // const response = await ApiHandler.request('/api/children/submit', 'POST', { children });
      
      console.log("Final submission:", children);
      setToast({
        message: "All information submitted successfully",
        type: "success"
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Error submitting information",
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
          {children.map((child, childIndex) => (
            <React.Fragment key={childIndex}>
              {/* Child Separator */}
              {childIndex > 0 && (
                <div className="seperator-line primary">
                </div>
              )}
              
              <Accordion
                openIndex={
                  forceOpenAccordion === `${childIndex}-child` ? 0 : 
                  (accordionStates[`${childIndex}-child`] ?? null)
                }
                onToggle={(index) => handleAccordionToggle(childIndex, 'child', index)}
              >
                {/* Child Information Section */}
                <AccordionItem
                  heading={`${t("cnInfo.childInfo")} ${childIndex + 1}`}
                  label={t("cnInfo.required")}
                >
                  <Form
                    onSubmit={() => saveChildInfo(childIndex)}
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
                            ref={(el) => inputRefs.current[`${childIndex}-child-lastName`] = el}
                            name="lastName"
                            placeholder={t("cncontactform.lastnamePlaceholder")}
                            value={child.lastName}
                            onChange={(e) => handleChildInputChange(childIndex, e)}
                            validations={[{ type: "required" }]}
                            icon={<FaUser size={12} />}
                            readOnly={isOriginalData(childIndex, 'lastName', child.lastName)}
                          />
                          <InputField
                            name="firstName"
                            placeholder={t("aboutPage.firstNamePlaceholder")}
                            value={child.firstName}
                            onChange={(e) => handleChildInputChange(childIndex, e)}
                            validations={[{ type: "required" }]}
                            icon={<FaUser size={12} />}
                            readOnly={isOriginalData(childIndex, 'firstName', child.firstName)}
                          />
                        </div>
                        <div className={styles.fieldRow}>
                          <InputField
                            name="lastNameKana"
                            placeholder={t("cncontactform.lastnamePlaceholder") + " (Kana)"}
                            value={child.lastNameKana}
                            onChange={(e) => handleChildInputChange(childIndex, e)}
                            validations={[{ type: "required" }]}
                            icon={<FaUser size={12} />}
                            readOnly={isOriginalData(childIndex, 'lastNameKana', child.lastNameKana)}
                          />
                          <InputField
                            name="firstNameKana"
                            placeholder={t("aboutPage.firstNamePlaceholder") + " (Kana)"}
                            value={child.firstNameKana}
                            onChange={(e) => handleChildInputChange(childIndex, e)}
                            validations={[{ type: "required" }]}
                            icon={<FaUser size={12} />}
                            readOnly={isOriginalData(childIndex, 'firstNameKana', child.firstNameKana)}
                          />
                        </div>
                      </div>

                      {/* Nickname */}
                      <div className={styles.label}>
                        {t("cnInfo.nickname")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <InputField
                        name="nickname"
                        placeholder={t("cnInfo.nickname")}
                        value={child.nickname}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        validations={[{ type: "required" }]}
                        icon={<MdChildCare size={12} />}
                        readOnly={isOriginalData(childIndex, 'nickname', child.nickname)}
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
                          value={child.birthYear}
                          onChange={(e) => handleDateOfBirthChange(childIndex, e)}
                          validations={[{ type: "required" }]}
                          icon={<SlCalender size={12} />}
                          disabled={isOriginalData(childIndex, 'birthYear', child.birthYear)}
                        />
                        <SelectField
                          name="birthMonth"
                          placeholder={t("aboutPage.monthPlaceholder")}
                          options={Array.from({ length: 12 }, (_, i) => ({
                            label: String(i + 1),
                            value: String(i + 1).padStart(2, "0")
                          }))}
                          value={child.birthMonth}
                          onChange={(e) => handleDateOfBirthChange(childIndex, e)}
                          validations={[{ type: "required" }]}
                          icon={<SlCalender size={12} />}
                          disabled={isOriginalData(childIndex, 'birthMonth', child.birthMonth)}
                        />
                        <SelectField
                          name="birthDay"
                          placeholder={t("aboutPage.dayPlaceholder")}
                          options={Array.from({ length: 31 }, (_, i) => ({
                            label: String(i + 1),
                            value: String(i + 1).padStart(2, "0")
                          }))}
                          value={child.birthDay}
                          onChange={(e) => handleDateOfBirthChange(childIndex, e)}
                          validations={[{ type: "required" }]}
                          icon={<SlCalender size={12} />}
                          disabled={isOriginalData(childIndex, 'birthDay', child.birthDay)}
                        />
                        <InputField
                          name="age"
                          placeholder={t("aboutPage.agePlaceholder")}
                          value={child.age}
                          onChange={(e) => handleChildInputChange(childIndex, e)}
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
                        name={`gender-${childIndex}`}
                        options={[
                          { label: t("cnInfo.male"), value: "male" },
                          { label: t("cnInfo.female"), value: "female" },
                          { label: t("cnInfo.other"), value: "other" }
                        ]}
                        selectedValue={child.gender}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                        disabled={isOriginalData(childIndex, 'gender', child.gender)}
                      />

                      {/* Language */}
                      <div className={styles.label}>
                        {t("cnInfo.language")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <RadioField
                        name={`language-${childIndex}`}
                        options={[
                          { label: t("cnInfo.japanese"), value: "japanese" },
                          { label: t("cnInfo.english"), value: "english" },
                          { label: t("cnInfo.both"), value: "both" }
                        ]}
                        selectedValue={child.language}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                        disabled={isOriginalData(childIndex, 'language', child.language)}
                      />

                      {/* Temperature */}
                      <div className={styles.label}>
                        {t("cnInfo.normalTemperature")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <InputField
                        name="temperature"
                        placeholder="36.5"
                        value={child.temperature}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        type="number"
                        validations={[{ type: "required" }]}
                        icon={<FaThermometerHalf size={12} />}
                        readOnly={isOriginalData(childIndex, 'temperature', child.temperature)}
                      />

                      {/* Health Status */}
                      <div className={styles.label}>
                        {t("cnInfo.healthStatus")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <SelectField
                        name="healthStatus"
                        placeholder={t("cnInfo.healthStatus")}
                        options={[
                          { label: "Excellent", value: "excellent" },
                          { label: "Good", value: "good" },
                          { label: "Fair", value: "fair" }
                        ]}
                        value={child.healthStatus}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        validations={[{ type: "required" }]}
                        icon={<BiHealth size={12} />}
                        disabled={isOriginalData(childIndex, 'healthStatus', child.healthStatus)}
                      />

                      {/* Allergies */}
                      <div className={styles.label}>
                        {t("cnInfo.allergies")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <div className={styles.fieldGroup}>
                        <RadioField
                          name={`hasAllergies-${childIndex}`}
                          options={[
                            { label: t("cnInfo.hasAllergies"), value: "yes" },
                            { label: t("cnInfo.noAllergies"), value: "no" }
                          ]}
                          selectedValue={child.hasAllergies}
                          onChange={(e) => handleChildInputChange(childIndex, e)}
                          className={styles.radioGroup}
                        />
                        {child.hasAllergies === "yes" && (
                          <InputField
                            name="allergiesDetails"
                            placeholder={t("cnInfo.allergiesDetails")}
                            value={child.allergiesDetails}
                            onChange={(e) => handleChildInputChange(childIndex, e)}
                            validations={[{ type: "required" }]}
                            readOnly={isOriginalData(childIndex, 'allergiesDetails', child.allergiesDetails)}
                          />
                        )}
                      </div>

                      {/* Personality */}
                      <div className={styles.label}>
                        {t("cnInfo.personality")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <div className={styles.fieldGroup}>
                        <RadioField
                          name={`personality-${childIndex}`}
                          options={[
                            { label: t("cnInfo.personality1"), value: "personality1" },
                            { label: t("cnInfo.personality2"), value: "personality2" },
                            { label: t("cnInfo.personality3"), value: "personality3" },
                            { label: t("cnInfo.personality4"), value: "personality4" },
                            { label: t("cnInfo.personality5"), value: "personality5" },
                            { label: t("cnInfo.others"), value: "others" }
                          ]}
                          selectedValue={child.personality}
                          onChange={(e) => handleChildInputChange(childIndex, e)}
                          className={styles.radioGroup}
                          columnsLg={8}
                          columnsMd={3}
                          columnsSm={1}
                          disabled={isOriginalData(childIndex, 'personality', child.personality)}
                        />
                        {child.personality === "others" && (
                          <InputField
                            name="personalityOther"
                            placeholder={t("cnInfo.personalityOtherPlaceholder")}
                            value={child.personalityOther}
                            onChange={(e) => handleChildInputChange(childIndex, e)}
                            validations={[{ type: "required" }]}
                            icon={<FaSmile size={12} />}
                            readOnly={isOriginalData(childIndex, 'personalityOther', child.personalityOther)}
                          />
                        )}
                      </div>

                      {/* Favorite Activities */}
                      <div className={styles.label}>
                        {t("cnInfo.favoriteActivities")}
                      </div>
                      <InputField
                        name="favoriteActivities"
                        placeholder={t("cnInfo.favoriteActivities")}
                        value={child.favoriteActivities}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        icon={<BsPersonWorkspace size={12} />}
                        readOnly={isOriginalData(childIndex, 'favoriteActivities', child.favoriteActivities)}
                      />

                      {/* Rooms for Sitting */}
                      <div className={styles.label}>
                        {t("cnInfo.roomsForSitting")}
                      </div>
                      <InputField
                        name="roomsForSitting"
                        placeholder={t("cnInfo.roomsForSitting")}
                        value={child.roomsForSitting}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        icon={<MdMeetingRoom size={12} />}
                        readOnly={isOriginalData(childIndex, 'roomsForSitting', child.roomsForSitting)}
                      />

                      {/* First Aid Kit Location */}
                      <div className={styles.label}>
                        {t("cnInfo.firstAidKitLocation")}
                      </div>
                      <InputField
                        name="firstAidKitLocation"
                        placeholder={t("cnInfo.firstAidKitLocation")}
                        value={child.firstAidKitLocation}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        icon={<GiMedicines size={12} />}
                        readOnly={isOriginalData(childIndex, 'firstAidKitLocation', child.firstAidKitLocation)}
                      />

                      {/* Sitter Requests */}
                      <div className={styles.label}>
                        {t("cnInfo.sitterRequests")}
                      </div>
                      <InputField
                        name="sitterRequests"
                        placeholder={t("cnInfo.sitterRequests")}
                        value={child.sitterRequests}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        icon={<FaSmile size={12} />}
                        readOnly={isOriginalData(childIndex, 'sitterRequests', child.sitterRequests)}
                      />
                    </div>

                    {/* Child Information Form - Save Button */}
                    <div className="d-flex justify-content-center mt-4 mb-2">
                      <Button
                        htmlType="submit"
                        type="primary"
                        text={isSubmitting ? t("buttons.saving") : t("buttons.save")}
                        className="px-10"
                        disabled={isSubmitting || isLoading}
                      />
                    </div>
                  </Form>
                </AccordionItem>
              </Accordion>

              <Accordion
                openIndex={
                  forceOpenAccordion === `${childIndex}-doctor` ? 0 : 
                  (accordionStates[`${childIndex}-doctor`] ?? null)
                }
                onToggle={(index) => handleAccordionToggle(childIndex, 'doctor', index)}
              >
                {/* Family Doctor Information */}
                <AccordionItem
                  heading={t("cnInfo.familyDoctor")}
                  label={t("cnInfo.required")}
                >
                  <Form
                    onSubmit={() => saveDoctorInfo(childIndex)}
                    setErrors={setErrors}
                    errors={errors}
                    className={styles.customerForm}
                  >
                    <div className={styles.formGrid}>
                      <div className={styles.label}>
                        {t("cnInfo.familyDoctor")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <RadioField
                        name={`hasPrimaryDoctor-${childIndex}`}
                        options={[
                          { label: t("cnInfo.hasPrimaryDoctor"), value: "yes" },
                          { label: t("cnInfo.noPrimaryDoctor"), value: "no" }
                        ]}
                        selectedValue={child.hasPrimaryDoctor}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                      />

                      {child.hasPrimaryDoctor === "yes" && (
                        <>
                          {child.doctors.map((doctor, doctorIndex) => (
                            <React.Fragment key={doctorIndex}>
                              <div className={styles.label}>
                                {t("cnInfo.primaryHospital")} {doctorIndex + 1}
                              </div>
                              <div className={styles.fieldGroup}>
                                <InputField
                                  ref={(el) => inputRefs.current[`doctor-${childIndex}-${doctorIndex}-primaryHospital`] = el}
                                  name="primaryHospital"
                                  placeholder={t("cnInfo.primaryHospital")}
                                  value={doctor.primaryHospital}
                                  onChange={(e) => handleDoctorInputChange(childIndex, doctorIndex, e)}
                                  icon={<FaHospital size={12} />}
                                  readOnly={isOriginalDoctorData(childIndex, doctorIndex, 'primaryHospital', doctor.primaryHospital)}
                                />
                                <InputField
                                  name="doctorPhone"
                                  placeholder={t("cnInfo.doctorPhone")}
                                  value={doctor.doctorPhone}
                                  onChange={(e) => handleDoctorInputChange(childIndex, doctorIndex, e)}
                                  icon={<FaPhone size={12} />}
                                  readOnly={isOriginalDoctorData(childIndex, doctorIndex, 'doctorPhone', doctor.doctorPhone)}
                                />
                                <InputField
                                  name="primaryDoctor"
                                  placeholder={t("cnInfo.primaryDoctor")}
                                  value={doctor.primaryDoctor}
                                  onChange={(e) => handleDoctorInputChange(childIndex, doctorIndex, e)}
                                  icon={<FaUser size={12} />}
                                  readOnly={isOriginalDoctorData(childIndex, doctorIndex, 'primaryDoctor', doctor.primaryDoctor)}
                                />
                              </div>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Family Doctor Form - Save Button + Add Doctor Button */}
                    <div className="d-flex flex-column align-items-center gap-3 mt-4 mb-2">
                      <div style={{ width: '300px' }}>
                        <Button
                          htmlType="submit"
                          type="primary"
                          text={isSubmitting ? t("buttons.saving") : t("buttons.save")}
                          className="px-10 w-100"
                          disabled={isSubmitting || isLoading}
                        />
                      </div>
                      {(() => {
                        const accordionOpen = (accordionStates[`${childIndex}-doctor`] === 0) || (forceOpenAccordion === `${childIndex}-doctor`);
                        const shouldShow = accordionOpen && (child.hasPrimaryDoctor === "yes");
                        return shouldShow;
                      })() && (
                        <div style={{ width: '300px' }}>
                          <Button
                            type="secondary"
                            text={t("cnInfo.addPrimaryDoctor")}
                            className="px-10 w-100"
                            onClick={() => addDoctorToChild(childIndex)}
                            icon={<FaPlus size={12} />}
                            disabled={false}
                          />
                        </div>
                      )}
                    </div>
                  </Form>
                </AccordionItem>
              </Accordion>

              <Accordion
                openIndex={
                  forceOpenAccordion === `${childIndex}-school` ? 0 : 
                  (accordionStates[`${childIndex}-school`] ?? null)
                }
                onToggle={(index) => handleAccordionToggle(childIndex, 'school', index)}
              >
                {/* School Information */}
                <AccordionItem
                  heading={t("cnInfo.schoolInfo")}
                  label={t("cnInfo.required")}
                >
                  <Form
                    onSubmit={() => saveSchoolInfo(childIndex)}
                    setErrors={setErrors}
                    errors={errors}
                    className={styles.customerForm}
                  >
                    <div className={styles.formGrid}>
                      <div className={styles.label}>
                        {t("cnInfo.schoolInfo")}{" "}
                        <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <RadioField
                        name={`hasSchool-${childIndex}`}
                        options={[
                          { label: t("cnInfo.hasSchool"), value: "yes" },
                          { label: t("cnInfo.noSchool"), value: "no" }
                        ]}
                        selectedValue={child.hasSchool}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                        columnsLg={3}
                        columnsSm={1}
                      />

                      {child.hasSchool === "yes" && (
                        <>
                          {child.schools.map((school, schoolIndex) => (
                            <React.Fragment key={schoolIndex}>
                              <div className={styles.label}>
                                {t("cnInfo.schoolName")} {schoolIndex + 1}
                              </div>
                              <div className={styles.fieldGroup}>
                                <InputField
                                  ref={(el) => inputRefs.current[`school-${childIndex}-${schoolIndex}-schoolName`] = el}
                                  name="schoolName"
                                  placeholder={t("cnInfo.schoolName")}
                                  value={school.schoolName}
                                  onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                  icon={<FaSchool size={12} />}
                                  readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'schoolName', school.schoolName)}
                                />
                                <InputField
                                  name="schoolPhone"
                                  placeholder={t("cnInfo.schoolPhone")}
                                  value={school.schoolPhone}
                                  onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                  icon={<FaPhone size={12} />}
                                  readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'schoolPhone', school.schoolPhone)}
                                />

                                {/* School Address Section */}
                                <div style={{ fontWeight: 'bold', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                                  {t("aboutPage.addressLabel")}
                                </div>
                                <div className={styles.fieldRow}>
                                  <InputField
                                    name="schoolPostalCode"
                                    placeholder={t("cnInfo.postalCode")}
                                    value={school.schoolPostalCode}
                                    onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                    icon={<MdLocationOn size={12} />}
                                    readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'schoolPostalCode', school.schoolPostalCode)}
                                  />
                                  <SelectField
                                    name="schoolPrefecture"
                                    placeholder={t("cnInfo.prefecture")}
                                    options={[
                                      { label: "Tokyo", value: "tokyo" },
                                      { label: "Osaka", value: "osaka" },
                                      { label: "Kyoto", value: "kyoto" }
                                    ]}
                                    value={school.schoolPrefecture}
                                    onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                    icon={<MdLocationOn size={12} />}
                                    disabled={isOriginalSchoolData(childIndex, schoolIndex, 'schoolPrefecture', school.schoolPrefecture)}
                                  />
                                </div>
                                <InputField
                                  name="schoolAddress1"
                                  placeholder={t("cnInfo.address1")}
                                  value={school.schoolAddress1}
                                  onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                  icon={<MdLocationOn size={12} />}
                                  readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'schoolAddress1', school.schoolAddress1)}
                                />
                                <InputField
                                  name="schoolAddress2"
                                  placeholder={t("cnInfo.address2")}
                                  value={school.schoolAddress2}
                                  onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                  icon={<MdLocationOn size={12} />}
                                  readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'schoolAddress2', school.schoolAddress2)}
                                />

                                <InputField
                                  name="homeroom"
                                  placeholder={t("cnInfo.homeroom")}
                                  value={school.homeroom}
                                  onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                  icon={<FaChalkboardTeacher size={12} />}
                                  readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'homeroom', school.homeroom)}
                                />
                                <InputField
                                  name="grade"
                                  placeholder={t("cnInfo.grade")}
                                  value={school.grade}
                                  onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                  icon={<FaGraduationCap size={12} />}
                                  readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'grade', school.grade)}
                                />
                                <InputField
                                  name="class"
                                  placeholder={t("cnInfo.class")}
                                  value={school.class}
                                  onChange={(e) => handleSchoolInputChange(childIndex, schoolIndex, e)}
                                  icon={<FaBook size={12} />}
                                  readOnly={isOriginalSchoolData(childIndex, schoolIndex, 'class', school.class)}
                                />
                              </div>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </div>

                    {/* School Information Form - Save Button + Add School Button */}
                    <div className="d-flex flex-column align-items-center gap-3 mt-4 mb-2">
                      <div style={{ width: '300px' }}>
                        <Button
                          htmlType="submit"
                          type="primary"
                          text={isSubmitting ? t("buttons.saving") : t("buttons.save")}
                          className="px-10 w-100"
                          disabled={isSubmitting || isLoading}
                        />
                      </div>
                      {(() => {
                        const accordionOpen = (accordionStates[`${childIndex}-school`] === 0) || (forceOpenAccordion === `${childIndex}-school`);
                        const shouldShow = accordionOpen && (child.hasSchool === "yes");
                        return shouldShow;
                      })() && (
                        <div style={{ width: '300px' }}>
                          <Button
                            type="secondary"
                            text={t("cnInfo.addSchool")}
                            className="px-10 w-100"
                            onClick={() => addSchoolToChild(childIndex)}
                            icon={<FaPlus size={12} />}
                            disabled={false}
                          />
                        </div>
                      )}
                    </div>
                  </Form>
                </AccordionItem>
              </Accordion>
            </React.Fragment>
          ))}

          {/* Final Buttons Outside Accordions */}
          <div className="d-flex flex-column align-items-center gap-3 mt-4 mb-4">
            <div style={{ width: '300px' }}>
              <Button
                type="secondary"
                text={t("cnInfo.addChild")}
                className="px-10 w-100"
                onClick={addNewChild}
                icon={<FaPlus size={12} />}
              />
            </div>
            <div style={{ width: '300px' }}>
              <Button
                type="primary"
                text={t("buttons.submit")}
                className="px-10 w-100"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>
        </div>
      </ClientLayout>
    </>
  );
} 