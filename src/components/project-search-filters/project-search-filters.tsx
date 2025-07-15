// import React, { useEffect, useState } from "react";
// import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
// import InputDateField from "@/components/input-date/input-date";
// import CustomSelectField from "@/components/custom-select/custom-select";
// import { useLanguage } from "../../localization/LocalContext";
// import Style from "../../styles/pages/employees.module.scss";
// import InusranceStyle from "../../styles/pages/insurance.module.scss";
// import ProjectStyle from "@/styles/pages/project-confirmed.module.scss";
// import InquiryStyle from "@/styles/pages/inquiry.module.scss";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/app/store";
// import { useRouter } from "next/router";
// import SelectField from "../select-field/select-field";

// const SearchFilters: React.FC<any> = ({
//   setIsReset,
//   setFinalSortState,
//   sortParamState,
//   sortColumn,
//   handleSearch,
//   handleFormReset,
//   insuranceLoading,
//   taxOfficeShippingStartDate,
//   setTaxOfficeShippingStartDate,
//   taxOfficeShippingEndDate,
//   setTaxOfficeShippingEndDate,
//   valid,
//   setValid,
//   projectType,
//   setProjectType,
//   interviewMc,
//   setInterviewMc,
//   manager,
//   setManager,
//   worker,
//   setWorker,
//   introducedBy,
//   setIntroducedBy,
//   projectCategories,
//   users,
//   introducedByOpt,
//   situationValidOptions,
//   keyword,
//   setKeyword,
//   setManualChange,
//   setRecordLimit,
//   setPageNum,
//   existingFilters,
//   setSortDirection,
//   setSortColumn,
//   // isFirstLoad
// }) => {
//   const { t } = useLanguage();
//   const router = useRouter();
//   const [sortAsc, setSortAsc] = useState(router.query.sort_asc || '');
//   const [sortDesc, setSortDesc] = useState(router.query.sort_desc || '');
//   const [lastQueryState, setLastQueryState] = useState({}); // Store last known query state

//   console.log('sortColumn', sortColumn)
//   const fields = [
//     {
//       type: "input" as FieldType,
//       label: t("nameToSearchCondition"),
//       placeholder: t("uniformNoCustCodeHeirName"),
//       value: keyword,
//       onChange: (e: any) => { setManualChange(true); setKeyword(e.target.value) },
//       className: `${Style.searchInput} w-100 mt-11`,
//       labelClassName: 'mt-11px'
//     },
//   ];

//   const dispatch = useDispatch<AppDispatch>();

//   const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setManualChange(true);
//     setter(e.target.value);
//     setIsReset(false);
//   };
//   const handleCustomChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: string) => {

//     setManualChange(true);
//     setter(value);
//   };



//   useEffect(() => {
//     console.log('router.query', router.query, Object.keys(router.query).length)
//     if (!router.isReady || Object.keys(router.query).length === 0) return;

//     const queryParams = router.query;
//     console.log('queryParams', queryParams)
//     const currentTab = queryParams.active_tab || 1;

//     // Extract sort parameters from query
//     let sortParams = {};
//     console.log('queryParams8.sort_asc', queryParams.sort_asc)

//     // Remove both sort parameters first
//     let currentParams = new URLSearchParams(window.location.search);

//     currentParams.delete('sort_asc');
//     currentParams.delete('sort_desc');

//     if (queryParams.sort_asc) {
//       setSortDirection('asc')
//       setSortColumn(queryParams.sort_asc as any)
//       sortParams = { sort_asc: queryParams.sort_asc };
//       setSortAsc(queryParams.sort_asc as string);
//       setSortDesc('');
      
//       // Add only sort_asc parameter
//       currentParams.set('sort_asc', queryParams.sort_asc as string);
//     } else if (queryParams.sort_desc) {
//       setSortDirection('desc')
//       setSortColumn(queryParams.sort_desc as any)
//       sortParams = { sort_desc: queryParams.sort_desc };
//       setSortAsc('');
//       setSortDesc(queryParams.sort_desc as string);
      
