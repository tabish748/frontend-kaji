import React, { useEffect, useState, useRef } from "react";
import Style from "../../styles/pages/customer-create.module.scss";
import copy from "../../../public/assets/svg/copy.svg";
import { useLanguage } from "../../localization/LocalContext";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import { useDispatch, useSelector } from "react-redux";
import Toast from "@/components/toast/toast";
import { AppDispatch, RootState } from "../../app/store";
import { useRouter } from "next/router";
import settingStyles from "../../styles/pages/settings.module.scss";
import { Form } from "../form/form";
import Pagination from "../pagination/pagination";
import InputDateField from "../input-date/input-date";
import InputField from "../input-field/input-field";
import ToggleButton from "../toggle-button/toggle-button";
import SelectField from "../select-field/select-field";
import {
  monthOptions,
  dayOptions,
  yearOptions,
  genderOptions,
  phoneTypeOptions,
  spouseOptions,
  spouseCheckBoxOptions,
} from "@/libs/optionsHandling";
import { fetchInsuranceDropdowns } from "@/app/features/insurance/insuranceDropdownSlice";
import RadioField from "../radio-field/radio-field";
import CustomSelectField from "../custom-select/custom-select";
import TextAreaField from "../text-area/text-area";
import HeadingRow from "../heading-row/heading-row";
import CheckboxField from "../checkbox-field/checkbox-field";
import Button from "../button/button";
import { fetchFamilyListing } from "@/app/features/customers/customerFamilyListingSlice";
import { getParamValue } from "@/libs/utils";
import TableBuddy from "../table-buddy/table-buddy";
import Image from "next/image";
import {
  createFamilyMember,
  resetFamilyMemberCreateState,
} from "@/app/features/customers/createFamilyMemberSlice";
import { fetchPrefectures } from "@/app/features/generals/getPrefecturesSlice";
import { fetchFamilyMemberById, resetFamilyMemberDetail } from "@/app/features/customers/getFamilyMemberByIdSlice";
import FullscreenLoader from "../loader/loader";
import ConfirmationBox from "../confirmation-box/confirmation-box";
import { fetchFamilyAddress, resetFamilyAddress } from "@/app/features/generals/copyFamilyAddressSlice";
import { usePostCodeLookup } from "@/hooks/postCodeHook/postCodeHook";
import { useCheckEmailExist } from "@/hooks/postCodeHook/isEmailExistHook/isEmailExistHook";
import { useCheckPhoneExist } from "@/hooks/postCodeHook/isPhoneExistHook/isPhoneExistHook";
import {
  deleteFamilyMemberById,
  resetDeleteFamilyMemberState,
} from "@/app/features/customers/deleteFamilyMemberSlice";
import { createCustomerFromFamilyMember, resetCustomerFromFamilyMemberCreateState } from "@/app/features/customers/createCustomerFromFamilyMemberSlice";
type ToastState = {
  message: string | string[];
  type: string;
};

