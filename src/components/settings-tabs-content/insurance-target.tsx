import React, { useEffect, useState, useRef } from "react";
import Style from "../../styles/pages/settings.module.scss";
import InquiryStyle from "@/styles/pages/inquiry.module.scss";
import { useLanguage } from "../../localization/LocalContext";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import { useDispatch, useSelector } from "react-redux";
import Toast from "@/components/toast/toast";
import { AppDispatch, RootState } from "../../app/store";
import { useRouter } from "next/router";
import settingStyles from "../../styles/pages/settings.module.scss";
import HeadingRow from "@/components/heading-row/heading-row";
import TableBuddy from "@/components/table-buddy/table-buddy";
import {
  fetchCities,
  updateCity,
} from "@/app/features/settings/city/cityListingSlice";
import Image from "next/image";
import { createCity } from "@/app/features/settings/city/cityListingSlice";
import { resetTeamStatus } from "../../app/features/settings/teams/teamListSlice";

import { fetchCityById } from "@/app/features/settings/city/getCityByIdSlice";
import { getParamValue } from "@/libs/utils";
import Pagination from "../pagination/pagination";
import CheckboxField from "../checkbox-field/checkbox-field";
import { fetchFilterData } from "../../app/features/employees/employeeFilterDataSlice";
import {
  introduceByTypesOptions,
  statusValidInvalidOptions,
  yearOptions,
} from "@/libs/optionsHandling";
// import { fetchDropdownData } from "../../app/features/employees/departmentCityOfficeDropdownSlice";
import { fetchActiveOffices } from "../../app/features/settings/teams/activeOfficeDropdownSlice";
import {
  fetchTeamList,
  createTeam,
  updateTeam,
} from "../../app/features/settings/teams/teamListSlice"; // assuming you have this action in your slice
import { fetchTeamById } from "../../app/features/settings/teams/getTeamByIdSlice";
import { fetchInsuranceTargetsDropdown } from "@/app/features/settings/insuranceTarget/getInsuranceTargetDropdownSlice";
import { fetchInsuranceTargetShow } from "@/app/features/settings/insuranceTarget/getInsuranceTargetShowSlice";
import InputField from '../input-field/input-field';
import styles from '../../styles/components/molecules/insurance-target-table.module.scss';
import Button from "../button/button";
import { postInsuranceTargetData, resetStoreState } from '@/app/features/settings/insuranceTarget/insuranceTargetStoreSlice'; // Adjust the import path as necessary
import FullscreenLoader from "../loader/loader";

type ToastState = {
  message: string | string[];
  type: string;
};