//       // Add only sort_desc parameter
//       currentParams.set('sort_desc', queryParams.sort_desc as string);
//     }

//     // Handle static fields with sort params
//     const staticFields = {
//       search_keyword: queryParams.search_keyword || '',
//       taxOffice_shipping_start_date: queryParams.taxOffice_shipping_start_date || '',
//       taxOffice_shipping_end_date: queryParams.taxOffice_shipping_end_date || '',
//       taxoffice_shipping_date_exists: queryParams.taxoffice_shipping_date_exists || '',
//       valid: queryParams.valid || '',
//       project_category: queryParams.project_category || '',
//       interviewer1_id: queryParams.interviewer1_id || '',
//       manager_id: queryParams.manager_id || '',
//       worker1_id: queryParams.worker1_id || '',
//       introduced_by: queryParams.introduced_by || '',
//       active_tab: queryParams.active_tab || '',
//       limit: queryParams.limit || existingFilters?.limit,
//       page: queryParams.page || '1',
//       ...sortParams  // Include sort parameters here
//     };

//     console.log('staticfields', staticFields);


//     const keyMap = {
//       // Customer Information
//       "customerInformation.inheritanceStartDate": "p_inheritance_start_date",
//       "customerInformation.inheritanceEndDate": "p_inheritance_end_date",
//       "customerInformation.dobStartDate": "cust_dob_start_date",
//       "customerInformation.dobEndDate": "cust_dob_end_date",
//       "customerInformation.customerAddress": "cust_address",
//       "customerInformation.filingTaxOffice": "p_filing_tax_office",

//       // Heir Information
//       "heirInfo.isRepresentative": "p_heir_representative",
//       "heirInfo.relationship": "p_heir_relation",
//       "heirInfo.phoneNumber": "p_heir_telephone",
//       "heirInfo.email": "p_heir_email",
//       "heirInfo.postCode": "p_heir_zipcode",
//       "heirInfo.prefectures": "p_heir_prefecture",
//       "heirInfo.address": "p_heir_address",
//       "heirInfo.legalInheritance": "p_heir_legal_inherit",
//       "heirInfo.taxPayment": "p_heir_tax_payment",

//       // Project Information
//       "projectInfo.worker1Branch": "p_worker_office",
//       "projectInfo.orderStartDate": "p_order_start_date",
//       "projectInfo.orderEndDate": "p_order_end_date",
//       "projectInfo.elapsedStartDate": "p_elapsed_start_days",
//       "projectInfo.elapsedEndDate": "p_elapsed_end_days",
//       "projectInfo.dueStartDate": "p_due_start_date",
//       "projectInfo.dueEndDate": "p_due_end_date",
//       "projectInfo.startNumberOfDaysForFiling": "p_filing_start_days",
//       "projectInfo.endNumberOfDaysForFiling": "p_filing_end_days",
//       "projectInfo.statusNumberOfDaysForFiling": "p_filing_days_status",

