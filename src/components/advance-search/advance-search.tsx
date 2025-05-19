import React, { useEffect } from "react";
import InputField from "../input-field/input-field";
import Style from "../../styles/components/molecules/search-modal.module.scss";
import Image from "next/image";
import close from "../../../public/assets/svg/modalClose.svg";
import { useLanguage } from "@/localization/LocalContext";

import { useState, useContext } from "react";
import { genderOptions } from "@/libs/optionsHandling";
import { fetchtaxAdvanceSearchDropdown } from "@/app/features/generals/getTaxAdvanceSearchDropDownSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import Button from "../button/button";
import AdvanceSrchStyle from "../../styles/components/molecules/advance-search-modal.module.scss";
import InputDateField from "../input-date/input-date";
import HeadingRow from "../heading-row/heading-row";
import ToggleButton from "../toggle-button/toggle-button";
import SelectField from "../select-field/select-field";
import { Form } from "../form/form";
import { fetchProjectConfirmed } from "@/app/features/project/projectConfirmedListingSlice";
import { getParamValue } from "@/libs/utils";
import CustomMultiSelectField from "../multiselector/multiselector";
import CustomSelectField from "../custom-select/custom-select";
import router from "next/router";
interface Props {
  onClose?: (customer?: any) => void;
  isLoading?: boolean;
  existingFilters?: any;
  setFilteredParamState?: any;
  setIsReset?: any;
}
interface FormState {
  customerInformation: {
    inheritanceStartDate: string;
    inheritanceEndDate: string;
    dobStartDate: string;
    dobEndDate: string;
    customerAddress: string;
    filingTaxOffice: string;
  };
  heirInfo: {
    isRepresentative: string;
    relationship: string;
    phoneNumber: string;
    email: string;
    postCode: string;
    prefectures: string;
    address: string;
    legalInheritance: string;
    taxPayment: string;
  };
  projectInfo: {
    worker1Branch: "";
    orderStartDate: "";
    orderEndDate: "";
    elapsedStartDate: "";
    elapsedEndDate: "";
    dueStartDate: "";
    dueEndDate: "";
    startNumberOfDaysForFiling: "";
    endNumberOfDaysForFiling: "";
    statusNumberOfDaysForFiling: "";
    estSubmissionStartMonth: "";
    estSubmissionEndMonth: "";
    semiConfirmTaxStartDeadline: "";
    semiConfirmTaxEndDeadline: "";
    semiDaysStartRemaining: "";
    semiDaysEndRemaining: "";
    statusSemiDaysEndRemaining: "";
    blueApplicationForm: "";
    consumptionTax: "";
    check1: "";
    check2: "";
    check3: "";
    final1: "";
    final2: "";
    startContractAmount: "";
    endContractAmount: "";
    startDepositAmount: "";
    endDepositAmount: "";
    startRemainingAmount: "";
    endRemainingAmount: "";
    startBillingTotal: "";
    endBillingTotal: "";
    unDivided: "";
    startDueDateWithin3Year: "";
    endDueDateWithin3Year: "";
    startNoDaysRemDue3Years: "";
    endNoDaysRemDue3Years: "";
    statusNoDaysRemDue3Years: "";
    realEstateSale: "";
    secondaryMeasures: "";
    realEstateReg: "";
    end: "";
    workStatus: "";
  };
  dueStatus: {
    startTotalTaxAmount: "";
    endTotalTaxAmount: "";
    startRealEstateAmount: "";
    endRealEstateAmount: "";
    startSecurityAmount: "";
    endSecurityAmount: "";
    startSavingAmount: "";
    endSavingAmount: "";
    startLifeInsuranceAmount: "";
    endLifeInsuranceAmount: "";
    startOthersAmount: "";
    endOthersAmount: "";
  };
  workLog: {
    startWorkingDate: "";
    endWorkingDate: "";
    workCategory: "";
    content: "";
    worker: "";
  };
  progress: {
    startContractIssueDate: "";
    endContractIssueDate: "";
    statusContractIssue: "";

    startDepositBillingDate: "";
    endDepositBillingDate: "";
    statusDepositBilling: "";

    startDepositDate: "";
    endDepositDate: "";
    statusDeposit: "";

    startReceiptOfMaterialDate: "";
    endReceiptOfMaterialDate: "";
    statusReceiptOfMaterial: "";

    startScDeficiencyCheckDate: "";
    endScDeficiencyCheckDate: "";
    statusScDeficiencyCheck: "";

    startIntermediateReportDate: "";
    endIntermediateReportDate: "";
    statusIntermediateReport: "";

    startCPVerifyDate: "";
    endCPVerifyDate: "";
    statusCPVerifyDate: "";

    startCalcSubmitDate: "";
    endCalcSubmitDate: "";
    statusCalcSubmit: "";

    startCountingDaysOneGoDate: "";
    endCountingDaysOneGoDate: "";
    statusCountingDaysOneGo: "";

    startSecondaryCalcSubmitDate: "";
    endSecondaryCalcSubmitDate: "";
    statusSecondaryCalcSubmit: "";

    startCalcAfterSecondDate: "";
    endCalcAfterSecondDate: "";
    statusCalcAfterSecond: "";

    startThirdVerificationSubmitDate: "";
    endThirdVerificationSubmitDate: "";
    statusThirdVerificationSubmitDate: "";

    startAfterCountThreeDate: "";
    endAfterCountThreeDate: "";
    statusAfterCountThree: "";

    startFinalCheck1Date: "";
    endFinalCheck1Date: "";
    statusFinalCheck1: "";

    startFinalCheck2Date: "";
    endFinalCheck2Date: "";
    statusFinalCheck2: "";

    startSealDate: "";
    endSealDate: "";
    statusSealDate: "";

    startBalanceBillingDate: "";
    endBalanceBillingDate: "";
    statusBalanceBilling: "";

    startRemBalanceDate: "";
    endRemBalanceDate: "";
    statusRemBalanceDate: "";

    startTaxOfficeShippingDate: "";
    endTaxOfficeShippingDate: "";
    statusTaxOfficeShippingDate: "";

    startBusinessProcessBookDate: "";
    endBusinessProcessBookDate: "";
    statusBusinessProcessBookDate: "";

    startReceiptTaxReturnCopyDate: "";
    endReceiptTaxReturnCopyDate: "";
    statusReceiptTaxReturnCopyDate: "";

    startReturnDate: "";
    endReturnDate: "";
    statusReturnDate: "";

    startAmendedReturnFilingDate: "";
    endAmendedReturnFilingDate: "";
    statusAmendedReturnFilingDate: "";

    startRealEstateRegCompDate: "";
    endRealEstateRegCompDate: "";
    statusRealEstateRegCompDate: "";
  };
  involvementRecord: {
    startCompatibleDate: "";
    endCompatibleDate: "";
    howToRespond: "";
    worker: "";
  };
  remarks: "";
  [key: string]: any;
}


