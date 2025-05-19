import React from "react";
import { useLanguage } from "../../localization/LocalContext";
import AuthMiddleware from "@/components/auth-middleware/auth-middleware";
import HeadingRow from "@/components/heading-row/heading-row";
import Style from "../../styles/pages/insurance.module.scss";
import InputField from "@/components/input-field/input-field";
import { Form } from "@/components/form/form";
import { Key, useEffect, useState, useRef, useCallback } from "react";
import Button from "@/components/button/button";
import CustomSelectField from "@/components/custom-select/custom-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchInsuranceDropdowns } from "@/app/features/insurance/insuranceDropdownSlice"; // Import the action
import InputDateField from "@/components/input-date/input-date";
import TextAreaField from "@/components/text-area/text-area";
import ToggleButton from "@/components/toggle-button/toggle-button";
import ProjectStyle from "@/styles/pages/project-confirmed.module.scss";
import { addCommas, getCurrentDate, getDateRangeForLastThreeDays, getParamValue, handleNoRecordFound, replaceSlashesWithDashes } from "@/libs/utils";
import ProjectHeirCollapseComponent from "@/components/project-heir-collapse/project-heir-collapse";
import { fetchProjectSozokuDetails, resetProjectSozokuShowState } from "@/app/features/project/projectSozokuShowSlice";
import { fetchProjectSozokuDropdowns } from "@/app/features/generals/getProjectSozokuDropdownSlice";
import {
  calculateDaysDifference,
  evaluateDate,
  calculateThreeYearsLaterAndDays,
  getDateAfterWeeks,
} from "@/libs/utils";
import TableBuddy from "@/components/table-buddy/table-buddy";
import { extractDaysFromString, calculateAge } from "@/libs/utils";
import {
  updateProjectSozoku,
  resetProjectSozokuUpdateState,
} from "@/app/features/project/projectSozokuUpdateSlice";
import AddFamilyMemberModal from "./add-family-member-modal";
import { PlusIcon } from "@/libs/svgIcons";
import Toast from "../toast/toast";
import { scrollToTopSmooth } from "@/libs/utils";
import ConfirmationBox from "../confirmation-box/confirmation-box";
import { deleteProjectSozokuById, resetDeleteProjectSozokuState } from "@/app/features/project/deleteProjectSozokuSlice";
import { useRouter } from "next/router";
import { fetchOfficesByUserId } from "@/app/features/employees/getOfficesByUserIdSlice";
import FullscreenLoader from "../loader/loader";
import { fetchAllOffices } from "@/app/features/generals/getAllOfficesSlice";
import JapaneseDatePicker from "../japanese-date-picker/japanese-date-picker";

const initialState: any = {
  applicationType: "",
  unifiedNumber: "",
  customerCode: "",
  nextCustomerCode: "",
  filingTaxOffice: "",
  workStatus: "",
  remarks: "",
  familyMember: {
    personalCode: "",
    familyCode: "",
  },
  decedentInfo: {
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    inheritanceStartDate: "",
    dateOfBirth: "",
    japaneseDateFormat: "",
    address: "",
  },
  projectInfo: {
    projectType: "",
    work1Branch: "",
    orderDate: "",
    introduceBy: "",
    elapsedData: "",
    declarationDate: "",
    noOfDaysRemainingForFiling: "",
    submissionDate: "",
    semiTaxReturnedDate: "",
    semiRemainingDays: "",
    blueApplicationForm: "",
    consumptionTax: "",
    interviewMc: "",
    worker1: "",
    worker1Office: "",
    manager: "",
    check1: "",
    check2: "",
    check3: "",
    final1: "",
    final2: "",
    contractAmount: "",
    deposit: "",
    remainingAmount: "",
    billingTotal: "",
    undivided: "0",
    dueDateWithin3Years: "",
    noOfRemainingDaysWithin3Years: "",
    realEstateSale: "0",
    secondaryMeasure: "0",
    realEstateReg: "0",
    newsLetter: "",
    isEnd: "0",
    isSemiFinalTaxReturn: "0",
  },
  progress: {
    contractIssueDate: "",
    depositBillingDate: "",
    depositDate: "",
    receiptOfMaterial: "",
    scDeficiencyCheck: "",
    interimReport: "",
    firstCalculationFilingDate: "",
    firstCalculationCompletionDate: "",
    secondaryCalculationFilingDate: "",
    secondaryCalculationCompletionDate: "",
    thirdVerificationSubmissionDate: "",
    thirdVerificationCompletionDate: "",
    propertyValuationCompletionDate: "",
    finalCheck1CompletionDate: "",
    finalCheck2CompletionDate: "",
    sealDate: "",
    balanceBillingDate: "",
    remainingBalanceDeposit: "",
    taxOfficeShipping: "",
    businessProcessingBook: "",
    copyReceiptOfTaxReturn: "",
    returnDate: "",
    amendedReturnFilingDate: "",
    realEstateRegCompletionDate: "",
    cpDate: "",
  },
};
interface Progress {
  [key: string]: string | null; // Assuming all values are strings or null
  // ... (other specific properties, if any)
}

type ToastState = {
  message: string | string[];
  type: string;
};