//       "projectInfo.estSubmissionStartMonth": "p_submission_month_start_date",
//       "projectInfo.estSubmissionEndMonth": "p_submission_month_end_date",
//       "projectInfo.semiConfirmTaxStartDeadline": "p_submission_tax_return_due_start_date",
//       "projectInfo.semiConfirmTaxEndDeadline": "p_submission_tax_return_due_end_date",
//       "projectInfo.semiDaysStartRemaining": "p_semi_certain_start_days",
//       "projectInfo.semiDaysEndRemaining": "p_semi_certain_end_days",
//       "projectInfo.statusSemiDaysEndRemaining": "p_semi_certain_end_days_status",
//       "projectInfo.blueApplicationForm": "p_blue_app_form",
//       "projectInfo.consumptionTax": "p_sales_tax",
//       "projectInfo.check1": "p_checker1_id",
//       "projectInfo.check2": "p_checker2_id",
//       "projectInfo.check3": "p_checker3_id",
//       "projectInfo.final1": "p_final1_id",
//       "projectInfo.final2": "p_final2_id",
//       "projectInfo.startContractAmount": "p_start_contract_amount",
//       "projectInfo.endContractAmount": "p_end_contract_amount",
//       "projectInfo.startDepositAmount": "p_start_deposit_amount",
//       "projectInfo.endDepositAmount": "p_end_deposit_amount",
//       "projectInfo.startRemainingAmount": "p_start_balance_amount",
//       "projectInfo.endRemainingAmount": "p_end_balance_amount",
//       "projectInfo.startBillingTotal": "p_start_total_amount",
//       "projectInfo.endBillingTotal": "p_end_total_amount",
//       "projectInfo.unDivided": "p_undivided",
//       "projectInfo.startDueDateWithin3Year": "p_start_due_date_after_3_years",
//       "projectInfo.endDueDateWithin3Year": "p_end_due_date_after_3_years",
//       "projectInfo.startNoDaysRemDue3Years": "p_start_due_days_after_3_years",
//       "projectInfo.endNoDaysRemDue3Years": "p_end_due_days_after_3_years",
//       "projectInfo.realEstateSale": "p_real_estate_sale",
//       "projectInfo.secondaryMeasures": "p_secondary_measures",
//       "projectInfo.realEstateReg": "p_real_estate_reg",
//       "projectInfo.end": "p_finish",
//       "projectInfo.workStatus": "p_work_remarks",

//       // Work Log
//       "workLog.startWorkingDate": "p_worklog_response_start_date",
//       "workLog.endWorkingDate": "p_worklog_response_end_date",
//       "workLog.workCategory": "p_worklog_category",
//       "workLog.content": "p_worklog_content",
//       "workLog.worker": "p_worklog_worker",

//       // Involvement Record
//       "involvementRecord.startCompatibleDate": "p_engagement_response_start_date",
//       "involvementRecord.endCompatibleDate": "p_engagement_response_end_date",
//       "involvementRecord.howToRespond": "p_engagement_content",
//       "involvementRecord.worker": "p_engagement_worker",