const keyMap: any = {
  // Customer Information
  "customerInformation.inheritanceStartDate": "p_inheritance_start_date",
  "customerInformation.inheritanceEndDate": "p_inheritance_end_date",
  "customerInformation.dobStartDate": "cust_dob_start_date",
  "customerInformation.dobEndDate": "cust_dob_end_date",
  "customerInformation.customerAddress": "cust_address",
  "customerInformation.filingTaxOffice": "p_filing_tax_office",

  // Heir Information
  "heirInfo.isRepresentative": "p_heir_representative",
  "heirInfo.relationship": "p_heir_relation",
  "heirInfo.phoneNumber": "p_heir_telephone",
  "heirInfo.email": "p_heir_email",
  "heirInfo.postCode": "p_heir_zipcode",
  "heirInfo.prefectures": "p_heir_prefecture",
  "heirInfo.address": "p_heir_address",
  "heirInfo.legalInheritance": "p_heir_legal_inherit",
  "heirInfo.taxPayment": "p_heir_tax_payment",

  // Project Information
  "projectInfo.worker1Branch": "p_worker_office",
  "projectInfo.orderStartDate": "p_order_start_date",
  "projectInfo.orderEndDate": "p_order_end_date",
  "projectInfo.elapsedStartDate": "p_elapsed_start_days",
  "projectInfo.elapsedEndDate": "p_elapsed_end_days",
  "projectInfo.dueStartDate": "p_due_start_date",
  "projectInfo.dueEndDate": "p_due_end_date",
  "projectInfo.startNumberOfDaysForFiling": "p_filing_start_days",
  "projectInfo.endNumberOfDaysForFiling": "p_filing_end_days",
  "projectInfo.statusNumberOfDaysForFiling": "p_filing_days_status",

  "projectInfo.estSubmissionStartMonth": "p_submission_month_start_date",
  "projectInfo.estSubmissionEndMonth": "p_submission_month_end_date",
  "projectInfo.semiConfirmTaxStartDeadline": "p_submission_tax_return_due_start_date",
  "projectInfo.semiConfirmTaxEndDeadline": "p_submission_tax_return_due_end_date",
  "projectInfo.semiDaysStartRemaining": "p_semi_certain_start_days",
  "projectInfo.semiDaysEndRemaining": "p_semi_certain_end_days",
  "projectInfo.statusSemiDaysEndRemaining": "p_semi_certain_end_days_status",
  "projectInfo.blueApplicationForm": "p_blue_app_form",
  "projectInfo.consumptionTax": "p_sales_tax",
  "projectInfo.check1": "p_checker1_id",
  "projectInfo.check2": "p_checker2_id",
  "projectInfo.check3": "p_checker3_id",
  "projectInfo.final1": "p_final1_id",
  "projectInfo.final2": "p_final2_id",
  "projectInfo.startContractAmount": "p_start_contract_amount",
  "projectInfo.endContractAmount": "p_end_contract_amount",
  "projectInfo.startDepositAmount": "p_start_deposit_amount",
  "projectInfo.endDepositAmount": "p_end_deposit_amount",
  "projectInfo.startRemainingAmount": "p_start_balance_amount",
  "projectInfo.endRemainingAmount": "p_end_balance_amount",
  "projectInfo.startBillingTotal": "p_start_total_amount",
  "projectInfo.endBillingTotal": "p_end_total_amount",
  "projectInfo.unDivided": "p_undivided",
  "projectInfo.startDueDateWithin3Year": "p_start_due_date_after_3_years",
  "projectInfo.endDueDateWithin3Year": "p_end_due_date_after_3_years",
  "projectInfo.startNoDaysRemDue3Years": "p_start_due_days_after_3_years",
  "projectInfo.endNoDaysRemDue3Years": "p_end_due_days_after_3_years",
  "projectInfo.realEstateSale": "p_real_estate_sale",
  "projectInfo.secondaryMeasures": "p_secondary_measures",
  "projectInfo.realEstateReg": "p_real_estate_reg",
  "projectInfo.end": "p_finish",
  "projectInfo.workStatus": "p_work_remarks",

  // Work Log
  "workLog.startWorkingDate": "p_worklog_response_start_date",
  "workLog.endWorkingDate": "p_worklog_response_end_date",
  "workLog.workCategory": "p_worklog_category",
  "workLog.content": "p_worklog_content",
  "workLog.worker": "p_worklog_worker",

  // Involvement Record
  "involvementRecord.startCompatibleDate": "p_engagement_response_start_date",
  "involvementRecord.endCompatibleDate": "p_engagement_response_end_date",
  "involvementRecord.howToRespond": "p_engagement_content",
  "involvementRecord.worker": "p_engagement_worker",

  // Progress
  "progress.startContractIssueDate": "prgrs_contract_issue_start_date",
  "progress.endContractIssueDate": "prgrs_contract_issue_end_date",
  "progress.statusContractIssue": "prgrs_contract_issue_date_exists",
  "progress.startDepositBillingDate": "prgrs_deposit_billing_start_date",
  "progress.endDepositBillingDate": "prgrs_deposit_billing_end_date",
  "progress.statusDepositBilling": "prgrs_deposit_billing_date_exists",
  "progress.startDepositDate": "prgrs_payment_start_date",
  "progress.endDepositDate": "prgrs_payment_end_date",
  "progress.statusDeposit": "prgrs_payment_date_exists",
  "progress.startReceiptOfMaterialDate": "prgrs_doc_recv_start_date",
  "progress.endReceiptOfMaterialDate": "prgrs_doc_recv_end_date",
  "progress.statusReceiptOfMaterial": "prgrs_doc_recv_date_exists",
  "progress.startScDeficiencyCheckDate": "prgrs_sc_insufficient_start_date",
  "progress.endScDeficiencyCheckDate": "prgrs_sc_insufficient_end_date",
  "progress.statusScDeficiencyCheck": "prgrs_sc_insufficient_date_exists",
  "progress.startIntermediateReportDate": "prgrs_interim_report_start_date",
  "progress.endIntermediateReportDate": "prgrs_interim_report_end_date",
  "progress.statusIntermediateReport": "prgrs_interim_report_date_exists",
  "progress.startCPVerifyDate": "prgrs_cp_verification_start_date",
  "progress.endCPVerifyDate": "prgrs_cp_verification_end_date",
  "progress.statusCPVerifyDate": "prgrs_cp_verification_date_exists",
  "progress.startCalcSubmitDate": "prgrs_verify_1st_submit_start_date",
  "progress.endCalcSubmitDate": "prgrs_verify_1st_submit_end_date",
  "progress.statusCalcSubmit": "prgrs_verify_1st_submit_date_exists",
  "progress.startCountingDaysOneGoDate": "prgrs_verify_1st_comp_start_date",
  "progress.endCountingDaysOneGoDate": "prgrs_verify_1st_comp_end_date",
  "progress.statusCountingDaysOneGo": "prgrs_verify_1st_comp_date_exists",
  "progress.startSecondaryCalcSubmitDate": "prgrs_verify_2nd_submit_start_date",
  "progress.endSecondaryCalcSubmitDate": "prgrs_verify_2nd_submit_end_date",
  "progress.statusSecondaryCalcSubmit": "prgrs_verify_2nd_submit_date_exists",
  "progress.startCalcAfterSecondDate": "prgrs_verify_2nd_comp_start_date",
  "progress.endCalcAfterSecondDate": "prgrs_verify_2nd_comp_end_date",
  "progress.statusCalcAfterSecond": "prgrs_verify_2nd_comp_date_exists",
  "progress.startThirdVerificationSubmitDate": "prgrs_verify_3rd_submit_start_date",
  "progress.endThirdVerificationSubmitDate": "prgrs_verify_3rd_submit_end_date",
  "progress.statusThirdVerificationSubmitDate": "prgrs_verify_3rd_submit_date_exists",
  "progress.startAfterCountThreeDate": "prgrs_verify_3rd_comp_start_date",
  "progress.endAfterCountThreeDate": "prgrs_verify_3rd_comp_end_date",
  "progress.statusAfterCountThree": "prgrs_verify_3rd_comp_date_exists",
  "progress.startFinalCheck1Date": "prgrs_final_check_1st_comp_start_date",
  "progress.endFinalCheck1Date": "prgrs_final_check_1st_comp_end_date",
  "progress.statusFinalCheck1": "prgrs_final_check_1st_comp_date_exists",
  "progress.startFinalCheck2Date": "prgrs_final_check_2nd_comp_start_date",
  "progress.endFinalCheck2Date": "prgrs_final_check_2nd_comp_end_date",
  "progress.statusFinalCheck2": "prgrs_final_check_2nd_comp_date_exists",
  "progress.startSealDate": "prgrs_stamp_start_date",
  "progress.endSealDate": "prgrs_stamp_end_date",
  "progress.statusSealDate": "prgrs_stamp_date_exists",
  "progress.startBalanceBillingDate": "prgrs_balance_billing_start_date",
  "progress.endBalanceBillingDate": "prgrs_balance_billing_end_date",
  "progress.statusBalanceBilling": "prgrs_balance_billing_date_exists",
  "progress.startRemBalanceDate": "prgrs_balance_deposit_start_date",
  "progress.endRemBalanceDate": "prgrs_balance_deposit_end_date",
  "progress.statusRemBalanceDate": "prgrs_balance_deposit_date_exists",
  "progress.startTaxOfficeShippingDate": "prgrs_taxoffice_shipping_start_date",
  "progress.endTaxOfficeShippingDate": "prgrs_taxoffice_shipping_end_date",
  "progress.statusTaxOfficeShippingDate": "prgrs_taxoffice_shipping_date_exists",
  "progress.startBusinessProcessBookDate": "prgrs_work_process_book_start_date",
  "progress.endBusinessProcessBookDate": "prgrs_work_process_book_end_date",
  "progress.statusBusinessProcessBookDate": "prgrs_work_process_book_date_exists",
  "progress.startReceiptTaxReturnCopyDate": "prgrs_receipt_declaration_start_date",
  "progress.endReceiptTaxReturnCopyDate": "prgrs_receipt_declaration_end_date",
  "progress.statusReceiptTaxReturnCopyDate": "prgrs_receipt_declaration_date_exists",
  "progress.startReturnDate": "prgrs_return_start_date",
  "progress.endReturnDate": "prgrs_return_end_date",
  "progress.statusReturnDate": "prgrs_return_date_exists",
  
  // Remarks
  "remarks": "p_remarks",
  
  // Add other mappings as needed...
};


