import React, { ChangeEvent, useEffect } from "react";
import InputField from "../input-field/input-field";
import Style from "../../styles/components/molecules/search-modal.module.scss";
import Image from "next/image";
import close from "../../../public/assets/svg/modalClose.svg";
import { useLanguage } from "@/localization/LocalContext";
import { useState } from "react";
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
import TextAreaField from "../text-area/text-area";
import { fetchProjectLegalListing } from "@/app/features/projectLegal/projectLegalListingSlice";
import { getParamValue } from "@/libs/utils";
import CustomSelectField from "../custom-select/custom-select";
import router from "next/router";
interface Props {
  onClose?: (customer?: any) => void;
  isLoading?: boolean;
  existingFilters?: any;
  setIsReset?: any;
  setManualChange?: any;
}



const keyMap: any = {
  // Customer Information
  "customerInformation.inheritanceStartDate": "pl_inheritance_start_date",
  "customerInformation.inheritanceEndDate": "pl_inheritance_end_date",
  "customerInformation.dobEndDate": "cust_dob_end_date",
  "customerInformation.dobStartDate": "cust_dob_start_date",
  "customerInformation.customerAddress": "cust_address",

  // Heir Information
  "heirInfo.isRepresentative": "pl_heir_is_representative",
  "heirInfo.relationship": "pl_heir_relation",
  "heirInfo.phoneNumber": "pl_heir_telephone",
  "heirInfo.email": "pl_heir_email",
  "heirInfo.postCode": "pl_heir_zipcode",
  "heirInfo.prefectures": "pl_heir_prefecture",
  "heirInfo.address": "pl_heir_address",

  // Project Information
  "projectInfo.opportunityStatus": "pl_opportunity_status",
  "projectInfo.projectType": "pl_project_category",
  "projectInfo.base": "pl_office",
  "projectInfo.referralSource": "pl_introduced_by",
  "projectInfo.taxPerson": "pl_tax_officer",
  "projectInfo.taxWorker": "pl_tax_worker",
  "projectInfo.officeCorporateTossRaiser": "pl_office_corporate_tossers",
  "projectInfo.corporateTossRaiser": "pl_corporate_tossers",
  "projectInfo.startOrderDate": "pl_order_start_date",
  "projectInfo.endOrderDate": "pl_order_end_date",
  "projectInfo.startElapsedDate": "pl_elapsed_start_days",
  "projectInfo.endElapsedDate": "pl_elapsed_end_days",
  "projectInfo.startTotalOrderAmount": "pl_total_order_start_amount",
  "projectInfo.endTotalOrderAmount": "pl_total_order_end_amount",
  "projectInfo.startBillingTotal": "pl_billing_total_start_amount",
  "projectInfo.endBillingTotal": "pl_billing_total_end_amount",
  "projectInfo.deadlineDate": "pl_due_date",
  "projectInfo.progressStatus": "pl_progress_status",
  "projectInfo.realEstateAppraisal": "pl_real_estate_appraisal",
  "projectInfo.realEstateSale": "pl_real_estate_sale",
  "projectInfo.will": "pl_will",
  "projectInfo.trust": "pl_trust",
  "projectInfo.insurance": "pl_insurance",
  "projectInfo.newsletter": "pl_newsletter",
  "projectInfo.execution": "pl_execution",
  "projectInfo.startExecutionFee": "pl_execution_start_amount",
  "projectInfo.endExecutionFee": "pl_execution_end_amount",
  "projectInfo.willCustody": "pl_custody_of_will",
  "projectInfo.startTestatorAge": "pl_age_of_testator_start_date",
  "projectInfo.endTestatorAge": "pl_age_of_testator_end_date",
  "projectInfo.isExecuted": "pl_executed",
  "projectInfo.finalTaxReturn": "pl_tax_return",

  // Order Details
  "orderDetails.orderProcedure": "pl_order_procedure",
  "orderDetails.startDate": "pl_order_start_date_start",
  "orderDetails.endDate": "pl_order_start_date_end",
  "orderDetails.startWorkCompletionDate": "pl_order_work_completion_start_date",
  "orderDetails.endWorkCompletionDate": "pl_order_work_completion_end_date",
  "orderDetails.startCheckDate": "pl_order_check_start_date",
  "orderDetails.endCheckDate": "pl_order_check_end_date",
  "orderDetails.inspector": "pl_order_inspector",
  "orderDetails.startExpectedBillingDate": "pl_order_expected_billing_start_date",
  "orderDetails.endExpectedBillingDate": "pl_order_expected_billing_end_date",
  "orderDetails.endExpectedBillingDate_1": "pl_order_billing_start_date",
  "orderDetails.startBillingDate": "pl_order_billing_end_date",

  // Amount of Money Dropped
  "amountOfMoneyDropped.startFallenMoonDate": "pl_amount_fell_start_date",
  "amountOfMoneyDropped.endFallenMoonDate": "pl_amount_fell_end_date",
  "amountOfMoneyDropped.startAmountOfMoneyDropped": "pl_amount_fell_start_amount",
  "amountOfMoneyDropped.endAmountOfMoneyDropped": "pl_amount_fell_end_amount",

  // Invoice
  "invoice.startBillingDate": "pl_invoice_billing_start_date",
  "invoice.endBillingDate": "pl_invoice_billing_end_date",
  "invoice.depositStatus": "pl_invoice_deposit_status",

  // Involvement Log
  "involvementLog.startCompatibleDate": "pl_worklog_compatible_start_date",
  "involvementLog.endCompatibleDate": "pl_worklog_compatible_end_date",
  "involvementLog.correspondingPerson": "pl_worklog_corresponding_person",

  // Work Log
  "workLog.startCompatibleDate": "pl_engagement_compatible_start_date",
  "workLog.endCompatibleDate": "pl_engagement_compatible_end_date",
  "workLog.correspondingPerson": "pl_engagement_corresponding_person",

  // Identification
  "identification.startIdentityVerifyDate": "pl_identity_contact_start_date",
  "identification.endIdentityVerifyDate": "pl_identity_contact_end_date",
  "identification.person": "pl_identity_verify_person",

  // Legal Affairs Dispatch
  "legalAffairsDispatch.startShipmentDate": "pl_lg_affair_application_start_date",
  "legalAffairsDispatch.endShipmentDate": "pl_lg_affair_application_end_date",
  "legalAffairsDispatch.jurisdictionalLegalAffairsBureau": "pl_lg_affair_jurisdiction",
  "legalAffairsDispatch.startExpectedCompletionDate": "pl_lg_affair_expected_comp_start_date",
  "legalAffairsDispatch.endExpectedCompletionDate": "pl_lg_affair_expected_comp_end_date",

  // Family Court Dispatch
  "familyCourtDispatch.startShipmentDate": "pl_family_court_application_start_date",
  "familyCourtDispatch.endShipmentDate": "pl_family_court_application_end_date",
  "familyCourtDispatch.jurisdictionalFamilyCourt": "pl_family_court_jurisdiction",

  // Notes and Remarks
  "remarks": "pl_notes",
  "notes": "pl_remarks",
};



