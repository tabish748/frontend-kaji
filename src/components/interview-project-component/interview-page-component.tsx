import React, { useState, useEffect } from "react";
import InputField from "../input-field/input-field";
import SelectField from "../select-field/select-field";
import Button from "../button/button";
import Style from "../../styles/pages/insurance.module.scss";
import CheckboxField from "../checkbox-field/checkbox-field";
import { useLanguage } from "@/localization/LocalContext";
import CustomSelectField from "../custom-select/custom-select";
import { questionAirOptions } from "@/libs/optionsHandling";
import InputDateField from "../input-date/input-date";
import ToggleButton from "../toggle-button/toggle-button";

interface Props {
  proposalDate?: string;
  attendees?: string;
  insuranceType?: string;
  insuranceAmount?: string;
  commission?: string;
  resultType?: string;
  contractDate?: string;
  nextTime?: string;
  workCategory?: string;
  questionaire?: string;
  established?: number | string;
  onDataChange?: (data: any) => void;
  onRemove?: () => void;
  insuranceTypeOptions?: any;
  insuranceTypeResultOptions?: any;
  workCategoriesOptions?: any;
  attendeesOptions?: any;
  isFirstForm?: boolean;
}

const RequestForm: React.FC<Props> = ({
  proposalDate: initialProposalDate = new Date().toISOString().split("T")[0],
  attendees: initialAttendees = "",
  insuranceType: initialInsuranceType = "",
  insuranceAmount: initialInsuranceAmount = "",
  commission: initialCommission = "",
  resultType: initialResultType = "",
  contractDate: initialContractDate = new Date().toISOString().split("T")[0],
  nextTime: initialNextTime = "",
  workCategory: initialWorkCategory = "",
  questionaire: initialQuestionaire = "",
  established: initialEstablished = "0",
  onDataChange,
  onRemove,
  insuranceTypeOptions,
  insuranceTypeResultOptions,
  workCategoriesOptions,
  attendeesOptions,
  isFirstForm
}) => {
  const { t } = useLanguage();

  const [proposalDate, setProposalDate] = useState(initialProposalDate);
  const [attendees, setAttendees] = useState(initialAttendees);
  const [insuranceType, setInsuranceType] = useState(initialInsuranceType);
  const [insuranceAmount, setInsuranceAmount] = useState(
    initialInsuranceAmount
  );
  const [commission, setCommission] = useState(initialCommission);
  const [resultType, setResultType] = useState(initialResultType);
  const [contractDate, setContractDate] = useState(initialContractDate);
  const [nextTime, setNextTime] = useState(initialNextTime);
  const [workCategory, setWorkCategory] = useState(initialWorkCategory);
  const [questionaire, setQuestionaire] = useState(initialQuestionaire);
  const [selectedValues, setSelectedValues] = useState(
    String(initialEstablished)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        proposalDate,
        attendees,
        insuranceType,
        insuranceAmount,
        commission,
        resultType,
        contractDate,
        nextTime,
        workCategory,
        questionaire,
        established: selectedValues,
      });
    }
  }, [
    proposalDate,
    attendees,
    insuranceType,
    insuranceAmount,
    commission,
    resultType,
    contractDate,
    nextTime,
    workCategory,
    questionaire,
    selectedValues,
    onDataChange,
  ]);

  const handleToggleStateChange = (isOn: boolean) => {
    setSelectedValues(isOn ? "1" : "0");
  };

  const handleCommissionChange = (e: any) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9.,]/g, "");
    setCommission(formattedValue);
  };
  useEffect(()=> {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ['1', '99'];
      if (!allowedRoles.includes(loggedInUserRole)) 
       setIsAuthenticated(false);
      else 
      setIsAuthenticated(true);
    }
  },[])
  return (
    <div className={Style.requestFormWrapper}>
      <div>
        <div className={Style.requestFieldsContainer}>
          <InputDateField
            name="proposalDate"
            value={proposalDate}
            onChange={(e) => setProposalDate(e.target.value)}
            label={t("proposalDate")}
            placeholder={t("proposalDate")}
          />

          <CustomSelectField
            name="attendees"
            label={t("attendees")}
            options={attendeesOptions}
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder={t("attendees")}
            className={Style.insuranceDropdownSelect}
          />
          <CustomSelectField
            name="insuranceType"
            label={t("insuranceType")}
            options={insuranceTypeOptions}
            value={insuranceType}
            onChange={(e) => setInsuranceType(e.target.value)}
            placeholder={t("inquiry")}
            className={Style.insuranceDropdownSelect}
          />
          <InputField
            name="insuranceAmount"
            value={insuranceAmount}
            label={t("insuranceAmount")}
            placeholder={t("insuranceAmount")}
            onChange={(e) => setInsuranceAmount(e.target.value)}
          />
          <InputField
            name="commission"
            value={commission}
            label={t("commission")}
            placeholder={t("commission")}
            onChange={handleCommissionChange}
          />
        </div>
        <div className={Style.requestFieldsContainer2}>
          <CustomSelectField
            name="resultType"
            label={t("resultType")}
            options={insuranceTypeResultOptions}
            value={resultType}
            onChange={(e) => setResultType(e.target.value)}
            placeholder={t("resultType")}
            className={Style.insuranceDropdownSelect}
          />

          <InputDateField
            name="contractDate"
            value={contractDate}
            onChange={(e) => setContractDate(e.target.value)}
            label={t("contractDate")}
            placeholder={t("contractDate")}
          />

          {/* <InputField
            name="contractDate"
            value={contractDate}
            label={t("contractDate")}
            placeholder={t("contractDate")}
            onChange={(e) => setContractDate(e.target.value)}
          /> */}
          <InputField
            name="nextTime"
            value={nextTime}
            label={t("nextTime")}
            placeholder={t("nextTime")}
            onChange={(e) => setNextTime(e.target.value)}
          />
          <CustomSelectField
            name="workCategory"
            label={t("workCategory")}
            options={workCategoriesOptions}
            value={workCategory}
            onChange={(e) => setWorkCategory(e.target.value)}
            placeholder={t("workCategory")}
            className={Style.insuranceDropdownSelect}
          />
          <CustomSelectField
            name="questionaire"
            label={t("questionaire")}
            options={questionAirOptions}
            value={questionaire}
            onChange={(e) => setQuestionaire(e.target.value)}
            placeholder={t("questionaire")}
            className={Style.insuranceDropdownSelect}
          />
          <ToggleButton
            value={selectedValues === "1"}
            label={t("established")}
            options={{
              on: `${t("established")}`,
              off: `${t("established")}`,
            }}
            getSelectedOption={handleToggleStateChange}
            hideSelectedText={true}
          />
        </div>
      </div>
      <div className={Style.requestFormActionsContainer}>
        {
          (isFirstForm && isAuthenticated) && <Button
            text={t("remove")}
            type="danger"
            size="small"
            className={`${Style.insuranceRemoveButton}`}
            onClick={onRemove}
          />
        }

      </div>
    </div>
  );
};

export default RequestForm;