const AdvanceSearchModal: React.FC<Props> = ({ onClose, isLoading, existingFilters, setFilteredParamState, setIsReset }) => {

  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  useEffect(() => {
    // Fetch active_tab value from URL when component mounts
    const activeTabValue = getParamValue("active_tab");
    setActiveTab(activeTabValue);
  }, []);
  const [formState, setFormState] = useState<FormState>({
    customerInformation: {
      inheritanceStartDate: "",
      inheritanceEndDate: "",
      dobStartDate: "",
      dobEndDate: "",
      customerAddress: "",
      filingTaxOffice: "",
    },
    heirInfo: {
      isRepresentative: "0",
      relationship: "",
      phoneNumber: "",
      email: "",
      postCode: "",
      prefectures: "",
      address: "",
      legalInheritance: "",
      taxPayment: "",
    },
    projectInfo: {
      worker1Branch: "",
      orderStartDate: "",
      orderEndDate: "",
      elapsedStartDate: "",
      elapsedEndDate: "",
      dueStartDate: "",
      dueEndDate: "",
      startNumberOfDaysForFiling: "",
      endNumberOfDaysForFiling: "",
      statusNumberOfDaysForFiling: "",
      estSubmissionStartMonth: "",
      estSubmissionEndMonth: "",
      semiConfirmTaxStartDeadline: "",
      semiConfirmTaxEndDeadline: "",
      semiDaysStartRemaining: "",
      semiDaysEndRemaining: "",
      statusSemiDaysEndRemaining: "",
      blueApplicationForm: "",
      consumptionTax: "",
      check1: "",
      check2: "",
      check3: "",
      final1: "",
      final2: "",
      startContractAmount: "",
      endContractAmount: "",
      startDepositAmount: "",
      endDepositAmount: "",
      startRemainingAmount: "",
      endRemainingAmount: "",
      startBillingTotal: "",
      endBillingTotal: "",
      unDivided: "",
      startDueDateWithin3Year: "",
      endDueDateWithin3Year: "",
      startNoDaysRemDue3Years: "",
      endNoDaysRemDue3Years: "",
      statusNoDaysRemDue3Years: "",
      realEstateSale: "",
      secondaryMeasures: "",
      realEstateReg: "",
      end: "",
      workStatus: "",
    },
    dueStatus: {
      startTotalTaxAmount: "",
      endTotalTaxAmount: "",
      startRealEstateAmount: "",
      endRealEstateAmount: "",
      startSecurityAmount: "",
      endSecurityAmount: "",
      startSavingAmount: "",
      endSavingAmount: "",
      startLifeInsuranceAmount: "",
      endLifeInsuranceAmount: "",
      startOthersAmount: "",
      endOthersAmount: "",
    },
    workLog: {
      startWorkingDate: "",
      endWorkingDate: "",
      workCategory: "",
      content: "",
      worker: "",
    },
    progress: {
      startContractIssueDate: "",
      endContractIssueDate: "",
      statusContractIssue: "",

      startDepositBillingDate: "",
      endDepositBillingDate: "",
      statusDepositBilling: "",

      startDepositDate: "",
      endDepositDate: "",
      statusDeposit: "",

      startReceiptOfMaterialDate: "",
      endReceiptOfMaterialDate: "",
      statusReceiptOfMaterial: "",

      startScDeficiencyCheckDate: "",
      endScDeficiencyCheckDate: "",
      statusScDeficiencyCheck: "",

      startIntermediateReportDate: "",
      endIntermediateReportDate: "",
      statusIntermediateReport: "",

      startCPVerifyDate: "",
      endCPVerifyDate: "",
      statusCPVerifyDate: "",

      startCalcSubmitDate: "",
      endCalcSubmitDate: "",
      statusCalcSubmit: "",

      startCountingDaysOneGoDate: "",
      endCountingDaysOneGoDate: "",
      statusCountingDaysOneGo: "",

      startSecondaryCalcSubmitDate: "",
      endSecondaryCalcSubmitDate: "",
      statusSecondaryCalcSubmit: "",

      startCalcAfterSecondDate: "",
      endCalcAfterSecondDate: "",
      statusCalcAfterSecond: "",

      startThirdVerificationSubmitDate: "",
      endThirdVerificationSubmitDate: "",
      statusThirdVerificationSubmitDate: "",

      startAfterCountThreeDate: "",
      endAfterCountThreeDate: "",
      statusAfterCountThree: "",

      startFinalCheck1Date: "",
      endFinalCheck1Date: "",
      statusFinalCheck1: "",

      startFinalCheck2Date: "",
      endFinalCheck2Date: "",
      statusFinalCheck2: "",

      startSealDate: "",
      endSealDate: "",
      statusSealDate: "",

      startBalanceBillingDate: "",
      endBalanceBillingDate: "",
      statusBalanceBilling: "",

      startRemBalanceDate: "",
      endRemBalanceDate: "",
      statusRemBalanceDate: "",

      startTaxOfficeShippingDate: "",
      endTaxOfficeShippingDate: "",
      statusTaxOfficeShippingDate: "",

      startBusinessProcessBookDate: "",
      endBusinessProcessBookDate: "",
      statusBusinessProcessBookDate: "",

      startReceiptTaxReturnCopyDate: "",
      endReceiptTaxReturnCopyDate: "",
      statusReceiptTaxReturnCopyDate: "",

      startReturnDate: "",
      endReturnDate: "",
      statusReturnDate: "",

      startAmendedReturnFilingDate: "",
      endAmendedReturnFilingDate: "",
      statusAmendedReturnFilingDate: "",

      startRealEstateRegCompDate: "",
      endRealEstateRegCompDate: "",
      statusRealEstateRegCompDate: "",
    },
    involvementRecord: {
      startCompatibleDate: "",
      endCompatibleDate: "",
      howToRespond: "",
      worker: "",
    },
    remarks: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchtaxAdvanceSearchDropdown())
  }, [dispatch])

  const {
    prefectures: prefecturesOpt,
    offices: officesOpt,
    deadlineSubmit: deadlineOpt,
    afterDeadline: afterDeadlineOpt,
    blueApplication: blueApplicationOpt,
    noneCanbe: noneCanbeOpt,
    usersTax: usersTaxOpt,
    usersLegal: usersLegalOpt,
    workLogCategories: workLogCategoriesOpt,
    // opportunityStatus: opportunityStatusOpt,
    // progressStatus: progressStatusOpt,
    // execution: executionOpt,
    // custodyOfWills: custodyOfWillsOpt,
    // taxReturn: taxReturnOpt,
  } = useSelector((state: RootState) => state.advSrchDropdown);

  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };
  
  const updateUrlFromState = (state: any) => {
    // Get current parameters from the URL
    const currentParams = new URLSearchParams(window.location.search);
  
    // Flattens state and applies key transformations
    const transformAndFlattenState = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fullPath = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          transformAndFlattenState(value, fullPath);
        } else {
          const newKey = keyMap[fullPath as any] || fullPath; 
          if (value != null && value !== '') {
            currentParams.set(newKey, value);  
          } else {
            currentParams.delete(newKey);  
          }
        }
      });
    };
  
    // Flatten and transform the state
    transformAndFlattenState(state);
  
    
    if (!currentParams.has('adv')) {
      currentParams.append('adv', 'true');  
    }
  
    const queryString = currentParams.toString();
  
    router.push(`${router.pathname}?${queryString}`, undefined, { shallow: true });
  };
  
  
//  const updateUrlFromState = (state: any) => {
//   // Get current parameters from the URL
//   console.log('state&*************',state)
//   const currentParams = new URLSearchParams(window.location.search);

//   // Flattens state and applies key transformations
//   const transformAndFlattenState = (obj: any, prefix = '') => {
//     Object.keys(obj).forEach(key => {
//       const value = obj[key];
//       const fullPath = prefix ? `${prefix}.${key}` : key;
//       if (value && typeof value === 'object' && !Array.isArray(value)) {
//         transformAndFlattenState(value, fullPath);
//       } else {
//         const newKey = keyMap[fullPath as any] || fullPath;  // Apply mapping or use original path
//         if (value != null && value !== '') {
//           currentParams.set(newKey, value);  // Set or update the value in currentParams
//         }
//       }
//     });
//   };

//   transformAndFlattenState(state);

//   // Construct the final query string with both previous and new parameters
//   const queryString = currentParams.toString();

//   // alert('test')
  