const LegalAdvanceSearchModal: React.FC<Props> = ({ onClose, isLoading, existingFilters, setIsReset, setManualChange }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  useEffect(() => {
    // Fetch active_tab value from URL when component mounts
    const activeTabValue = getParamValue("active_tab");
    setActiveTab(activeTabValue);
  }, []);
  const [formState, setFormState] = useState({
    customerInformation: {
      inheritanceStartDate: "",
      inheritanceEndDate: "",
      dobStartDate: "",
      dobEndDate: "",
      customerAddress: "",
    },
    heirInfo: {
      isRepresentative: "0",
      relationship: "",
      phoneNumber: "",
      email: "",
      postCode: "",
      prefectures: "",
      address: "",
    },
    projectInfo: {
      opportunityStatus: "",
      projectType: "",
      base: "",
      referralSource: "",
      taxPerson: "",
      taxWorker: "",
      officeCorporateTossRaiser: "",
      corporateTossRaiser: "",
      startOrderDate: "",
      endOrderDate: "",
      startElapsedDate: "",
      endElapsedDate: "",
      startTotalOrderAmount: "",
      endTotalOrderAmount: "",
      startBillingTotal: "",
      endBillingTotal: "",
      deadlineDate: "",
      progressStatus: "",
      realEstateAppraisal: "",
      realEstateSale: "",
      will: "",
      trust: "",
      insurance: "",
      newsletter: "",
      execution: "",
      startExecutionFee: "",
      endExecutionFee: "",
      willCustody: "",
      startTestatorAge: "",
      isExecuted: "",
      endTestatorAge: "",
      finalTaxReturn: "",
    },
    orderDetails: {
      orderProcedure: "",
      startDate: "",
      endDate: "",
      startWorkCompletionDate: "",
      endWorkCompletionDate: "",
      startCheckDate: "",
      endCheckDate: "",
      inspector: "",
      startExpectedBillingDate: "",
      endExpectedBillingDate: "",
      startBillingDate: "",
      endBillingDate: "",
    },
    amountOfMoneyDropped: {
      startFallenMoonDate: "",
      endFallenMoonDate: "",
      startAmountOfMoneyDropped: "",
      endAmountOfMoneyDropped: "",
    },
    invoice: {
      startBillingDate: "",
      endBillingDate: "",
      depositStatus: "",
    },
    involvementLog: {
      startCompatibleDate: "",
      endCompatibleDate: "",
      correspondingPerson: "",
    },
    workLog: {
      startCompatibleDate: "",
      endCompatibleDate: "",
      correspondingPerson: "",
    },
    identification: {
      startIdentityVerifyDate: "",
      endIdentityVerifyDate: "",
      person: "",
    },
    legalAffairsDispatch: {
      startShipmentDate: "",
      endShipmentDate: "",
      jurisdictionalLegalAffairsBureau: "",
      startExpectedCompletionDate: "",
      endExpectedCompletionDate: "",
    },
    familyCourtDispatch: {
      startShipmentDate: "",
      endShipmentDate: "",
      jurisdictionalFamilyCourt: "",
    },
    remarks: "",
    notes: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchtaxAdvanceSearchDropdown())
  }, [dispatch])

  const {
    prefectures: prefecturesOpt,
    opportunityStatus: opportunityStatusOpt,
    projectTypes: projectTypesOpt,
    offices: officesOpt,
    introducedBy: introducedByOpt,
    usersTax: usersTaxOpt,
    usersLegal: usersLegalOpt,
    corporateToss: corporateTossOpt,
    progressStatus: progressStatusOpt,
    general: generalOpt,
    newsLetter: newsLetterOpt,
    execution: executionOpt,
    custodyOfWills: custodyOfWillsOpt,
    taxReturn: taxReturnOpt,
    orderType: orderTypeOpt,
    depositStatus: depositStatusOpt,
    identityVerification: identityVerificationOpt,

  } = useSelector((state: RootState) => state.advSrchDropdown);

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
      return newState;
    });
  };

  const updateUrlFromState = (state: any) => {
    // Retrieve the current URL parameters
    const currentParams = new URLSearchParams(window.location.search);
  
    const newParams = new URLSearchParams(currentParams.toString()); // Copy existing params
  
    // Flattens state and applies key transformations
    const transformAndFlattenState = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fullPath = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          transformAndFlattenState(value, fullPath);
        } else {
          const newKey = keyMap[fullPath as any] || fullPath;  // Apply mapping or use original path
          if (value != null && value !== '') {
            newParams.set(newKey, value); // Set or update new parameter
          } else {
            newParams.delete(newKey); // Optionally remove the parameter if the value is empty or null
          }
        }
      });
    };
  
    // Flatten and merge the new state into the current URL parameters
    transformAndFlattenState(state);
  
    // Push the updated parameters to the URL
    router.push(`${router.pathname}?${newParams.toString()}&adv=true`, undefined, { shallow: true });
  };
  
  

  const handleSubmit = async () => {
    const otherParams = {
      ...existingFilters,
      adv_search: 1,
      cust_dob_start_date: formState.customerInformation.dobStartDate,
      cust_dob_end_date: formState.customerInformation.dobEndDate,
      cust_address: formState.customerInformation.customerAddress,
      pl_inheritance_start_date: formState.customerInformation.inheritanceStartDate,
      pl_inheritance_end_date: formState.customerInformation.inheritanceEndDate,

      pl_heir_is_representative: formState.heirInfo.isRepresentative,
      pl_heir_relation: formState.heirInfo.relationship,
      pl_heir_telephone: formState.heirInfo.phoneNumber,
      pl_heir_email: formState.heirInfo.email,
      pl_heir_zipcode: formState.heirInfo.postCode,
      pl_heir_prefecture: formState.heirInfo.prefectures,
      pl_heir_address: formState.heirInfo.address,

      pl_opportunity_status: formState.projectInfo.opportunityStatus,
      pl_project_category: formState.projectInfo.projectType,
      pl_office: formState.projectInfo.base,
      pl_introduced_by: formState.projectInfo.referralSource,
      pl_tax_officer: formState.projectInfo.taxPerson,
      pl_tax_worker: formState.projectInfo.taxWorker,
      pl_office_corporate_tossers: formState.projectInfo.officeCorporateTossRaiser,
      pl_corporate_tossers: formState.projectInfo.corporateTossRaiser,
      pl_order_start_date: formState.projectInfo.startOrderDate,
      pl_order_end_date: formState.projectInfo.endOrderDate,
      pl_elapsed_start_days: formState.projectInfo.startElapsedDate,
      pl_elapsed_end_days: formState.projectInfo.endElapsedDate,

      pl_total_order_start_amount: formState.projectInfo.startTotalOrderAmount,
      pl_total_order_end_amount: formState.projectInfo.endTotalOrderAmount,
      pl_billing_total_start_amount: formState.projectInfo.startBillingTotal,
      pl_billing_total_end_amount: formState.projectInfo.endBillingTotal,
      pl_due_date: formState.projectInfo.deadlineDate,
      pl_progress_status: formState.projectInfo.progressStatus,
      pl_real_estate_appraisal: formState.projectInfo.realEstateAppraisal,
      pl_real_estate_sale: formState.projectInfo.realEstateSale,
      pl_will: formState.projectInfo.will,
      pl_trust: formState.projectInfo.trust,
      pl_insurance: formState.projectInfo.insurance,
      pl_newsletter: formState.projectInfo.newsletter,
      pl_execution: formState.projectInfo.execution,
      pl_execution_start_amount: formState.projectInfo.startExecutionFee,
      pl_execution_end_amount: formState.projectInfo.endExecutionFee,
      pl_custody_of_will: formState.projectInfo.willCustody,
      pl_age_of_testator_start_date: formState.projectInfo.startTestatorAge,
      pl_age_of_testator_end_date: formState.projectInfo.endTestatorAge,
      pl_executed: formState.projectInfo.isExecuted,
      pl_tax_return: formState.projectInfo.finalTaxReturn,

      pl_order_procedure: formState.orderDetails.orderProcedure,

      pl_order_start_date_start: formState.orderDetails.startDate,
      pl_order_start_date_end: formState.orderDetails.endDate,
      pl_order_work_completion_start_date: formState.orderDetails.startWorkCompletionDate,
      pl_order_work_completion_end_date: formState.orderDetails.endWorkCompletionDate,
      pl_order_check_start_date: formState.orderDetails.startCheckDate,
      pl_order_check_end_date: formState.orderDetails.endCheckDate,
      pl_order_inspector: formState.orderDetails.inspector,
      pl_order_expected_billing_start_date: formState.orderDetails.startExpectedBillingDate,
      pl_order_expected_billing_end_date: formState.orderDetails.endExpectedBillingDate,
      pl_order_billing_start_date: formState.orderDetails.endExpectedBillingDate,
      pl_order_billing_end_date: formState.orderDetails.startBillingDate,

      pl_amount_fell_start_date: formState.amountOfMoneyDropped.startFallenMoonDate,
      pl_amount_fell_end_date: formState.amountOfMoneyDropped.endFallenMoonDate,
      pl_amount_fell_start_amount: formState.amountOfMoneyDropped.startAmountOfMoneyDropped,
      pl_amount_fell_end_amount: formState.amountOfMoneyDropped.endAmountOfMoneyDropped,

      pl_invoice_billing_start_date: formState.invoice.startBillingDate,
      pl_invoice_billing_end_date: formState.invoice.endBillingDate,
      pl_invoice_deposit_status: formState.invoice.depositStatus,

      pl_worklog_compatible_start_date: formState.involvementLog.startCompatibleDate,
      pl_worklog_compatible_end_date: formState.involvementLog.endCompatibleDate,
      pl_worklog_corresponding_person: formState.involvementLog.correspondingPerson,

      pl_engagement_compatible_start_date: formState.workLog.startCompatibleDate,
      pl_engagement_compatible_end_date: formState.workLog.endCompatibleDate,
      pl_engagement_corresponding_person: formState.workLog.correspondingPerson,

      pl_identity_contact_start_date: formState.identification.startIdentityVerifyDate,
      pl_identity_contact_end_date: formState.identification.endIdentityVerifyDate,
      pl_identity_verify_person: formState.identification.person,

      pl_lg_affair_application_start_date: formState.legalAffairsDispatch.startShipmentDate,
      pl_lg_affair_application_end_date: formState.legalAffairsDispatch.endShipmentDate,
      pl_lg_affair_jurisdiction: formState.legalAffairsDispatch.jurisdictionalLegalAffairsBureau,
      pl_lg_affair_expected_comp_start_date: formState.legalAffairsDispatch.startExpectedCompletionDate,
      pl_lg_affair_expected_comp_end_date: formState.legalAffairsDispatch.endExpectedCompletionDate,

      pl_family_court_application_start_date: formState.familyCourtDispatch.startShipmentDate,
      pl_family_court_application_end_date: formState.familyCourtDispatch.endShipmentDate,
      pl_family_court_jurisdiction: formState.familyCourtDispatch.jurisdictionalFamilyCourt,

      pl_notes: formState.remarks,
      pl_remarks: formState.notes,

    };

    const filteredParams = Object.fromEntries(
      Object.entries(otherParams).filter(
        ([key, value]) => value != null && value !== ""
      )
    );

    updateUrlFromState(formState);
    setIsReset(false);
    setManualChange(true);
  
    dispatch(fetchProjectLegalListing(filteredParams));
    if (onClose) {
      onClose();
    }

  };


  useEffect(() => {
    if (!router.isReady) return;
  
    // Assuming query params keys are exactly as they need to be in the form state
    const queryParams = router.query;
  
    const updatedFormState = {
      customerInformation: {
        inheritanceStartDate: queryParams['pl_inheritance_start_date_1'] || queryParams['pl_inheritance_start_date'] || '',
        inheritanceEndDate: queryParams['pl_inheritance_end_date_1'] || queryParams['pl_inheritance_end_date'] || '',
        dobStartDate: queryParams['cust_dob_start_date'] || '',
        dobEndDate: queryParams['cust_dob_end_date'] || '',
        customerAddress: queryParams['cust_address'] || '',
      },
      heirInfo: {
        isRepresentative: queryParams['pl_heir_is_representative'] || '0',
        relationship: queryParams['pl_heir_relation'] || '',
        phoneNumber: queryParams['pl_heir_telephone'] || '',
        email: queryParams['pl_heir_email'] || '',
        postCode: queryParams['pl_heir_zipcode'] || '',
        prefectures: queryParams['pl_heir_prefecture'] || '',
        address: queryParams['pl_heir_address'] || '',
      },
      projectInfo: {
        opportunityStatus: queryParams['pl_opportunity_status'] || '',
        projectType: queryParams['pl_project_category'] || '',
        base: queryParams['pl_office'] || '',
        referralSource: queryParams['pl_introduced_by'] || '',
        taxPerson: queryParams['pl_tax_officer'] || '',
        taxWorker: queryParams['pl_tax_worker'] || '',
        officeCorporateTossRaiser: queryParams['pl_office_corporate_tossers'] || '',
        corporateTossRaiser: queryParams['pl_corporate_tossers'] || '',
        startOrderDate: queryParams['pl_order_start_date'] || '',
        endOrderDate: queryParams['pl_order_end_date'] || '',
        startElapsedDate: queryParams['pl_elapsed_start_days'] || '',
        endElapsedDate: queryParams['pl_elapsed_end_days'] || '',
        startTotalOrderAmount: queryParams['pl_total_order_start_amount'] || '',
        endTotalOrderAmount: queryParams['pl_total_order_end_amount'] || '',
        startBillingTotal: queryParams['pl_billing_total_start_amount'] || '',
        endBillingTotal: queryParams['pl_billing_total_end_amount'] || '',
        deadlineDate: queryParams['pl_due_date'] || '',
        progressStatus: queryParams['pl_progress_status'] || '',
        realEstateAppraisal: queryParams['pl_real_estate_appraisal'] || '',
        realEstateSale: queryParams['pl_real_estate_sale'] || '',
        will: queryParams['pl_will'] || '',
        trust: queryParams['pl_trust'] || '',
        insurance: queryParams['pl_insurance'] || '',
        newsletter: queryParams['pl_newsletter'] || '',
        execution: queryParams['pl_execution'] || '',
        startExecutionFee: queryParams['pl_execution_start_amount'] || '',
        endExecutionFee: queryParams['pl_execution_end_amount'] || '',
        willCustody: queryParams['pl_custody_of_will'] || '',
        startTestatorAge: queryParams['pl_age_of_testator_start_date'] || '',
        endTestatorAge: queryParams['pl_age_of_testator_end_date'] || '',
        isExecuted: queryParams['pl_executed'] || '',
        finalTaxReturn: queryParams['pl_tax_return'] || '',
      },
      orderDetails: {
        orderProcedure: queryParams['pl_order_procedure'] || '',
        startDate: queryParams['pl_order_start_date_start'] || '',
        endDate: queryParams['pl_order_start_date_end'] || '',
        startWorkCompletionDate: queryParams['pl_order_work_completion_start_date'] || '',
        endWorkCompletionDate: queryParams['pl_order_work_completion_end_date'] || '',
        startCheckDate: queryParams['pl_order_check_start_date'] || '',
        endCheckDate: queryParams['pl_order_check_end_date'] || '',
        inspector: queryParams['pl_order_inspector'] || '',
        startExpectedBillingDate: queryParams['pl_order_expected_billing_start_date'] || '',
        endExpectedBillingDate: queryParams['pl_order_expected_billing_end_date'] || '',
        startBillingDate: queryParams['pl_order_billing_start_date'] || '',
        endBillingDate: queryParams['pl_order_billing_end_date'] || '',
      },
      amountOfMoneyDropped: {
        startFallenMoonDate: queryParams['pl_amount_fell_start_date'] || '',
        endFallenMoonDate: queryParams['pl_amount_fell_end_date'] || '',
        startAmountOfMoneyDropped: queryParams['pl_amount_fell_start_amount'] || '',
        endAmountOfMoneyDropped: queryParams['pl_amount_fell_end_amount'] || '',
      },
      invoice: {
        startBillingDate: queryParams['pl_invoice_billing_start_date'] || '',
        endBillingDate: queryParams['pl_invoice_billing_end_date'] || '',
        depositStatus: queryParams['pl_invoice_deposit_status'] || '',
      },
      involvementLog: {
        startCompatibleDate: queryParams['pl_worklog_compatible_start_date'] || '',
        endCompatibleDate: queryParams['pl_worklog_compatible_end_date'] || '',
        correspondingPerson: queryParams['pl_worklog_corresponding_person'] || '',
      },
      workLog: {
        startCompatibleDate: queryParams['pl_engagement_compatible_start_date'] || '',
        endCompatibleDate: queryParams['pl_engagement_compatible_end_date'] || '',
        correspondingPerson: queryParams['pl_engagement_corresponding_person'] || '',
      },
      identification: {
        startIdentityVerifyDate: queryParams['pl_identity_contact_start_date'] || '',
        endIdentityVerifyDate: queryParams['pl_identity_contact_end_date'] || '',
        person: queryParams['pl_identity_verify_person'] || '',
      },
      legalAffairsDispatch: {
        startShipmentDate: queryParams['pl_lg_affair_application_start_date'] || '',
        endShipmentDate: queryParams['pl_lg_affair_application_end_date'] || '',
        jurisdictionalLegalAffairsBureau: queryParams['pl_lg_affair_jurisdiction'] || '',
        startExpectedCompletionDate: queryParams['pl_lg_affair_expected_comp_start_date'] || '',
        endExpectedCompletionDate: queryParams['pl_lg_affair_expected_comp_end_date'] || '',
      },
      familyCourtDispatch: {
        startShipmentDate: queryParams['pl_family_court_application_start_date'] || '',
        endShipmentDate: queryParams['pl_family_court_application_end_date'] || '',
        jurisdictionalFamilyCourt: queryParams['pl_family_court_jurisdiction'] || '',
      },
      remarks: queryParams['pl_notes'] || '',
      notes: queryParams['pl_remarks'] || '',
    }
  
    setFormState(updatedFormState as any);
  
  }, [router.isReady, router.query]);
  

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

        <Form onSubmit={handleSubmit} isLoading={isLoading} showTobSubmitBtn={false} registerBtnText={t('advSrchSubmitTxt')} isSubmitFix={true} showConfirmation={false}>
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
                  // label={t("inheritanceEndDate")}
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
                  // label={t("dobEndDate")}
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
              <span></span>
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
            </div>

            <HeadingRow headingTitle={t("projectInformation")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <SelectField
                name="projectInfo.opportunityStatus"
                options={opportunityStatusOpt}
                value={formState.projectInfo.opportunityStatus}
                onChange={handleInputChange}
                label={t("opportunityStatus")}
                placeholder={t("opportunityStatus")}
              />
              {/* <span></span>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}> */}
              <SelectField
                name="projectInfo.projectType"
                options={projectTypesOpt}
                value={formState.projectInfo.projectType}
                onChange={handleInputChange}
                label={t("projectType")}
                placeholder={t("projectType")}
              />

              <SelectField
                name="projectInfo.base"
                options={officesOpt}
                value={formState.projectInfo.base}
                onChange={handleInputChange}
                label={t("office")}
                placeholder={t("office")}
              />

              <SelectField
                name="projectInfo.referralSource"
                options={introducedByOpt}
                value={formState.projectInfo.referralSource}
                onChange={handleInputChange}
                label={t("introduceBy")}
                placeholder={t("introduceBy")}
              />
              <CustomSelectField
                name="projectInfo.taxPerson"
                options={usersTaxOpt}
                value={formState.projectInfo.taxPerson}
                onChange={handleInputChange}
                label={t("taxPerson")}
                placeholder={t("taxPerson")}
              />
              <CustomSelectField
                name="projectInfo.taxWorker"
                options={usersTaxOpt}
                value={formState.projectInfo.taxWorker}
                onChange={handleInputChange}
                label={t("taxWorker")}
                placeholder={t("taxWorker")}
              />
              <SelectField
                name="projectInfo.officeCorporateTossRaiser"
                options={corporateTossOpt}
                value={formState.projectInfo.officeCorporateTossRaiser}
                onChange={handleInputChange}
                label={t("officeOfCorporateTossRaiser")}
                placeholder={t("officeOfCorporateTossRaiser")}
              />

              <InputField
                name="projectInfo.corporateTossRaiser"
                value={formState.projectInfo.corporateTossRaiser}
                onChange={handleInputChange}
                label={t("corporateTossRaiser")}
              />

              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="projectInfo.startOrderDate"
                  value={formState.projectInfo.startOrderDate}
                  onChange={handleInputChange}
                  label={t("orderDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="projectInfo.endOrderDate"
                  value={formState.projectInfo.endOrderDate}
                  onChange={handleInputChange}
                  // label={t("endOrderDate")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startElapsedDate"
                  value={formState.projectInfo.startElapsedDate}
                  onChange={handleInputChange}
                  label={t("elapsedDays")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endElapsedDate"
                  value={formState.projectInfo.endElapsedDate}
                  onChange={handleInputChange}
                  // label={t("endElapsedDate")}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startTotalOrderAmount"
                  value={formState.projectInfo.startTotalOrderAmount}
                  onChange={handleInputChange}
                  label={t("totalOrderAmount")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endTotalOrderAmount"
                  value={formState.projectInfo.endTotalOrderAmount}
                  onChange={handleInputChange}
                  // label={t(".")}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startBillingTotal"
                  value={formState.projectInfo.startBillingTotal}
                  onChange={handleInputChange}
                  label={t("billingTotal")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endBillingTotal"
                  value={formState.projectInfo.endBillingTotal}
                  onChange={handleInputChange}
                  // label={t(".")}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <InputDateField
                name="projectInfo.deadlineDate"
                value={formState.projectInfo.deadlineDate}
                onChange={handleInputChange}
                label={t("termDate")}
              />

              <SelectField
                name="projectInfo.progressStatus"
                options={progressStatusOpt}
                value={formState.projectInfo.progressStatus}
                onChange={handleInputChange}
                label={t("progressStatus")}
                placeholder={t("progressStatus")}
              />

              <ToggleButton
                value={formState.projectInfo.realEstateAppraisal === "1"}
                label={t("realEstateAppraisal")}
                options={{
                  on: `${t("realEstateAppraisal")}`,
                  off: `${t("realEstateAppraisal")}`,
                }}
                getSelectedOption={(isOn) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    projectInfo: {
                      ...prevState.projectInfo,
                      realEstateAppraisal: isOn ? "1" : "0",
                    },
                  }));
                }}
                hideSelectedText={true}
              />

              <SelectField
                name="projectInfo.realEstateSale"
                options={generalOpt}
                value={formState.projectInfo.realEstateSale}
                onChange={handleInputChange}
                label={t("realEstateSale")}
                placeholder={t("realEstateSale")}
              />
              <SelectField
                name="projectInfo.will"
                options={generalOpt}
                value={formState.projectInfo.will}
                onChange={handleInputChange}
                label={t("will")}
                placeholder={t("will")}
              />
              <SelectField
                name="projectInfo.trust"
                value={formState.projectInfo.trust}
                options={generalOpt}
                onChange={handleInputChange}
                label={t("trust")}
                placeholder={t("trust")}
              />
              <SelectField
                name="projectInfo.insurance"
                value={formState.projectInfo.insurance}
                options={generalOpt}
                onChange={handleInputChange}
                label={t("insurance")}
                placeholder={t("insurance")}
              />
              <SelectField
                name="projectInfo.newsletter"
                value={formState.projectInfo.newsletter}
                options={newsLetterOpt}
                onChange={handleInputChange}
                label={t("newsLetter")}
                placeholder={t("newsLetter")}
              />
              <SelectField
                name="projectInfo.execution"
                value={formState.projectInfo.execution}
                options={executionOpt}
                onChange={handleInputChange}
                label={t("implement")}
                placeholder={t("implement")}
              />
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="projectInfo.startExecutionFee"
                  value={formState.projectInfo.startExecutionFee}
                  onChange={handleInputChange}
                  label={t("executionCompensation")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="projectInfo.endExecutionFee"
                  value={formState.projectInfo.endExecutionFee}
                  onChange={handleInputChange}
                  // label={t(".")}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <SelectField
                name="projectInfo.willCustody"
                value={formState.projectInfo.willCustody}
                options={custodyOfWillsOpt}
                onChange={handleInputChange}
                label={t("willCustody")}
                placeholder={t("willCustody")}
              />
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="projectInfo.startTestatorAge"
                  value={formState.projectInfo.startTestatorAge}
                  onChange={handleInputChange}
                  label={t("testatorAge")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="projectInfo.endTestatorAge"
                  value={formState.projectInfo.endTestatorAge}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <ToggleButton
                value={formState.projectInfo.isExecuted === "1"}
                label={t("executed")}
                options={{
                  on: `${t("isExecuted")}`,
                  off: `${t("isExecuted")}`,
                }}
                getSelectedOption={(isOn) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    projectInfo: {
                      ...prevState.projectInfo,
                      isExecuted: isOn ? "1" : "0",
                    },
                  }));
                }}
                hideSelectedText={true}
              />
              <SelectField
                name="projectInfo.finalTaxReturn"
                value={formState.projectInfo.finalTaxReturn}
                options={taxReturnOpt}
                onChange={handleInputChange}
                label={t("finalTaxReturn")}
                placeholder={t("finalTaxReturn")}
              />
            </div>
            <HeadingRow headingTitle={t("orderDetail")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <SelectField
                name="orderDetails.orderProcedure"
                value={formState.orderDetails.orderProcedure}
                options={orderTypeOpt}
                onChange={handleInputChange}
                label={t("orderProcedure")}
                placeholder={t("orderProcedure")}
              />
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="orderDetails.startDate"
                  value={formState.orderDetails.startDate}
                  onChange={handleInputChange}
                  label={t("startingDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="orderDetails.endDate"
                  value={formState.orderDetails.endDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="orderDetails.startWorkCompletionDate"
                  value={formState.orderDetails.startWorkCompletionDate}
                  onChange={handleInputChange}
                  label={t("workCompletionDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="orderDetails.endWorkCompletionDate"
                  value={formState.orderDetails.endWorkCompletionDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="orderDetails.startCheckDate"
                  value={formState.orderDetails.startCheckDate}
                  onChange={handleInputChange}
                  label={t("checkDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="orderDetails.endCheckDate"
                  value={formState.orderDetails.endCheckDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <CustomSelectField
                name="orderDetails.inspector"
                value={formState.orderDetails.inspector}
                options={usersLegalOpt}
                onChange={handleInputChange}
                className="mt-11px"
                label={t("inspector")}
                placeholder={t("inspector")}
              />
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="orderDetails.startExpectedBillingDate"
                  value={formState.orderDetails.startExpectedBillingDate}
                  onChange={handleInputChange}
                  label={t("expectedBilling")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="orderDetails.endExpectedBillingDate"
                  value={formState.orderDetails.endExpectedBillingDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="orderDetails.startBillingDate"
                  value={formState.orderDetails.startBillingDate}
                  onChange={handleInputChange}
                  label={t("billingDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="orderDetails.endBillingDate"
                  value={formState.orderDetails.endBillingDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
            </div>
            <HeadingRow headingTitle={t("amountOfMoneyDropped")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="amountOfMoneyDropped.startFallenMoonDate"
                  value={formState.amountOfMoneyDropped.startFallenMoonDate}
                  onChange={handleInputChange}
                  label={t("fallenMoon")}
                  inputType="month"
                />
                <span className="mt-2">~</span>
                <InputDateField
                  inputType="month"
                  name="amountOfMoneyDropped.endFallenMoonDate"
                  value={formState.amountOfMoneyDropped.endFallenMoonDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>

              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputField
                  name="amountOfMoneyDropped.startAmountOfMoneyDropped"
                  value={
                    formState.amountOfMoneyDropped.startAmountOfMoneyDropped
                  }
                  onChange={handleInputChange}
                  label={t("amountOfMoneyDropped")}
                  type="number"
                />
                <span className="mt-2">~</span>
                <InputField
                  name="amountOfMoneyDropped.endAmountOfMoneyDropped"
                  value={formState.amountOfMoneyDropped.endAmountOfMoneyDropped}
                  onChange={handleInputChange}
                  // label={t(".")}
                  type="number"
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
            </div>
            <HeadingRow headingTitle={t("invoice")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="invoice.startBillingDate"
                  value={formState.invoice.startBillingDate}
                  onChange={handleInputChange}
                  label={t("billingDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="invoice.endBillingDate"
                  value={formState.invoice.endBillingDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <SelectField
                name="invoice.depositStatus"
                options={depositStatusOpt}
                value={formState.invoice.depositStatus}
                onChange={handleInputChange}
                label={t("depositStatus")}
                placeholder={t("depositStatus")}
              />
            </div>

            <HeadingRow headingTitle={t("involvementLog")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="involvementLog.startCompatibleDate"
                  value={formState.involvementLog.startCompatibleDate}
                  onChange={handleInputChange}
                  label={t("compatibleDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="involvementLog.endCompatibleDate"
                  value={formState.involvementLog.endCompatibleDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <SelectField
                name="involvementLog.correspondingPerson"
                options={usersLegalOpt}
                value={formState.involvementLog.correspondingPerson}
                onChange={handleInputChange}
                label={t("correspondingPerson")}
                placeholder={t("correspondingPerson")}
              />
            </div>

            <HeadingRow headingTitle={t("workLog")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="workLog.startCompatibleDate"
                  value={formState.workLog.startCompatibleDate}
                  onChange={handleInputChange}
                  label={t("compatibleDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="workLog.endCompatibleDate"
                  value={formState.workLog.endCompatibleDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <SelectField
                name="workLog.correspondingPerson"
                options={usersLegalOpt}
                value={formState.workLog.correspondingPerson}
                onChange={handleInputChange}
                label={t("correspondingPerson")}
                placeholder={t("correspondingPerson")}
              />
            </div>

            <HeadingRow headingTitle={t("identification")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="identification.startIdentityVerifyDate"
                  value={formState.identification.startIdentityVerifyDate}
                  onChange={handleInputChange}
                  label={t("identityVerifyDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="identification.endIdentityVerifyDate"
                  value={formState.identification.endIdentityVerifyDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <SelectField
                name="identification.person"
                options={identityVerificationOpt}
                value={formState.identification.person}
                onChange={handleInputChange}
                label={t("personInChargeOfIdentityVerify")}
                placeholder={t("personInChargeOfIdentityVerify")}
              />
            </div>

            <HeadingRow headingTitle={t("legalAffairsDispatch")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="legalAffairsDispatch.startShipmentDate"
                  value={formState.legalAffairsDispatch.startShipmentDate}
                  onChange={handleInputChange}
                  label={t("shipmentDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="legalAffairsDispatch.endShipmentDate"
                  value={formState.legalAffairsDispatch.endShipmentDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <InputField
                name="legalAffairsDispatch.jurisdictionalLegalAffairsBureau"
                value={
                  formState.legalAffairsDispatch
                    .jurisdictionalLegalAffairsBureau
                }
                onChange={handleInputChange}
                label={t("jurisdictionalLegalAffairsBureau")}
                placeholder={t("jurisdictionalLegalAffairsBureau")}
              />
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="legalAffairsDispatch.startExpectedCompletionDate"
                  value={
                    formState.legalAffairsDispatch.startExpectedCompletionDate
                  }
                  onChange={handleInputChange}
                  label={t("expectedCompletion")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="legalAffairsDispatch.endExpectedCompletionDate"
                  value={
                    formState.legalAffairsDispatch.endExpectedCompletionDate
                  }
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
            </div>

            <HeadingRow headingTitle={t("familyCourtDispatch")}></HeadingRow>
            <div className={AdvanceSrchStyle.advanceSearchFieldsWrapper}>
              <div className={AdvanceSrchStyle.startEndDateFieldsWrapper}>
                <InputDateField
                  name="familyCourtDispatch.startShipmentDate"
                  value={formState.familyCourtDispatch.startShipmentDate}
                  onChange={handleInputChange}
                  label={t("shipmentDate")}
                />
                <span className="mt-2">~</span>
                <InputDateField
                  name="familyCourtDispatch.endShipmentDate"
                  value={formState.familyCourtDispatch.endShipmentDate}
                  onChange={handleInputChange}
                  // label={t(".")}
                  className={AdvanceSrchStyle.searchField}
                />
              </div>
              <InputField
                name="familyCourtDispatch.jurisdictionalFamilyCourt"
                value={formState.familyCourtDispatch.jurisdictionalFamilyCourt}
                onChange={handleInputChange}
                label={t("jurisdictionalFamilyCourt")}
                placeholder={t("jurisdictionalFamilyCourt")}
              />
            </div>

            <HeadingRow headingTitle={t("remarks")}></HeadingRow>
            <div className="p-2">
              <TextAreaField
                name="remarks"
                cols={10}
                rows={2}
                value={formState.remarks}
                onChange={handleInputChange}
                label={t("remarks")}
              />
            </div>
            <HeadingRow headingTitle={t("notes")}></HeadingRow>
            <div className="p-2">
              <TextAreaField
                name="notes"
                cols={10}
                rows={2}
                value={formState.notes}
                onChange={handleInputChange}
                label={t("notes")}
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LegalAdvanceSearchModal;