//       // Progress
//       "progress.startContractIssueDate": "prgrs_contract_issue_start_date",
//       "progress.endContractIssueDate": "prgrs_contract_issue_end_date",
//       "progress.statusContractIssue": "prgrs_contract_issue_date_exists",
//       "progress.startDepositBillingDate": "prgrs_deposit_billing_start_date",
//       "progress.endDepositBillingDate": "prgrs_deposit_billing_end_date",
//       "progress.statusDepositBilling": "prgrs_deposit_billing_date_exists",
//       "progress.startDepositDate": "prgrs_payment_start_date",
//       "progress.endDepositDate": "prgrs_payment_end_date",
//       "progress.statusDeposit": "prgrs_payment_date_exists",
//       "progress.startReceiptOfMaterialDate": "prgrs_doc_recv_start_date",
//       "progress.endReceiptOfMaterialDate": "prgrs_doc_recv_end_date",
//       "progress.statusReceiptOfMaterial": "prgrs_doc_recv_date_exists",
//       "progress.startScDeficiencyCheckDate": "prgrs_sc_insufficient_start_date",
//       "progress.endScDeficiencyCheckDate": "prgrs_sc_insufficient_end_date",
//       "progress.statusScDeficiencyCheck": "prgrs_sc_insufficient_date_exists",
//       "progress.startIntermediateReportDate": "prgrs_interim_report_start_date",
//       "progress.endIntermediateReportDate": "prgrs_interim_report_end_date",
//       "progress.statusIntermediateReport": "prgrs_interim_report_date_exists",
//       "progress.startCPVerifyDate": "prgrs_cp_verification_start_date",
//       "progress.endCPVerifyDate": "prgrs_cp_verification_end_date",
//       "progress.statusCPVerifyDate": "prgrs_cp_verification_date_exists",
//       "progress.startCalcSubmitDate": "prgrs_verify_1st_submit_start_date",
//       "progress.endCalcSubmitDate": "prgrs_verify_1st_submit_end_date",
//       "progress.statusCalcSubmit": "prgrs_verify_1st_submit_date_exists",
//       "progress.startCountingDaysOneGoDate": "prgrs_verify_1st_comp_start_date",
//       "progress.endCountingDaysOneGoDate": "prgrs_verify_1st_comp_end_date",
//       "progress.statusCountingDaysOneGo": "prgrs_verify_1st_comp_date_exists",
//       "progress.startSecondaryCalcSubmitDate": "prgrs_verify_2nd_submit_start_date",
//       "progress.endSecondaryCalcSubmitDate": "prgrs_verify_2nd_submit_end_date",
//       "progress.statusSecondaryCalcSubmit": "prgrs_verify_2nd_submit_date_exists",
//       "progress.startCalcAfterSecondDate": "prgrs_verify_2nd_comp_start_date",
//       "progress.endCalcAfterSecondDate": "prgrs_verify_2nd_comp_end_date",
//       "progress.statusCalcAfterSecond": "prgrs_verify_2nd_comp_date_exists",
//       "progress.startThirdVerificationSubmitDate": "prgrs_verify_3rd_submit_start_date",
//       "progress.endThirdVerificationSubmitDate": "prgrs_verify_3rd_submit_end_date",
//       "progress.statusThirdVerificationSubmitDate": "prgrs_verify_3rd_submit_date_exists",
//       "progress.startAfterCountThreeDate": "prgrs_verify_3rd_comp_start_date",
//       "progress.endAfterCountThreeDate": "prgrs_verify_3rd_comp_end_date",
//       "progress.statusAfterCountThree": "prgrs_verify_3rd_comp_date_exists",
//       "progress.startFinalCheck1Date": "prgrs_final_check_1st_comp_start_date",
//       "progress.endFinalCheck1Date": "prgrs_final_check_1st_comp_end_date",
//       "progress.statusFinalCheck1": "prgrs_final_check_1st_comp_date_exists",
//       "progress.startFinalCheck2Date": "prgrs_final_check_2nd_comp_start_date",
//       "progress.endFinalCheck2Date": "prgrs_final_check_2nd_comp_end_date",
//       "progress.statusFinalCheck2": "prgrs_final_check_2nd_comp_date_exists",
//       "progress.startSealDate": "prgrs_stamp_start_date",
//       "progress.endSealDate": "prgrs_stamp_end_date",
//       "progress.statusSealDate": "prgrs_stamp_date_exists",
//       "progress.startBalanceBillingDate": "prgrs_balance_billing_start_date",
//       "progress.endBalanceBillingDate": "prgrs_balance_billing_end_date",
//       "progress.statusBalanceBilling": "prgrs_balance_billing_date_exists",
//       "progress.startRemBalanceDate": "prgrs_balance_deposit_start_date",
//       "progress.endRemBalanceDate": "prgrs_balance_deposit_end_date",
//       "progress.statusRemBalanceDate": "prgrs_balance_deposit_date_exists",
//       "progress.startTaxOfficeShippingDate": "prgrs_taxoffice_shipping_start_date",
//       "progress.endTaxOfficeShippingDate": "prgrs_taxoffice_shipping_end_date",
//       "progress.statusTaxOfficeShippingDate": "prgrs_taxoffice_shipping_date_exists",
//       "progress.startBusinessProcessBookDate": "prgrs_work_process_book_start_date",
//       "progress.endBusinessProcessBookDate": "prgrs_work_process_book_end_date",
//       "progress.statusBusinessProcessBookDate": "prgrs_work_process_book_date_exists",
//       "progress.startReceiptTaxReturnCopyDate": "prgrs_receipt_declaration_start_date",
//       "progress.endReceiptTaxReturnCopyDate": "prgrs_receipt_declaration_end_date",
//       "progress.statusReceiptTaxReturnCopyDate": "prgrs_receipt_declaration_date_exists",
//       "progress.startReturnDate": "prgrs_return_start_date",
//       "progress.endReturnDate": "prgrs_return_end_date",
//       "progress.statusReturnDate": "prgrs_return_date_exists",

