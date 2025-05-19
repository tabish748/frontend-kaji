import React, { useEffect, useState } from "react";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import InputDateField from "@/components/input-date/input-date";
import CustomSelectField from "@/components/custom-select/custom-select";
import SelectField from "@/components/select-field/select-field";
import InputField from "@/components/input-field/input-field";
import { useLanguage } from "@/localization/LocalContext";
import Style from "@/styles/pages/employees.module.scss";
import InusranceStyle from "@/styles/pages/insurance.module.scss";
import ProjectStyle from "@/styles/pages/project-confirmed.module.scss";
import InquiryStyle from "@/styles/pages/inquiry.module.scss";
import LegalStyle from "@/styles/pages/project-legal.module.scss";
import { fetchProjectConfirmed } from "@/app/features/project/projectConfirmedListingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { useRouter } from "next/router";
import { fetchProjectLegalListing } from "@/app/features/projectLegal/projectLegalListingSlice";

const LegalSearchFilters: React.FC<any> = ({
    setIsReset,
    setFinalSortState,
    pageNumber,
    handleSearch,
    handleFormReset,
    sortParamState,
    insuranceLoading,
    projectType,
    setProjectType,
    interviewMc,
    setInterviewMc,
    worker1,
    setWorker1,
    users,
    keyword,
    setKeyword,
    setManualChange,
    setRecordLimit,
    alphabets,
    setAlphabets,
    proposalNumber,
    setProposalNumber,
    decedentName,
    setDecedentName,
    heirName,
    setHeirName,
    office,
    setOffice,
    opportunityStatus,
    setOpportunityStatus,
    progressStatus,
    setProgressStatus,
    financialOfficer,
    setFinancialOfficer,
    projectTypesOpt,
    officesOpt,
    opportunityStatusOpt,
    progressStatusOpt,
    proposalNumberChar,
    existingFilters,
    setSortDirection,
    setSortColumn
}) => {
    const { t } = useLanguage();
    const router = useRouter();
    const [sortAsc, setSortAsc] = useState(router.query.sort_asc || '');
    const [sortDesc, setSortDesc] = useState(router.query.sort_desc || '');
    const [lastQueryState, setLastQueryState] = useState({}); // Store last known query state
    const fields = [
        {
            type: "input" as FieldType,
            label: t("検索条件"),
            placeholder: t("統一番号、親族コード、個人コードを入力してください"),
            value: keyword,
            onChange: (e: any) => setKeyword(e.target.value),
            className: `${LegalStyle.searchInput} w-100`,
        },
    ];

    const dispatch = useDispatch<AppDispatch>();

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setManualChange(true);
        setter(e.target.value);
        setIsReset(false);
    };

    const handleCustomChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: string) => {
        setManualChange(true);
        setter(value);
    };

  

    useEffect(() => {
        if (!router.isReady) return;
      
        const queryParams = router.query;
        let sortParams = {};
        console.log('queryParams8.sort_asc', queryParams.sort_asc)

        // Create URLSearchParams instance
        let currentParams = new URLSearchParams(window.location.search);

        // Remove both sort parameters first
        currentParams.delete('sort_asc');
        currentParams.delete('sort_desc');

        if (queryParams.sort_asc) {
            setSortDirection('asc')
            setSortColumn(queryParams.sort_asc as any)
            sortParams = { sort_asc: queryParams.sort_asc };
            setSortAsc(queryParams.sort_asc as string);
            setSortDesc('');
            
            // Add only sort_asc parameter
            currentParams.set('sort_asc', queryParams.sort_asc as string);
        } else if (queryParams.sort_desc) {
            setSortDirection('desc')
            setSortColumn(queryParams.sort_desc as any)
            sortParams = { sort_desc: queryParams.sort_desc };
            setSortAsc('');
            setSortDesc(queryParams.sort_desc as string);
            
            // Add only sort_desc parameter
            currentParams.set('sort_desc', queryParams.sort_desc as string);
        }
        const staticFields = {
          search_keyword: queryParams.search_keyword || '',
          proposal_number_char: queryParams.proposal_number_char || '',
          proposal_number: queryParams.proposal_number || '',
          decedent_name: queryParams.decedent_name || '',
          opportunity_status: queryParams.opportunity_status || '',
          interviewer_id: queryParams.interviewer_id || '',
          worker_id: queryParams.worker_id || '',
          office_id: queryParams.office_id || '',
          financial_officer_id: queryParams.financial_officer_id || '',
          project_category: queryParams.project_category || '',
          progress_status: queryParams.progress_status || '', 
          heir_name: queryParams.heir_name || '', 
          active_tab: queryParams.active_tab || existingFilters?.active_tab, 
          limit: queryParams.limit ||  existingFilters?.limit, 
          page: queryParams.page ||  existingFilters?.page, 
          ...sortParams,
        //   page: pageNumber
        };
      
        const keyMap = {
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
          
          const updatedFormState: any = {};  // Object to store dynamic fields
    
          Object.entries(keyMap).forEach(([stateKey, queryKey]) => {
            if (queryParams[queryKey]) {
              updatedFormState[queryKey] = queryParams[queryKey];
            }
          });
          
       
        const finalState = {
          ...updatedFormState,
          ...existingFilters,
          ...staticFields,  // Add the static fields
        };
        const hasDynamicFields = Object.values(updatedFormState).some(
            value => typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined
          );
      
        const {
            search_keyword,
            proposal_number_char,
            proposal_number,
            decedent_name,
            opportunity_status,
            project_category,
            interviewer_id,
            worker_id,
            office_id,
            financial_officer_id,
            progress_status,
            heir_name,
            active_tab,
            limit
          } = staticFields;
        
          if (search_keyword) handleCustomChange(setKeyword, search_keyword as string);
            if (proposal_number_char) handleCustomChange(setAlphabets, proposal_number_char as string);
            if (proposal_number) handleCustomChange(setProposalNumber, proposal_number as string);
            if (decedent_name) handleCustomChange(setDecedentName, decedent_name as string);
            if (opportunity_status) handleCustomChange(setOpportunityStatus, opportunity_status as string);
            if (project_category) handleCustomChange(setProjectType, project_category as string);
            if (interviewer_id) handleCustomChange(setInterviewMc, interviewer_id as string);
            if (worker_id) handleCustomChange(setWorker1, worker_id as string);
            if (office_id) handleCustomChange(setOffice, office_id as string);
            if (financial_officer_id) handleCustomChange(setFinancialOfficer, financial_officer_id as string);
            if (progress_status) handleCustomChange(setProgressStatus, progress_status as string);
            if (heir_name) handleCustomChange(setHeirName, heir_name as string);
            if (limit) handleCustomChange(setRecordLimit, limit as string);
    
          if (
            search_keyword ||
            proposal_number ||
            proposal_number_char ||
            decedent_name ||
            opportunity_status ||
            project_category ||
            interviewer_id ||
            worker_id ||
            office_id ||
            financial_officer_id || 
            progress_status ||
            heir_name ||
            limit || limit == '' ||
            active_tab ||
            hasDynamicFields
          ) {
            setFinalSortState(finalState);
            dispatch(fetchProjectLegalListing(finalState));
          }
          
      }, [router.query]);
      
    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSearch}
            parentClassName={`${InusranceStyle.insuranceFieldsWrapper} ${LegalStyle.projectFieldsWrapperFilter}`}
            buttonClassName={Style.filterSubmitBtn}
            ResetBtnClassName={Style.filterResetBtn}
            isLoading={insuranceLoading}
            showResetButton={true}
            showResetLabel="reset"
            onReset={handleFormReset}
            submitButtonLabel={`${t("search")}`}
        >
            <div className={LegalStyle.proposalNumberWrapper}>
                <SelectField
                    name="alphabets"
                    label={t("proposalNumber")}
                    value={alphabets}
                    options={proposalNumberChar}
                    placeholder={t("proposalNumber")}
                    onChange={handleInputChange(setAlphabets)}
                />
                <InputField
                    name="proposalNumber"
                    value={proposalNumber}
                    placeholder={t("proposalNumber")}
                    onChange={handleInputChange(setProposalNumber)}
                    className={LegalStyle.proposalNumberField}
                />
            </div>
            <InputField
                name="decedentName"
                value={decedentName}
                label={t("decedentName")}
                placeholder={t("decedentName")}
                onChange={handleInputChange(setDecedentName)}
            />
            <InputField
                name="heirName"
                value={heirName}
                label={t("heirName")}
                placeholder={t("heirName")}
                onChange={handleInputChange(setHeirName)}
            />
            <CustomSelectField
                name="interviewMc"
                label={t("interviewMc")}
                value={interviewMc}
                options={users}
                placeholder={t("interviewMc")}
                onChange={handleInputChange(setInterviewMc)}
                className={LegalStyle.selectField}
            />
            <SelectField
                name="projectType"
                label={t("projectType")}
                value={projectType}
                options={projectTypesOpt}
                placeholder={t("projectType")}
                onChange={handleInputChange(setProjectType)}
            />
            <CustomSelectField
                name="worker1"
                label={t("worker1")}
                value={worker1}
                options={users}
                placeholder={t("worker1")}
                onChange={handleInputChange(setWorker1)}
                className={LegalStyle.selectField}
            />
            <SelectField
                name="office"
                label={t("office")}
                value={office}
                options={officesOpt}
                placeholder={t("office")}
                onChange={handleInputChange(setOffice)}
            />
            <SelectField
                name="opportunityStatus"
                label={t("opportunityStatus")}
                value={opportunityStatus}
                options={opportunityStatusOpt}
                placeholder={t("opportunityStatus")}
                onChange={handleInputChange(setOpportunityStatus)}
            />
            <SelectField
                name="progressStatus"
                label={t("progressStatus")}
                value={progressStatus}
                options={progressStatusOpt}
                placeholder={t("progressStatus")}
                onChange={handleInputChange(setProgressStatus)}
            />
            <CustomSelectField
                name="financialOfficer"
                label={t("financialOfficer")}
                value={financialOfficer}
                options={users}
                placeholder={t("financialOfficer")}
                onChange={handleInputChange(setFinancialOfficer)}
                className={LegalStyle.selectField}
            />
        </GenericForm>
    );
};

export default LegalSearchFilters;