//   // setFilteredParamState(queryString)
//   router.push(`${router.pathname}?${queryString}&adv=true`, undefined, { shallow: true });
// };

  
  
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    // Split name into path array to handle nested state
    const keys = name.split(".");

    setFormState((prevState) => {
      // Helper function to recursively set value by path
      function setByPath(
        obj: { [x: string]: any },
        keyPath: string | any[],
        value: any
      ) {
        const lastKeyIndex = keyPath.length - 1;
        for (let i = 0; i < lastKeyIndex; ++i) {
          const key = keyPath[i];
          if (!(key in obj)) obj[key] = {};
          obj = obj[key];
        }
        obj[keyPath[lastKeyIndex]] = value;
      }

      // Create a deep clone of the state to avoid direct mutation
      const newState = JSON.parse(JSON.stringify(prevState));
      setByPath(newState, keys, value);
      // updateUrlFromState(newState);

      return newState;
    });

  };



 
  useEffect(() => {
    if (!router.isReady) return;
  
    // Assuming query params keys are exactly as they need to be in the form state
    const queryParams = router.query;
  
    const updatedFormState = {
      customerInformation: {
        inheritanceStartDate: queryParams['p_inheritance_start_date'] || '',
        inheritanceEndDate: queryParams['p_inheritance_end_date'] || '',
        dobStartDate: queryParams['cust_dob_start_date'] || '',
        dobEndDate: queryParams['cust_dob_end_date'] || '',
        customerAddress: queryParams['cust_address'] || '',
        filingTaxOffice: queryParams['p_filing_tax_office'] || '',
      },
      heirInfo: {
        isRepresentative: queryParams['p_heir_representative'] || '0',
        relationship: queryParams['p_heir_relation'] || '',
        phoneNumber: queryParams['p_heir_telephone'] || '',
        email: queryParams['p_heir_email'] || '',
        postCode: queryParams['p_heir_zipcode'] || '',
        prefectures: queryParams['p_heir_prefecture'] || '',
        address: queryParams['p_heir_address'] || '',
        legalInheritance: queryParams['p_heir_legal_inherit'] || '',
        taxPayment: queryParams['p_heir_tax_payment'] || '',
      },
      projectInfo: {
        worker1Branch: queryParams['p_worker_office'] || '',
        orderStartDate: queryParams['p_order_start_date'] || '',
        orderEndDate: queryParams['p_order_end_date'] || '',
        elapsedStartDate: queryParams['p_elapsed_start_days'] || '',
        elapsedEndDate: queryParams['p_elapsed_end_days'] || '',
        dueStartDate: queryParams['p_due_start_date'] || '',
        dueEndDate: queryParams['p_due_end_date'] || '',
        startNumberOfDaysForFiling: queryParams['p_filing_start_days'] || '',
        endNumberOfDaysForFiling: queryParams['p_filing_end_days'] || '',
        statusNumberOfDaysForFiling: queryParams['p_filing_days_status'] || '',
        estSubmissionStartMonth: queryParams['p_submission_month_start_date'] || '',
        estSubmissionEndMonth: queryParams['p_submission_month_end_date'] || '',
        semiConfirmTaxStartDeadline: queryParams['p_submission_tax_return_due_start_date'] || '',
        semiConfirmTaxEndDeadline: queryParams['p_submission_tax_return_due_end_date'] || '',
        semiDaysStartRemaining: queryParams['p_semi_certain_start_days'] || '',
        semiDaysEndRemaining: queryParams['p_semi_certain_end_days'] || '',
        statusSemiDaysEndRemaining: queryParams['p_semi_certain_end_days_status'] || '',
        blueApplicationForm: queryParams['p_blue_app_form'] || '',
        consumptionTax: queryParams['p_sales_tax'] || '',
        check1: queryParams['p_checker1_id'] || '',
        check2: queryParams['p_checker2_id'] || '',
        check3: queryParams['p_checker3_id'] || '',
        final1: queryParams['p_final1_id'] || '',
        final2: queryParams['p_final2_id'] || '',
        startContractAmount: queryParams['p_start_contract_amount'] || '',
        endContractAmount: queryParams['p_end_contract_amount'] || '',
        startDepositAmount: queryParams['p_start_deposit_amount'] || '',
        endDepositAmount: queryParams['p_end_deposit_amount'] || '',
        startRemainingAmount: queryParams['p_start_balance_amount'] || '',
        endRemainingAmount: queryParams['p_end_balance_amount'] || '',
        startBillingTotal: queryParams['p_start_total_amount'] || '',
        endBillingTotal: queryParams['p_end_total_amount'] || '',
        unDivided: queryParams['p_undivided'] || '',
        startDueDateWithin3Year: queryParams['p_start_due_date_after_3_years'] || '',
        endDueDateWithin3Year: queryParams['p_end_due_date_after_3_years'] || '',
        startNoDaysRemDue3Years: queryParams['p_start_due_days_after_3_years'] || '',
        endNoDaysRemDue3Years: queryParams['p_end_due_days_after_3_years'] || '',
        realEstateSale: queryParams['p_real_estate_sale'] || '',
        secondaryMeasures: queryParams['p_secondary_measures'] || '',
        realEstateReg: queryParams['p_real_estate_reg'] || '',
        end: queryParams['p_finish'] || '',
        workStatus: queryParams['p_work_remarks'] || '',
      },
      // Populate other sections similarly...
      workLog: {
        startWorkingDate: queryParams['p_worklog_response_start_date'] || '',
        endWorkingDate: queryParams['p_worklog_response_end_date'] || '',
        workCategory: queryParams['p_worklog_category'] || '',
        content: queryParams['p_worklog_content'] || '',
        worker: queryParams['p_worklog_worker'] || '',
      },
      involvementRecord: {
        startCompatibleDate: queryParams['p_engagement_response_start_date'] || '',
        endCompatibleDate: queryParams['p_engagement_response_end_date'] || '',
        howToRespond: queryParams['p_engagement_content'] || '',
        worker: queryParams['p_engagement_worker'] || '',
      },
      progress: {
        startContractIssueDate: queryParams['prgrs_contract_issue_start_date'] || '',
        endContractIssueDate: queryParams['prgrs_contract_issue_end_date'] || '',
        statusContractIssue: queryParams['prgrs_contract_issue_date_exists'] || '',
      
        startDepositBillingDate: queryParams['prgrs_deposit_billing_start_date'] || '',
        endDepositBillingDate: queryParams['prgrs_deposit_billing_end_date'] || '',
        statusDepositBilling: queryParams['prgrs_deposit_billing_date_exists'] || '',
      
        startDepositDate: queryParams['prgrs_payment_start_date'] || '',
        endDepositDate: queryParams['prgrs_payment_end_date'] || '',
        statusDeposit: queryParams['prgrs_payment_date_exists'] || '',
      
        startReceiptOfMaterialDate: queryParams['prgrs_doc_recv_start_date'] || '',
        endReceiptOfMaterialDate: queryParams['prgrs_doc_recv_end_date'] || '',
        statusReceiptOfMaterial: queryParams['prgrs_doc_recv_date_exists'] || '',
      
        startScDeficiencyCheckDate: queryParams['prgrs_sc_insufficient_start_date'] || '',
        endScDeficiencyCheckDate: queryParams['prgrs_sc_insufficient_end_date'] || '',
        statusScDeficiencyCheck: queryParams['prgrs_sc_insufficient_date_exists'] || '',
      
        startIntermediateReportDate: queryParams['prgrs_interim_report_start_date'] || '',
        endIntermediateReportDate: queryParams['prgrs_interim_report_end_date'] || '',
        statusIntermediateReport: queryParams['prgrs_interim_report_date_exists'] || '',
      
        startCPVerifyDate: queryParams['prgrs_cp_verification_start_date'] || '',
        endCPVerifyDate: queryParams['prgrs_cp_verification_end_date'] || '',
        statusCPVerifyDate: queryParams['prgrs_cp_verification_date_exists'] || '',
      
        startCalcSubmitDate: queryParams['prgrs_verify_1st_submit_start_date'] || '',
        endCalcSubmitDate: queryParams['prgrs_verify_1st_submit_end_date'] || '',
        statusCalcSubmit: queryParams['prgrs_verify_1st_submit_date_exists'] || '',
      
        startCountingDaysOneGoDate: queryParams['prgrs_verify_1st_comp_start_date'] || '',
        endCountingDaysOneGoDate: queryParams['prgrs_verify_1st_comp_end_date'] || '',
        statusCountingDaysOneGo: queryParams['prgrs_verify_1st_comp_date_exists'] || '',
      
        startSecondaryCalcSubmitDate: queryParams['prgrs_verify_2nd_submit_start_date'] || '',
        endSecondaryCalcSubmitDate: queryParams['prgrs_verify_2nd_submit_end_date'] || '',
        statusSecondaryCalcSubmit: queryParams['prgrs_verify_2nd_submit_date_exists'] || '',
      
        startCalcAfterSecondDate: queryParams['prgrs_verify_2nd_comp_start_date'] || '',
        endCalcAfterSecondDate: queryParams['prgrs_verify_2nd_comp_end_date'] || '',
        statusCalcAfterSecond: queryParams['prgrs_verify_2nd_comp_date_exists'] || '',
      
        startThirdVerificationSubmitDate: queryParams['prgrs_verify_3rd_submit_start_date'] || '',
        endThirdVerificationSubmitDate: queryParams['prgrs_verify_3rd_submit_end_date'] || '',
        statusThirdVerificationSubmitDate: queryParams['prgrs_verify_3rd_submit_date_exists'] || '',
      
        startAfterCountThreeDate: queryParams['prgrs_verify_3rd_comp_start_date'] || '',
        endAfterCountThreeDate: queryParams['prgrs_verify_3rd_comp_end_date'] || '',
        statusAfterCountThree: queryParams['prgrs_verify_3rd_comp_date_exists'] || '',
      
        startFinalCheck1Date: queryParams['prgrs_final_check_1st_comp_start_date'] || '',
        endFinalCheck1Date: queryParams['prgrs_final_check_1st_comp_end_date'] || '',
        statusFinalCheck1: queryParams['prgrs_final_check_1st_comp_date_exists'] || '',
      
        startFinalCheck2Date: queryParams['prgrs_final_check_2nd_comp_start_date'] || '',
        endFinalCheck2Date: queryParams['prgrs_final_check_2nd_comp_end_date'] || '',
        statusFinalCheck2: queryParams['prgrs_final_check_2nd_comp_date_exists'] || '',
      
        startSealDate: queryParams['prgrs_stamp_start_date'] || '',
        endSealDate: queryParams['prgrs_stamp_end_date'] || '',
        statusSealDate: queryParams['prgrs_stamp_date_exists'] || '',
      
        startBalanceBillingDate: queryParams['prgrs_balance_billing_start_date'] || '',
        endBalanceBillingDate: queryParams['prgrs_balance_billing_end_date'] || '',
        statusBalanceBilling: queryParams['prgrs_balance_billing_date_exists'] || '',
      
        startRemBalanceDate: queryParams['prgrs_balance_deposit_start_date'] || '',
        endRemBalanceDate: queryParams['prgrs_balance_deposit_end_date'] || '',
        statusRemBalanceDate: queryParams['prgrs_balance_deposit_date_exists'] || '',
      
        startTaxOfficeShippingDate: queryParams['prgrs_taxoffice_shipping_start_date'] || '',
        endTaxOfficeShippingDate: queryParams['prgrs_taxoffice_shipping_end_date'] || '',
        statusTaxOfficeShippingDate: queryParams['prgrs_taxoffice_shipping_date_exists'] || '',
      
        startBusinessProcessBookDate: queryParams['prgrs_work_process_book_start_date'] || '',
        endBusinessProcessBookDate: queryParams['prgrs_work_process_book_end_date'] || '',
        statusBusinessProcessBookDate: queryParams['prgrs_work_process_book_date_exists'] || '',
      
        startReceiptTaxReturnCopyDate: queryParams['prgrs_receipt_declaration_start_date'] || '',
        endReceiptTaxReturnCopyDate: queryParams['prgrs_receipt_declaration_end_date'] || '',
        statusReceiptTaxReturnCopyDate: queryParams['prgrs_receipt_declaration_date_exists'] || '',
      
        startReturnDate: queryParams['prgrs_return_start_date'] || '',
        endReturnDate: queryParams['prgrs_return_end_date'] || '',
        statusReturnDate: queryParams['prgrs_return_date_exists'] || '',
      },      
      remarks: queryParams['p_remarks'] || ''
    };
  
    setFormState(updatedFormState as any);
  
  }, [router.isReady, router.query]);
  