//       // Remarks
//       "remarks": "p_remarks",

//       // Add other mappings as needed...
//     };


//     const updatedFormState: any = {};  // Object to store dynamic fields

//     Object.entries(keyMap).forEach(([stateKey, queryKey]) => {
//       if (queryParams[queryKey]) {
//         updatedFormState[queryKey] = queryParams[queryKey];
//       }
//     });


//     const finalState = {
//       ...updatedFormState,
//       ...existingFilters,
//       ...staticFields,  // Add the static fields
//     };
//     const hasDynamicFields = Object.values(updatedFormState).some(
//       value => typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined
//     );


//     //   const tabFinalState = { ...finalState, active_tab };
//     console.log('updatedFormState', updatedFormState)
//     console.log('existingFilters', existingFilters)

//     const {
//       search_keyword,
//       taxOffice_shipping_start_date,
//       taxOffice_shipping_end_date,
//       taxoffice_shipping_date_exists,
//       valid,
//       project_category,
//       interviewer1_id,
//       manager_id,
//       worker1_id,
//       introduced_by,
//       limit,
//       // page,
//       // sort_asc,
//       // sort_desc
//     } = staticFields;

//     console.log('project_category', project_category)
//     if (search_keyword){ handleCustomChange(setKeyword, search_keyword as string)} else setKeyword('');
//     if (taxOffice_shipping_start_date){ handleCustomChange(setTaxOfficeShippingStartDate, taxOffice_shipping_start_date as string)} else setTaxOfficeShippingStartDate('');
//     if (taxOffice_shipping_end_date){ handleCustomChange(setTaxOfficeShippingEndDate, taxOffice_shipping_end_date as string)} else setTaxOfficeShippingEndDate('');
//     if (taxoffice_shipping_date_exists){ handleCustomChange(setValid, taxoffice_shipping_date_exists as string)} else setValid('');
//     if (project_category || project_category == '') { console.log('eyeess'); handleCustomChange(setProjectType, project_category as string); } else setProjectType('');
//     if (interviewer1_id) handleCustomChange(setInterviewMc, interviewer1_id as string); else setInterviewMc('');
//     if (manager_id) handleCustomChange(setManager, manager_id as string); else setManager('');
//     if (worker1_id) handleCustomChange(setWorker, worker1_id as string); else setWorker('');
//     if (introduced_by) handleCustomChange(setIntroducedBy, introduced_by as string); else setIntroducedBy('');
//     // if (sort_asc) handleCustomChange(setIntroducedBy, introduced_by as string);
//     if (limit) handleCustomChange(setRecordLimit, limit as string);
//     // if (page) handleCustomChange(setPageNum, page as string);

//     if (
//       // sort_asc || 
//       // sort_desc || l
//       search_keyword || search_keyword == '' ||
//       limit || limit == '' ||
//       // page || page == '' ||
//       taxOffice_shipping_start_date || taxOffice_shipping_start_date == '' ||
//       taxOffice_shipping_end_date || taxOffice_shipping_end_date == '' ||
//       taxoffice_shipping_date_exists || taxoffice_shipping_date_exists == '' ||
//       valid || valid == '' ||
//       project_category || project_category == '' ||
//       interviewer1_id || interviewer1_id == '' ||
//       manager_id || manager_id == '' ||
//       worker1_id || worker1_id == '' ||
//       introduced_by || introduced_by == '' ||
//       hasDynamicFields
//     ) {
//       console.log('finalState', finalState)
//       setFinalSortState(finalState)
//       // if(currentTab == finalState.active_tab)
//       // dispatch(fetchProjectConfirmed(finalState));
//       const hasQueryChanged = JSON.stringify(finalState) !== JSON.stringify(lastQueryState);

