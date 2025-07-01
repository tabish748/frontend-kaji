import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { useLanguage } from "@/localization/LocalContext";
import { useRouter } from "next/router";
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
import {
  FaUser,
  FaPhone,
  FaThermometerHalf,
  FaHospital,
  FaSchool,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaSmile,
  FaBook,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { BiHomeAlt2, BiHealth } from "react-icons/bi";
import {
  MdOutlineHomeWork,
  MdChildCare,
  MdFavorite,
  MdLocalHospital,
  MdMeetingRoom,
  MdLocationOn,
} from "react-icons/md";
import { TbLanguage } from "react-icons/tb";
import { GiMedicines } from "react-icons/gi";
import { BsPersonWorkspace } from "react-icons/bs";
import ApiHandler from "@/app/api-handler";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);

  // Form errors state
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});

  // Accordion state management for tracking which accordions have been opened
  const [hasOpenedAccordions, setHasOpenedAccordions] = useState<
    Record<string, boolean>
  >({});
  const [forceOpenAccordion, setForceOpenAccordion] = useState<string | null>(
    null
  );
  const [accordionStates, setAccordionStates] = useState<
    Record<string, number | null>
  >({});

  // Refs for focus management
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Track original/fetched data to distinguish from user input
  const [originalData, setOriginalData] = useState<Child[]>([]);

  // Add state for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    prefectures: [] as { label: string; value: string }[],
    languages: [] as { label: string; value: string }[],
    genders: [] as { label: string; value: string }[],
    healthStatus: [] as { label: string; value: string }[],
    personality: [] as { label: string; value: string }[],
  });

  // Children state - array of children
  const [children, setChildren] = useState<Child[]>([]);

  // Helper to check if a child is empty (for hiding delete icon on extra child)
  const isEmptyChild = (child: Child) =>
    !child.firstName &&
    !child.lastName &&
    !child.firstNameKana &&
    !child.lastNameKana &&
    !child.nickname &&
    !child.birthYear &&
    !child.birthMonth &&
    !child.birthDay &&
    !child.age &&
    !child.gender &&
    !child.language &&
    !child.temperature &&
    !child.healthStatus &&
    !child.hasAllergies &&
    !child.allergiesDetails &&
    !child.personality &&
    !child.personalityOther &&
    !child.favoriteActivities &&
    !child.roomsForSitting &&
    !child.firstAidKitLocation &&
    !child.sitterRequests &&
    (!child.doctors || child.doctors.length === 0) &&
    (!child.schools || child.schools.length === 0);

  // Track the number of children returned from the API
  const [apiChildrenCount, setApiChildrenCount] = useState(0);

  // Load children data from API
  useEffect(() => {
    if (router.isReady) {
      loadAllDropdownOptions();
    loadChildrenData();
    }
  }, [router.isReady]);

  // Open first child's first accordion by default after data is loaded
  useEffect(() => {
    if (children.length > 0 && !isLoading) {
      // Check if no accordions are currently open
      const hasAnyOpenAccordion = Object.values(accordionStates).some(
        (state) => state !== null
      );

      if (!hasAnyOpenAccordion) {
        // Open the first child's first accordion by default
        setAccordionStates((prev) => ({
          ...prev,
          "0-child": 0, // Open first child's child info accordion
        }));
        setHasOpenedAccordions((prev) => ({ ...prev, "0-child": true }));
      }
    }
  }, [children, isLoading]);

  // Handle force open accordion effect
  useEffect(() => {
    if (forceOpenAccordion) {
      // Close all other accordions for this child first
      const [childIndex, accordionType] = forceOpenAccordion.split("-");
      const childKey = childIndex;

      // Set all accordion states for this child to closed, except the target one
      setAccordionStates((prev) => ({
        ...prev,
        [`${childKey}-child`]:
          forceOpenAccordion === `${childKey}-child` ? 0 : null,
        [`${childKey}-doctor`]:
          forceOpenAccordion === `${childKey}-doctor` ? 0 : null,
        [`${childKey}-school`]:
          forceOpenAccordion === `${childKey}-school` ? 0 : null,
      }));

      // Ensure the force-opened accordion is marked as opened
      setHasOpenedAccordions((prev) => ({
        ...prev,
        [forceOpenAccordion]: true,
      }));

      // Clear the force open state after a short delay
      setTimeout(() => {
        setForceOpenAccordion(null);
      }, 100);
    }
  }, [forceOpenAccordion]);

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
              value: item.value.toString(),
            })) || [],
          genders:
            response.data.gender?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(),
            })) || [],
          healthStatus:
            response.data.health_statuses?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(),
            })) || [],
          personality:
            response.data.personalities?.map((item: any) => ({
              label: item.label,
              value: item.value.toString(),
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
        type: "fail",
      });
    }
  };

  const loadChildrenData = async () => {
    try {
      setIsLoading(true);
      
      const response = await ApiHandler.request(
        '/api/customer/first-time-children-info/show',
        'GET',
        null,
        null,
        null,
        true
      );

      if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
        setApiChildrenCount(response.data.length);
        // Transform API data to match our component structure
        const transformedChildren = response.data.map((apiChild: any) => {
          // Parse date of birth
          const dob = new Date(apiChild.dob);
          const birthYear = dob.getFullYear().toString();
          const birthMonth = (dob.getMonth() + 1).toString().padStart(2, "0");
          const birthDay = dob.getDate().toString().padStart(2, "0");

          // Transform doctors data
          const doctors = apiChild.hospitals?.map((hospital: any) => ({
            id: undefined, // API doesn't provide doctor ID
            primaryHospital: hospital.hospital_name || "",
            doctorPhone: hospital.phone || "",
            primaryDoctor: hospital.doctor || "",
          })) || [];

          // Transform schools data
          const schools = apiChild.schools?.map((school: any) => ({
            id: undefined, // API doesn't provide school ID
            schoolName: school.school_name || "",
            schoolPhone: school.phone || "",
            schoolPostalCode: school.post_code || "",
            schoolPrefecture: school.prefecture_id?.toString() || "",
            schoolAddress1: school.address1 || "",
            schoolAddress2: school.address2 || "",
            homeroom: school.teacher_name || "",
            grade: school.grade || "",
            class: school.class || "",
          })) || [];

          // Parse name (assuming format "First Last")
          const nameParts = apiChild.name?.split(' ') || ['', ''];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Parse name_kana (assuming format "First Last")
          const kanaNameParts = apiChild.name_kana?.split(' ') || ['', ''];
          const firstNameKana = kanaNameParts[0] || '';
          const lastNameKana = kanaNameParts.slice(1).join(' ') || '';

          return {
            id: apiChild.id?.toString(),
            lastName,
            firstName,
            lastNameKana,
            firstNameKana,
            nickname: apiChild.nickname || "",
            birthYear,
            birthMonth,
            birthDay,
            age: apiChild.age?.toString() || "",
            gender: apiChild.gender?.toString() || "",
            language: apiChild.language?.toString() || "",
            temperature: apiChild.normal_temprature || "",
            healthStatus: apiChild.health_status?.toString() || "",
            hasAllergies: apiChild.allergy === 1 ? "yes" : "no",
            allergiesDetails: apiChild.allergy_details || "",
            personality: apiChild.personality?.[0]?.toString() || "",
            personalityOther: apiChild.personality_others?.[0] || "",
            favoriteActivities: apiChild.favorite_activity || "",
            roomsForSitting: apiChild.room_for_sitting || "",
            firstAidKitLocation: apiChild.ist_aid_kit_location || "",
            sitterRequests: apiChild.childcare_policy || "",
            hasPrimaryDoctor: doctors.length > 0 ? "yes" : "no",
            doctors,
            hasSchool: schools.length > 0 ? "yes" : "no",
            schools,
          };
        });

        setChildren(transformedChildren);
        setOriginalData([...transformedChildren]); // Store original data without empty template
        console.log("Children data loaded successfully:", transformedChildren);
      } else {
        setApiChildrenCount(0);
        // No children found - show one empty child
        const emptyChild: Child = {
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
          gender: "1",
          language: "1",
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
          schools: [],
        };
        setChildren([emptyChild]);
        setOriginalData([]);
      }
    } catch (error: any) {
      setApiChildrenCount(0);
      console.error("Error loading children data:", error);
      
      // Even on error, show one empty child so user can still add children
      const emptyChild: Child = {
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
        gender: "1",
        language: "1",
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
        schools: [],
      };
      setChildren([emptyChild]);
      setOriginalData([]);
      
      setToast({
        message: error.message || "Error loading children data",
        type: "fail",
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
    const fieldName = name.includes("-") ? name.split("-")[0] : name;

    setChildren((prev) =>
      prev.map((child, index) => {
        if (index === childIndex) {
          const updatedChild = { ...child, [fieldName]: value };

          // Auto-add first doctor when selecting "yes" for hasPrimaryDoctor
          if (
            fieldName === "hasPrimaryDoctor" &&
            value === "yes" &&
            child.doctors.length === 0
          ) {
            updatedChild.doctors = [
              {
                id: undefined,
                primaryHospital: "",
                doctorPhone: "",
                primaryDoctor: "",
              },
            ];
          }

          // Auto-add first school when selecting "yes" for hasSchool
          if (
            fieldName === "hasSchool" &&
            value === "yes" &&
            child.schools.length === 0
          ) {
            updatedChild.schools = [
              {
                id: undefined,
                schoolName: "",
                schoolPhone: "",
                schoolPostalCode: "",
                schoolPrefecture: "",
                schoolAddress1: "",
                schoolAddress2: "",
                homeroom: "",
                grade: "",
                class: "",
              },
            ];
          }

          return updatedChild;
        }
        return child;
      })
    );
  };

  const handleDateOfBirthChange = (
    childIndex: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedChildren = [...children];
    updatedChildren[childIndex] = {
      ...updatedChildren[childIndex],
      [name]: value,
    };

    const child = updatedChildren[childIndex];
    if (child.birthYear && child.birthMonth && child.birthDay) {
      const dob = `${child.birthYear}-${child.birthMonth.padStart(
        2,
        "0"
      )}-${child.birthDay.padStart(2, "0")}`;
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
      schools: [],
    };
    setChildren((prev) => [...prev, newChild]);
  };

  // Add new doctor to specific child
  const addDoctorToChild = (childIndex: number) => {
    const newDoctor: Doctor = {
      id: undefined,
      primaryHospital: "",
      doctorPhone: "",
      primaryDoctor: "",
    };
    setChildren((prev) =>
      prev.map((child, index) =>
        index === childIndex
          ? { ...child, doctors: [...child.doctors, newDoctor] }
          : child
      )
    );
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
      class: "",
    };
    setChildren((prev) =>
      prev.map((child, index) =>
        index === childIndex
          ? { ...child, schools: [...child.schools, newSchool] }
          : child
      )
    );
  };

  // Handle doctor input changes
  const handleDoctorInputChange = (
    childIndex: number,
    doctorIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    let { name, value } = e.target;
    // If name is like 'primaryHospital-0', extract the base name
    if (name.includes('-')) {
      name = name.split('-')[0];
    }
    setChildren((prev) =>
      prev.map((child, cIndex) =>
        cIndex === childIndex
          ? {
              ...child,
              doctors: child.doctors.map((doctor, dIndex) =>
                dIndex === doctorIndex ? { ...doctor, [name]: value } : doctor
              ),
            }
          : child
      )
    );
  };

  // Handle school input changes
  const handleSchoolInputChange = (
    childIndex: number,
    schoolIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    if (name.includes('-')) {
      name = name.split('-')[0];
    }
    setChildren((prev) =>
      prev.map((child, cIndex) =>
        cIndex === childIndex
          ? {
              ...child,
              schools: child.schools.map((school, sIndex) =>
                sIndex === schoolIndex ? { ...school, [name]: value } : school
              ),
            }
          : child
      )
    );
  };

  // Handle accordion toggle
  const handleAccordionToggle = (
    childIndex: number,
    accordionType: "child" | "doctor" | "school",
    accordionIndex: number
  ) => {
    try {
      const key = `${childIndex}-${accordionType}`;
      console.log(`🚀 handleAccordionToggle called:`, {
        childIndex,
        accordionType,
        accordionIndex,
        key,
      });

      // Check if this accordion is currently open
      const isCurrentlyOpen = accordionStates[key] === accordionIndex;

      if (isCurrentlyOpen) {
        console.log(`Closing accordion: ${key}`);
        // Close this accordion
        setAccordionStates((prev) => ({
          ...prev,
          [key]: null,
        }));
      } else {
        console.log(`Opening accordion: ${key}`);
        // Close all other accordions for this child and open the target one
        setAccordionStates((prev) => ({
          ...prev,
          [`${childIndex}-child`]:
            accordionType === "child" ? accordionIndex : null,
          [`${childIndex}-doctor`]:
            accordionType === "doctor" ? accordionIndex : null,
          [`${childIndex}-school`]:
            accordionType === "school" ? accordionIndex : null,
        }));
      }

      // Mark as opened
      setHasOpenedAccordions((prev) => ({ ...prev, [key]: true }));

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
      
      // Prepare form data for child save API
      const formData = new FormData();
      formData.append("child_id", childData.id || "_new");
      formData.append("first_name", childData.firstName);
      formData.append("last_name", childData.lastName);
      formData.append("first_name_kana", childData.firstNameKana);
      formData.append("last_name_kana", childData.lastNameKana);
      formData.append("nickname", childData.nickname);
      formData.append("dob_year", childData.birthYear);
      formData.append("dob_month", childData.birthMonth);
      formData.append("dob_day", childData.birthDay);
      formData.append("age", childData.age);
      formData.append("gender", childData.gender);
      formData.append("language", childData.language);
      formData.append("normal_temprature", childData.temperature);
      formData.append("health_status", childData.healthStatus);
      formData.append("allergy", childData.hasAllergies === "yes" ? "1" : "0");
      formData.append("home_status", "");
      formData.append("allergy_details", childData.allergiesDetails);
      
      // Handle personality array - set all to empty first, then set the selected one
      for (let i = 0; i <= 6; i++) {
        formData.append(`personality[${i}]`, "");
      }
      if (childData.personality && childData.personality !== "others") {
        formData.append(`personality[${childData.personality}]`, childData.personality);
      }
      
      // Handle personality others
      formData.append("personality_others[0]", childData.personalityOther || "");
      
      formData.append("favorite_activity", childData.favoriteActivities);
      formData.append("room_for_sitting", childData.roomsForSitting);
      formData.append("ist_aid_kit_location", childData.firstAidKitLocation);
      formData.append("childcare_policy", childData.sitterRequests);

      const response = await ApiHandler.request(
        '/api/customer/first-time-child-info/save',
        'POST',
        formData,
        null,
        null,
        true
      );

      if (response.success) {
        // Update child with returned ID if it's a new child
        if (response.data && response.data.id) {
          setChildren(prev => prev.map((child, index) =>
            index === childIndex ? { ...child, id: response.data.id.toString() } : child
          ));
        }

        setToast({
          message: "Child information saved successfully",
          type: "success",
        });

        await loadChildrenData(); // Refetch children after save

        // Auto-open next accordion (doctor) after successful save
        setTimeout(() => {
          const nextAccordionKey = `${childIndex}-doctor`;
          setForceOpenAccordion(nextAccordionKey);
          setHasOpenedAccordions((prev) => ({
            ...prev,
            [nextAccordionKey]: true,
          }));
        }, 500);
      } else {
        // Handle API validation errors
        let errorMsg = response.message || "Save failed";
        if (response.errors) {
          // Flatten all error messages into a single array
          const allErrors = Object.values(response.errors).flat();
          errorMsg = allErrors.join(" ");
        }
        setToast({
          message: errorMsg,
          type: "fail",
        });
      }
    } catch (error: any) {
      setToast({
        message: error.message || "Error saving child information",
        type: "fail",
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
      
      // Prepare form data for doctor save API
      const formData = new FormData();
      formData.append("child_id", childData.id || "");
      formData.append("primary_care_physician", childData.hasPrimaryDoctor === "yes" ? "1" : "0");
      
      // Add doctor information if there are doctors
      if (childData.doctors && childData.doctors.length > 0) {
        childData.doctors.forEach((doctor, index) => {
          formData.append(`doc_info[${index}][hospital_name]`, doctor.primaryHospital);
          formData.append(`doc_info[${index}][phone]`, doctor.doctorPhone);
          formData.append(`doc_info[${index}][doctor]`, doctor.primaryDoctor);
        });
      }

      const response = await ApiHandler.request(
        '/api/customer/first-time-child-doctor/save',
        'POST',
        formData,
        null,
        null,
        true
      );

      if (response.success) {
        setToast({
          message: "Doctor information saved successfully",
          type: "success",
        });

        await loadChildrenData(); // Refetch children after save

        // Auto-open next accordion (school) after successful save
        setTimeout(() => {
          const nextAccordionKey = `${childIndex}-school`;
          setForceOpenAccordion(nextAccordionKey);
          setHasOpenedAccordions((prev) => ({
            ...prev,
            [nextAccordionKey]: true,
          }));
        }, 500);
      } else {
        // Handle API validation errors
        let errorMsg = response.message || "Save failed";
        if (response.errors) {
          // Flatten all error messages into a single array
          const allErrors = Object.values(response.errors).flat();
          errorMsg = allErrors.join(" ");
        }
        setToast({
          message: errorMsg,
          type: "fail",
        });
      }
    } catch (error: any) {
      setToast({
        message: error.message || "Error saving doctor information",
        type: "fail",
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
      
      // Prepare form data for school save API
      const formData = new FormData();
      formData.append("child_id", childData.id || "");
      formData.append("has_school", childData.hasSchool === "yes" ? "1" : "0");
      
      // Add school information if there are schools
      if (childData.schools && childData.schools.length > 0) {
        childData.schools.forEach((school, index) => {
          formData.append(`school_info[${index}][school_name]`, school.schoolName);
          formData.append(`school_info[${index}][phone]`, school.schoolPhone);
          formData.append(`school_info[${index}][post_code]`, school.schoolPostalCode);
          formData.append(`school_info[${index}][prefecture_id]`, school.schoolPrefecture);
          formData.append(`school_info[${index}][address1]`, school.schoolAddress1);
          formData.append(`school_info[${index}][address2]`, school.schoolAddress2);
          formData.append(`school_info[${index}][teacher_name]`, school.homeroom);
          formData.append(`school_info[${index}][grade]`, school.grade);
          formData.append(`school_info[${index}][class]`, school.class);
        });
      }

      const response = await ApiHandler.request(
        '/api/customer/first-time-child-school/save',
        'POST',
        formData,
        null,
        null,
        true
      );

      if (response.success) {
        setToast({
          message: "School information saved successfully",
          type: "success",
        });

        await loadChildrenData(); // Refetch children after save

        // Close current accordion since this is the last one
        setTimeout(() => {
          setAccordionStates((prev) => ({
            ...prev,
            [`${childIndex}-school`]: null,
          }));
        }, 500);
      } else {
        // Handle API validation errors
        let errorMsg = response.message || "Save failed";
        if (response.errors) {
          // Flatten all error messages into a single array
          const allErrors = Object.values(response.errors).flat();
          errorMsg = allErrors.join(" ");
        }
        setToast({
          message: errorMsg,
          type: "fail",
        });
      }
    } catch (error: any) {
      setToast({
        message: error.message || "Error saving school information",
        type: "fail",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit all data
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Call the profile completion API endpoint
      const response = await ApiHandler.request(
        '/api/customer/first-time-profile_completion/save',
        'POST',
        null,
        null,
        null,
        true
      );

      if (response.success) {
        // Update localStorage with new profile completion data if available
        if (response.data && response.data.profile_completion_steps) {
          const loggedInUser = localStorage.getItem("loggedInUser");
          if (loggedInUser) {
            const userData = JSON.parse(loggedInUser);
            const updatedUserData = {
              ...userData,
              profile_completed: response.data.profile_completed || userData.profile_completed,
              profile_completion_steps: {
                ...userData.profile_completion_steps,
                ...response.data.profile_completion_steps
              }
            };
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));
          }
        }

        setToast({
          message: "Profile completion submitted successfully",
          type: "success",
        });

        // Redirect to home page after successful completion
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        throw new Error(response.message || "Profile completion failed");
      }
    } catch (error: any) {
      setToast({
        message: error.message || "Error submitting profile completion",
        type: "fail",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add remove handlers
  const removeDoctorFromChild = (childIndex: number, doctorIndex: number) => {
    setChildren((prev) =>
      prev.map((child, cIndex) =>
        cIndex === childIndex
          ? { ...child, doctors: child.doctors.filter((_, dIndex) => dIndex !== doctorIndex) }
          : child
      )
    );
  };

  const removeSchoolFromChild = (childIndex: number, schoolIndex: number) => {
    setChildren((prev) =>
      prev.map((child, cIndex) =>
        cIndex === childIndex
          ? { ...child, schools: child.schools.filter((_, sIndex) => sIndex !== schoolIndex) }
          : child
      )
    );
  };

  const removeChild = async (childIndex: number) => {
    const childToRemove = children[childIndex];
    if (childToRemove.id) {
      try {
        setIsLoading(true);
        const response = await ApiHandler.request(
          `/api/customer/first-time-profile_completion/child/destroy/${childToRemove.id}`,
          'DELETE',
          null,
          null,
          null,
          true
        );
        if (response.success) {
          setToast({ message: 'Child deleted successfully', type: 'success' });
          setChildren((prev) => prev.length > 1 ? prev.filter((_, cIndex) => cIndex !== childIndex) : prev);
        } else {
          setToast({ message: response.message || 'Failed to delete child', type: 'fail' });
        }
      } catch (error: any) {
        setToast({ message: error.message || 'Error deleting child', type: 'fail' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setChildren((prev) => prev.length > 1 ? prev.filter((_, cIndex) => cIndex !== childIndex) : prev);
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

        <div className="d-flex flex-column gap-2">
          <h1 className={styleHeader.topHeading}>
            {t("cnInfo.childInfoForm")}
          </h1>

          {children.map((child, childIndex) => (
            <React.Fragment key={childIndex}>
              {childIndex > 0 && <div className="seperator-line primary" style={{ margin: "24px 0" }} />}
              <Accordion
                openIndex={
                  forceOpenAccordion === `${childIndex}-child`
                    ? 0
                    : accordionStates[`${childIndex}-child`] ?? null
                }
                onToggle={(index) =>
                  handleAccordionToggle(childIndex, "child", index)
                }
              >
                <AccordionItem
                  heading={
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>{t("cnInfo.childInfo")} {childIndex + 1}</span>
                      {children.length > 1 && !isEmptyChild(child) && (
                        <button
                          type="button"
                          onClick={() => removeChild(childIndex)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#d9534f", marginLeft: 8 }}
                          title="Remove Child"
                          aria-label="Remove Child"
                        >
                          <FaTrash size={18} />
                        </button>
                      )}
                    </div>
                  }
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
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldRow}>
                          <InputField
                            ref={(el) =>
                              (inputRefs.current[
                                `${childIndex}-child-lastName`
                              ] = el)
                            }
                            name="lastName"
                            placeholder={t("cncontactform.lastnamePlaceholder")}
                            value={child.lastName}
                            onChange={(e) =>
                              handleChildInputChange(childIndex, e)
                            }
                            validations={[{ type: "required" }]}
                            icon={<FaUser size={12} />}

                          />
                          <InputField
                            name="firstName"
                            placeholder={t("aboutPage.firstNamePlaceholder")}
                            value={child.firstName}
                            onChange={(e) =>
                              handleChildInputChange(childIndex, e)
                            }
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
                            value={child.lastNameKana}
                            onChange={(e) =>
                              handleChildInputChange(childIndex, e)
                            }
                            validations={[{ type: "required" }]}
                            icon={<FaUser size={12} />}

                          />
                          <InputField
                            name="firstNameKana"
                            placeholder={
                              t("aboutPage.firstNamePlaceholder") + " (Kana)"
                            }
                            value={child.firstNameKana}
                            onChange={(e) =>
                              handleChildInputChange(childIndex, e)
                            }
                            validations={[{ type: "required" }]}
                            icon={<FaUser size={12} />}
                          />
                        </div>
                      </div>

                      {/* Nickname */}
                      <div className={styles.label}>
                        {t("cnInfo.nickname")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <InputField
                        name="nickname"
                        placeholder={t("cnInfo.nickname")}
                        value={child.nickname}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        validations={[{ type: "required" }]}
                        icon={<MdChildCare size={12} />}
                      />

                      {/* Date of Birth */}
                      <div className={styles.label}>
                        {t("cnInfo.dateOfBirth")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <div className={styles.dateGroup}>
                        <SelectField
                          name="birthYear"
                          placeholder={t("aboutPage.yearPlaceholder")}
                          options={Array.from({ length: 20 }, (_, i) => ({
                            label: String(new Date().getFullYear() - i),
                            value: String(new Date().getFullYear() - i),
                          }))}
                          value={child.birthYear}
                          onChange={(e) =>
                            handleDateOfBirthChange(childIndex, e)
                          }
                          validations={[{ type: "required" }]}
                          icon={<SlCalender size={12} />}
                        />
                        <SelectField
                          name="birthMonth"
                          placeholder={t("aboutPage.monthPlaceholder")}
                          options={Array.from({ length: 12 }, (_, i) => ({
                            label: String(i + 1),
                            value: String(i + 1).padStart(2, "0"),
                          }))}
                          value={child.birthMonth}
                          onChange={(e) =>
                            handleDateOfBirthChange(childIndex, e)
                          }
                          validations={[{ type: "required" }]}
                          icon={<SlCalender size={12} />}
                        />
                        <SelectField
                          name="birthDay"
                          placeholder={t("aboutPage.dayPlaceholder")}
                          options={Array.from({ length: 31 }, (_, i) => ({
                            label: String(i + 1),
                            value: String(i + 1).padStart(2, "0"),
                          }))}
                          value={child.birthDay}
                          onChange={(e) =>
                            handleDateOfBirthChange(childIndex, e)
                          }
                          validations={[{ type: "required" }]}
                          icon={<SlCalender size={12} />}
                        />
                        <InputField
                          name="age"
                          placeholder={t("aboutPage.agePlaceholder")}
                          value={child.age}
                          onChange={(e) =>
                            handleChildInputChange(childIndex, e)
                          }
                          icon={<SlCalender size={12} />}
                        />
                      </div>

                      {/* Gender */}
                      <div className={styles.label}>
                        {t("cnInfo.gender")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <RadioField
                        name={`gender-${childIndex}`}
                        options={dropdownOptions.genders}
                        selectedValue={child.gender}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                      />

                      {/* Language */}
                      <div className={styles.label}>
                        {t("cnInfo.language")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <RadioField
                        name={`language-${childIndex}`}
                        options={dropdownOptions.languages}
                        selectedValue={child.language}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                      />

                      {/* Temperature */}
                      <div className={styles.label}>
                        {t("cnInfo.normalTemperature")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <InputField
                        name="temperature"
                        placeholder="36.5"
                        value={child.temperature}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        type="number"
                        validations={[
                          { type: "required" },
                          { type: "min", value: 30, message: "Temperature must be at least 30°C" },
                          { type: "max", value: 45, message: "Temperature must be at most 45°C" }
                        ]}

                        icon={<FaThermometerHalf size={12} />}
                        
                      />

                      {/* Health Status */}
                      <div className={styles.label}>
                        {t("cnInfo.healthStatus")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <SelectField
                        name="healthStatus"
                        placeholder={t("cnInfo.healthStatus")}
                        options={dropdownOptions.healthStatus}
                        value={child.healthStatus}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        validations={[{ type: "required" }]}
                        icon={<BiHealth size={12} />}
                      />

                      {/* Allergies */}
                      <div className={styles.label}>
                        {t("cnInfo.allergies")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <div className={styles.fieldGroup}>
                        <RadioField
                          name={`hasAllergies-${childIndex}`}
                          options={[
                            { label: t("cnInfo.hasAllergies"), value: "yes" },
                            { label: t("cnInfo.noAllergies"), value: "no" },
                          ]}
                          selectedValue={child.hasAllergies}
                          onChange={(e) =>
                            handleChildInputChange(childIndex, e)
                          }
                          className={styles.radioGroup}
                        />
                        {child.hasAllergies === "yes" && (
                          <InputField
                            name="allergiesDetails"
                            placeholder={t("cnInfo.allergiesDetails")}
                            value={child.allergiesDetails}
                            onChange={(e) =>
                              handleChildInputChange(childIndex, e)
                            }
                            validations={[{ type: "required" }]}
                          />
                        )}
                      </div>

                      {/* Personality */}
                      <div className={styles.label}>
                        {t("cnInfo.personality")}{" "}
                        <span className="cn-labelWarn">
                          {t("cnInfo.required")}
                        </span>
                      </div>
                      <div className={styles.fieldGroup}>
                        <RadioField
                          name={`personality-${childIndex}`}
                          options={dropdownOptions.personality.length > 0 ? dropdownOptions.personality : [
                            { label: "Loading...", value: "" }
                          ]}
                          selectedValue={child.personality}
                          onChange={(e) =>
                            handleChildInputChange(childIndex, e)
                          }
                          className={styles.radioGroup}
                        />
                        {child.personality === "6" && (
                          <InputField
                            name="personalityOther"
                            placeholder={t(
                              "cnInfo.personalityOtherPlaceholder"
                            )}
                            value={child.personalityOther}
                            onChange={(e) =>
                              handleChildInputChange(childIndex, e)
                            }
                            validations={[{ type: "required" }]}
                            icon={<FaSmile size={12} />}
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
                      />
                    </div>

                    {/* Child Information Form - Save Button */}
                    <div className="d-flex justify-content-center mt-4 mb-2">
                      <Button
                        htmlType="submit"
                        type="primary"
                        text={
                          isSubmitting ? t("buttons.saving") : t("buttons.save")
                        }
                        className="px-10"
                        disabled={isSubmitting || isLoading}
                      />
                    </div>
                  </Form>
                </AccordionItem>
              </Accordion>

              <Accordion
                openIndex={
                  forceOpenAccordion === `${childIndex}-doctor`
                    ? 0
                    : accordionStates[`${childIndex}-doctor`] ?? null
                }
                onToggle={(index) =>
                  handleAccordionToggle(childIndex, "doctor", index)
                }
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
                        {t("cnInfo.familyDoctor")} <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <RadioField
                        name={`hasPrimaryDoctor-${childIndex}`}
                        options={[
                          { label: t("cnInfo.hasPrimaryDoctor"), value: "yes" },
                          { label: t("cnInfo.noPrimaryDoctor"), value: "no" },
                        ]}
                        selectedValue={child.hasPrimaryDoctor}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                      />
                      {child.hasPrimaryDoctor === "yes" && (
                        <>
                          {child.doctors.map((doctor, doctorIndex) => (
                            <React.Fragment key={doctorIndex}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className={styles.label} style={{ fontWeight: "bold" }}>
                                  {t("cnInfo.primaryHospital")} {doctorIndex + 1} <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                                </div>
                                {child.doctors.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeDoctorFromChild(childIndex, doctorIndex)}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#d9534f", marginLeft: 8 }}
                                    title="Remove Doctor"
                                    aria-label="Remove Doctor"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                )}
                              </div>
                              <div className={styles.fieldGroup}>
                                <InputField
                                  ref={(el) =>
                                    (inputRefs.current[
                                      `doctor-${childIndex}-${doctorIndex}-primaryHospital`
                                    ] = el)
                                  }
                                  name={`primaryHospital-${doctorIndex}`}
                                  placeholder={t("cnInfo.primaryHospital")}
                                  value={doctor.primaryHospital}
                                  onChange={(e) =>
                                    handleDoctorInputChange(
                                      childIndex,
                                      doctorIndex,
                                      e
                                    )
                                  }
                                  icon={<FaHospital size={12} />}
                                  validations={[{ type: "required" }]}
                                />
                                <InputField
                                  name={`doctorPhone-${doctorIndex}`}
                                  placeholder={t("cnInfo.doctorPhone")}
                                  value={doctor.doctorPhone}
                                  onChange={(e) =>
                                    handleDoctorInputChange(
                                      childIndex,
                                      doctorIndex,
                                      e
                                    )
                                  }
                                  type="tel"
                                  validations={[
                                    { type: "required" },
                                    { type: "pattern", pattern: /^[0-9\-\+\(\)\s]+$/, message: "Please enter a valid phone number" }
                                  ]}
                                  icon={<FaPhone size={12} />}
                                />
                                <InputField
                                  name={`primaryDoctor-${doctorIndex}`}
                                  placeholder={t("cnInfo.primaryDoctor")}
                                  value={doctor.primaryDoctor}
                                  onChange={(e) =>
                                    handleDoctorInputChange(
                                      childIndex,
                                      doctorIndex,
                                      e
                                    )
                                  }
                                  icon={<FaUser size={12} />}
                                  validations={[{ type: "required" }]}
                                />
                              </div>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Family Doctor Form - Save Button + Add Doctor Button */}
                    <div className="d-flex flex-column align-items-center gap-3 mt-4 mb-2">
                      <div style={{ width: "300px" }}>
                        <Button
                          htmlType="submit"
                          type="primary"
                          text={
                            isSubmitting
                              ? t("buttons.saving")
                              : t("buttons.save")
                          }
                          className="px-10 w-100"
                          disabled={isSubmitting || isLoading}
                        />
                      </div>
                      {(() => {
                        const accordionOpen =
                          accordionStates[`${childIndex}-doctor`] === 0 ||
                          forceOpenAccordion === `${childIndex}-doctor`;
                        const shouldShow =
                          accordionOpen && child.hasPrimaryDoctor === "yes";
                        return shouldShow;
                      })() && (
                        <div style={{ width: "300px" }}>
                          <Button
                            type="secondary"
                            text={t("cnInfo.addPrimaryDoctor")}
                            className="px-10 w-100"
                            onClick={() => addDoctorToChild(childIndex)}
                            icon={<FaPlus size={12} />}
                          />
                        </div>
                      )}
                    </div>
                  </Form>
                </AccordionItem>
              </Accordion>

              <Accordion
                openIndex={
                  forceOpenAccordion === `${childIndex}-school`
                    ? 0
                    : accordionStates[`${childIndex}-school`] ?? null
                }
                onToggle={(index) =>
                  handleAccordionToggle(childIndex, "school", index)
                }
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
                        {t("cnInfo.schoolInfo")} <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                      </div>
                      <RadioField
                        name={`hasSchool-${childIndex}`}
                        options={[
                          { label: t("cnInfo.hasSchool"), value: "yes" },
                          { label: t("cnInfo.noSchool"), value: "no" },
                        ]}
                        selectedValue={child.hasSchool}
                        onChange={(e) => handleChildInputChange(childIndex, e)}
                        className={styles.radioGroup}
                      />
                      {child.hasSchool === "yes" && (
                        <>
                          {child.schools.map((school, schoolIndex) => (
                            <React.Fragment key={schoolIndex}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className={styles.label} style={{ fontWeight: "bold" }}>
                                  {t("cnInfo.schoolName")} {schoolIndex + 1} <span className="cn-labelWarn">{t("cnInfo.required")}</span>
                                </div>
                                {child.schools.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSchoolFromChild(childIndex, schoolIndex)}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#d9534f", marginLeft: 8 }}
                                    title="Remove School"
                                    aria-label="Remove School"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                )}
                              </div>
                              <div className={styles.fieldGroup}>
                                <InputField
                                  ref={(el) =>
                                    (inputRefs.current[
                                      `schoolName-${schoolIndex}`
                                    ] = el)
                                  }
                                  name={`schoolName-${schoolIndex}`}
                                  placeholder={t("cnInfo.schoolName")}
                                  value={school.schoolName}
                                  onChange={(e) =>
                                    handleSchoolInputChange(
                                      childIndex,
                                      schoolIndex,
                                      e
                                    )
                                  }
                                  icon={<FaSchool size={12} />}
                                  validations={[{ type: "required" }]}
                                />
                                <InputField
                                  name={`schoolPhone-${schoolIndex}`}
                                  placeholder={t("cnInfo.schoolPhone")}
                                  value={school.schoolPhone}
                                  onChange={(e) =>
                                    handleSchoolInputChange(
                                      childIndex,
                                      schoolIndex,
                                      e
                                    )
                                  }
                                  type="tel"
                                  validations={[
                                    { type: "required" },
                                    { type: "pattern", pattern: /^[0-9\-]+$/, message: "Please enter a valid phone number (numbers and hyphens only)" }
                                  ]}
                                  icon={<FaPhone size={12} />}
                                />
                                {/* School Address Section */}
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    marginTop: "0.5rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  {t("aboutPage.addressLabel")}
                                </div>
                                <div className={styles.fieldRow}>
                                  <InputField
                                    name={`schoolPostalCode-${schoolIndex}`}
                                    placeholder={t("cnInfo.postalCode")}
                                    value={school.schoolPostalCode}
                                    onChange={(e) =>
                                      handleSchoolInputChange(
                                        childIndex,
                                        schoolIndex,
                                        e
                                      )
                                    }
                                    type="text"
                                    validations={[
                                      { type: "required" },
                                      { type: "pattern", pattern: /^[0-9\-]+$/, message: "Please enter a valid postal code (numbers and hyphens only)" }
                                    ]}
                                    icon={<MdLocationOn size={12} />}
                                  />
                                  <SelectField
                                    name={`schoolPrefecture-${schoolIndex}`}
                                    placeholder={t("cnInfo.prefecture")}
                                    options={dropdownOptions.prefectures}
                                    value={school.schoolPrefecture}
                                    onChange={(e) =>
                                      handleSchoolInputChange(
                                        childIndex,
                                        schoolIndex,
                                        e
                                      )
                                    }
                                    icon={<MdLocationOn size={12} />}
                                    validations={[{ type: "required" }]}
                                  />
                                </div>
                                <InputField
                                  name={`schoolAddress1-${schoolIndex}`}
                                  placeholder={t("cnInfo.address1")}
                                  value={school.schoolAddress1}
                                  onChange={(e) =>
                                    handleSchoolInputChange(
                                      childIndex,
                                      schoolIndex,
                                      e
                                    )
                                  }
                                  icon={<MdLocationOn size={12} />}
                                  validations={[{ type: "required" }]}
                                />
                                <InputField
                                  name={`schoolAddress2-${schoolIndex}`}
                                  placeholder={t("cnInfo.address2")}
                                  value={school.schoolAddress2}
                                  onChange={(e) =>
                                    handleSchoolInputChange(
                                      childIndex,
                                      schoolIndex,
                                      e
                                    )
                                  }
                                  icon={<MdLocationOn size={12} />}
                                />
                                <InputField
                                  name={`homeroom-${schoolIndex}`}
                                  placeholder={t("cnInfo.homeroom")}
                                  value={school.homeroom}
                                  onChange={(e) =>
                                    handleSchoolInputChange(
                                      childIndex,
                                      schoolIndex,
                                      e
                                    )
                                  }
                                  icon={<FaChalkboardTeacher size={12} />}
                                  validations={[{ type: "required" }]}
                                />
                                <InputField
                                  name={`grade-${schoolIndex}`}
                                  placeholder={t("cnInfo.grade")}
                                  value={school.grade}
                                  onChange={(e) =>
                                    handleSchoolInputChange(
                                      childIndex,
                                      schoolIndex,
                                      e
                                    )
                                  }
                                  icon={<FaGraduationCap size={12} />}
                                  validations={[{ type: "required" }]}
                                />
                                <InputField
                                  name={`class-${schoolIndex}`}
                                  placeholder={t("cnInfo.class")}
                                  value={school.class}
                                  onChange={(e) =>
                                    handleSchoolInputChange(
                                      childIndex,
                                      schoolIndex,
                                      e
                                    )
                                  }
                                  icon={<FaBook size={12} />}
                                  validations={[{ type: "required" }]}
                                />
                              </div>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </div>

                    {/* School Information Form - Save Button + Add School Button */}
                    <div className="d-flex flex-column align-items-center gap-3 mt-4 mb-2">
                      <div style={{ width: "300px" }}>
                        <Button
                          htmlType="submit"
                          type="primary"
                          text={
                            isSubmitting
                              ? t("buttons.saving")
                              : t("buttons.save")
                          }
                          className="px-10 w-100"
                          disabled={isSubmitting || isLoading}
                        />
                      </div>
                      {(() => {
                        const accordionOpen =
                          accordionStates[`${childIndex}-school`] === 0 ||
                          forceOpenAccordion === `${childIndex}-school`;
                        const shouldShow =
                          accordionOpen && child.hasSchool === "yes";
                        return shouldShow;
                      })() && (
                        <div style={{ width: "300px" }}>
                          <Button
                            type="secondary"
                            text={t("cnInfo.addSchool")}
                            className="px-10 w-100"
                            onClick={() => addSchoolToChild(childIndex)}
                            icon={<FaPlus size={12} />}
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
            <div style={{ width: "300px" }}>
              <Button
                type="secondary"
                text={t("cnInfo.addChild")}
                className="px-10 w-100"
                onClick={addNewChild}
                icon={<FaPlus size={12} />}
              />
            </div>
            <div style={{ width: "300px" }}>
              <Button
                type="primary"
                text={t("buttons.submit")}
                className="px-10 w-100"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || isLoading || apiChildrenCount === 0}
              />
            </div>
          </div>
        </div>
    </>
  );
}