interface Props {
  onApplicationTypeChange: (applicationType: string) => void;
}
export const ProjectRevisedUpdateLayout: React.FC<Props> = ({ onApplicationTypeChange }) => {
  const { t } = useLanguage();
  const [currentRepresentativeId, setCurrentRepresentativeId] = useState(null);
  const [shouldShowInquiryTab, setShouldShowInquiryTab] = useState(false);

  const [shouldShowInterviewTab, setShouldShowInterviewTab] = useState(false);
  const [heirData, setHeirData] = useState({});
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [hasChanges, setHasChanges] = useState(false);
  const [showMainDelConfirmBox, setShowMainDelConfirmBox] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [collapseComponents, setCollapseComponents] = useState([]);
  const [updatedHeirData, setUpdatedHeirData] = useState([]);
  const [displayedComponents, setDisplayedComponents] = useState<any>({});
  const [
    shouldShowProjectSozokuConfirmedTab,
    setShouldShowProjectSozokuConfirmedTab,
  ] = useState(false);
  const [shouldShowProjectLegalTab, setShouldShowProjectLegalTab] =
    useState(false);
  const [formState, setFormState] = useState<any>(initialState);
  const [lastRowText, setLastRowText] = useState(t("goalNotSet"));
  const [datesSet, setDatesSet] = useState(false);
  const [disableIsEndToggle, setDisableIsEndToggle] = useState(true);
  const [showFamilyMemberModal, setShowFamilyMemberModal] = useState(false);
  const [
    disablerealEstateRegCompletionDate,
    setDisablerealEstateRegCompletionDate,
  ] = useState(true);
  const [noOfRemFilingDaysCanChange, setNoOfRemFilingDaysCanChange] =
    useState(true);
  const [includedIds, setIncludedIds] = useState<any>([]);
  const [tostMessage, setToastMessage] = useState('');
  const [type, setType] = useState('');
  const initialRowTextsTable1 = new Array(7).fill(t("goalNotSet")); // Adjust the size based on the number of columns in table 1
  const initialRowTextsTable2 = new Array(9).fill(t("goalNotSet")); // Adjust the size based on the number of columns in table 2

  const [lastRowTextsTable1, setLastRowTextsTable1] = useState(
    initialRowTextsTable1
  );
  const [lastRowTextsTable2, setLastRowTextsTable2] = useState(
    initialRowTextsTable2
  );
  const [activeRepresentative, setActiveRepresentative] = useState(null);
  const [errors, setErrors] = useState<any>([]);

  const [heirFormStates, setHeirFormStates] = useState<any>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ["1", "99", "2"];
      if (!allowedRoles.includes(loggedInUserRole)) setIsAuthenticated(false);
      else setIsAuthenticated(true);
    }
  }, []);
  const textTd1Ref = useRef(null);
  const textTd2Ref = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  // const handleRepresentativeChange = (newKey: string | React.SetStateAction<null>) => {
  
  //   if (newKey !== activeRepresentative) {
  //     setActiveRepresentative(newKey as any);
  
  //     // Update displayedComponents to ensure only one representative
  //       setDisplayedComponents((prevComponents: any) => {
  //         const updatedComponents = Object.keys(prevComponents).reduce((acc: any, key: string | number) => {

  //           acc[key] = {
  //             ...prevComponents[key],
  //             is_representative: key == newKey ? "1" : "0",
  //           };
  //           return acc;
  //         }, {});
  //         return updatedComponents;
  //       });
    
  //   }
  // };

  const handleRepresentativeChange = (newKey: string | React.SetStateAction<null>) => {
    if (newKey !== activeRepresentative) {
      setActiveRepresentative(newKey as any);
  
      // Update displayedComponents to ensure only one representative
      setDisplayedComponents((prevComponents: any) => {
        const updatedComponents = Object.keys(prevComponents).reduce((acc: any, key: string | number) => {
          acc[key] = {
            ...prevComponents[key],
            is_representative: key == newKey ? "1" : "0",
          };
          return acc;
        }, {});
        return updatedComponents;
      });
    }
  };
  
  

  const updateInitialState = (key: any, initialState: any) => {
    setHeirFormStates((prevStates: any) => ({
      ...prevStates,
      [key]: initialState,
    }));
  };

  const {
    inquiry,
    interview,
    projectConfirmed,
    projectRevised,
    projectLegal,
    loading,
    error,
    message,
  } = useSelector((state: RootState) => state.inquiryInterviewProjectTabs);

  const {
    message: deleteMessage,
    success: deleteSuccess,
    loading: deleteLoading,
    errorMessages: deleteErrorMessages,
  } = useSelector((state: RootState) => state.deleteProjectSozoku);

  useEffect(() => {
    if (deleteSuccess === true) {
      setToast({
        message: deleteMessage || "Deleted successfully!",
        type: "success",
      });
      
    } else if (deleteErrorMessages && deleteErrorMessages.length > 0) {
      setToast({
        message: deleteErrorMessages,
        type: "fail",
      });
    }
    
  }, [dispatch, deleteSuccess, deleteErrorMessages, deleteMessage]);

  useEffect(() => {
    if (inquiry.active == true) {
      setShouldShowInquiryTab(true);
    } else {
      setShouldShowInquiryTab(false);
    }
    if (interview.active == true) {
      setShouldShowInterviewTab(true);
    } else {
      setShouldShowInterviewTab(false);
    }
    if (projectLegal.active == true) setShouldShowProjectLegalTab(true);
    else setShouldShowProjectLegalTab(false);
    if (projectConfirmed.active == true)
      setShouldShowProjectSozokuConfirmedTab(true);
    else setShouldShowProjectSozokuConfirmedTab(false);
  }, [inquiry, interview, projectLegal, projectConfirmed]);

  useEffect(() => {
    dispatch(fetchProjectSozokuDropdowns());
    const id = getParamValue("id");
    if (id) dispatch(fetchProjectSozokuDetails(Number(id)));
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index: number
  ) => {
    const { name, value } = e.target;
    const fieldName = name.split("-")[0];

    let updatedFormState = { ...formState };

    if (
      fieldName === "compatibleDate" ||
      fieldName === "description" ||
      fieldName === "worker"
    ) {
      // Handling the involvementRecord array fields
      let updatedRecords = [...formState.involvementRecord];

      // Check if editing the last record
      if (index === updatedRecords.length - 1) {
        // Update the last record
        updatedRecords[index] = {
          ...updatedRecords[index],
          [fieldName]: value,
        };
      } else if (index < updatedRecords.length) {
        // Update an existing record
        updatedRecords[index] = {
          ...updatedRecords[index],
          [fieldName]: value,
        };
      }

      updatedFormState.involvementRecord = updatedRecords;
    } else {
      // Handle non-array fields
      if (name in formState.familyMember) {
        updatedFormState.familyMember = {
          ...formState.familyMember,
          [name]: value,
        };
      } else if (name in formState.decedentInfo) {
        updatedFormState.decedentInfo = {
          ...formState.decedentInfo,
          [name]: value,
        };
      } else if (name in formState.projectInfo) {
        updatedFormState.projectInfo = {
          ...formState.projectInfo,
          [name]: value,
        };
      } else if (name in formState.progress) {
        // console.log('name', name, value)
        updatedFormState.progress = {
          ...formState.progress,
          [name]: value,
        };
      }
      // else if (name.startsWith("exist")) {
      //   const fieldIndex = parseInt(name.split("-")[1]); // Extracting the index from the field name
      //   const updatedInterviews = formState.existingInterviews.map(
      //     (interview: any, idx: number) => {
      //       if (idx === fieldIndex) {
      //         return { ...interview, [fieldName]: value }; // Update only the specific field
      //       }
      //       return interview;
      //     }
      //   );
      //   updatedFormState.existingInterviews = updatedInterviews;
      // }
      else {
        updatedFormState = { ...updatedFormState, [name]: value };
      }
    }

    // Update the form state
    setFormState(updatedFormState);
  };

  const handleSubmit = () => {
    const displayedComponentsArray = Object.keys(displayedComponents).map(
      (key) => displayedComponents[key]
    );

    const heirFormStatesArray = Object.keys(heirFormStates).map(
      (key) => heirFormStates[key]
    );


    const filteredHeirFormStatesArray = heirFormStatesArray.filter(
      (heirState) =>
        displayedComponentsArray.some(
          (displayedComponent) => displayedComponent.id === heirState.id
        )
    );

    const renamedHeirFormStatesArray = filteredHeirFormStatesArray.map(
      (heirData) => ({
        customer_id: heirData?.customerId || "",
        id: heirData?.id || "",
        is_representative: heirData?.representative || "0",
        first_name: heirData?.firstName || "",
        last_name: heirData?.lastName || "",
        first_name_kana: heirData?.firstNameKana || "",
        last_name_kana: heirData?.lastNameKana || "",
        relationship: heirData?.relationship || "",
        personal_code: heirData?.personalCode || "",
        phone_type1: heirData?.phoneType1 || "",
        phone_type2: heirData?.phoneType2 || "",
        phone_type3: heirData?.phoneType3 || "",
        phone1: heirData?.phone1 || "",
        phone2: heirData?.phone2 || "",
        phone3: heirData?.phone3 || "",
        email: heirData?.email || "",
        email2: heirData?.email2 || "",
        legal_inheritance: heirData?.legalInheritance || "",
        tax_payment: heirData?.taxPayment || "",
        postal_code: heirData?.postCode || "",
        prefecture_id: heirData?.prefecture || "",
        address: heirData?.postAddress || "",
        primary_contact: heirData?.primaryContact || "",
        // Add additional key changes as needed
      })
    );
    
    const payload = {
      proposal_number: formState.customerCode || "",
      dec_tax_office: formState.filingTaxOffice || "",
      work_remarks: formState.workStatus || "",
      remarks: formState.remarks || "",
      family_member: {
        id: projectSozokuDetails?.customer?.family_member_id || "",
        customer_id: projectSozokuDetails?.customer?.customer_id || "",
        family_codes_id: projectSozokuDetails?.family_codes_id || "",
        family_code: formState.familyMember.familyCode || "",
        personal_code: formState.familyMember.personalCode || "",
      },
      decedent_info: {
        first_name_kana: formState.decedentInfo.firstNameKana || "",
        last_name_kana: formState.decedentInfo.lastNameKana || "",
        first_name: formState.decedentInfo.firstName || "",
        last_name: formState.decedentInfo.lastName || "",
        dec_inheritance_start_date:
          formState.decedentInfo.inheritanceStartDate || "",
        dec_dob: replaceSlashesWithDashes(formState.decedentInfo.dateOfBirth) || "",
        dec_address: formState.decedentInfo.address || "",
      },
      project_info: {
        project_category: formState.projectInfo.projectType || "",
        order_date: formState.projectInfo.orderDate || "",
        due_date: formState.projectInfo.declarationDate || "",
        introduced_by_id: formState.projectInfo.introduceBy || "",
        expected_submission_month: formState.projectInfo.submissionDate || "",
        submission_tax_return_due_date:
          formState.projectInfo.semiTaxReturnedDate || "",
        blue_application_form: formState.projectInfo.blueApplicationForm || "",
        // sales_tax: formState.projectInfo.consumptionTax || "",
        semi_final_tax_return: formState.projectInfo.isSemiFinalTaxReturn || "0",
        interviewer_id: formState.projectInfo.interviewMc || "",
        worker_id: formState.projectInfo.worker1 || "",
        worker_office_id: formState.projectInfo.worker1Office || "",
        manager_id: formState.projectInfo.manager || "",
        checker1_id: formState.projectInfo.check1 || "",
        checker2_id: formState.projectInfo.check2 || "",
        checker3_id: formState.projectInfo.check3 || "",
        final1_id: formState.projectInfo.final1 || "",
        final2_id: formState.projectInfo.final2 || "",
        order_amount: formState.projectInfo.contractAmount || "",
        deposit_amount: formState.projectInfo.deposit || "",
        balance_amount: formState.projectInfo.remainingAmount || "",
        newsletter: formState.projectInfo.newsletter || "",
        undivided: String(formState.projectInfo.undivided) || "0",
        real_estate_sale: String(formState.projectInfo.realEstateSale) || "0",
        secondary_measures:
          String(formState.projectInfo.secondaryMeasure) || "0",
        real_estate_registration:
          String(formState.projectInfo.realEstateReg) || "0",
        project_finish: String(formState.projectInfo.isEnd) || "0",
      },
      progress: {
        prgrs_contract_issue_date: formState.progress.contractIssueDate || "",
        prgrs_deposit_billing_date: formState.progress.depositBillingDate || "",
        prgrs_payment_date: formState.progress.depositDate || "",
        prgrs_doc_recv_date: formState.progress.receiptOfMaterial || "",

        prgrs_sc_insufficient_date: formState.progress.scDeficiencyCheck || "",
        prgrs_interim_report_date: formState.progress.interimReport || "",
        prgrs_cp_verification_date: formState.progress.cpDate || "",
        prgrs_verify_1st_submit_date:
          formState.progress.firstCalculationFilingDate || "",
        prgrs_verify_1st_comp_date:
          formState.progress.firstCalculationCompletionDate || "",
        prgrs_verify_2nd_submit_date:
          formState.progress.secondaryCalculationFilingDate || "",
        prgrs_verify_2nd_comp_date:
          formState.progress.secondaryCalculationCompletionDate || "",
        prgrs_verify_3rd_submit_date:
          formState.progress.thirdVerificationSubmissionDate || "",
        prgrs_verify_3rd_comp_date:
          formState.progress.thirdVerificationCompletionDate || "",
        prgrs_final_check_1st_comp_date:
          formState.progress.finalCheck1CompletionDate || "",
        prgrs_final_check_2nd_comp_date:
          formState.progress.finalCheck2CompletionDate || "",
        // prgrs_property_eval_comp_date:
        //   formState.progress.propertyValuationCompletionDate || "",
        // prgrs_final_check_1st_submit_date: formState.progress.finalCheck1CompletionDate,

        prgrs_stamp_date: formState.progress.sealDate || "",
        prgrs_balance_billing_date: formState.progress.balanceBillingDate || "",
        prgrs_balance_deposit_date:
          formState.progress.remainingBalanceDeposit || "",
        prgrs_taxoffice_shipping_date:
          formState.progress.taxOfficeShipping || "",
        prgrs_work_process_book_date:
          formState.progress.businessProcessingBook || "",
        prgrs_receipt_declaration_date:
          formState.progress.copyReceiptOfTaxReturn || "",
        prgrs_return_date: formState.progress.returnDate || "",


        // prgrs_correction_filing_date:
        //   formState.progress.amendedReturnFilingDate || "",
        // prgrs_real_estate_reg_date:
        //   formState.progress.realEstateRegCompletionDate || "",
      },
      heirs: renamedHeirFormStatesArray,
    };
    const id = getParamValue("id");
    if (id != null) {
      dispatch(updateProjectSozoku({ id: id, data: payload as any }));
    }
  };

  const {
    status: updateStatus,
    loading: updateLoading,
    message: updateMessage,
    errorMessages: updateErrorMessages,
  } = useSelector((state: RootState) => state.updateProjectSozoku);

  useEffect(() => {
    if (updateStatus === true) {
      setToast({
        message: updateMessage || "Property Created successfully!",
        type: "success",
      });
      // scrollToTopSmooth();
      dispatch(resetProjectSozokuUpdateState());
      const id = getParamValue("id");
      if (id) dispatch(fetchProjectSozokuDetails(Number(id)));

    } else if (updateErrorMessages && updateErrorMessages.length > 0) {
      setToast({
        message: updateErrorMessages,
        type: "fail",
      });
    }
  }, [dispatch, updateStatus, updateErrorMessages, updateMessage]);

  const { projectSozokuDetails, loading: showLoading, success: showSuccess } = useSelector(
    (state: RootState) => state.projectSozokuShow
  );
  const { projectSozokuDropdowns: formDropdowns } = useSelector(
    (state: RootState) => state.projectSozokuDropdowns
  );

  useEffect(() => {
    if (projectSozokuDetails) {
      onApplicationTypeChange(projectSozokuDetails?.application_type);
      setFormState((prevState: any) => ({
        ...prevState,
        applicationType: projectSozokuDetails?.application_type,
        unifiedNumber: projectSozokuDetails?.uniform_id,
        customerCode: projectSozokuDetails?.proposal_number,
        nextCustomerCode: projectSozokuDetails?.next_proposal_number,
        workStatus: projectSozokuDetails?.work_remarks,
        remarks: projectSozokuDetails?.remarks,
        familyMember: {
          familyCode: projectSozokuDetails?.customer.family_code,
          personalCode: projectSozokuDetails?.customer.personal_code,
        },
        decedentInfo: {
          lastName: projectSozokuDetails?.decedent_info.dec_last_name,
          firstName: projectSozokuDetails?.decedent_info.dec_first_name,
          lastNameKana: projectSozokuDetails?.decedent_info.dec_last_name_kana,
          firstNameKana:
            projectSozokuDetails?.decedent_info.dec_first_name_kana,
          inheritanceStartDate:
            projectSozokuDetails?.decedent_info.dec_inheritance_start_date,
          dateOfBirth: projectSozokuDetails?.decedent_info.dec_dob,
          address: projectSozokuDetails?.decedent_info.dec_address,
          filingTaxOffice: projectSozokuDetails?.dec_tax_office,
        },
        projectInfo: {
          projectType: projectSozokuDetails?.project_category,
          // work1Branch: projectSozokuDetails?.project_category,
          introduceBy: projectSozokuDetails?.introduced_by_id,
          orderDate: projectSozokuDetails?.order_date,
          declarationDate: projectSozokuDetails?.due_date,
          work1Branch: String(projectSozokuDetails?.worker_office_id),
          submissionDate: projectSozokuDetails?.expected_submission_month,
          newsletter: String(projectSozokuDetails?.customer?.newsletter),
          semiTaxReturnedDate:
            projectSozokuDetails?.submission_tax_return_due_date,
          blueApplicationForm: String(projectSozokuDetails?.blue_application_form),
          consumptionTax: projectSozokuDetails?.sales_tax,
          interviewMc: projectSozokuDetails?.interviewer_id,
          worker1: projectSozokuDetails?.worker_id,
          manager: projectSozokuDetails?.manager_id,
          check1: projectSozokuDetails?.checker1_id,
          check2: projectSozokuDetails?.checker2_id,
          check3: projectSozokuDetails?.checker3_id,
          final1: projectSozokuDetails?.final1_id,
          final2: projectSozokuDetails?.final2_id,
          contractAmount: projectSozokuDetails?.order_amount,
          deposit: projectSozokuDetails?.deposit_amount,
          isSemiFinalTaxReturn: projectSozokuDetails?.semi_final_tax_return,
          remainingAmount: projectSozokuDetails?.balance_amount,
          undivided: String(projectSozokuDetails?.undivided) || "0",
          realEstateSale: String(projectSozokuDetails?.real_estate_sale) || "0",
          secondaryMeasure:
            String(projectSozokuDetails?.secondary_measures) || "0",
          realEstateReg:
            String(projectSozokuDetails?.real_estate_registration) || "0",
          isEnd: String(projectSozokuDetails?.project_finish) || "0",
        },
        progress: {
          contractIssueDate:
            projectSozokuDetails?.progress?.prgrs_contract_issue_date,
          depositBillingDate:
            projectSozokuDetails?.progress?.prgrs_deposit_billing_date,
          depositDate: projectSozokuDetails?.progress?.prgrs_payment_date,
          receiptOfMaterial:
            projectSozokuDetails?.progress?.prgrs_doc_recv_date,
          scDeficiencyCheck:
            projectSozokuDetails?.progress?.prgrs_sc_insufficient_date,
          interimReport:
            projectSozokuDetails?.progress?.prgrs_interim_report_date, //first table end
          cpDate:
            projectSozokuDetails?.progress?.prgrs_cp_verification_date,

          firstCalculationFilingDate:
            projectSozokuDetails?.progress?.prgrs_verify_1st_submit_date,
          firstCalculationCompletionDate:
            projectSozokuDetails?.progress?.prgrs_verify_1st_comp_date,
          secondaryCalculationFilingDate:
            projectSozokuDetails?.progress?.prgrs_verify_2nd_submit_date,
          secondaryCalculationCompletionDate:
            projectSozokuDetails?.progress?.prgrs_verify_2nd_comp_date,
          thirdVerificationSubmissionDate:
            projectSozokuDetails?.progress?.prgrs_verify_3rd_submit_date,
          thirdVerificationCompletionDate:
            projectSozokuDetails?.progress?.prgrs_verify_3rd_comp_date,
          // propertyValuationCompletionDate:
          //   projectSozokuDetails?.progress?.prgrs_property_eval_comp_date,
          finalCheck1CompletionDate:
            projectSozokuDetails?.progress?.prgrs_final_check_1st_comp_date,
          finalCheck2CompletionDate:
            projectSozokuDetails?.progress?.prgrs_final_check_2nd_comp_date, //second table end
          sealDate: projectSozokuDetails?.progress?.prgrs_stamp_date,
          balanceBillingDate:
            projectSozokuDetails?.progress?.prgrs_balance_billing_date,
          remainingBalanceDeposit:
            projectSozokuDetails?.progress?.prgrs_balance_deposit_date,
          taxOfficeShipping:
            projectSozokuDetails?.progress?.prgrs_taxoffice_shipping_date,
          businessProcessingBook:
            projectSozokuDetails?.progress?.prgrs_work_process_book_date,
          copyReceiptOfTaxReturn:
            projectSozokuDetails?.progress?.prgrs_receipt_declaration_date,
          returnDate: projectSozokuDetails?.progress?.prgrs_return_date,

          // amendedReturnFilingDate:
          //   projectSozokuDetails?.progress?.prgrs_correction_filing_date, //third table end
          // realEstateRegCompletionDate:
          //   projectSozokuDetails?.progress?.prgrs_real_estate_reg_date, //third table end
        },

      }));
      const heirsObject = (projectSozokuDetails?.heirs as any).reduce(
        (obj: { [x: string]: any }, heir: { id: string | number }) => {

          obj[heir.id] = heir;
          return obj;
        },
        {}
      );

      setDisplayedComponents(heirsObject);
      setDatesSet(false);

      const representativeHeir = (projectSozokuDetails?.heirs as any).find(
        (heir: { is_representative: number }) => heir.is_representative == 1
      );
      if (representativeHeir) {
        setActiveRepresentative(representativeHeir.id);
      }
      else if (Object.keys(heirsObject).length === 1 ) {
        setActiveRepresentative(Object.keys(heirsObject)[0] as any);
      }
    }

    else if (!showLoading && projectSozokuDetails === null && showSuccess) {
      handleNoRecordFound(router, setToastMessage, setType, '/projectConfirmed?project_category=1&taxoffice_shipping_date_exists=0&limit=50&active_tab=1');
    }
  }, [projectSozokuDetails, showSuccess, showLoading]);

  useEffect(() => {
    return () => {
      dispatch(resetProjectSozokuShowState());
    };
  }, [dispatch]);


  useEffect(() => {
    if (formState && formState.progress && !datesSet) {
      // checkAndSetProgressDates();
    }
  }, [formState, datesSet]);
  alert('test4')
  useEffect(() => {
    alert('test3')
    handleIsEndToggle();
  }, [formState.progress, formState.projectInfo]);
console.log('formState.progress', formState.progress)
  const handleIsEndToggle = () => {
    alert('test')
    const fieldsToCheck = [
      "interviewMc",
      "manager",
      "worker1",
      "check1",
      "final1",
    ];
    const progressFieldsToCheck = [
      'receiptOfMaterial',
      'firstCalculationFilingDate',
      'firstCalculationCompletionDate',
      'finalCheck1CompletionDate',
      'sealDate',
      'balanceBillingDate',
      'remainingBalanceDeposit',
      'taxOfficeShipping',
      'businessProcessingBook',
      'copyReceiptOfTaxReturn',
      'returnDate',
    ];
    // Check if all of the specified fields in projectInfo have data
    const allProjectInfoFieldsHaveData = fieldsToCheck.every((fieldName) => {
      const fieldValue = formState.projectInfo[fieldName];
      return fieldValue != null && fieldValue !== "";
    });
    // Check if all of the specified fields in progress have data
    const allProgressFieldsHaveData = progressFieldsToCheck.every(
      (fieldName) => {
        const fieldValue = formState.progress[fieldName];
        return fieldValue != null && fieldValue !== "";
      }
    );

    const allFieldsHaveData =
      allProjectInfoFieldsHaveData && allProgressFieldsHaveData;
      console.log('allFieldsHaveData', allFieldsHaveData)
    setDisableIsEndToggle(!allFieldsHaveData);
  };
  
  const progressFieldToInputNameMap: any = {
    prgrs_contract_issue_date: "contractIssueDate",
    prgrs_deposit_billing_date: "depositBillingDate",
    prgrs_payment_date: "depositDate",
    prgrs_doc_recv_date: "receiptOfMaterial",
    prgrs_sc_insufficient_date: "scDeficiencyCheck",
    prgrs_interim_report_date: "interimReport",
    prgrs_verify_1st_submit_date: "firstCalculationFilingDate",
    prgrs_verify_1st_comp_date: "firstCalculationCompletionDate",
    prgrs_verify_2nd_submit_date: "secondaryCalculationFilingDate",
    prgrs_verify_2nd_comp_date: "secondaryCalculationCompletionDate",
    prgrs_verify_3rd_comp_date: "thirdVerificationCompletionDate",
    prgrs_property_eval_comp_date: "propertyValuationCompletionDate",
    prgrs_final_check_1st_comp_date: "finalCheck1CompletionDate",
    prgrs_final_check_2nd_comp_date: "finalCheck2CompletionDate",
    prgrs_stamp_date: "sealDate",
    prgrs_balance_billing_date: "balanceBillingDate",
    prgrs_balance_deposit_date: "remainingBalanceDeposit",
    prgrs_taxoffice_shipping_date: "taxOfficeShipping",
    prgrs_work_process_book_date: "businessProcessingBook",
    prgrs_receipt_declaration_date: "copyReceiptOfTaxReturn",
    // prgrs_return_date: "returnDate",
    prgrs_correction_filing_date: "amendedReturnFilingDate",
    prgrs_real_estate_reg_date: "realEstateRegCompletionDate",
  };

  function checkAndSetProgressDates() {
    const progressFields: any = projectSozokuDetails?.progress;

    for (const apiFieldName in progressFields) {
      if (
        progressFields.hasOwnProperty(apiFieldName) &&
        progressFields[apiFieldName]
      ) {
        const inputName = progressFieldToInputNameMap[apiFieldName as any];
        if (inputName) {
          // Find the input element by name and get its closest 'td' parent
          const inputElement = document.querySelector(
            `input[name="${inputName}"]`
          );
          const parentTd = inputElement ? inputElement.closest("td") : null;

          // If a parent 'td' is found, get its ID
          const tdId = parentTd ? parentTd.id : null;

          setTodayDate(inputName, tdId as string);
        }
      }
    }
    setDatesSet(true); // Indicate that dates have been set
  }

  const [projectDaysLeft, setProjectDaysLeft] = useState('');
  const [projectDaysLeft2, setProjectDaysLeft2] = useState('');
  useEffect(() => {
    const remainingDays = calculateDaysDifference(
      formState.projectInfo.orderDate
    );

    
    if (formState.projectInfo.isEnd != "1") {
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          elapsedData: formState.projectInfo.orderDate ? remainingDays : '',
        },
      }));
    }

    const daysLeft = evaluateDate(formState.projectInfo.declarationDate);
    
    setProjectDaysLeft(daysLeft);

    if (noOfRemFilingDaysCanChange === true && !isNaN(Number(daysLeft))) {
      setTimeout(() => {
        setFormState((prevState: { projectInfo: any }) => ({
          ...prevState,
          projectInfo: {
            ...prevState.projectInfo,
            noOfDaysRemainingForFiling: `${daysLeft} 日`,
          },
        }));
      }, 1000);
    } 
     
    else {
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          noOfDaysRemainingForFiling: (formState.progress.taxOfficeShipping) ? "提出済" : (!formState.progress.taxOfficeShipping && daysLeft == '期限後') ? '期限後' : '期限後',
        },
      }));
    }

    const daysLeft2 = evaluateDate(formState.projectInfo.semiTaxReturnedDate);
    
    setProjectDaysLeft2(daysLeft2)
    setTimeout(() => {
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          semiRemainingDays: formState.projectInfo.semiTaxReturnedDate ? (!isNaN(Number(daysLeft2)) ? `${daysLeft2} 日` : daysLeft2) : '',
        },
      }));
    }, 1000);
  }, [
    formState.projectInfo.orderDate,
    setFormState,
    formState.projectInfo.declarationDate,
    formState.projectInfo.semiTaxReturnedDate,
    formState.projectInfo.isEnd,
    noOfRemFilingDaysCanChange,
  ]);

  useEffect(() => {
    if(!formState.progress.taxOfficeShipping && !formState.projectInfo.declarationDate)
      {
        setTimeout(() => {
          setFormState((prevState: { projectInfo: any }) => ({
            ...prevState,
            projectInfo: {
              ...prevState.projectInfo,
              noOfDaysRemainingForFiling: "",
            },
          }));
        }, 500);
      }
  },[formState.progress.taxOfficeShipping, formState.projectInfo.declarationDate])

  useEffect(() => {
    if (formState.progress.taxOfficeShipping) {
      setNoOfRemFilingDaysCanChange(false);
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          noOfDaysRemainingForFiling: "提出済",
        },
      }));
    } else {
      setNoOfRemFilingDaysCanChange(true);
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          noOfDaysRemainingForFiling: "期限後",
        },
      }));
    }
  }, [formState.progress.taxOfficeShipping, setFormState]);

  useEffect(() => {
    if (formState.projectInfo.isEnd == "1") {
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          elapsedData: `-`,
        },
      }));
    }
  }, [formState.projectInfo.isEnd]);

  useEffect(() => {
    if (formState.projectInfo.realEstateReg == "1") {
      setDisablerealEstateRegCompletionDate(false);
    } else {
      setDisablerealEstateRegCompletionDate(true);
    }
  }, [formState.projectInfo.realEstateReg]);

  useEffect(() => {
    const sum =
      Number(formState.projectInfo.remainingAmount) +
      Number(formState.projectInfo.deposit);
    setFormState((prevState: { projectInfo: any }) => ({
      ...prevState,
      projectInfo: {
        ...prevState.projectInfo,
        billingTotal: `${sum} 円`,
      },
    }));
  }, [
    formState.projectInfo.remainingAmount,
    setFormState,
    formState.projectInfo.deposit,
  ]);

  useEffect(() => {
    if (formState.projectInfo.undivided == "1") {
      const { futureDate, daysInNextThreeYears } =
        calculateThreeYearsLaterAndDays(formState.projectInfo.declarationDate);
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          dueDateWithin3Years: futureDate,
          noOfRemainingDaysWithin3Years: daysInNextThreeYears,
        },
      }));
    } else {
      setFormState((prevState: { projectInfo: any }) => ({
        ...prevState,
        projectInfo: {
          ...prevState.projectInfo,
          dueDateWithin3Years: "-",
          noOfRemainingDaysWithin3Years: "-",
        },
      }));
    }
  }, [
    formState.projectInfo.declarationDate,
    formState.projectInfo.undivided,
    setFormState,
  ]);

  function onButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    const target = event.target as HTMLElement; // Cast the target to HTMLElement
    const parentTd = target.closest("td");
    if (parentTd) {
      const inputElement = parentTd.querySelector("input[name]");
      if (inputElement) {
        const inputName = inputElement.getAttribute("name");
        if (inputName) {
          setTodayDate(inputName, parentTd.id);
        }
      }
    }
  }

  function setTodayDate(inputName: string, tdId: string) {
    const today = new Date();
    // Manually construct the 'YYYY/MM/DD' format
    const formattedToday = [
      today.getFullYear(),
      ("0" + (today.getMonth() + 1)).slice(-2),
      ("0" + today.getDate()).slice(-2),
    ].join("-");


    const syntheticEvent = {
      target: {
        name: inputName,
        value: formattedToday, // Use the manually formatted date
      },
    };

    handleInputChange(syntheticEvent as any, 0);
    handleResetGoals(tdId);
  }

  // useEffect(() => {
  //   createProgressDatesSchedule('texttd1', null);
  // }, [formState.progress.receiptOfMaterial]);

  useEffect(() => {
    if (!formState.progress.balanceBillingDate) {
      createProgressDatesSchedule("texttd13", null);
    }
  }, [formState.progress.balanceBillingDate]);

  useEffect(() => {
    if (!formState.progress.sealDate) {
      createProgressDatesSchedule("texttd12", null);
    }
  }, [formState.progress.sealDate]);

  useEffect(() => {
    if (!formState.progress.finalCheck2CompletionDate) {
      createProgressDatesSchedule("texttd11", null);
    }
  }, [formState.progress.finalCheck2CompletionDate]);

  useEffect(() => {
    if (!formState.progress.finalCheck1CompletionDate) {
      createProgressDatesSchedule("texttd10", null);
    }
  }, [formState.progress.finalCheck1CompletionDate]);

  useEffect(() => {
    if (!formState.progress.propertyValuationCompletionDate) {
      createProgressDatesSchedule("texttd9", null);
    }
  }, [formState.progress.propertyValuationCompletionDate]);

  useEffect(() => {
    if (!formState.progress.thirdVerificationCompletionDate) {
      createProgressDatesSchedule("texttd8", null);
    }
  }, [formState.progress.thirdVerificationCompletionDate]);

  useEffect(() => {
    if (!formState.progress.secondaryCalculationCompletionDate) {
      createProgressDatesSchedule("texttd7", null);
    }
  }, [formState.progress.secondaryCalculationCompletionDate]);

  useEffect(() => {
    if (!formState.progress.secondaryCalculationFilingDate) {
      createProgressDatesSchedule("texttd6", null);
    }
  }, [formState.progress.secondaryCalculationFilingDate]);

  useEffect(() => {
    if (!formState.progress.firstCalculationCompletionDate) {
      createProgressDatesSchedule("texttd5", null);
    }
  }, [formState.progress.firstCalculationCompletionDate]);

  useEffect(() => {
    if (!formState.progress.firstCalculationFilingDate) {
      createProgressDatesSchedule("texttd4", null);
    }
  }, [formState.progress.firstCalculationFilingDate]);

  useEffect(() => {
    if (!formState.progress.interimReport) {
      createProgressDatesSchedule("texttd3", null);
    }
  }, [formState.progress.interimReport]);

  useEffect(() => {
    if (!formState.progress.scDeficiencyCheck) {
      createProgressDatesSchedule("texttd2", null);
    }
  }, [formState.progress.scDeficiencyCheck]);

  useEffect(() => {
    // if (formState.progress.receiptOfMaterial) {
    createProgressDatesSchedule("texttd13", "texttd1");
    // }
  }, [formState.progress.receiptOfMaterial]);

  useEffect(() => {
    const textIds = [
      "texttd1",
      "texttd2",
      "texttd3",
      "texttd4",
      "texttd5",
      "texttd6",
      "texttd7",
      "texttd8",
      "texttd9",
      "texttd10",
      "texttd11",
      "texttd12",
      "texttd13",
    ];
    const currentDate = new Date();
    textIds.forEach((textId) => {
      const textTdElement = document.querySelector(`#${textId}`);
      const pElement = textTdElement ? textTdElement.querySelector("p") : null;
      const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/; // Regex for 'YYYY/MM/DD' format

      if (pElement && dateRegex.test(pElement.innerText)) {
        const dateFromP = new Date(pElement.innerText);
        if (textTdElement != null) {
          if (dateFromP < currentDate) {
            textTdElement.classList.add("danger");
          } else {
            textTdElement.classList.remove("danger");
          }
        }
      } else if (textTdElement) {
        textTdElement.classList.remove("danger");
      }
    });
  }, [formState.progress]);



  const createProgressDatesSchedule = (specificTextId: string | null = null, beginIndex: any) => {
    
    const textIds = [
      "texttd1",
      "texttd2",
      "texttd3",
      "texttd4",
      "texttd5",
      "texttd6",
      "texttd7",
      "texttd8",
      "texttd9",
      "texttd10",
      "texttd11",
      "texttd12",
      "texttd13",
    ];
    const ids = [
      "td1",
      "td2",
      "td3",
      "td4",
      "td5",
      "td6",
      "td7",
      "td8",
      "td9",
      "td10",
      "td11",
      "td12",
      "td13",
      "td14",
      "td15",
      "td16",
      "td17",
      "td18",
      "td19",
    ];

    const dateCalculations: any = {
      texttd2: getDateAfterWeeks(formState.progress.receiptOfMaterial, 2),
      texttd3: getDateAfterWeeks(formState.progress.receiptOfMaterial, 5),
      texttd4: getDateAfterWeeks(formState.progress.receiptOfMaterial, 7),
      texttd5: getDateAfterWeeks(formState.progress.receiptOfMaterial, 7),
      texttd6: getDateAfterWeeks(formState.progress.receiptOfMaterial, 9),
      texttd7: getDateAfterWeeks(formState.progress.receiptOfMaterial, 9),
      texttd8: getDateAfterWeeks(formState.progress.receiptOfMaterial, 10),
      texttd9: getDateAfterWeeks(formState.progress.receiptOfMaterial, 10),
      texttd10: getDateAfterWeeks(formState.progress.receiptOfMaterial, 11),
      texttd11: getDateAfterWeeks(formState.progress.receiptOfMaterial, 11),
      texttd12: getDateAfterWeeks(formState.progress.receiptOfMaterial, 11),
      texttd13: getDateAfterWeeks(formState.progress.receiptOfMaterial, 12),
    };

    const updateTextId = (textId: string) => {
      const dateForTextId = dateCalculations[textId];
      const textElement = document.querySelector(`#${textId} p`);
      if (dateForTextId && textElement) {
        const htmlElement = textElement as HTMLElement;
        htmlElement.innerText = dateForTextId;
        if (!formState.progress.receiptOfMaterial) {
          htmlElement.innerText = 'testing';
        }
      }

      if (beginIndex) {
        const element = document.querySelector(`#${beginIndex} p`) as HTMLElement;
        if (element) {
          element.innerText = '-';
        }
      }
    };

    if (specificTextId) {
      const specificIndex = textIds.indexOf(specificTextId);
      if (specificIndex !== -1) {
        const tdId = `td${specificTextId.substring(6)}`;
        const tdIndex = ids.indexOf(tdId);

        let startIndex = specificIndex;
        for (let i = tdIndex; i >= 0; i--) {
          const td = document.querySelector(`#${ids[i]}`);
          const input = td ? td.querySelector("input") : null;


          if (input && (input.name === "receiptOfMaterial" || input.value)) {
            startIndex = textIds.indexOf(`text${ids[i]}`) + 1;

            break;
          }
        }

        const textIdsToUpdate = textIds.slice(startIndex, specificIndex + 1);

        // if (!formState.progress.receiptOfMaterial) {
        // console.log('textIdsToUpdate', textIdsToUpdate);
        // }

        textIdsToUpdate.forEach((textId) => updateTextId(textId));
      }
    } else {
      textIds.forEach((textId) => updateTextId(textId));
    }
  };

  const handleResetGoals = (arg: any) => {
    const ids = [
      "td1",
      "td2",
      "td3",
      "td4",
      "td5",
      "td6",
      "td7",
      "td8",
      "td9",
      "td10",
      "td11",
      "td12",
      "td13",
      "td14",
      "td15",
      "td16",
      "td17",
      "td18",
      "td19",
    ];

    if (typeof arg === "string") {
      // Use the string ID directly
      const clickedIndex = ids.indexOf(arg);
      if (clickedIndex !== -1) {
        setIncludedIds(ids.slice(0, clickedIndex + 1));
      }
    } else if (arg && arg.target) {
      // Extract the td ID from an event
      const clickedTd = arg.target.closest("td");
      if (clickedTd) {
        const clickedId = clickedTd.id;
        const clickedIndex = ids.indexOf(clickedId);
        if (clickedIndex !== -1) {
          setIncludedIds(ids.slice(0, clickedIndex + 1));
        }
      }
    }
  };


  useEffect(() => {
    includedIds.forEach((id: string) => {
      const texttd = document.querySelector(`#text${id}`);
      if (texttd) {
        if (texttd.classList.contains("danger")) {
          texttd.classList.remove("danger");
        }
        const p = texttd.querySelector("p");
        if (p) p.innerText = "-";
      }
    });
  }, [includedIds]);

  const handleAddClick = (heirData: any) => {
    setDisplayedComponents((prevComponents: any) => {
      const updatedComponents = { ...prevComponents, [heirData.id]: heirData };
  
      // Check if there's no representative currently selected
      const hasRepresentative = Object.values(updatedComponents).some(
        (heir: any) => heir.is_representative === "1"
      );
  
      // If no representative, set the first heir as representative
      if (!hasRepresentative && Object.keys(updatedComponents).length === 1) {
        updatedComponents[heirData.id] = {
          ...updatedComponents[heirData.id],
          is_representative: "1",
        };
        handleRepresentativeChange(heirData.id);
      }
      else {
        updatedComponents[heirData.id] = {
          ...updatedComponents[heirData.id],
          is_representative: "0",
        };
      }
  
      return updatedComponents;
    });
  };
  
  
  
  // const handleAddClick = (heirData: any) => {
  //   // Attempt to find the heir in projectSozokuDetails?.heirs
  //   const foundHeir = (projectSozokuDetails?.heirs as any).find(
  //     (heir: any) => heir.id === heirData.id
  //   );

  //   setDisplayedComponents((prevComponents: any) => ({
  //     ...prevComponents,
  //     // If foundHeir exists, use its data; otherwise, use heirData
  //     [heirData.id]: foundHeir || heirData,
  //   }));
  // };

  
  const handleDeleteClick = (heirId: any) => {
    setDisplayedComponents((prevComponents: any) => {
      const updatedComponents = { ...prevComponents };
      delete updatedComponents[heirId] as any;
      return updatedComponents;
    });
  };
  const dataSource =
    updatedHeirData.length > 0
      ? updatedHeirData
      : projectSozokuDetails?.family_members;
  let updatedHeirs = dataSource?.map((item: any) => {
    return {
      ...item,
      personalCode: item.personal_code,
      name: item.name,
      address: item.address,
      contact: item.phone1,

      actions: (displayedComponents[item.id] as any) ? (
        <Button
          text={t("remove")}
          type="danger"
          className={`heirActionBtn`}
          size="small"
          onClick={() => handleDeleteClick(item.id)}
        />
      ) : (
        <Button
          text={t("addRecord")}
          type="secondary"
          className={`heirActionBtn`}
          size="small"
          onClick={() => handleAddClick(item)}
        />
      ),
    };
  });

  useEffect(() => {

  }, [displayedComponents]);
  const columns = [
    { header: `${t("personalCode")}`, accessor: "personalCode" },
    { header: `${t("name")}`, accessor: "name" },
    { header: `${t("contact")}`, accessor: "contact" },
    { header: `${t("address")}`, accessor: "address" },
    { header: `${t("actions")}`, accessor: "actions" },
  ];
  useEffect(() => {
    const inputElement = document.querySelector(
      'input[name="noOfDaysRemainingForFiling"]'
    );
    const daysLeft = extractDaysFromString(
      formState.projectInfo.noOfDaysRemainingForFiling
    );

    if (inputElement) {
      // Check that inputElement is not null
      if (!isNaN(projectDaysLeft as any) && projectDaysLeft != null && (inputElement as HTMLInputElement).value != '提出済') {
        // debugger;
        if (Number(projectDaysLeft) >= 0 && Number(projectDaysLeft) <= 15) {
          inputElement.classList.add("bg-red");
          inputElement.classList.remove("bg-yellow");
        } else if (Number(projectDaysLeft) > 15 && Number(projectDaysLeft) <= 30) {
          inputElement.classList.add("bg-yellow");
          inputElement.classList.remove("bg-red");
        } else {
          inputElement.classList.remove("bg-red", "bg-yellow");
        }
      } else {
        // Handle the case where daysLeft is NaN, i.e., the string doesn't contain a number
        inputElement.classList.remove("bg-red", "bg-yellow");
      }
    }
  }, [formState.projectInfo.noOfDaysRemainingForFiling]);


  useEffect(() => {
    setTimeout(() => {
      const inputElement = document.querySelector(
        'input[name="semiRemainingDays"]'
      );
      const daysLeft = extractDaysFromString(
        formState.projectInfo.semiRemainingDays
      );
      


      if (inputElement) {
        // Check that inputElement is not null
        if (!isNaN(projectDaysLeft2 as any) && projectDaysLeft2 != null) {
          // debugger;
          if (Number(projectDaysLeft2) >= 0 && Number(projectDaysLeft2) <= 30) {
            inputElement.classList.add("bg-red");
            inputElement.classList.remove("bg-yellow");
          } else {
            inputElement.classList.remove("bg-red", "bg-yellow");
          }
        } else {
          // Handle the case where daysLeft is NaN, i.e., the string doesn't contain a number
          inputElement.classList.remove("bg-red", "bg-yellow");
        }
      }
    }, 1500);
  }, [formState.projectInfo.semiRemainingDays, projectDaysLeft2]);

  // const updateFormState = (key, formState) => {
  //   setAllFormStates(prevStates => ({ ...prevStates, [key]: formState }));
  // };

  const handleFamilyMemberData = (
    familyMemberData: React.SetStateAction<never[]>
  ) => {
    setUpdatedHeirData(familyMemberData);
  };

  const handleCloseToast = () => {
    if(deleteSuccess)
      {
        dispatch(resetDeleteProjectSozokuState());
        router.push("/projectConfirmed?project_category=1&taxoffice_shipping_date_exists=0&limit=50&active_tab=1");
      }
      if (!showLoading && projectSozokuDetails === null && showSuccess) {
        router.push("/projectConfirmed?project_category=1&taxoffice_shipping_date_exists=0&limit=50&active_tab=1");
      }
    setToast({ message: "", type: "" });
    dispatch(resetProjectSozokuUpdateState());
  };

  const handleInputChangeNotify = () => {
    setHasChanges(true);
  };

  const handleFormSubmitBefore = () => {
    if (hasChanges) {
      setShowConfirmBox(true);
    } else {
      handleSubmit();
    }
  };
 
  useEffect(() => {
        const age = calculateAge(formState.decedentInfo.dateOfBirth);
      
      setFormState((prevState: { decedentInfo: any }) => ({
        ...prevState,
        decedentInfo: {
          ...prevState.decedentInfo,
          japaneseDateFormat: age,
        },
      }));
    
  }, [formState.decedentInfo.dateOfBirth]);

  const handleMainDeleteClick = () => {
    const id = getParamValue("id");
    if (id != null) {
      dispatch(deleteProjectSozokuById(Number(id)));
    }
  };

  const { offices: officesOptions } = useSelector(
    (state: RootState) => state.allOfficesOptions
  );
  useEffect(() => {
    dispatch(fetchAllOffices())
  }, [])

  // useEffect(() => {
  //   if (formState.projectInfo.worker1Office) {
  //     dispatch(
  //       fetchOfficesByUserId(Number(formState.projectInfo.worker1Office))
  //     );
  //   }
  // }, [formState.projectInfo.worker1Office]);


  const { minDate, maxDate } = getDateRangeForLastThreeDays();

  const handleDateChange = (newDate: any) => {
    setFormState((prevState: { decedentInfo: any; }) => ({
      ...prevState,
      decedentInfo: {
        ...prevState.decedentInfo,
        dateOfBirth: newDate,
      },
    }));
}; 



  return (
    <>
      {tostMessage && <Toast message={tostMessage} type={type} onClose={() => {setToastMessage('');handleCloseToast();}} />}
      {
        showLoading && <FullscreenLoader />
      }
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      <AuthMiddleware>
        <Form
          onSubmit={handleFormSubmitBefore}
          isLoading={updateLoading}
          showDeleteButton={isAuthenticated ? true : false}
          deleteButtonLoading={deleteLoading}
          onClickDeleteButton={() => setShowMainDelConfirmBox(true)}
          setErrors={setErrors} errors={errors}
        >
          <div className={`mt-1`}>
            <div className={ProjectStyle.projectTaxFormWrapper}>
              <HeadingRow headingTitle={t("被相続人情報")}></HeadingRow>

              <div
                className={`${Style.customerFromWrapper} ${ProjectStyle.customerFormFirstRow} mt-1`}
              >
                <InputField
                  name="familyCode"
                  value={formState.familyMember.familyCode}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("familyCode")}
                  placeholder={t("familyCode")}
                  readOnly={true}
                />
                <InputField
                  name="personalCode"
                  value={formState.familyMember.personalCode}
                  onChange={(e) => handleInputChange(e, 0)}
                  className={Style.customerReadBtn}
                  label={t("personalCode")}
                  placeholder={t("personalCode")}
                  readOnly={true}
                />

                <InputField
                  name="unifiedNumber"
                  value={formState.unifiedNumber}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("unifiedNumber")}
                  placeholder={t("unifiedNumber")}
                  readOnly={true}
                />
                <InputField
                  name="customerCode"
                  value={formState.customerCode}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("customerCode")}
                  placeholder={t("customerCode")}
                  validations={[{ type: "onlyAlphanumeric" }]}
                  // readOnly={true}
                />
                <p className={ProjectStyle.suggestedCodeText}>
                  次の利用可能な案件番号：{formState.nextCustomerCode}
                </p>
              </div>
              <div className={ProjectStyle.decedentInfoWrapper}>
                <InputField
                  name="firstNameKana"
                  value={formState.decedentInfo.firstNameKana}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("firstNameKana")}
                  placeholder={t("firstNameKana")}
                />
                <InputField
                  name="lastNameKana"
                  value={formState.decedentInfo.lastNameKana}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("lastNameKana")}
                  placeholder={t("lastNameKana")}
                />

                <InputField
                  name="firstName"
                  value={formState.decedentInfo.firstName}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("firstName")}
                  placeholder={t("firstName")}
                />
                <InputField
                  name="lastName"
                  value={formState.decedentInfo.lastName}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("lastName")}
                  placeholder={t("lastName")}
                />
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <InputDateField
                  name="inheritanceStartDate"
                  value={formState.decedentInfo.inheritanceStartDate}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("inheritanceStartDate")}
                  placeholder={t("inheritanceStartDate")}
                />
                {/* <InputDateField
                  name="dateOfBirth"
                  value={formState.decedentInfo.dateOfBirth}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("dateOfBirth")}
                  placeholder={t("dateOfBirth")}
                /> */}
                  <div className="mt-1half">
                  <JapaneseDatePicker 
                  initialDate={formState.decedentInfo.dateOfBirth} 
                  onDateChange={handleDateChange} 
                  label={t("dateOfBirth")} 
                  className={ProjectStyle.japaneseDateInput}
                  />
                  </div>
                {/* <InputField
                  name="japaneseDateFormat"
                  value={formState.decedentInfo.japaneseDateFormat}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t(".")}
                  readOnly={true}
                /> */}
                {/* <span></span> */}
                {/* <div className={ProjectStyle.addressField}> */}
                <InputField
                  name="address"
                  value={formState.decedentInfo.address}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("address")}
                  placeholder={t("address")}
                  className={ProjectStyle.addressField}
                />
                {/* </div> */}

                {/* <InputField
                  name="filingTaxOffice"
                  value={formState.decedentInfo.filingTaxOffice}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("filingTaxOffice")}
                  placeholder={t("filingTaxOffice")}
                /> */}
              </div>
              <HeadingRow headingTitle={t("projectInformation")}></HeadingRow>
              <div className={ProjectStyle.projectInfoFormWrapperRow1}>
                <CustomSelectField
                  name="projectType"
                  label={t("projectType")}
                  options={formDropdowns?.project_categories}
                  value={formState.projectInfo.projectType}
                  onChange={(e) => {
                    handleInputChange(e, 0);
                  }}
                  className={ProjectStyle.customSelectFields}
                />
                <CustomSelectField
                  name="work1Branch"
                  value={formState.projectInfo.work1Branch}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("作業者オフィス")}
                  disabled={true}
                  options={officesOptions as any}
                  className={ProjectStyle.customSelectFields}
                />
                <CustomSelectField
                  name="introduceBy"
                  label={t("introduceBy")}
                  options={formDropdowns?.introduced_by}
                  value={formState.projectInfo.introduceBy}
                  onChange={(e) => {
                    handleInputChange(e, 0);
                  }}
                  placeholder={t("introduceBy")}
                  className={ProjectStyle.customSelectFields}
                  tag={t('required')}
                  validations={[{ type: "required" }]}
                  errorText={errors["introduceBy"]}
                />
                <InputDateField
                  name="orderDate"
                  value={formState.projectInfo.orderDate}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("orderDate")}
                  placeholder={t("orderDate")}
                />
                <InputField
                  name="elapsedData"
                  value={addCommas(formState.projectInfo.elapsedData)}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("elapsedDays")}
                  readOnly={true}
                />
                <InputDateField
                  name="declarationDate"
                  value={formState.projectInfo.declarationDate}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("declarationDate")}
                  placeholder={t("declarationDate")}
                />
                <InputField
                  name="noOfDaysRemainingForFiling"
                  value={addCommas(formState.projectInfo.noOfDaysRemainingForFiling)}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("noOfDaysRemainingForFiling")}
                  // placeholder={t("noOfDaysRemainingForFiling")}
                  readOnly={true}
                  className={(formState.projectInfo.noOfDaysRemainingForFiling == '期限後' || formState.projectInfo.noOfDaysRemainingForFiling == undefined) ? ProjectStyle.grayCell : ''}
                />
                <InputDateField
                  name="submissionDate"
                  value={formState.projectInfo.submissionDate}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("submissionDate")}
                  placeholder={t("submissionDate")}
                  inputType="month"
                />

                <div>
                  <ToggleButton
                    value={formState.projectInfo.isSemiFinalTaxReturn == "1"}
                    options={{
                      on: `${t("準確定申告")}`,
                      off: `${t("準確定申告")}`,
                    }}
                    getSelectedOption={(isOn) => {
                      setFormState((prevState: { projectInfo: any }) => ({
                        ...prevState,
                        projectInfo: {
                          ...prevState.projectInfo,
                          isSemiFinalTaxReturn: isOn ? "1" : "0",
                        },
                      }));
                    }}
                    hideSelectedText={true}
                    label={t("準確定申告")}
                  />
                </div>
                <InputDateField
                  name="semiTaxReturnedDate"
                  value={formState.projectInfo.semiTaxReturnedDate}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("semiTaxReturnedDate")}
                  placeholder={t("semiTaxReturnedDate")}
                />

                <InputField
                  name="semiRemainingDays"
                  value={addCommas(formState.projectInfo.semiRemainingDays)}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("semiRemainingDays")}
                  // placeholder={t("semiRemainingDays")}
                  readOnly={true} 
                  className={(formState.projectInfo.semiRemainingDays == '期限後' || formState.projectInfo.semiRemainingDays == undefined) ? ProjectStyle.grayCell : ''}
                />
                <CustomSelectField
                  name="blueApplicationForm"
                  label={t("青色申請書")}
                  options={formDropdowns?.blue_application}
                  value={formState.projectInfo.blueApplicationForm}
                  onChange={(e) => {
                    handleInputChange(e,0);
                  }}
                  className={ProjectStyle.customSelectFields}
                />
                {/* <CustomSelectField
                  name="consumptionTax"
                  label={t("トス上げ者")}
                  options={formDropdowns?.consumption_tax}
                  value={formState.projectInfo.consumptionTax}
                  onChange={(e) => {
                    handleInputChange;
                  }}
                  className={ProjectStyle.customSelectFields}

                /> */}
              </div>
              {/* ********Next Row********** */}
              <div className={ProjectStyle.projectInfoFormWrapperRow2}>
                <CustomSelectField
                  label={t("interviewMc")}
                  name="interviewMc"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.interviewMc}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("interviewMc")}
                // className={Style.insuranceDropdownSelect}
                />



                <CustomSelectField
                  label={t("manager")}
                  name="manager"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.manager}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("manager")}
                // className={Style.insuranceDropdownSelect}
                />

                <CustomSelectField
                  label={t("worker1")}
                  name="worker1"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.worker1}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("worker1")}
                // className={Style.insuranceDropdownSelect}
                />
                {/* <CustomSelectField
                  options={officesOptions || []}
                  name="worker1Office"
                  value={formState.projectInfo.worker1Office}
                  onChange={(e) => handleInputChange(e, 0)}
                  disabled={formState.projectInfo.worker1 == "" ? true : false}
                  label={t("office")}
                // className={Style.insuranceDropdownSelect}
                /> */}


                <CustomSelectField
                  label={t("check1")}
                  name="check1"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.check1}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("check1")}
                // className={Style.insuranceDropdownSelect}
                />
                <CustomSelectField
                  label={t("check2")}
                  name="check2"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.check2}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("check2")}
                // className={Style.insuranceDropdownSelect}
                />
                <CustomSelectField
                  label={t("check3")}
                  name="check3"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.check3}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("check3")}
                // className={Style.insuranceDropdownSelect}
                />
                <CustomSelectField
                  label={t("Final (1)")}
                  name="final1"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.final1}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("final1")}
                // className={Style.insuranceDropdownSelect}
                />
                <CustomSelectField
                  label={t("Final (2)")}
                  name="final2"
                  options={formDropdowns?.users}
                  value={formState.projectInfo.final2}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("final2")}
                // className={Style.insuranceDropdownSelect}
                />
              </div>
              {/* *******Next Row*** */}
              <div className={ProjectStyle.projectInfoFormWrapperRow3}>
                <InputField
                  name="contractAmount"
                  value={formState.projectInfo.contractAmount}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("contractAmountNew")}
                  placeholder={t("contractAmountNew")}
                />
                <InputField
                  name="deposit"
                  value={formState.projectInfo.deposit}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("depositTaxIncluded")}
                  placeholder={t("depositTaxIncluded")}
                />
                <InputField
                  name="remainingAmount"
                  value={formState.projectInfo.remainingAmount}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("remainingAmountTaxIncluded")}
                  placeholder={t("remainingAmountTaxIncluded")}
                />
                <InputField
                  name="billingTotal"
                  value={addCommas(formState.projectInfo.billingTotal)}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("billingTotal")}
                  placeholder={t("billingTotal")}
                  readOnly={true}
                />

                <ToggleButton
                  value={formState.projectInfo.undivided === "1"}
                  label={t("undivided")}
                  options={{
                    on: `${t("undivided")}`,
                    off: `${t("undivided")}`,
                  }}
                  getSelectedOption={(isOn) => {
                    setFormState((prevState: { projectInfo: any }) => ({
                      ...prevState,
                      projectInfo: {
                        ...prevState.projectInfo,
                        undivided: isOn ? "1" : "0",
                      },
                    }));
                  }}
                  hideSelectedText={true}
                />
                <InputField
                  name="dueDateWithin3Years"
                  value={formState.projectInfo.dueDateWithin3Years}
                  onChange= {(e) => handleInputChange(e, 0)}
                  label= {t("dueDateWithin3Years")}
                  placeholder= {t("dueDateWithin3Years")}
                  readOnly= {true}
                  className={
                    (() => {
                      const remainingDays = parseInt(formState.projectInfo.noOfRemainingDaysWithin3Years?.match(/-?\d+/), 10);
                      return remainingDays >= 0
                        ? remainingDays <= 15
                          ? 'dangerinputField'
                          : remainingDays <= 30
                            ? 'warninginputfield'
                            : ''
                        : 'greyInputFieldd';
                    })()
                  }
                /> 
                <InputField
                  name="noOfRemainingDaysWithin3Years"
                  value={formState.projectInfo.noOfRemainingDaysWithin3Years == '期限後' ? '期限後' : addCommas(formState.projectInfo.noOfRemainingDaysWithin3Years)}
                  onChange={(e) => handleInputChange(e, 0)}
                  label={t("noOfRemainingDaysWithin3Years")}
                  placeholder={t("noOfRemainingDaysWithin3Years")}
                  readOnly={true}
                  className={
                    (() => {
                      const remainingDays = parseInt(formState.projectInfo.noOfRemainingDaysWithin3Years?.match(/-?\d+/), 10);
                      return remainingDays >= 0
                        ? remainingDays <= 15
                          ? 'dangerinputField'
                          : remainingDays <= 30
                            ? 'warninginputfield'
                            : ''
                        : 'greyInputFieldd';
                    })()
                  }
                />
                <ToggleButton
                  value={formState.projectInfo.realEstateSale === "1"}
                  label={t("realEstateSale")}
                  options={{
                    on: `${t("realEstateSale")}`,
                    off: `${t("realEstateSale")}`,
                  }}
                  getSelectedOption={(isOn) => {
                    setFormState((prevState: { projectInfo: any }) => ({
                      ...prevState,
                      projectInfo: {
                        ...prevState.projectInfo,
                        realEstateSale: isOn ? "1" : "0",
                      },
                    }));
                  }}
                  hideSelectedText={true}
                />
                <div className="mr-1">
                  <ToggleButton
                    value={formState.projectInfo.secondaryMeasure === "1"}
                    label={t("保険")}
                    options={{
                      on: `${t("secondaryMeasure")}`,
                      off: `${t("secondaryMeasure")}`,
                    }}
                    getSelectedOption={(isOn) => {
                      setFormState((prevState: { projectInfo: any }) => ({
                        ...prevState,
                        projectInfo: {
                          ...prevState.projectInfo,
                          secondaryMeasure: isOn ? "1" : "0",
                        },
                      }));
                    }}

                    hideSelectedText={true}
                  />
                </div>
                <ToggleButton
                  value={formState.projectInfo.realEstateReg === "1"}
                  label={t("realEstateReg")}
                  options={{
                    on: `${t("realEstateReg")}`,
                    off: `${t("realEstateReg")}`,
                  }}
                  getSelectedOption={(isOn) => {
                    setFormState((prevState: { projectInfo: any }) => ({
                      ...prevState,
                      projectInfo: {
                        ...prevState.projectInfo,
                        realEstateReg: isOn ? "1" : "0",
                      },
                    }));
                  }}
                  hideSelectedText={true}
                />
                <CustomSelectField
                  label={t("newsLetter")}
                  name="newsletter"
                  options={formDropdowns?.newsletter}
                  value={formState.projectInfo.newsletter}
                  onChange={(e) => handleInputChange(e, 0)}
                  placeholder={t("newsletter")}
                  className={ProjectStyle.newsletterDropdown}
                />
                <ToggleButton
                  value={formState.projectInfo.isEnd === "1"}
                  label={t("isEnd")}
                  options={{
                    on: `${t("isEnd")}`,
                    off: `${t("isEnd")}`,
                  }}
                  getSelectedOption={(isOn) => {
                    setFormState((prevState: { projectInfo: any }) => ({
                      ...prevState,
                      projectInfo: {
                        ...prevState.projectInfo,
                        isEnd: isOn ? "1" : "0",
                      },
                    }));
                  }}
                  hideSelectedText={true}
                  disabled={disableIsEndToggle}
                />
              </div>

              <HeadingRow headingTitle={t("workStatus")}></HeadingRow>
              <TextAreaField
                // label={t("workStatus")}
                name="workStatus"
                value={formState.workStatus}
                placeholder={t("workStatus")}
                onChange={(e) => handleInputChange(e, 0)}
                rows={5}
                cols={50}
                className="mt-2"
              />
              <HeadingRow headingTitle={t("progress")}></HeadingRow>

              <div className={`${ProjectStyle.progressTableWrapper} mt-2 mb-2`}>
                <table
                  className={ProjectStyle.table1}
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr>
                      <th>-</th>
                      <th>{t("contractIssueDate")}</th>
                      <th>{t("depositBillingDate")}</th>
                      <th>{t("着手金入金日")}</th>
                      <th> {t("receiptOfMaterial")}</th>
                      <th>{t("scDeficiencyCheck")}</th>
                      <th>{t("interimReport")}</th>
                      <th>{t("CP検算")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <small>作業日</small>
                      </td>
                      <td>
                        {
                          <Button
                            text={t("today")}
                            type="secondary"
                            size="small"
                            fullWidth={true}
                            onClick={() => setFormState((prevState: { progress: any; }) => ({
                              ...prevState,
                              progress: {
                                ...prevState.progress,
                                contractIssueDate: getCurrentDate(),
                              },
                            }))}
                            disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_contract_issue_date)}
                            className={`${ProjectStyle.todayBtn} mb-1`}
                          />
                        }
                        <InputDateField
                          name="contractIssueDate"
                          value={formState.progress.contractIssueDate}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("contractIssueDate")}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_contract_issue_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_contract_issue_date ? maxDate : undefined)}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_contract_issue_date)}
                        />
                      </td>
                      <td>
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={() => setFormState((prevState: { progress: any; }) => ({
                            ...prevState,
                            progress: {
                              ...prevState.progress,
                              depositBillingDate: getCurrentDate(),
                            },
                          }))}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_deposit_billing_date)}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                        />
                        <InputDateField
                          name="depositBillingDate"
                          value={formState.progress.depositBillingDate}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("depositBillingDate")}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_deposit_billing_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_deposit_billing_date ? maxDate : undefined)}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_deposit_billing_date)}
                        />
                      </td>
                      <td>
                        <InputDateField
                          name="depositDate"
                          value={formState.progress.depositDate}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("depositDate")}
                          disabled={!(isAuthenticated)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_payment_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_payment_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td1">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_doc_recv_date)}
                          onClick={() => {
                            setFormState((prevState: { progress: any; }) => ({
                              ...prevState,
                              progress: {
                                ...prevState.progress,
                                receiptOfMaterial: getCurrentDate(),
                              },
                            }))
                          }}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                        />
                        <InputDateField
                          name="receiptOfMaterial"
                          value={formState.progress.receiptOfMaterial}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td1') }}
                          placeholder={t("receiptOfMaterial")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_doc_recv_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_doc_recv_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_doc_recv_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td2">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_sc_insufficient_date)}
                        />
                        <InputDateField
                          name="scDeficiencyCheck"
                          value={formState.progress.scDeficiencyCheck}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td2') }}
                          placeholder={t("scDeficiencyCheck")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_sc_insufficient_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_sc_insufficient_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_sc_insufficient_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td3">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_interim_report_date)}
                        />
                        <InputDateField
                          name="interimReport"
                          value={formState.progress.interimReport}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td3') }}
                          placeholder={t("interimReport")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_interim_report_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_interim_report_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_interim_report_date ? maxDate : undefined)}
                        />
                      </td>
                      <td>
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={() => {
                            setFormState((prevState: { progress: any; }) => ({
                              ...prevState,
                              progress: {
                                ...prevState.progress,
                                cpDate: getCurrentDate(),
                              },
                            }))
                          }}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_cp_verification_date)}
                        />
                        <InputDateField
                          name="cpDate"
                          value={formState.progress.cpDate}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("cpDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_cp_verification_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_cp_verification_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_cp_verification_date ? maxDate : undefined)}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <small>目標</small>
                      </td>
                      <td>
                        <p></p>
                      </td>
                      <td>
                        <p></p>
                      </td>
                      <td>
                        <p></p>
                      </td>
                      <td id="texttd1">
                        <p ref={textTd1Ref}>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd2">
                        <p ref={textTd2Ref}> {t("goalNotSet")}</p>
                      </td>
                      <td id="texttd3">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td>
                        <p></p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table
                  className={ProjectStyle.table2}
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr>
                      <th>-</th>
                      <th>{t("firstCalculationFilingDate")}</th>
                      <th>{t("firstCalculationCompletionDate")}</th>
                      <th>{t("secondaryCalculationFilingDate")}</th>
                      <th>{t("secondaryCalculationCompletionDate")}</th>
                      <th>{t("thirdVerificationSubmissionDate")}</th>
                      <th>{t("thirdVerificationCompletionDate")}</th>
                      <th>{t("finalCheck1CompletionDate")}</th>
                      <th>{t("finalCheck2CompletionDate")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <small>作業日</small>
                      </td>
                      <td id="td4">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_1st_submit_date)}
                        />
                        <InputDateField
                          name="firstCalculationFilingDate"
                          value={formState.progress.firstCalculationFilingDate}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td4') }}
                          placeholder={t("contractIssueDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_1st_submit_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_1st_submit_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_1st_submit_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td5">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_1st_comp_date)}
                        />
                        <InputDateField
                          name="firstCalculationCompletionDate"
                          value={
                            formState.progress.firstCalculationCompletionDate
                          }
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td5') }}
                          placeholder={t("firstCalculationCompletionDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_1st_comp_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_1st_comp_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_1st_comp_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td6">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_2nd_submit_date)}
                        />
                        <InputDateField
                          name="secondaryCalculationFilingDate"
                          value={
                            formState.progress.secondaryCalculationFilingDate
                          }
                          onChange={(e) => {
                            handleInputChange(e, 0);
                            handleResetGoals('td6')
                          }}
                          placeholder={t("secondaryCalculationFilingDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_2nd_submit_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_2nd_submit_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_2nd_submit_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td7">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_2nd_comp_date)}
                        />
                        <InputDateField
                          name="secondaryCalculationCompletionDate"
                          value={
                            formState.progress
                              .secondaryCalculationCompletionDate
                          }
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td7') }}
                          placeholder={t("secondaryCalculationCompletionDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_2nd_comp_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_2nd_comp_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_2nd_comp_date ? maxDate : undefined)}
                        />
                      </td>

                      <td id="td8">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_3rd_submit_date)}
                          onClick={() => {
                            setFormState((prevState: { progress: any; }) => ({
                              ...prevState,
                              progress: {
                                ...prevState.progress,
                                thirdVerificationSubmissionDate: getCurrentDate(),
                              },
                            }));

                          }}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                        />
                        <InputDateField
                          name="thirdVerificationSubmissionDate"
                          value={formState.progress.thirdVerificationSubmissionDate}
                          onChange={(e) => {
                            handleInputChange(e, 0);
                            handleResetGoals('td8')
                          }}
                          placeholder={t("thirdVerificationSubmissionDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_3rd_submit_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_3rd_submit_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_3rd_submit_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td9">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_3rd_comp_date)}
                        />
                        <InputDateField
                          name="thirdVerificationCompletionDate"
                          value={
                            formState.progress.thirdVerificationCompletionDate
                          }
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td9') }}
                          placeholder={t("thirdVerificationCompletionDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_verify_3rd_comp_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_3rd_comp_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_verify_3rd_comp_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td10">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_final_check_1st_comp_date)}
                        />
                        <InputDateField
                          name="finalCheck1CompletionDate"
                          value={formState.progress.finalCheck1CompletionDate}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td10') }}
                          placeholder={t("finalCheck1CompletionDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_final_check_1st_comp_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_final_check_1st_comp_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_final_check_1st_comp_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td11">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_final_check_2nd_comp_date)}
                        />
                        <InputDateField
                          name="finalCheck2CompletionDate"
                          value={formState.progress.finalCheck2CompletionDate}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td11') }}
                          placeholder={t("finalCheck2CompletionDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_final_check_2nd_comp_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_final_check_2nd_comp_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_final_check_2nd_comp_date ? maxDate : undefined)}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <small>目標</small>
                      </td>
                      <td id="texttd4">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd5">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd6">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd7">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd8">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd9">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd10">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd11">
                        <p>{t("goalNotSet")}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <br />
                <table
                  className={ProjectStyle.table3}
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr>
                      <th>-</th>
                      <th>{t("sealDate")}</th>
                      <th>{t("balanceBillingDate")}</th>
                      <th>{t("remainingBalanceDeposit")}</th>
                      <th> {t("taxOfficeShipping")}</th>
                      <th>{t("businessProcessingBook")}</th>
                      <th>{t("copyReceiptOfTaxReturn")}</th>
                      <th>{t("return")}</th>
                      {/* <th>{t("amendedReturnFilingDate")}</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <small>作業日</small>
                      </td>
                      <td id="td12">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_stamp_date)}
                        />
                        <InputDateField
                          name="sealDate"
                          value={formState.progress.sealDate}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td12') }}
                          placeholder={t("sealDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_stamp_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_stamp_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_stamp_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td13">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_balance_billing_date)}
                        />
                        <InputDateField
                          name="balanceBillingDate"
                          value={formState.progress.balanceBillingDate}
                          onChange={(e) => { handleInputChange(e, 0); handleResetGoals('td13') }}
                          placeholder={t("balanceBillingDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_balance_billing_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_balance_billing_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_balance_billing_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td14">

                        <InputDateField
                          name="remainingBalanceDeposit"
                          value={formState.progress.remainingBalanceDeposit}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("remainingBalanceDeposit")}
                          disabled={!(isAuthenticated)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_balance_deposit_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_balance_deposit_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td15">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_taxoffice_shipping_date)}
                        />
                        <InputDateField
                          name="taxOfficeShipping"
                          value={formState.progress.taxOfficeShipping}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("taxOfficeShipping")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_taxoffice_shipping_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_taxoffice_shipping_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_taxoffice_shipping_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td16">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_work_process_book_date)}
                        />
                        <InputDateField
                          name="businessProcessingBook"
                          value={formState.progress.businessProcessingBook}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("businessProcessingBook")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_work_process_book_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_work_process_book_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_work_process_book_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td17">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_receipt_declaration_date)}
                        />
                        <InputDateField
                          name="copyReceiptOfTaxReturn"
                          value={formState.progress.copyReceiptOfTaxReturn}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("copyReceiptOfTaxReturn")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_receipt_declaration_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_receipt_declaration_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_receipt_declaration_date ? maxDate : undefined)}
                        />
                      </td>
                      <td id="td18">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_return_date)}
                        />
                        <InputDateField
                          name="returnDate"
                          value={formState.progress.returnDate}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("returnDate")}
                          disabled={!(isAuthenticated || !projectSozokuDetails?.progress?.prgrs_return_date)}
                          minDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_return_date ? minDate : undefined)}
                          maxDate={isAuthenticated ? undefined : (!projectSozokuDetails?.progress?.prgrs_return_date ? maxDate : undefined)}
                        />
                      </td>
                      {/* <td id="td19">
                        <Button
                          text={t("today")}
                          type="secondary"
                          size="small"
                          fullWidth={true}
                          onClick={onButtonClick}
                          className={`${ProjectStyle.todayBtn} mb-1`}
                        />
                        <InputDateField
                          name="amendedReturnFilingDate"
                          value={formState.progress.amendedReturnFilingDate}
                          onChange={(e) => handleInputChange(e, 0)}
                          placeholder={t("amendedReturnFilingDate")}
                        />
                      </td> */}
                    </tr>

                    <tr>
                      <td>
                        <small>目標</small>
                      </td>
                      <td id="texttd12">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd13">
                        <p>{t("goalNotSet")}</p>
                      </td>
                      <td id="texttd14"></td>
                      <td id="texttd15"></td>
                      <td id="texttd16"></td>
                      <td id="texttd17"></td>
                      <td id="texttd18"></td>
                      {/* <td id="texttd19"></td> */}
                    </tr>
                  </tbody>
                </table>
                <br />


              </div>

              <HeadingRow headingTitle={t("heirInformation")} tag={t('required')}></HeadingRow>
              <button
                className={`${Style.addRequestFormBtn} mt-2`}
                onClick={() => setShowFamilyMemberModal(true)}
                type="button"
              >
                <PlusIcon className={Style.addIcon} focusable="false" />
                {t("add")}
              </button>
              <div className="mt-2 mb-2">
                <TableBuddy
                  columns={columns}
                  data={updatedHeirs || []}
                  loading={loading}
                  stickyHeaders={false}
                />
              </div>
              {Object.entries(displayedComponents).map(([key, value], index) => {
                
                return  <ProjectHeirCollapseComponent
                  key={key}
                  heirData={value}
                  prefectures={formDropdowns?.prefectures}
                  updateInitialState={(initialState: any) =>
                    updateInitialState(key, initialState)
                  }
                  isRepresentative={ activeRepresentative == key}
                  onRepresentativeChange={() => handleRepresentativeChange(key)}
                  onInputChangeNotify={handleInputChangeNotify}
                  totalRecords={Object.entries(displayedComponents).length}
                  showHeirs ={projectSozokuDetails?.heirs}
                  index={index}
                />
              })}
              <HeadingRow headingTitle={t("remarks")} tag={[{ label: t("takeOver"), value: "inherit" }]}></HeadingRow>
              <TextAreaField
                // label={t("remarks")}
                name="remarks"
                value={formState.remarks}
                placeholder={t("remarks")}
                onChange={(e) => handleInputChange(e, 0)}
                rows={5}
                cols={50}
                className="mt-2"
              />
            </div>
          </div>
        </Form>
        {showFamilyMemberModal && (
          <AddFamilyMemberModal
            prefectures={formDropdowns?.prefectures}
            familyCode={formState.familyMember.familyCode}
            onDataReceived={handleFamilyMemberData} // Passing the callback
            onClose={() => setShowFamilyMemberModal(false)}
          />
        )}
        {showConfirmBox && (
          <ConfirmationBox
            isOpen={showConfirmBox}
            title={`${t("custInfoChangeAlertRegister")}`}
            onConfirm={() => {
              handleSubmit();
              setShowConfirmBox(false);
            }}
            onCancel={() => setShowConfirmBox(false)}
          />
        )}
        {showMainDelConfirmBox && (
          <ConfirmationBox
            isOpen={showMainDelConfirmBox}
            title={`${t("areYouSureWantToDeleteProject")}`}
            onConfirm={() => {
              handleMainDeleteClick();
              setShowMainDelConfirmBox(false);
            }}
            confirmButtonText="続行する"
            onCancel={() => setShowMainDelConfirmBox(false)}
          />
        )}
      </AuthMiddleware>
    </>
  );
}