//       // if (hasQueryChanged) {
//       //   setLastQueryState(finalState);
//       //   if (currentTab == queryParams.active_tab) {
//       //     dispatch(fetchProjectConfirmed(finalState)); // Your API dispatch
//       //   }
//       // }
//     }

//   }, [router.query]);

//   return (
//     <GenericForm
//       fields={fields}
//       onSubmit={handleSearch}
//       parentClassName={`${InusranceStyle.insuranceFieldsWrapper} ${ProjectStyle.projectFieldsWrapperFilter} pt-2  mb-2`}
//       buttonClassName={`${Style.filterSubmitBtn}`}
//       ResetBtnClassName={Style.filterResetBtn}
//       isLoading={insuranceLoading}
//       showResetButton={true}
//       showResetLabel="reset"
//       onReset={handleFormReset}
//       submitButtonLabel={t("search")}
//     >
//       <div className="d-flex gap-half align-items-center mt-11">
//         <InputDateField
//           name="taxOfficeShippingStartDate"
//           value={taxOfficeShippingStartDate}
//           label={t("taxOfficeShipping")}
//           placeholder={t("円")}
//           onChange={handleInputChange(setTaxOfficeShippingStartDate)}
//           className={InquiryStyle.customerAssetsAmount}
//         />
//         <span className="mt-2">~</span>
//         <InputDateField
//           name="taxOfficeShippingEndDate"
//           value={taxOfficeShippingEndDate}
//           onChange={handleInputChange(setTaxOfficeShippingEndDate)}
//           placeholder={t("円")}
//           className={`${ProjectStyle.dateSection}`}
//         />
//         <CustomSelectField
//           options={situationValidOptions} // Ensure this is defined somewhere or passed as a prop
//           value={valid}
//           name="valid"
//           onChange={handleInputChange(setValid)}
//           className={`${Style.insuranceDropdownSelect} mt-2 w-100`}
//         />
//       </div>

//       <div style={{marginTop: '-8px'}}>
//       <SelectField
//         label={t("projectType")}
//         options={projectCategories}
//         value={projectType}
//         placeholder={t("projectType")}
//         name="projectType"
//         //   onChange={(e) => setProjectType(e.target.value)}
//         onChange={handleInputChange(setProjectType)}
//         className={`w-100 mb-1`}
        
//       />
//       </div>
//       <div className="d-flex gap-1">
//         <CustomSelectField
//           label={t("interviewMc")}
//           options={users}
//           value={interviewMc}
//           name="interviewMc"
//           //   onChange={(e) => setInterviewMc(e.target.value)}
//           onChange={handleInputChange(setInterviewMc)}
//           className={`${ProjectStyle.projectDropdown} w-100`}
//         />
//         <CustomSelectField
//           label={t("manager")}
//           options={users}
//           value={manager}
//           name="manager"
//           //   onChange={(e) => setManager(e.target.value)}
//           onChange={handleInputChange(setManager)}
//           className={`${ProjectStyle.projectDropdown} w-100`}
//         />
//       </div>
//       <CustomSelectField
//         label={t("worker")}
//         options={users}
//         value={worker}
//         name="worker"
//         //   onChange={(e) => setWorker(e.target.value)}
//         onChange={handleInputChange(setWorker)}
//         className={`${ProjectStyle.projectDropdown} w-100`}
//       />
//       <CustomSelectField
//         label={t("introduceBy")}
//         options={introducedByOpt}
//         value={introducedBy}
//         name="introducedBy"
//         //   onChange={(e) => setIntroducedBy(e.target.value)}
//         onChange={handleInputChange(setIntroducedBy)}
//         className={`${ProjectStyle.projectDropdown} w-100`}
//       />

//     </GenericForm>
//   );
// };

// export default SearchFilters;