export default function InsuranceTargetSettingsTab() {
  const { t } = useLanguage();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [sortColumn, setSortColumn] = useState("loginId");
  const [activeOfficeDropdown, setActiveOfficeDropdown] = useState([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
    "asc"
  );
  const [activeTab, setActiveTab] = useState(0);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [formState, setFormState] = useState({
    city: "",
    office: "",
    year: "",
    dashboard: "",
    target_data: []
  });

  useEffect(() => {
    dispatch(fetchInsuranceTargetsDropdown(''));

  }, [dispatch]);



  useEffect(() => {
    if (formState.city) {
      console.log('formState.city', formState.city)
      dispatch(fetchInsuranceTargetsDropdown({ city_id: formState.city, office_id: formState.office }));
    }
  }, [formState.city]);
  
  useEffect(() => {
    if (formState.office) {
      dispatch(fetchInsuranceTargetsDropdown({ city_id: formState.city, office_id: formState.office }));
    }
  }, [formState.office]);

  const {
    targets: dropdownData, loading: dropdownLoading
  } = useSelector((state: RootState) => state.insuranceTargetDropdown);


  const {
    data: responseShowData,
    loading: responseShowLoading,
  } = useSelector((state: RootState) => state.insuranceTargetShow);

  const {
    loading: storeLoading,
    error: storeError,
    success: storeSuccess,
    message: storeMessage
  } = useSelector((state: RootState) => state.insuranceTargetStore);

  console.log('responseShowData', responseShowData)

  useEffect(() => {
    if (responseShowData) {
      setFormState(prevState => ({
        ...prevState,
        target_data: responseShowData.target_data.map((item: { month: any; target_count: any; target_amount: any; }) => ({
          month: item.month,
          target_count: item.target_count,
          target_amount: item.target_amount || '',
        }))
      }));
    }
  }, [responseShowData])


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };


  const resetForm = () => {
    setFormState({
      city: "",
      office: '',
      year: '',
      dashboard: '',
      target_data: []
    });
  };


  useEffect(() => {
    if (showUpdateBtn === false) {
      resetForm();
    }
  }, [showUpdateBtn]);
  useEffect(() => {
    let toastMessage = "";
    let toastType = "";
    if (storeSuccess === true) {
      toastMessage = storeMessage || "Created successfully!";
      toastType = "success";
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetStoreState());
    } else if (storeSuccess === false) {
      toastMessage = "Something went wrong!";
      toastType = "fail";
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetStoreState());
    }
  }, [storeSuccess]);




  const fields = [
    {
      type: "customSelect" as FieldType,
      name: "dashboard",
      label: t("ダッシュボード"),
      value: formState.dashboard,
      options: dropdownData?.dashboards,
      placeholder: t("dashboard"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "customSelect" as FieldType,
      name: "city",
      label: t("エリア"),
      value: formState.city,
      options: dropdownData?.cities,
      placeholder: t("city"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "customSelect" as FieldType,
      name: "office",
      label: t("office"),
      loading: dropdownLoading,
      value: formState.office,
      options: dropdownData?.offices,
      placeholder: t("office"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "customSelect" as FieldType,
      name: "year",
      label: t("year"),
      value: formState.year,
      loading: dropdownLoading,
      options: dropdownData?.years,
      placeholder: t("office"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },

 

  ];

  const handleSubmit = () => {

  };

  const handleMainSubmission = () => {
    const id = responseShowData?.id; // or some integer value
    const city_id = formState.city; // Assuming you have city_id in formState
    const office_id = formState.office; // Assuming you have office_id in formState
    const dashboard_name = formState.dashboard; // Assuming you have office_id in formState
    const year = formState.year; // Assuming you have year in formState
    const target_data = formState.target_data; // Your target data array

    // Dispatch the postInsuranceTargetData thunk
    dispatch(postInsuranceTargetData({ id, city_id, office_id, year, dashboard_name, target_data }));
  }




  useEffect(() => {
    if (formState.city && formState.office && formState.year && formState.dashboard) {
      dispatch(fetchInsuranceTargetShow({ city_id: formState.city, office_id: formState.office, year: formState.year, dashboard_name: formState.dashboard }));
    }
  }, [formState.city, formState.office, formState.year, formState.dashboard, dispatch]);

  const handleTargetInputChange = (index: number, field: string, value: string) => {
    const updatedData: any = [...formState.target_data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setFormState({ ...formState, target_data: updatedData });
  };
  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetStoreState());
  };

  return (
    <>
    {
      responseShowLoading && <FullscreenLoader/>
    }
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      {/* <HeadingRow headingTitle={t("teamSettings")}></HeadingRow> */}
      <div className={settingStyles.formContainer}>
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={false}
          submitButtonLabel={`${t("register")}`}
          showResetButton={true}
          showResetLabel={t("フォームをリセットする")}
          onReset={resetForm}
          parentClassName={Style.createFormWrapper}
          buttonClassName={settingStyles.formCreateBtn}
          isHideSubmission={true}
        ></GenericForm>
      </div>
      {formState.target_data.length === 12 && (
        <div className={styles.tableContainer}>
          <table className={styles.targetTable}>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>月</th>
                <th style={{ width: '40%' }}>件数</th>
                { formState.dashboard != 'number_design_documents' && <th style={{ width: '40%' }}>目標金額(税込)</th> }
              </tr>
            </thead>
            <tbody>
              {formState.target_data.map((item: { month: any; target_count: any; target_amount: any; }, index: number) => (
                <tr key={index}>
                  <td>{item.month}月</td>
                  <td>
                    <InputField
                      type="number"
                      value={item.target_count}
                      onChange={(e) => handleTargetInputChange(index, 'target_count', e.target.value)}
                      className={styles.targetInput}
                    />
                  </td>
                  {
                     formState.dashboard != 'number_design_documents' &&  <td>
                     <InputField
                       type="number"
                       value={item.target_amount}
                       onChange={(e) => handleTargetInputChange(index, 'target_amount', e.target.value)}
                       className={styles.targetInput}
                     />
                   </td>
                  }
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(formState.target_data && formState.target_data.length > 0) && (
        <Button
          text={'以上の内容で登録する'}
          type="primary"
          size="small"
          fullWidth={false}
          onClick={handleMainSubmission}
          isLoading={storeLoading}
          className={styles.submitBtn}
        />
      )}

    </>
  );
}