console.log('formState.customerInformation.inheritanceStartDate',formState.customerInformation.inheritanceStartDate)
  const handleSubmit = async () => {

    const otherParams = {
      ...existingFilters,
      adv_search: 1,
      p_inheritance_start_date: formState.customerInformation.inheritanceStartDate,
      p_inheritance_end_date: formState.customerInformation.inheritanceEndDate,
      cust_dob_start_date: formState.customerInformation.dobStartDate,
      cust_dob_end_date: formState.customerInformation.dobEndDate,
      cust_address: formState.customerInformation.customerAddress,
      p_filing_tax_office: formState.customerInformation.filingTaxOffice,

      p_heir_representative: formState.heirInfo.isRepresentative,
      p_heir_relation: formState.heirInfo.relationship,
      p_heir_telephone: formState.heirInfo.phoneNumber,
      p_heir_email: formState.heirInfo.email,
      p_heir_zipcode: formState.heirInfo.postCode,
      p_heir_prefecture: formState.heirInfo.prefectures,
      p_heir_address: formState.heirInfo.address,
      p_heir_legal_inherit: formState.heirInfo.legalInheritance,
      p_heir_tax_payment: formState.heirInfo.taxPayment,

      p_worker_office: formState.projectInfo.worker1Branch,
      p_order_start_date: formState.projectInfo.orderStartDate,
      p_order_end_date: formState.projectInfo.orderEndDate,
      p_elapsed_start_days: formState.projectInfo.elapsedStartDate,
      p_elapsed_end_days: formState.projectInfo.elapsedEndDate,
      p_due_start_date: formState.projectInfo.dueStartDate,
      p_due_end_date: formState.projectInfo.dueEndDate,
      p_filing_start_days: formState.projectInfo.startNumberOfDaysForFiling,
      p_filing_end_days: formState.projectInfo.endNumberOfDaysForFiling,
      p_filing_days_status: formState.projectInfo.statusNumberOfDaysForFiling,
      p_submission_month_start_date: formState.projectInfo.estSubmissionStartMonth,
      p_submission_month_end_date: formState.projectInfo.estSubmissionEndMonth,
      p_submission_tax_return_due_start_date: formState.projectInfo.semiConfirmTaxStartDeadline,
      p_submission_tax_return_due_end_date: formState.projectInfo.semiConfirmTaxEndDeadline,
      p_semi_certain_start_days: formState.projectInfo.semiDaysStartRemaining,
      p_semi_certain_end_days: formState.projectInfo.semiDaysEndRemaining,
      p_semi_certain_end_days_status: formState.projectInfo.statusSemiDaysEndRemaining,
      p_blue_app_form: formState.projectInfo.blueApplicationForm,
      p_sales_tax: formState.projectInfo.consumptionTax,
      p_checker1_id: formState.projectInfo.check1,
      p_checker2_id: formState.projectInfo.check2,
      p_checker3_id: formState.projectInfo.check3,
      p_final1_id: formState.projectInfo.final1,
      p_final2_id: formState.projectInfo.final2,
      p_start_contract_amount: formState.projectInfo.startContractAmount,
      p_end_contract_amount: formState.projectInfo.endContractAmount,
      p_start_deposit_amount: formState.projectInfo.startDepositAmount,
      p_end_deposit_amount: formState.projectInfo.endDepositAmount,
      p_start_balance_amount: formState.projectInfo.startRemainingAmount,
      p_end_balance_amount: formState.projectInfo.endRemainingAmount,
      p_start_total_amount: formState.projectInfo.startBillingTotal,
      p_end_total_amount: formState.projectInfo.endBillingTotal,
      p_undivided: formState.projectInfo.unDivided,
      p_start_due_date_after_3_years: formState.projectInfo.startDueDateWithin3Year,
      p_end_due_date_after_3_years: formState.projectInfo.endDueDateWithin3Year,
      p_start_due_days_after_3_years: formState.projectInfo.startNoDaysRemDue3Years,
      p_end_due_days_after_3_years: formState.projectInfo.endNoDaysRemDue3Years,
      p_end_due_days_after_3_years_status: formState.projectInfo.statusNoDaysRemDue3Years,
      p_real_estate_sale: formState.projectInfo.realEstateSale,
      p_secondary_measures: formState.projectInfo.secondaryMeasures,
      p_real_estate_reg: formState.projectInfo.realEstateReg,
      p_finish: formState.projectInfo.end,
      p_work_remarks: formState.projectInfo.workStatus,

      prgrs_contract_issue_start_date: formState.progress.startContractIssueDate,
      prgrs_contract_issue_end_date: formState.progress.endContractIssueDate,
      prgrs_contract_issue_date_exists: formState.progress.statusContractIssue,
      prgrs_deposit_billing_start_date: formState.progress.startDepositBillingDate,
      prgrs_deposit_billing_end_date: formState.progress.endDepositBillingDate,
      prgrs_deposit_billing_date_exists: formState.progress.statusDepositBilling,
      prgrs_payment_start_date: formState.progress.startDepositDate,
      prgrs_payment_end_date: formState.progress.endDepositDate,
      prgrs_payment_date_exists: formState.progress.statusDeposit,
      prgrs_doc_recv_start_date: formState.progress.startReceiptOfMaterialDate,
      prgrs_doc_recv_end_date: formState.progress.endReceiptOfMaterialDate,
      prgrs_doc_recv_date_exists: formState.progress.statusReceiptOfMaterial,
      prgrs_sc_insufficient_start_date: formState.progress.startScDeficiencyCheckDate,
      prgrs_sc_insufficient_end_date: formState.progress.endScDeficiencyCheckDate,
      prgrs_sc_insufficient_date_exists: formState.progress.statusScDeficiencyCheck,
      prgrs_interim_report_start_date: formState.progress.startIntermediateReportDate,
      prgrs_interim_report_end_date: formState.progress.endIntermediateReportDate,
      prgrs_interim_report_date_exists: formState.progress.statusIntermediateReport,

      prgrs_cp_verification_start_date: formState.progress.startCPVerifyDate,
      prgrs_cp_verification_end_date: formState.progress.endCPVerifyDate,
      prgrs_cp_verification_date_exists: formState.progress.statusCPVerifyDate,

      prgrs_verify_1st_submit_start_date: formState.progress.startCalcSubmitDate,
      prgrs_verify_1st_submit_end_date: formState.progress.endCalcSubmitDate,
      prgrs_verify_1st_submit_date_exists: formState.progress.statusCalcSubmit,
      prgrs_verify_1st_comp_start_date: formState.progress.startCountingDaysOneGoDate,
      prgrs_verify_1st_comp_end_date: formState.progress.endCountingDaysOneGoDate,
      prgrs_verify_1st_comp_date_exists: formState.progress.statusCountingDaysOneGo,
      prgrs_verify_2nd_submit_start_date: formState.progress.startSecondaryCalcSubmitDate,
      prgrs_verify_2nd_submit_end_date: formState.progress.endSecondaryCalcSubmitDate,
      prgrs_verify_2nd_submit_date_exists: formState.progress.statusSecondaryCalcSubmit,
      prgrs_verify_2nd_comp_start_date: formState.progress.startCalcAfterSecondDate,
      prgrs_verify_2nd_comp_end_date: formState.progress.endCalcAfterSecondDate,
      prgrs_verify_2nd_comp_date_exists: formState.progress.statusCalcAfterSecond,
      prgrs_verify_3rd_submit_start_date: formState.progress.startThirdVerificationSubmitDate,
      prgrs_verify_3rd_submit_end_date: formState.progress.endThirdVerificationSubmitDate,
      prgrs_verify_3rd_submit_date_exists: formState.progress.statusThirdVerificationSubmitDate,
      prgrs_verify_3rd_comp_start_date: formState.progress.startAfterCountThreeDate,
      prgrs_verify_3rd_comp_end_date: formState.progress.endAfterCountThreeDate,
      prgrs_verify_3rd_comp_date_exists: formState.progress.statusAfterCountThree,
      prgrs_final_check_1st_comp_start_date: formState.progress.startFinalCheck1Date,
      prgrs_final_check_1st_comp_end_date: formState.progress.endFinalCheck1Date,
      prgrs_final_check_1st_comp_date_exists: formState.progress.statusFinalCheck1,
      prgrs_final_check_2nd_comp_start_date: formState.progress.startFinalCheck2Date,
      prgrs_final_check_2nd_comp_end_date: formState.progress.endFinalCheck2Date,
      prgrs_final_check_2nd_comp_date_exists: formState.progress.statusFinalCheck2,
      prgrs_stamp_start_date: formState.progress.startSealDate,
      prgrs_stamp_end_date: formState.progress.endSealDate,
      prgrs_stamp_date_exists: formState.progress.statusSealDate,
      prgrs_balance_billing_start_date: formState.progress.startBalanceBillingDate,
      prgrs_balance_billing_end_date: formState.progress.endBalanceBillingDate,
      prgrs_balance_billing_date_exists: formState.progress.statusBalanceBilling,
      prgrs_balance_deposit_start_date: formState.progress.startRemBalanceDate,
      prgrs_balance_deposit_end_date: formState.progress.endRemBalanceDate,
      prgrs_balance_deposit_date_exists: formState.progress.statusRemBalanceDate,
      prgrs_taxoffice_shipping_start_date: formState.progress.startTaxOfficeShippingDate,
      prgrs_taxoffice_shipping_end_date: formState.progress.endTaxOfficeShippingDate,
      prgrs_taxoffice_shipping_date_exists: formState.progress.statusTaxOfficeShippingDate,
      prgrs_work_process_book_start_date: formState.progress.startBusinessProcessBookDate,
      prgrs_work_process_book_end_date: formState.progress.endBusinessProcessBookDate,
      prgrs_work_process_book_date_exists: formState.progress.statusBusinessProcessBookDate,
      prgrs_receipt_declaration_start_date: formState.progress.startReceiptTaxReturnCopyDate,
      prgrs_receipt_declaration_end_date: formState.progress.endReceiptTaxReturnCopyDate,
      prgrs_receipt_declaration_date_exists: formState.progress.statusReceiptTaxReturnCopyDate,
      prgrs_return_start_date: formState.progress.startReturnDate,
      prgrs_return_end_date: formState.progress.endReturnDate,
      prgrs_return_date_exists: formState.progress.statusReturnDate,

      p_worklog_response_start_date: formState.workLog.startWorkingDate,
      p_worklog_response_end_date: formState.workLog.endWorkingDate,
      p_worklog_category: formState.workLog.workCategory,
      p_worklog_content: formState.workLog.content,
      p_worklog_worker: formState.workLog.worker,

      p_engagement_response_start_date: formState.involvementRecord.startCompatibleDate,
      p_engagement_response_end_date: formState.involvementRecord.endCompatibleDate,
      p_engagement_content: formState.involvementRecord.howToRespond,
      p_engagement_worker: formState.involvementRecord.worker,

      p_remarks: formState.remarks,

      // ...formState.customerInformation,
      // ...formState.heirInfo,
      // ...formState.projectInfo,
      // ...formState.progress,
      // ...formState.workLog,
      // ...formState.involvementRecord,
      // p_remarks: formState.remarks,
    };
    const filteredParams = Object.fromEntries(
      Object.entries(otherParams).filter(
        ([key, value]) => value != null && value !== "" && value !== false
      )
    );
    
    // const filteredParams = Object.fromEntries(
    //   Object.entries(otherParams).filter(
    //     ([key, value]) => value != null && value !== ""
    //   )
    // );
    console.log('formstate', formState)
    updateUrlFromState(formState);

    setIsReset(false);
    console.log('filteredParams$$$$', filteredParams)
    // dispatch(fetchProjectConfirmed(filteredParams));
    
    if (onClose) {
      onClose();
    }
   
  };

  return (
    <div className={Style.modalOverlay}>
      <div
        className={`${Style.modalContent} ${AdvanceSrchStyle.advanceSearchModalContent}`}
      >
        <div
          className={`${Style.modalHeader} ${AdvanceSrchStyle.modalHeaderAdvanceSrch}`}
        >
          <h5 className="text-center mt-2">
            <b>{t("refineSearch")}</b>
          </h5>
          <Button
            onClick={() => onClose?.()}
            className={Style.closeButton}
            icon={<Image src={close} alt="Close Icon" width={15} height={20} />}
          />
        </div>

        <Form onSubmit={handleSubmit} isLoading={isLoading} showTobSubmitBtn={false} isSubmitFix={true} registerBtnText={t('advSrchSubmitTxt')} showConfirmation={false}>
          <div className="p-4">
            <HeadingRow headingTitle={t("customerInfo")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="customerInformation.inheritanceStartDate"
                  value={formState.customerInformation.inheritanceStartDate}
                  onChange={handleInputChange}
                  label={t("inheritanceStartDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="customerInformation.inheritanceEndDate"
                  value={formState.customerInformation.inheritanceEndDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="customerInformation.dobStartDate"
                  value={formState.customerInformation.dobStartDate}
                  onChange={handleInputChange}
                  label={t("dateOfBirth")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="customerInformation.dobEndDate"
                  value={formState.customerInformation.dobEndDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <InputField
                name="customerInformation.customerAddress"
                value={formState.customerInformation.customerAddress}
                onChange={handleInputChange}
                label={t("address")}
                placeholder={t("address")}
              />
              <InputField
                name="customerInformation.filingTaxOffice"
                value={formState.customerInformation.filingTaxOffice}
                onChange={handleInputChange}
                label={t("filingTaxOffice")}
                placeholder={t("filingTaxOffice")}
              />
            </div>

            <HeadingRow headingTitle={t("heirInformation")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <ToggleButton
                value={formState.heirInfo.isRepresentative === "1"}
                label={t("isRepresentative")}
                options={{
                  on: `${t("isRepresentative")}`,
                  off: `${t("isRepresentative")}`,
                }}
                getSelectedOption={(isOn) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    heirInfo: {
                      ...prevState.heirInfo,
                      isRepresentative: isOn ? "1" : "0",
                    },
                  }));
                }}
                hideSelectedText={true}
              />

              <InputField
                name="heirInfo.relationship"
                value={formState.heirInfo.relationship}
                onChange={handleInputChange}
                label={t("relationship")}
                placeholder={t("relationship")}
              />
              <InputField
                name="heirInfo.phoneNumber"
                value={formState.heirInfo.phoneNumber}
                onChange={handleInputChange}
                label={t("telephoneNumber")}
                placeholder={t("telephoneNumber")}
              />
              <InputField
                name="heirInfo.email"
                value={formState.heirInfo.email}
                onChange={handleInputChange}
                label={t("email")}
                placeholder={t("email")}
              />
              <InputField
                name="heirInfo.postCode"
                value={formState.heirInfo.postCode}
                onChange={handleInputChange}
                label={t("postCode")}
                placeholder={t("postCode")}
              />
              <SelectField
                name="heirInfo.prefectures"
                options={prefecturesOpt}
                value={formState.heirInfo.prefectures}
                onChange={handleInputChange}
                label={t("prefectures")}
                placeholder={t("prefectures")}
              />

              <div className={AdvanceSrchStyle.addressFieldWrapper}>
                <InputField
                  name="heirInfo.address"
                  value={formState.heirInfo.address}
                  onChange={handleInputChange}
                  label={t("address")}
                  placeholder={t("address")}
                />
              </div>
              <InputField
                name="heirInfo.legalInheritance"
                value={formState.heirInfo.legalInheritance}
                onChange={handleInputChange}
                label={t("legalInheritance")}
                placeholder={t("legalInheritance")}
              />
              <InputField
                name="heirInfo.taxPayment"
                value={formState.heirInfo.taxPayment}
                onChange={handleInputChange}
                label={t("taxPaymentYen")}
                placeholder={t("taxPaymentYen")}
              />
            </div>
            {/* <HeadingRow headingTitle={t("heirInformation")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <ToggleButton
                value={formState.heirInfo.isRepresentative === "1"}
                label={t("isRepresentative")}
                options={{
                  on: `${t("isRepresentative")}`,
                  off: `${t("isRepresentative")}`,
                }}
                getSelectedOption={(isOn) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    heirInfo: {
                      ...prevState.heirInfo,
                      isRepresentative: isOn ? "1" : "0",
                    },
                  }));
                }}
                hideSelectedText={true}
              />
            </div> */}

            <HeadingRow headingTitle={t("projectInformation")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <SelectField
                name="projectInfo.worker1Branch"
                options={officesOpt}
                value={formState.projectInfo.worker1Branch}
                onChange={handleInputChange}
                label={t("作業者オフィス")}
                placeholder={t("作業者オフィス")}
              />
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="projectInfo.orderStartDate"
                  value={formState.projectInfo.orderStartDate}
                  onChange={handleInputChange}
                  label={t("orderDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="projectInfo.orderEndDate"
                  value={formState.projectInfo.orderEndDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.elapsedStartDate"
                  value={formState.projectInfo.elapsedStartDate}
                  onChange={handleInputChange}
                  label={t("elapsedDays")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.elapsedEndDate"
                  value={formState.projectInfo.elapsedEndDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                  type="number"
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="projectInfo.dueStartDate"
                  value={formState.projectInfo.dueStartDate}
                  onChange={handleInputChange}
                  label={t("dueDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="projectInfo.dueEndDate"
                  value={formState.projectInfo.dueEndDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputField
                  name="projectInfo.startNumberOfDaysForFiling"
                  value={formState.projectInfo.startNumberOfDaysForFiling}
                  onChange={handleInputChange}
                  label={t("noOfDaysRemainingForFiling")}
                  type="number"
                />
                <span className="mt-4">~</span>
                <InputField
                  name="projectInfo.endNumberOfDaysForFiling"
                  value={formState.projectInfo.endNumberOfDaysForFiling}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                  type="number"
                />
                <SelectField
                  name="projectInfo.statusNumberOfDaysForFiling"
                  options={deadlineOpt}
                  placeholder={t("noOfDaysRemainingForFiling")}
                  value={formState.projectInfo.statusNumberOfDaysForFiling}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="projectInfo.estSubmissionStartMonth"
                  value={formState.projectInfo.estSubmissionStartMonth}
                  onChange={handleInputChange}
                  label={t("submissionDate")}
                  inputType="month"
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="projectInfo.estSubmissionEndMonth"
                  value={formState.projectInfo.estSubmissionEndMonth}
                  onChange={handleInputChange}
                  inputType="month"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="projectInfo.semiConfirmTaxStartDeadline"
                  value={formState.projectInfo.semiConfirmTaxStartDeadline}
                  onChange={handleInputChange}
                  label={t("semiTaxReturnedDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="projectInfo.semiConfirmTaxEndDeadline"
                  value={formState.projectInfo.semiConfirmTaxEndDeadline}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputField
                  type="number"
                  name="projectInfo.semiDaysStartRemaining"
                  value={formState.projectInfo.semiDaysStartRemaining}
                  onChange={handleInputChange}
                  label={t("semiRemainingDays")}
                />
                <span className="mt-4">~</span>
                <InputField
                  type="number"
                  name="projectInfo.semiDaysEndRemaining"
                  value={formState.projectInfo.semiDaysEndRemaining}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="projectInfo.statusSemiDaysEndRemaining"
                  options={afterDeadlineOpt}
                  placeholder={t("semiRemainingDays")}
                  value={formState.projectInfo.statusSemiDaysEndRemaining}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <SelectField
                name="projectInfo.blueApplicationForm"
                options={blueApplicationOpt}
                placeholder={t("blueApplicationForm")}
                value={formState.projectInfo.blueApplicationForm}
                onChange={handleInputChange}
                label={t("blueApplicationForm")}
              />
              <SelectField
                name="projectInfo.consumptionTax"
                options={noneCanbeOpt}
                placeholder={t("consumptionTax")}
                value={formState.projectInfo.consumptionTax}
                onChange={handleInputChange}
                label={t("consumptionTax")}
              />
              <span> </span>
              <div className={`${AdvanceSrchStyle.project4SelectFieldsWrapper} ${AdvanceSrchStyle.project5SelectFieldsgrid}`} >
                <CustomSelectField
                  name="projectInfo.check1"
                  options={usersTaxOpt}
                  value={formState.projectInfo.check1}
                  onChange={handleInputChange}
                  label={t("check1")}
                />
                <CustomSelectField
                  name="projectInfo.check2"
                  options={usersTaxOpt}
                  value={formState.projectInfo.check2}
                  onChange={handleInputChange}
                  label={t("check2")}
                />
                <CustomSelectField
                  name="projectInfo.check3"
                  options={usersTaxOpt}
                  value={formState.projectInfo.check3}
                  onChange={handleInputChange}
                  label={t("check3")}
                />
                <CustomSelectField
                  name="projectInfo.final1"
                  options={usersTaxOpt}
                  value={formState.projectInfo.final1}
                  onChange={handleInputChange}
                  label={t("final1")}
                />
                <CustomSelectField
                  name="projectInfo.final2"
                  options={usersTaxOpt}
                  value={formState.projectInfo.final2}
                  onChange={handleInputChange}
                  label={t("final2")}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startContractAmount"
                  value={formState.projectInfo.startContractAmount}
                  onChange={handleInputChange}
                  label={t("contractAmount")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endContractAmount"
                  value={formState.projectInfo.endContractAmount}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                  type="number"
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startDepositAmount"
                  value={formState.projectInfo.startDepositAmount}
                  onChange={handleInputChange}
                  label={t("deposit")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endDepositAmount"
                  value={formState.projectInfo.endDepositAmount}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                  type="number"
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startRemainingAmount"
                  value={formState.projectInfo.startRemainingAmount}
                  onChange={handleInputChange}
                  label={t("remainingAmount")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endRemainingAmount"
                  value={formState.projectInfo.endRemainingAmount}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                  type="number"
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startBillingTotal"
                  value={formState.projectInfo.startBillingTotal}
                  onChange={handleInputChange}
                  label={t("billingTotalAmount")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endBillingTotal"
                  value={formState.projectInfo.endBillingTotal}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                  type="number"
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="projectInfo.startDueDateWithin3Year"
                  value={formState.projectInfo.startDueDateWithin3Year}
                  onChange={handleInputChange}
                  label={t("dueDateWithin3Years")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="projectInfo.endDueDateWithin3Year"
                  value={formState.projectInfo.endDueDateWithin3Year}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputField
                  name="projectInfo.startNoDaysRemDue3Years"
                  value={formState.projectInfo.startNoDaysRemDue3Years}
                  onChange={handleInputChange}
                  label={t("noOfRemainingDaysWithin3Years")}
                  type="number"
                />
                <span className="mt-4">~</span>
                <InputField
                  name="projectInfo.endNoDaysRemDue3Years"
                  value={formState.projectInfo.endNoDaysRemDue3Years}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                  type="number"
                />
                <SelectField
                  name="projectInfo.statusNoDaysRemDue3Years"
                  options={afterDeadlineOpt}
                  placeholder={t("noOfRemainingDaysWithin3Years")}
                  value={formState.projectInfo.statusNoDaysRemDue3Years}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.project4SelectFieldsWrapper}>
                <SelectField
                  name="projectInfo.unDivided"
                  options={noneCanbeOpt}
                  placeholder={t("undivided")}
                  value={formState.projectInfo.unDivided}
                  onChange={handleInputChange}
                  label={t("undivided")}
                />

              </div>
              <div className={AdvanceSrchStyle.project4SelectFieldsWrapper}>
                <SelectField
                  name="projectInfo.realEstateSale"
                  options={noneCanbeOpt}
                  placeholder={t("realEstateSale")}
                  value={formState.projectInfo.realEstateSale}
                  onChange={handleInputChange}
                  label={t("realEstateSale")}
                />
                <SelectField
                  name="projectInfo.secondaryMeasures"
                  options={noneCanbeOpt}
                  placeholder={t("insurance")}
                  value={formState.projectInfo.secondaryMeasures}
                  onChange={handleInputChange}
                  label={t("insurance")}
                />
                <SelectField
                  name="projectInfo.realEstateReg"
                  options={noneCanbeOpt}
                  placeholder={t("realEstateReg")}
                  value={formState.projectInfo.realEstateReg}
                  onChange={handleInputChange}
                  label={t("realEstateReg")}
                />
                <SelectField
                  name="projectInfo.end"
                  options={noneCanbeOpt}
                  placeholder={t("isEnd")}
                  value={formState.projectInfo.end}
                  onChange={handleInputChange}
                  label={t("isEnd")}
                />
              </div>
              <div className={AdvanceSrchStyle.workStatusFieldWrapper}>
                <InputField
                  name="projectInfo.workStatus"
                  value={formState.projectInfo.workStatus}
                  onChange={handleInputChange}
                  label={t("workStatus")}
                />
              </div>
            </div>

            <HeadingRow headingTitle={t("progress")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startContractIssueDate"
                  value={formState.progress.startContractIssueDate}
                  onChange={handleInputChange}
                  label={t("contractIssueDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endContractIssueDate"
                  value={formState.progress.endContractIssueDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusContractIssue"
                  options={noneCanbeOpt}
                  value={formState.progress.statusContractIssue}
                  onChange={handleInputChange}
                  placeholder={t("statusContractIssue")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startDepositBillingDate"
                  value={formState.progress.startDepositBillingDate}
                  onChange={handleInputChange}
                  label={t("depositBillingDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endDepositBillingDate"
                  value={formState.progress.endDepositBillingDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusDepositBilling"
                  options={noneCanbeOpt}
                  value={formState.progress.statusDepositBilling}
                  onChange={handleInputChange}
                  placeholder={t("statusDepositBilling")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startDepositDate"
                  value={formState.progress.startDepositDate}
                  onChange={handleInputChange}
                  label={t("depositDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endDepositDate"
                  value={formState.progress.endDepositDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusDeposit"
                  options={noneCanbeOpt}
                  value={formState.progress.statusDeposit}
                  onChange={handleInputChange}
                  placeholder={t("statusDeposit")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startReceiptOfMaterialDate"
                  value={formState.progress.startReceiptOfMaterialDate}
                  onChange={handleInputChange}
                  label={t("receiptOfMaterial")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endReceiptOfMaterialDate"
                  value={formState.progress.endReceiptOfMaterialDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusReceiptOfMaterial"
                  options={noneCanbeOpt}
                  value={formState.progress.statusReceiptOfMaterial}
                  onChange={handleInputChange}
                  placeholder={t("receiptOfMaterial")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startScDeficiencyCheckDate"
                  value={formState.progress.startScDeficiencyCheckDate}
                  onChange={handleInputChange}
                  label={t("scDeficiencyCheck")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endScDeficiencyCheckDate"
                  value={formState.progress.endScDeficiencyCheckDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusScDeficiencyCheck"
                  options={noneCanbeOpt}
                  value={formState.progress.statusScDeficiencyCheck}
                  onChange={handleInputChange}
                  placeholder={t("scDeficiencyCheck")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startIntermediateReportDate"
                  value={formState.progress.startIntermediateReportDate}
                  onChange={handleInputChange}
                  label={t("interimReport")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endIntermediateReportDate"
                  value={formState.progress.endIntermediateReportDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusIntermediateReport"
                  options={noneCanbeOpt}
                  value={formState.progress.statusIntermediateReport}
                  onChange={handleInputChange}
                  placeholder={t("interimReport")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startCPVerifyDate"
                  value={formState.progress.startCPVerifyDate}
                  onChange={handleInputChange}
                  label={t("CP検算")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endCPVerifyDate"
                  value={formState.progress.endCPVerifyDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusCPVerifyDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusCPVerifyDate}
                  onChange={handleInputChange}
                  placeholder={t("CP検算")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startCalcSubmitDate"
                  value={formState.progress.startCalcSubmitDate}
                  onChange={handleInputChange}
                  label={t("firstCalculationFilingDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endCalcSubmitDate"
                  value={formState.progress.endCalcSubmitDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusCalcSubmit"
                  options={noneCanbeOpt}
                  value={formState.progress.statusCalcSubmit}
                  onChange={handleInputChange}
                  placeholder={t("firstCalculationFilingDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startCountingDaysOneGoDate"
                  value={formState.progress.startCountingDaysOneGoDate}
                  onChange={handleInputChange}
                  label={t("firstCalculationCompletionDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endCountingDaysOneGoDate"
                  value={formState.progress.endCountingDaysOneGoDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusCountingDaysOneGo"
                  options={noneCanbeOpt}
                  value={formState.progress.statusCountingDaysOneGo}
                  onChange={handleInputChange}
                  placeholder={t("statusCountingDaysOneGo")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startSecondaryCalcSubmitDate"
                  value={formState.progress.startSecondaryCalcSubmitDate}
                  onChange={handleInputChange}
                  label={t("secondaryCalculationFilingDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endSecondaryCalcSubmitDate"
                  value={formState.progress.endSecondaryCalcSubmitDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusSecondaryCalcSubmit"
                  options={noneCanbeOpt}
                  value={formState.progress.statusSecondaryCalcSubmit}
                  onChange={handleInputChange}
                  placeholder={t("secondaryCalculationFilingDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startCalcAfterSecondDate"
                  value={formState.progress.startCalcAfterSecondDate}
                  onChange={handleInputChange}
                  label={t("secondaryCalculationCompletionDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endCalcAfterSecondDate"
                  value={formState.progress.endCalcAfterSecondDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusCalcAfterSecond"
                  options={noneCanbeOpt}
                  value={formState.progress.statusCalcAfterSecond}
                  onChange={handleInputChange}
                  placeholder={t("secondaryCalculationCompletionDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startThirdVerificationSubmitDate"
                  value={formState.progress.startThirdVerificationSubmitDate}
                  onChange={handleInputChange}
                  label={t("thirdVerificationSubmissionDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endThirdVerificationSubmitDate"
                  value={formState.progress.endThirdVerificationSubmitDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusThirdVerificationSubmitDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusThirdVerificationSubmitDate}
                  onChange={handleInputChange}
                  placeholder={t("thirdVerificationSubmissionDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startAfterCountThreeDate"
                  value={formState.progress.startAfterCountThreeDate}
                  onChange={handleInputChange}
                  label={t("thirdVerificationCompletionDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endAfterCountThreeDate"
                  value={formState.progress.endAfterCountThreeDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusAfterCountThree"
                  options={noneCanbeOpt}
                  value={formState.progress.statusAfterCountThree}
                  onChange={handleInputChange}
                  placeholder={t("thirdVerificationCompletionDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startFinalCheck1Date"
                  value={formState.progress.startFinalCheck1Date}
                  onChange={handleInputChange}
                  label={t("finalCheck1CompletionDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endFinalCheck1Date"
                  value={formState.progress.endFinalCheck1Date}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusFinalCheck1"
                  options={noneCanbeOpt}
                  value={formState.progress.statusFinalCheck1}
                  onChange={handleInputChange}
                  placeholder={t("finalCheck1CompletionDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startFinalCheck2Date"
                  value={formState.progress.startFinalCheck2Date}
                  onChange={handleInputChange}
                  label={t("finalCheck2CompletionDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endFinalCheck2Date"
                  value={formState.progress.endFinalCheck2Date}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusFinalCheck2"
                  options={noneCanbeOpt}
                  value={formState.progress.statusFinalCheck2}
                  onChange={handleInputChange}
                  placeholder={t("finalCheck2CompletionDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startSealDate"
                  value={formState.progress.startSealDate}
                  onChange={handleInputChange}
                  label={t("sealDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endSealDate"
                  value={formState.progress.endSealDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusSealDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusSealDate}
                  onChange={handleInputChange}
                  placeholder={t("sealDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startBalanceBillingDate"
                  value={formState.progress.startBalanceBillingDate}
                  onChange={handleInputChange}
                  label={t("balanceBillingDate")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endBalanceBillingDate"
                  value={formState.progress.endBalanceBillingDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusBalanceBilling"
                  options={noneCanbeOpt}
                  value={formState.progress.statusBalanceBilling}
                  onChange={handleInputChange}
                  placeholder={t("balanceBillingDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startRemBalanceDate"
                  value={formState.progress.startRemBalanceDate}
                  onChange={handleInputChange}
                  label={t("remainingBalanceDeposit")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endRemBalanceDate"
                  value={formState.progress.endRemBalanceDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusRemBalanceDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusRemBalanceDate}
                  onChange={handleInputChange}
                  placeholder={t("remainingBalanceDeposit")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startTaxOfficeShippingDate"
                  value={formState.progress.startTaxOfficeShippingDate}
                  onChange={handleInputChange}
                  label={t("taxOfficeShipping")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endTaxOfficeShippingDate"
                  value={formState.progress.endTaxOfficeShippingDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusTaxOfficeShippingDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusTaxOfficeShippingDate}
                  onChange={handleInputChange}
                  placeholder={t("taxOfficeShipping")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startBusinessProcessBookDate"
                  value={formState.progress.startBusinessProcessBookDate}
                  onChange={handleInputChange}
                  label={t("businessProcessingBook")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endBusinessProcessBookDate"
                  value={formState.progress.endBusinessProcessBookDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusBusinessProcessBookDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusBusinessProcessBookDate}
                  onChange={handleInputChange}
                  placeholder={t("statusBusinessProcessBookDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startReceiptTaxReturnCopyDate"
                  value={formState.progress.startReceiptTaxReturnCopyDate}
                  onChange={handleInputChange}
                  label={t("copyReceiptOfTaxReturn")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endReceiptTaxReturnCopyDate"
                  value={formState.progress.endReceiptTaxReturnCopyDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusReceiptTaxReturnCopyDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusReceiptTaxReturnCopyDate}
                  onChange={handleInputChange}
                  placeholder={t("copyReceiptOfTaxReturn")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.dateSelectFieldsWrapper}>
                <InputDateField
                  name="progress.startReturnDate"
                  value={formState.progress.startReturnDate}
                  onChange={handleInputChange}
                  label={t("return")}
                />
                <span className="mt-4">~</span>
                <InputDateField
                  name="progress.endReturnDate"
                  value={formState.progress.endReturnDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
                <SelectField
                  name="progress.statusReturnDate"
                  options={noneCanbeOpt}
                  value={formState.progress.statusReturnDate}
                  onChange={handleInputChange}
                  placeholder={t("return")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

            </div>

            {/* <HeadingRow headingTitle={t("dueStatus")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className="d-flex gap-1 align-items-center">
                <InputField
                  name="dueStatus.startTotalTaxAmount"
                  value={formState.dueStatus.startTotalTaxAmount}
                  onChange={handleInputChange}
                  label={t("totalTaxAmountYen")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="dueStatus.endTotalTaxAmount"
                  value={formState.dueStatus.endTotalTaxAmount}
                  onChange={handleInputChange}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className="d-flex gap-1 align-items-center">
                <InputField
                  name="dueStatus.startRealEstateAmount"
                  value={formState.dueStatus.startRealEstateAmount}
                  onChange={handleInputChange}
                  label={t("realEstateAmountThousandYen")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="dueStatus.endRealEstateAmount"
                  value={formState.dueStatus.endRealEstateAmount}
                  onChange={handleInputChange}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className="d-flex gap-1 align-items-center">
                <InputField
                  name="dueStatus.startSecurityAmount"
                  value={formState.dueStatus.startSecurityAmount}
                  onChange={handleInputChange}
                  label={t("securitiesAmountThousandYen")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="dueStatus.endSecurityAmount"
                  value={formState.dueStatus.endSecurityAmount}
                  onChange={handleInputChange}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className="d-flex gap-1 align-items-center">
                <InputField
                  name="dueStatus.startSavingAmount"
                  value={formState.dueStatus.startSavingAmount}
                  onChange={handleInputChange}
                  label={t("savingsAmountThousandYen")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="dueStatus.endSavingAmount"
                  value={formState.dueStatus.endSavingAmount}
                  onChange={handleInputChange}
                  type="number" 
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className="d-flex gap-1 align-items-center">
                <InputField
                  name="dueStatus.startLifeInsuranceAmount"
                  value={formState.dueStatus.startLifeInsuranceAmount}
                  onChange={handleInputChange}
                  label={t("lifeInsuranceAmountThousandYen")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="dueStatus.endLifeInsuranceAmount"
                  value={formState.dueStatus.endLifeInsuranceAmount}
                  onChange={handleInputChange}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className="d-flex gap-1 align-items-center">
                <InputField
                  name="dueStatus.startOthersAmount"
                  value={formState.dueStatus.startOthersAmount}
                  onChange={handleInputChange}
                  label={t("othersAmountThousandYen")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="dueStatus.endOthersAmount"
                  value={formState.dueStatus.endOthersAmount}
                  onChange={handleInputChange}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
            </div> */}

            <HeadingRow headingTitle={t("workLog")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={`${AdvanceSrchStyle.dateSelectFieldsWrapper} align-items-center`}>
                <InputDateField
                  name="workLog.startWorkingDate"
                  value={formState.workLog.startWorkingDate}
                  onChange={handleInputChange}
                  label={t("workingDay")}
                />
                <span className="mt-2">~</span>
               <div className={AdvanceSrchStyle.customizeField}>
               <InputDateField 
                  name="workLog.endWorkingDate"
                  value={formState.workLog.endWorkingDate}
                  onChange={handleInputChange}
                  className={`${AdvanceSrchStyle.searchField}`}
                />
               </div>
              </div>
              <SelectField
                name="workLog.workCategory"
                options={workLogCategoriesOpt}
                value={formState.workLog.workCategory}
                onChange={handleInputChange}
                label={t("workCategory")}
                placeholder={t("workCategory")}
              />

              <div className={AdvanceSrchStyle.addressFieldWrapper}>
                <InputField
                  name="workLog.content"
                  value={formState.workLog.content}
                  onChange={handleInputChange}
                  label={t("content")}
                  placeholder={t("content")}
                />
              </div>
              <CustomSelectField
                name="workLog.worker"
                options={usersTaxOpt}
                value={formState.workLog.worker}
                onChange={handleInputChange}
                label={t("worker")}
                placeholder={t("worker")}
              />
            </div>

            <HeadingRow headingTitle={t("involvementRecord")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className="d-flex gap-1 align-items-center">
                <InputDateField
                  name="involvementRecord.startCompatibleDate"
                  value={formState.involvementRecord.startCompatibleDate}
                  onChange={handleInputChange}
                  label={t("compatibleDate")}
                />
                <span className="mt-2">~</span>
              <div className={AdvanceSrchStyle.customizeField}>
              <InputDateField
                  name="involvementRecord.endCompatibleDate"
                  value={formState.involvementRecord.endCompatibleDate}
                  onChange={handleInputChange}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              </div>
              <span></span>
              <div className={AdvanceSrchStyle.addressFieldWrapper}>
                <InputField
                  name="involvementRecord.howToRespond"
                  value={formState.involvementRecord.howToRespond}
                  onChange={handleInputChange}
                  label={t("howToRespond")}
                  placeholder={t("howToRespond")}
                />
              </div>
              <CustomSelectField
                name="involvementRecord.worker"
                options={usersTaxOpt}
                value={formState.involvementRecord.worker}
                onChange={handleInputChange}
                label={t("worker")}
                placeholder={t("worker")}
              />
            </div>

            <HeadingRow headingTitle={t("remarks")}></HeadingRow>
            <div className={`${AdvanceSrchStyle.advanceSearchFieldsWrapper} ${AdvanceSrchStyle.remarksFieldFGrid}`} >
              <InputField
                name="remarks"
                value={formState.remarks}
                onChange={handleInputChange}
                label={t("remarks")}
                placeholder={t("remarks")}
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdvanceSearchModal;