export default function FamilyCreateTab() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formState, setFormState] = useState<any>(
    {
    id: "",
    familyCode: "",
    personalCode: "",
    lastNameKana: "",
    firstNameKana: "",
    lastName: "",
    firstName: "",
    isCustomer: "0",
    isRepresentative: "0",
    isDied: "0",
    isHandicapped: "0",
    year: "",
    month: "",
    day: "",
    age: "",
    actualAge: "",
    gender: "1",
    phone1: "",
    phone2: "",
    phone3: "",
    phoneType1: "",
    phoneType2: "",
    phoneType3: "",
    newsletter: "",
    email1: "",
    email2: "",
    postCode: "",
    prefectures: "",
    flag: "0",
    address: "",
    remarks: "",
    decedentRelationship: "",
    numberOfHeirs: "",
    special: [""],
    spouse: "",
    relationship: "",
    primaryContact: "phone1",
  });
  const [sortColumn, setSortColumn] = useState("personalCode");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
    "asc"
  );
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [familyMemberIdForDel, setFamilyMemberIdForDel] = useState('');
  const [showMainDelConfirmBox, setShowMainDelConfirmBox] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [errors, setErrors] = useState<any>([]);
  const [showMakeCustomerModal1, setShowMakeCustomerModal1] = useState<boolean>(false);
  const [showMakeCustomerModal2, setShowMakeCustomerModal2] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchInsuranceDropdowns());
    const fc = getParamValue("familyCode");
    
    if (fc != null) {
      dispatch(
        fetchFamilyListing({
          familyCode: fc,
        })
      );
    }
  }, [dispatch]);

  const { prefCode: prefCodeApi, address: addressApi, resetPostCodeData } = usePostCodeLookup(
    formState.postCode
  );

  const [isAddressManuallyEdited, setIsAddressManuallyEdited] = useState(0);
  
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (prefCodeApi || addressApi) {
        if(!formState.address){
        setFormState((prevState: any) => ({
          ...prevState,
          prefectures: prefCodeApi || prevState.prefectures,
          address: addressApi || prevState.address,
        }));
        const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement;
        if (addressInput) {
          addressInput.focus();
          const length = addressInput.value.length;
          addressInput.setSelectionRange(length, length);
        }
      }
      else {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
        }
        const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement;
        if (addressInput) {
          addressInput.focus();
          const length = addressInput.value.length;
          addressInput.setSelectionRange(length, length);
        }
      }
      resetPostCodeData();
    }
     
  }, [prefCodeApi, addressApi]);


  useEffect(() => {
    const fc = getParamValue("familyCode");
    if (fc != null) {
      setFormState((prevState: any) => ({
        ...prevState,
        familyCode: fc,
      }));
    }
    dispatch(fetchPrefectures());
  }, []);

  const { ageOptions, newsletter: newsletterOpt } = useSelector(
    (state: RootState) => state.insuranceDropdown
  );

  
  const { status: statusFm, loading: loadingFm,  responseId, familyCode: familyCodeFm, errorMessages: createFMErrorMessages  } = useSelector(
    (state: RootState) => state.createCustFromFM
  );

  
  useEffect(() => {
    if (statusFm === true) {
      setToast({
        message: `個人コード(${personalCodeFm})に親族コード(${familyCodeFm})が割り当てられました`,
        type: "success",
      });
      
    }  
    else {
      setToast({
        message: createFMErrorMessages,
        type: "fail",
      });
    }
  }, [dispatch, statusFm, createFMErrorMessages]);


  const prefecturesOptions = useSelector(
    (state: RootState) => state.prefectures.prefectures
  );
  const { familyMembers: familyMembersListing, loading: familyListingLoading } =
    useSelector((state: RootState) => state.customerFamilyListing);

  const handleFormSubmit = () => {
    const customerId = getParamValue("id");
    const numericCustomerId =
      customerId !== null ? parseInt(customerId, 10) : 0;
    const officeDptId = localStorage.getItem('officeDepartmentsId');

    const payload = {
      id: formState.id,
      office_departments_id: String(officeDptId),
      customer_id: numericCustomerId,
      family_code: formState.familyCode,
      first_name: formState.firstName,
      last_name: formState.lastName,
      first_name_kana: formState.firstNameKana,
      last_name_kana: formState.lastNameKana,
      email: formState.email1,
      email2: formState.email2,
      gender: formState.gender,
      year: formState.year,
      month: formState.month,
      day: formState.day,
      age: formState.age,
      zipcode: formState.postCode,
      prefecture_id: formState.prefectures == null ? "" : formState.prefectures,
      address: formState.address,
      phone_type1: formState.phoneType1,
      phone_type2: formState.phoneType2,
      phone_type3: formState.phoneType3,
      phone1: formState.phone1,
      phone2: formState.phone2,
      phone3: formState.phone3,
      remarks: formState.remarks,
      is_representative: formState.isRepresentative,
      is_died: formState.isDied,
      relation: formState.relationship,
      newsletter: formState.newsletter,
      primary_contact: formState.primaryContact,
    };
    dispatch(createFamilyMember(payload));
    setShowConfirmBox(false);
  };

  const {
    status: createStatus,
    loading: createLoading,
    message: createMessage,
    errorMessages: createErrorMessages,
  } = useSelector((state: RootState) => state.familyMemberCreate);

  useEffect(() => {
    if (createStatus === true) {
      setToast({
        message: createMessage || "Engagement updated successfully!",
        type: "success",
      });
      handleResetBtn();
      const fc = getParamValue("familyCode");
      if (fc != null) {
        dispatch(fetchFamilyListing({ familyCode: fc }));
      }
      dispatch(resetFamilyMemberCreateState());
    } else if (createErrorMessages && createErrorMessages.length > 0) {
      setToast({
        message: createErrorMessages,
        type: "fail",
      });
      dispatch(resetFamilyMemberCreateState());
    }
  }, [dispatch, createStatus, createErrorMessages, createMessage]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let newFormState = { ...formState, [name]: value };

    if (name === "address" || name === "postCode") {
      setIsAddressManuallyEdited(1);
    }

    const currentYear = new Date().getFullYear();

    if (name === "year" && value) {
      // When the year changes, calculate and update the age
      const age = currentYear - parseInt(value, 10);
      newFormState.actualAge = isNaN(age) ? "" : age.toString();
    } else if (name === "actualAge" && value) {
      // When the actual age is entered, calculate and update the year
      const year = currentYear - parseInt(value, 10);
      newFormState.year = isNaN(year) ? "" : year.toString();
    }

    setFormState(newFormState);
  };

  const handleToggleStateChange = (isOn: boolean) => {
    setFormState((prevState: any) => ({
      ...prevState,
      isCustomer: isOn ? "1" : "0",
    }));
  };
  const handleCheckboxChange = (values: string[]) => {
    setFormState((prevState: any) => ({
      ...prevState,
      special: values,
    }));
  };

  const handleCopyClick = () => {
    const fc = getParamValue("familyCode");
    const custId = getParamValue("id");
    if (fc != null && custId != null) {
      setIsAddressManuallyEdited(2);
      dispatch(
        fetchFamilyAddress({ customerId: Number(custId), familyCode: fc })
      );
    }
  };
  const { familyAddress, loading, error } = useSelector(
    (state: RootState) => state.copyFamilyAddress
  );

  const {
    message: deleteMessage,
    success: deleteSuccess,
    loading: deleteLoading,
    errorMessages: deleteErrorMessages,
  } = useSelector((state: RootState) => state.deleteFamilyMember);

  useEffect(() => {
    if (deleteSuccess === true) {
      setToast({
        message: deleteMessage || "Deleted successfully!",
        type: "success",
      });
      const fc = getParamValue("familyCode");
      if (fc != null) {
        dispatch(fetchFamilyListing({ familyCode: fc }));
      }
    } else if (deleteErrorMessages && deleteErrorMessages.length > 0) {
      setToast({
        message: deleteErrorMessages,
        type: "fail",
      });
    }
    dispatch(resetDeleteFamilyMemberState());
  }, [dispatch, deleteSuccess, deleteErrorMessages, deleteMessage, router]);

  useEffect(() => {
    if (familyAddress) {
      setFormState((prevState: any) => ({
        ...prevState,
        address: familyAddress?.address,
        prefectures: String(familyAddress?.prefecture_id),
        postCode: familyAddress?.zipcode,
      }));
    }
  }, [familyAddress]);

  

  const columns = [
    { header: `${t("familyCode")}`, accessor: "familyCode" },
    { header: `${t("personalCode")}`, accessor: "personalCode" },
    // { header: `${t("customerStatus")}`, accessor: "customerStatus" },
    { header: `${t("customer")}`, accessor: "isCustomer" },
    // { header: `${t("representative")}`, accessor: "isRepresentative" },
    { header: `${t("name")}`, accessor: "customerName" },
    { header: `${t("relationship")}`, accessor: "relation" },
    { header: `${t("actions")}`, accessor: "actions" },
  ];
  const renderStatus = (status: boolean | number | null) => {
    return (
      <span>
        <Image
          src={`/assets/images/${status == true ? `true.png` : `false.png`}`}
          alt="status icon"
          width={15}
          height={15}
        />
        &nbsp; &nbsp;
      </span>
    );
  };

  const showTag = (customerStatus: boolean) => {
    if (customerStatus) {
      return (
        <>
          <span className=" cust-tag customer-tag">{t("isCustomer")}</span>
        </>
      );
    } else {
      return (
        <>
          <span className="cust-tag futureCustomer-tag">
            {t("potentialCustomer")}
          </span>
        </>
      );
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ["1", "99", "2"];
      if (!allowedRoles.includes(loggedInUserRole)) setIsAuthenticated(false);
      else setIsAuthenticated(true);
    }
  }, []);
  const OnClickDeleteButton = (id: number) => { };

  const [personalCodeFm, setPersonalCodeFm] = useState('')
  const [familyMemberIdFm, setFamilyMemberIdFm] = useState<any>('')

  function showActionButtons(id: number, isCustomer: boolean, personalCode: string, memberId: number | React.SetStateAction<string>) {
    // setFamilyMemberIdForDel(String(id));
    return (
      <div className="d-flex gap-1">
        <Button
          text={t("PropertyRegistration")}
          onClick={() => OnClickPropertyRegistrationBtn(id)}
          type="secondary"
          size="small"
        />
        {(!isCustomer && isAuthenticated) && (
          <Button
            text={t("remove")}
            onClick={() => { setFamilyMemberIdForDel(String(id)); setShowMainDelConfirmBox(true) }}
            type="danger"

            size="small"
          />
        )}
          {(!isCustomer) && (
          <Button
            text={t("親族コード割り当て")}
            onClick={() => {setShowMakeCustomerModal1(true);setPersonalCodeFm(personalCode);setFamilyMemberIdFm(memberId)}}
            size="small"
          />
        )}
      </div>
    );
  }

  const OnClickPropertyRegistrationBtn = (familyMemberid: number) => {
    const fc = getParamValue("familyCode");
    const id = getParamValue("id");
    router.push(
      `/customer/asset?id=${id}&familyCode=${fc}&familyMemberId=${familyMemberid}`
    );
  };

  useEffect(() => {
    const memberId = getParamValue("memberId");
    if (memberId != null) {
      handleLinkClick(memberId as any, false);
    }
  }, []);
  const handleLinkClick = (id: number, isCustomer: boolean) => {
    if (isCustomer) {
      const fc = getParamValue("familyCode");
      const id = getParamValue("id");
      router.push(`/customer/update?id=${id}&familyCode=${fc}`);
    } else dispatch(fetchFamilyMemberById(String(id)));
  };
  const { member: fetchedMember, loading: fetchedFamilyLoading } = useSelector(
    (state: RootState) => state.familyMemberDetail
  );
  useEffect(() => {
    if (fetchedMember) {
      console.log('fetchedMember',fetchedMember)
      setFormState((prevState: any) => ({
        ...prevState,
        id: String(fetchedMember?.id),
        familyCode: fetchedMember.family_code,
        personalCode: fetchedMember.personal_code,
        firstName: fetchedMember.first_name,
        lastName: fetchedMember.last_name,
        firstNameKana: fetchedMember.first_name_kana,
        lastNameKana: fetchedMember.last_name_kana,
        email1: fetchedMember.email || "",
        email2: fetchedMember.email2 || "",
        gender: String(fetchedMember.gender) || "",
        year: fetchedMember.year || "",
        month: fetchedMember.month || "",
        day: fetchedMember.day || "",
        age: String(fetchedMember.age) || "",
        actualAge:
          fetchedMember.actual_age !== null
            ? String(fetchedMember.actual_age)
            : "",
        postCode: fetchedMember.zipcode || "",
        prefectures:
          fetchedMember.prefecture_id !== null
            ? String(fetchedMember.prefecture_id)
            : "",
        address: fetchedMember.address || "",
        phoneType1: fetchedMember.phone_type1 || "",
        phone1: fetchedMember.phone1 || "",
        phoneType2: fetchedMember.phone_type2 || "",
        phone2: fetchedMember.phone2 || "",
        phoneType3: fetchedMember.phone_type3 || "",
        phone3: fetchedMember.phone3 || "",
        remarks: fetchedMember.remarks || "",
        isRepresentative: String(fetchedMember.is_representative) || "",
        isDied: String(fetchedMember.is_died) || "",
        relationship: fetchedMember.relation || "",
        newsletter: String(fetchedMember.newsletter) || "",
        primaryContact: String(fetchedMember.primary_contact) || "",
      }));
      window.scrollTo({
        top: 0,
        behavior: "smooth", // For smooth scrolling
      });
    }
  }, [fetchedMember]);


  console.log('formState',formState)
  const renderLink = (
    customerName: string,
    id: number,
    isCustomer: boolean
  ) => {
    return (
      <span
        onClick={() => handleLinkClick(id, isCustomer)}
        className="text-link"
      >
        {customerName}
      </span>
    );
  };
  let updatedFamilyListing = familyMembersListing?.map((item) => ({
    ...item,
    isRepresentative: renderStatus(item?.isRepresentative),
    // isCustomer: renderStatus(item?.isCustomer),
    isCustomer: showTag(item?.isCustomer as boolean),
    personalCode: renderLink(
      item?.personalCode,
      item?.memberId,
      item?.isCustomer as any
    ),
    actions: showActionButtons(item?.memberId, item?.isCustomer as boolean, item.personalCode, item.memberId),
  }));

  const handleSort = (columnAccessor: string) => {
    let direction = "asc";
    let sortParam: { sort_asc?: string; sort_desc?: string } = {}; // Explicit type

    if (sortColumn === columnAccessor && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(columnAccessor);
    setSortDirection(direction as any);

    if (direction === "asc") {
      sortParam.sort_asc = columnAccessor;
    } else {
      sortParam.sort_desc = columnAccessor;
    }

    const fc = getParamValue("familyCode");
    if (fc != null) {
      dispatch(fetchFamilyListing({ familyCode: fc.toString(), ...sortParam }));
    }
  };

  const handleResetBtn = () => {
    setFormState((prevState: any) => ({
      ...prevState,
      id: "",
      personalCode: "",
      firstName: "",
      lastName: "",
      firstNameKana: "",
      lastNameKana: "",
      email1: "",
      email2: "",
      gender: "1",
      year: "",
      month: "",
      day: "",
      age: "",
      postCode: "",
      relationship: "",
      prefectures: "",
      flag: "",
      address: "",
      phoneType1: "",
      phone1: "",
      phoneType2: "",
      phone2: "",
      phoneType3: "",
      phone3: "",
      remarks: "",
      isRepresentative: "",
      isDied: "",
      isCustomer: "",
      primaryContact: "phone1",
    }));

    const fc = getParamValue("familyCode");
    if (fc != null) {
      dispatch(
        fetchFamilyListing({
          familyCode: fc,
        })
      );
    }
  };

  useEffect(() => {
    return () =>{
      handleResetBtn();
      dispatch(resetFamilyAddress());
    }
  },[])


  useEffect(() => {
    if (formState.year && formState.month && formState.day) {
      const birthDate = new Date(
        Number(formState.year),
        Number(formState.month) - 1, // JS months are 0-based
        Number(formState.day)
      );
      const age = calculateAge(birthDate);
      const ageRange = determineAgeRange(age);

      setFormState((prevState: any) => ({
        ...prevState,
        age: ageRange.toString(),
      }));
    }
  }, [formState.year, formState.month, formState.day]);
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const determineAgeRange = (age: number): number => {
    if (age < 10) return 0;
    else if (age < 20) return 1;
    else if (age < 30) return 2;
    else if (age < 40) return 3;
    else if (age < 50) return 4;
    else if (age < 60) return 5;
    else if (age < 70) return 6;
    else if (age < 80) return 7;
    else if (age < 90) return 8;
    else if (age < 100) return 9;
    else return 10;
  };

  const handleFormBeforeSubmit = () => {
    setShowConfirmBox(true);
  };
  const handleCloseToast = () => {
    if(responseId)
      {
        setToast({ message: "", type: "" });
        dispatch(resetCustomerFromFamilyMemberCreateState());
        router.push(`/customer/update?id=${responseId}&familyCode=${familyCodeFm}`)
      }
      else {
        setToast({ message: "", type: "" });
        dispatch(resetFamilyMemberCreateState());
        dispatch(resetCustomerFromFamilyMemberCreateState());
      }
    
  };

  const {
    checkEmail,
    exists,
    message,
    errorMessages: isEmailExistsErrorMessages,
    resetCheckEmail
  } = useCheckEmailExist();

  useEffect(() => {
    if (exists === true) {
      setToast({
        message: message || "",
        type: "success",
      });
    } else if (
      isEmailExistsErrorMessages &&
      isEmailExistsErrorMessages.length > 0
    ) {
      setToast({
        message: isEmailExistsErrorMessages,
        type: "fail",
      });
    }
    resetCheckEmail();
  }, [exists, isEmailExistsErrorMessages, message]);

  const {
    checkPhone,
    phoneExistState,
    message: phoneExistsMessage,
    errorMessages: isPhoneExistsErrorMessages,
    resetCheckPhone
  } = useCheckPhoneExist();

  useEffect(() => {
    if (phoneExistState === true) {
      setToast({
        message: phoneExistsMessage || "",
        type: "success",
      });
    } else if (
      isPhoneExistsErrorMessages &&
      isPhoneExistsErrorMessages.length > 0
    ) {
      setToast({
        message: isPhoneExistsErrorMessages,
        type: "fail",
      });
    }
    resetCheckPhone()
  }, [phoneExistState, isPhoneExistsErrorMessages, phoneExistsMessage]);

  const handleEmailFocusOut = (emailFieldName: string) => {
    const email = formState[emailFieldName];
    if (email) {
      const customerId = Number(getParamValue("id"));
      if (!isNaN(customerId)) {
        checkEmail(String(customerId), email, "family_member");
      }
    }
  };

  const handlePhoneFocusOut = (phoneFieldName: string) => {
    const phone = formState[phoneFieldName];
    if (phone) {
      const customerId = Number(getParamValue("id"));
      if (!isNaN(customerId)) {
        checkPhone(String(customerId), phone, "family_member");
      }
    }
  };

  const handleMainDeleteClick = () => {
    const id = getParamValue("id");
    if (id != null) {

      dispatch(deleteFamilyMemberById(Number(familyMemberIdForDel)));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState: any) => ({
      ...prevState,
      primaryContact: e.target.value
    }));
  };

  const HandleCustFromFM = () => {
    const ofcDptId = localStorage.getItem('officeDepartmentsId')
    const payload = {
      family_member_id: familyMemberIdFm,
      office_departments_id: ofcDptId
    }

    dispatch(createCustomerFromFamilyMember(payload as any))
              setShowMakeCustomerModal2(false)
  }

  useEffect(() => {

    return () => {
      
      dispatch(resetFamilyMemberDetail())
      setFormState( {
        id: "",
        familyCode: "",
        personalCode: "",
        lastNameKana: "",
        firstNameKana: "",
        lastName: "",
        firstName: "",
        isCustomer: "0",
        isRepresentative: "0",
        isDied: "0",
        isHandicapped: "0",
        year: "",
        month: "",
        day: "",
        age: "",
        actualAge: "",
        gender: "1",
        phone1: "",
        phone2: "",
        phone3: "",
        phoneType1: "",
        phoneType2: "",
        phoneType3: "",
        newsletter: "",
        email1: "",
        email2: "",
        postCode: "",
        prefectures: "",
        flag: "0",
        address: "",
        remarks: "",
        decedentRelationship: "",
        numberOfHeirs: "",
        special: [""],
        spouse: "",
        relationship: "",
        primaryContact: "phone1",
      })
    }
  },[])

  useEffect(() => {
    if(familyAddress?.zipcode && isAddressManuallyEdited != 2 && isAddressManuallyEdited != 1)
    setIsAddressManuallyEdited(0);
  }, [familyAddress, isAddressManuallyEdited]);


  console.log('familyAddress',familyAddress)
  console.log('isAddressManuallyEdited',isAddressManuallyEdited)
  return (
    <>
      {fetchedFamilyLoading && <FullscreenLoader />}
      {loadingFm && <FullscreenLoader />}
      {deleteLoading && <FullscreenLoader />}

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      <Form
        onSubmit={handleFormSubmit}
        isLoading={createLoading}
        showResetButton={true}
        resetButtonLoading={familyListingLoading}
        onClickResetButton={handleResetBtn}
        setErrors={setErrors} errors={errors}
        disabledSubmitForm={toast.message == '親族が登録されました。' && toast.type == 'success' ? true :false}
      >
        <HeadingRow headingTitle={"家族情報"} />
        <div className={`${Style.familyHeirsRow}  mt-1 d-none`}>
          <SelectField
            name="decedentRelationship"
            value={formState.decedentRelationship}
            options={ageOptions}
            onChange={handleInputChange}
            label={t("decedentRelationship")}
            placeholder={t("decedentRelationship")}
          />
          <SelectField
            name="numberOfHeirs"
            value={formState.numberOfHeirs}
            options={ageOptions}
            onChange={handleInputChange}
            label={t("numberOfHeirs")}
            placeholder={t("numberOfHeirs")}
          />
          <RadioField
            name="spouse"
            selectedValue={formState.spouse}
            onChange={handleInputChange}
            label={t("spouse")}
            options={spouseOptions}
            className={Style.genderRadio}
          />
          <CheckboxField
            // label={`${t("special")}`}
            name="special"
            options={spouseCheckBoxOptions}
            selectedValues={formState.special}
            onChange={handleCheckboxChange}
            className={`mb-3 mt-2 ${Style.customerTypeCheckbox}`}
          />
        </div>
        <div className={"d-flex gap-1 mb-2"}>
          <InputField
            name="familyCode"
            value={formState.familyCode}
            onChange={handleInputChange}
            label={t("familyCode")}
            placeholder={t("familyCode")}
            readOnly={true}
          />

          <InputField
            name="personalCode"
            value={formState.personalCode}
            label={t("personalCode")}
            placeholder={t("personalCode")}
            onChange={handleInputChange}
            readOnly={true}
          />
        </div>

        <hr></hr>

        <div className={`${Style.introFieldsWrapper} mt-1`}>
          <InputField
            name="firstNameKana"
            value={formState.firstNameKana}
            label={t("firstNameKana")}
            placeholder={t("firstNameKana")}
            onChange={handleInputChange}
            tag={t("required")}
            validations={[{ type: "required" },{ type: "onlyKanaCharacters" }]}
            errorText={errors["firstNameKana"]}
          />
          <InputField
            name="lastNameKana"
            value={formState.lastNameKana}
            label={t("lastNameKana")}
            placeholder={t("lastNameKana")}
            onChange={handleInputChange}
            // tag={t("required")}
            validations={[{ type: "onlyKanaCharacters" }]}
            // errorText={errors["lastNameKana"]}
          />
          {/* <ToggleButton
            value={formState.isCustomer === "1"}
            label={t("isCustomer")}
            options={{
              on: `${t("isCustomer")}`,
              off: `${t("isCustomer")}`,
            }}
            getSelectedOption={handleToggleStateChange}
            hideSelectedText={true}
          /> */}
          {/* <ToggleButton
            value={formState.isRepresentative === "1"}
            label={t("representative")}
            options={{
              on: `${t("representative")}`,
              off: `${t("representative")}`,
            }}
            getSelectedOption={(isOn) => {
              setFormState((prevState) => ({
                ...prevState,
                isRepresentative: isOn ? "1" : "0",
              }));
            }}
            hideSelectedText={true}
          /> */}
          <ToggleButton
            value={formState.isDied === "1"}
            label={t("deathOccur")}
            options={{
              on: `${t("died")}`,
              off: `${t("alive")}`,
            }}
            getSelectedOption={(isOn) => {
              setFormState((prevState: any) => ({
                ...prevState,
                isDied: isOn ? "1" : "0",
              }));
            }}
            hideSelectedText={false}
          />
          <span></span>
          <InputField
            name="firstName"
            value={formState.firstName}
            label={t("firstName")}
            placeholder={t("firstName")}
            onChange={handleInputChange}
          />
          <InputField
            name="lastName"
            value={formState.lastName}
            label={t("lastName")}
            placeholder={t("lastName")}
            onChange={handleInputChange}
          />
          <ToggleButton
            value={formState.isHandicapped === "1"}
            label={t("isHandicapped")}
            options={{
              on: `${t("isHandicapped")}`,
              off: `${t("isHandicapped")}`,
            }}
            getSelectedOption={(isOn) => {
              setFormState((prevState: any) => ({
                ...prevState,
                isHandicapped: isOn ? "1" : "0",
              }));
            }}
            hideSelectedText={true}
          />
        </div>
        <div className={Style.customerDobSection}>
          <div className="w-100">
            <div
              className={Style.customerDobContainer}
              style={{ maxWidth: "100%" }}
            >
              <div className={Style.dobField}>
                <SelectField
                  name="year"
                  label={t("birthday")}
                  value={formState.year}
                  options={yearOptions}
                  placeholder={t("year")}
                  onChange={handleInputChange}
                />
              </div>
              <span>{t("year")}</span>
              <div className={Style.dobField}>
                <SelectField
                  name="month"
                  value={formState.month}
                  options={monthOptions}
                  placeholder={t("month")}
                  onChange={handleInputChange}
                />
              </div>
              <span>{t("month")}</span>
              <div className={Style.dobField}>
                <SelectField
                  name="day"
                  value={formState.day}
                  options={dayOptions}
                  placeholder={t("day")}
                  onChange={handleInputChange}
                />
              </div>
              <span>{t("day")}</span>
              {/* <div className={Style.dobField}>
                <SelectField
                  name="age"
                  value={formState.age}
                  options={ageOptions}
                  onChange={handleInputChange}
                  placeholder={t("age")}
                />
              </div>
              <span>{t("age")}</span> */}
              <div className={Style.dobField}>
                <InputField
                  name="actualAge"
                  value={formState.actualAge}
                  onChange={handleInputChange}
                  placeholder={t("actualAge")}
                // className={Style.actualAgeField}
                />
              </div>
              <span>{t("currentAge")}</span>
              <InputField
                name="relationship"
                label={t("relationship")}
                value={formState.relationship}
                onChange={handleInputChange}
                placeholder={t("relationship")}
              />
              <div className={`${Style.dobField} mb-2`}>
                <p>{t("gender")}</p>
                <div className={Style.customerDobContainer}>
                  <RadioField
                    name="gender"
                    selectedValue={formState.gender}
                    onChange={handleInputChange}
                    // label={t("gender")}
                    options={genderOptions}
                    className={Style.genderRadio}
                  />
                </div>
              </div>
              <div className={Style.dobField}>
                <CustomSelectField
                  name="newsLetter"
                  label={t("newsLetter")}
                  options={newsletterOpt}
                  value={formState.newsletter}
                  onChange={(e) => {
                    setFormState((prevState: any) => ({
                      ...prevState,
                      newsLetter: e.target.value,
                    }));
                  }}
                  // disabled={fieldsReadOnly}
                  className="mb-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${Style.phoneRow} ${Style.newPhoneRow}`}>
          <input name="primaryContact"
            value="phone1"
            checked={formState.primaryContact === "phone1"}
            onChange={handleRadioChange}
            type="radio"
            className={Style.selectRadio}
          />
          <InputField
            name="phone1"
            value={formState.phone1}
            label={t("phone")}
            placeholder={t("phone")}
            onChange={handleInputChange}
            onBlur={() => handlePhoneFocusOut("phone1")}
          />

          <SelectField
            label={t("phoneType")}
            options={phoneTypeOptions}
            value={formState.phoneType1}
            onChange={(e) =>
              setFormState((prevState: any) => ({
                ...prevState,
                phoneType1: e.target.value,
              }))
            }
            placeholder={t("phoneType")}
            className={Style.insuranceDropdownSelect}
          />
          <input name="primaryContact"
            value="phone2"
            checked={formState.primaryContact === "phone2"}
            onChange={handleRadioChange}
            type="radio"
            className={Style.selectRadio}
          />
          <InputField
            name="phone2"
            value={formState.phone2}
            label={t("phone") + 2}
            placeholder={t("phone") + 2}
            onChange={handleInputChange}
            onBlur={() => handlePhoneFocusOut("phone2")}
          />
          <SelectField
            label={t("phoneType") + 2}
            options={phoneTypeOptions}
            value={formState.phoneType2}
            onChange={(e) =>
              setFormState((prevState: any) => ({
                ...prevState,
                phoneType2: e.target.value,
              }))
            }
            placeholder={t("phoneType") + 2}
            className={Style.insuranceDropdownSelect}
          />
          <input name="primaryContact"
            value="phone3"
            checked={formState.primaryContact === "phone3"}
            onChange={handleRadioChange}
            type="radio"
            className={Style.selectRadio}
          />
          <InputField
            name="phone3"
            value={formState.phone3}
            label={t("phone") + 3}
            placeholder={t("phone") + 3}
            onChange={handleInputChange}
            onBlur={() => handlePhoneFocusOut("phone3")}
          />
          <SelectField
            name="phoneType3"
            label={t("phoneType") + 3}
            options={phoneTypeOptions}
            value={formState.phoneType3}
            onChange={(e) =>
              setFormState((prevState: any) => ({
                ...prevState,
                phoneType3: e.target.value,
              }))
            }
            placeholder={t("phoneType") + 3}
            className={Style.insuranceDropdownSelect}
          />
        </div>
        <div className={`${Style.emailRow} ${Style.newEmailRow}`}>
          <input name="primaryContact"
            value="email1"
            checked={formState.primaryContact === "email1"}
            onChange={handleRadioChange}
            type="radio"
            className={Style.selectRadio}
          />
          <InputField
            name="email1"
            value={formState.email1}
            label={t("email")}
            placeholder={t("email")}
            onChange={handleInputChange}
            onBlur={() => handleEmailFocusOut("email1")}
          />
          <input name="primaryContact"
            value="email2"
            checked={formState.primaryContact === "email2"}
            onChange={handleRadioChange}
            type="radio"
            className={Style.selectRadio}
          />
          <InputField
            name="email2"
            value={formState.email2}
            label={t("email") + 2}
            placeholder={t("email") + 2}
            onChange={handleInputChange}
            onBlur={() => handleEmailFocusOut("email2")}
          />
        </div>

        <div className={Style.addressRow}>
          <InputField
            name="postCode"
            value={formState.postCode}
            label={t("postCode")}
            placeholder={t("postCode")}
            onChange={handleInputChange}
          />
          <SelectField
            name="prefectures"
            options={prefecturesOptions}
            value={formState.prefectures}
            label={t("prefectures")}
            placeholder={t("prefectures")}
            onChange={handleInputChange}
          />
          <InputField
            name="address"
            value={
              isAddressManuallyEdited == 1
                ? formState.address
                : isAddressManuallyEdited == 0 ? fetchedMember?.address  : isAddressManuallyEdited == 2 && familyAddress?.address || ""
            }
            label={t("address")}
            placeholder={t("address")}
            onChange={handleInputChange}
          />
          <Button
            text={t("copy")}
            type="primary"
            size="small"
            onClick={handleCopyClick}
            className={Style.copyBtn}
            icon={<Image src={copy} alt="Copy Icon" width={20} height={20} />}
          />
        </div>
        <TextAreaField
          label={t("remarks")}
          name="remarks"
          value={formState.remarks}
          placeholder={t("remarks")}
          onChange={handleInputChange}
          style={{
            minHeight: '150px'
          }}
          rows={5}
          cols={50}
        />
      </Form>

      <hr className="mb-2"></hr>

      <TableBuddy
        columns={columns}
        data={updatedFamilyListing}
        loading={familyListingLoading}
        onSort={handleSort}
        sortedColumn={sortColumn}
        sortDirection={sortDirection}
        stickyHeaders={false}
      />

      {showConfirmBox && (
        <ConfirmationBox
          isOpen={showConfirmBox}
          title={`${t("confirmYourEdits")}`}
          onConfirm={() => handleFormSubmit()}
          onCancel={() => setShowConfirmBox(false)}
        />
      )}

      {showMainDelConfirmBox && (
        <ConfirmationBox
          isOpen={showMainDelConfirmBox}
          title={`${t("areYouSureWantToDelete")}`}
          onConfirm={() => {
            handleMainDeleteClick();

            setShowMainDelConfirmBox(false);
          }}
          onCancel={() => setShowMainDelConfirmBox(false)}
        />
      )}
      {
        showMakeCustomerModal1 &&  (
          <ConfirmationBox
            isOpen={showMakeCustomerModal1}
            title={`個人コード(${personalCodeFm})に新規の親族コードを割り当ててよろしいですか？この操作は元に戻せません。`}
            secondText="  "
            onConfirm={() => {
              setShowMakeCustomerModal2(true)
              setShowMakeCustomerModal1(false)
            }}
            onCancel={() => setShowMakeCustomerModal1(false)}
          />
        )
      }

      {
        showMakeCustomerModal2 &&  (
          <ConfirmationBox
            isOpen={showMakeCustomerModal2}
            title={`新規の親族コードが割り当てられたページへ移動します。よろしいですか？ `}
            secondText="  "
            onConfirm={() => {
                HandleCustFromFM();
            }}
            onCancel={() => setShowMakeCustomerModal2(false)}  
          />
        )
      }
    </>
  );
}
