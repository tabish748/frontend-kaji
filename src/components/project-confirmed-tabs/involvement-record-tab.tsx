import React from "react";
import { useLanguage } from "../../localization/LocalContext";
import AuthMiddleware from "@/components/auth-middleware/auth-middleware";
import Head from "next/head";
import HeadingRow from "@/components/heading-row/heading-row";
import Style from "../../styles/pages/involvement-record.module.scss";
import CustomerStyle from "../../styles/pages/customer-create.module.scss";
import InputField from "@/components/input-field/input-field";
import Image from "next/image";
import { Form } from "@/components/form/form";
import { Key, useEffect, useState } from "react";
import SelectField from "@/components/select-field/select-field";
import Button from "@/components/button/button";
import RadioField from "@/components/radio-field/radio-field";
import bin from "../../../public/assets/svg/bin.svg";

import CustomSelectField from "@/components/custom-select/custom-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import InputDateField from "@/components/input-date/input-date";
import Toast from "../toast/toast";
import { genderOptions } from "@/libs/optionsHandling";
import { fetchEngagementWorklog } from "@/app/features/project/engagementWorkLogShowSlice";
import { getCurrentDate, getParamValue } from "@/libs/utils";
import { fetchProjectEngagementDropdown } from "@/app/features/generals/projectEngagementDropdownSlice";
import {
  updateEngagementWorkLog,
  resetEngagementWorkLogUpdateState,
} from "@/app/features/project/engagementWorkLogUpdateSlice";
import TextAreaField from "../text-area/text-area";
import ConfirmationBox from "../confirmation-box/confirmation-box";

type ToastState = {
  message: string | string[];
  type: string;
};

export default function InvolvementRecordTabLayout() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [formState, setFormState] = useState<any>({
    workLog: [],
    engagement: [],
  });
  const [errors, setErrors] = useState<any>([]);

  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [showWorkLogConfirm, setShowWorkLogConfirm] = useState(false);
  const [showEngagementConfirm, setShowEngagementConfirm] = useState(false);
  const [removeWorkLogIndex, setRemoveWorkLogIndex] = useState(null);
  const [removeEngagementIndex, setRemoveEngagementIndex] = useState(null);
  useEffect(() => {
    dispatch(fetchProjectEngagementDropdown());
    const id = getParamValue("id");
    if (id != null) dispatch(fetchEngagementWorklog(Number(id)));
  }, [dispatch]);

  const { engagements, workLogs, loading } = useSelector(
    (state: RootState) => state.engagementWorklogShow
  );
  const { worklogCategories, users } = useSelector(
    (state: RootState) => state.projectEngagementDropdown
  );

  const {
    loading: updateLoading,
    errorMessages,
    status,
    message,
  } = useSelector((state: RootState) => state.projectEngagementUpdate);

  useEffect(() => {
    if (status === true) {
      setToast({
        message: message || "Updated successfully!",
        type: "success",
      });
      dispatch(resetEngagementWorkLogUpdateState());

      const id = getParamValue("id");
      if (id != null) dispatch(fetchEngagementWorklog(Number(id)));

    } else if (errorMessages && errorMessages.length > 0) {
      setToast({
        message: errorMessages,
        type: "fail",
      });
    }
  }, [dispatch, status, errorMessages, message]);

  useEffect(() => {
    if (engagements) {
      setFormState((prevState: any) => ({
        ...prevState,
        engagement: [
          ...engagements.map((log: { id: any; response_date: any; content: any; corresponding_person_id: any; }) => ({
            id: log.id,
            workingDay: log.response_date,
            content: log.content,
            worker: log.corresponding_person_id,
          })),
          { id: "_new", workingDay: getCurrentDate() || "", content: "", worker: "" },
        ],
      }));
    } else {
      // Ensure an empty entry exists if no data is fetched.
      setFormState((prevState: any) => ({
        ...prevState,
        engagement: [{ id: "_new", workingDay: getCurrentDate() || "", content: "", worker: "" }],
      }));
    }
  }, [engagements]);

  useEffect(() => {
    if (workLogs) {
      setFormState((prevState: any) => ({
        ...prevState,
        workLog: [
          ...workLogs.map((log: { id: any; response_date: any; section_type: any; content: any; corresponding_person_id: any; }) => ({
            id: log.id,
            workingDay: log.response_date,
            workCategory: log.section_type,
            content: log.content,
            worker: log.corresponding_person_id,
          })),
          { id: "_new", workingDay: getCurrentDate(), workCategory: "", content: "", worker: "" },
        ],
      }));
    }  else {
      // Ensure an empty entry exists if no data is fetched.
      setFormState((prevState: any) => ({
        ...prevState,
        workLog: [{ id: "_new", workingDay: getCurrentDate(), workCategory: "", content: "", worker: "" }],
      }));
    }
  }, [workLogs]);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    const [key, index, field] = name.split(/[\[\].]+/);

    if (key === "workLog") {
      setFormState((prevState: { workLog: any }) => {
        const updatedWorkLogs = [...prevState.workLog];
        updatedWorkLogs[index][field] = value;
        return { ...prevState, workLog: updatedWorkLogs };
      });
    } else if (key === "engagement") {
      setFormState((prevState: { engagement: any }) => {
        const updatedEngagements = [...prevState.engagement];
        updatedEngagements[index][field] = value;
        return { ...prevState, engagement: updatedEngagements };
      });
    }
  };

  
  const handleSubmit = () => {
    const id = getParamValue("id");

    const workLogPayload = formState.workLog
      .map((log: { id: any; workingDay: any; content: any; workCategory: any; worker: any }) => ({
        id: log.id || "_new",
        response_date: log.workingDay,
        content: log.content,
        section_type: log.workCategory,
        corresponding_person_id: log.worker,
      }));

    const engagementPayload = formState.engagement
      .map((engagement: { id: any; workingDay: any; content: any; worker: any }) => ({
        id: engagement.id || "_new",
        response_date: engagement.workingDay,
        content: engagement.content,
        corresponding_person_id: engagement.worker,
      }));

    const payload = {
      project_sozoku_id: id,
      worklog: workLogPayload,
      engagement: engagementPayload,
    };
    
    if (id != null) {
      dispatch(updateEngagementWorkLog({ id: Number(id), data: payload as any }));
    }
  };

  const handleClostToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetEngagementWorkLogUpdateState());
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


  const handleRemoveClick = (index: any, type: string) => {
    if (type === "workLog") {
      setRemoveWorkLogIndex(index);
      setShowWorkLogConfirm(true);
    } else if (type === "engagement") {
      setRemoveEngagementIndex(index);
      setShowEngagementConfirm(true);
    }
  };

  const confirmRemoveWorkLog = () => {
    const updatedWorkLogs = formState.workLog.filter((_: any, idx: null) => idx !== removeWorkLogIndex);
    setFormState((prevState: any) => ({ ...prevState, workLog: updatedWorkLogs }));
    setShowWorkLogConfirm(false);
  };

  const confirmRemoveEngagement = () => {
    const updatedEngagements = formState.engagement.filter((_: any, idx: null) => idx !== removeEngagementIndex);
    setFormState((prevState: any) => ({ ...prevState, engagement: updatedEngagements }));
    setShowEngagementConfirm(false);
  };

  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleClostToast}
        />
      )}
      <Head>
        <title>
          {t(
            "作業ログ / 関与記録 ❘ 相続税(確定) ❘ 案件管理 ❘ 更新登録 ❘ 相続相談管理システム"
          )}
        </title>
      </Head>
      <AuthMiddleware>
        <Form onSubmit={handleSubmit} isLoading={updateLoading}  setErrors={setErrors} errors={errors} disabledSubmitForm={toast.message == '案件情報が更新されました。' && toast.type == 'success' ? true :false} >
          <HeadingRow headingTitle={t("workLog")}></HeadingRow>
          <div
            className={`${CustomerStyle.engagementFromRow1MainWrapper} mt-2 mb-2`}
          >
            <div
              className={`${Style.involvementRecord1FieldsWrapper} ${CustomerStyle.engagementFromRow1Header} pl-1 pr-1`}
            >
              <span className={CustomerStyle.engagementLabels}></span>
              <span className={CustomerStyle.engagementLabels}>
                {t("workingDay")}
              </span>
              <span className={CustomerStyle.engagementLabels}>
                {t("workCategory")}
              </span>
              <span className={CustomerStyle.engagementLabels}>
                {t("content")}
              </span>
              <span className={CustomerStyle.engagementLabels}>
                {t("worker")}
              </span>
              <span className={CustomerStyle.engagementLabels}>
              </span>
            </div>

            {formState.workLog.map(
              (
                workLog: {
                  id: string;
                  workingDay: string | undefined;
                  workCategory: string | number | undefined;
                  content: string | undefined;
                  worker: string | number | undefined;
                },
                index: React.Key | null | undefined
              ) => (
                <div
                  key={index}
                  className={`${Style.involvementRecord1FieldsWrapper} ${Style.borderBottom} pl-1 pr-1`}
                >
                  <small className="mt-1">{index != null && +index + 1}</small>
                  <InputDateField
                    name={`workLog[${index}].workingDay`}
                    value={workLog.workingDay || ""}
                    onChange={handleInputChange}
                    placeholder={t("workingDay")}
                    disabled={(!isAuthenticated && workLog.id != '_new') ? true : false}
                    validations={(workLog.content || workLog.worker || workLog.workCategory) &&[{ type: "required" }]}
                    errorText={errors[`workLog[${index}].worker`]}
                  />
                  <CustomSelectField
                    options={worklogCategories}
                    name={`workLog[${index}].workCategory`}
                    value={workLog.workCategory || ""}
                    onChange={handleInputChange}
                    placeholder={t("workCategory")}
                    className={`${Style.selectField}`}
                    disabled={(!isAuthenticated && workLog.id != '_new') ? true : false}
                    validations={(workLog.content || workLog.worker || workLog.workCategory) &&[{ type: "required" }]}
                    errorText={errors[`workLog[${index}].workCategory`]}
                  />
                  <TextAreaField
                    name={`workLog[${index}].content`}
                    value={workLog.content || ""}
                    onChange={handleInputChange}
                    placeholder={t("content")}
                    disabled={(!isAuthenticated && workLog.id != '_new') ? true : false}
                    validations={(workLog.content || workLog.worker || workLog.workCategory) &&[{ type: "required" }]}
                    errorText={errors[`workLog[${index}].content`]}
                  />
                  <CustomSelectField
                    name={`workLog[${index}].worker`}
                    options={users}
                    value={workLog.worker || ""}
                    onChange={handleInputChange}
                    placeholder={t("worker")}
                    className="pt-0"
                    disabled={(!isAuthenticated && workLog.id != '_new') ? true : false}
                    validations={(workLog.content || workLog.worker || workLog.workCategory) &&[{ type: "required" }]}
                    errorText={errors[`workLog[${index}].worker`]}
                  />
                  {
                    (isAuthenticated && workLog.id != '_new') && <Button
                      text={t("remove")}
                      type="danger"
                      size="small"
                      // className={`${InterviewStyle.customizeRemoveBtn}`}
                      onClick={() => handleRemoveClick(index, "workLog")}
                      icon={
                        <Image
                          src={bin}
                          alt="Delete Icon"
                          width={15}
                          height={15}
                        />
                      }
                    />
                  }
                </div>
              )
            )}
          </div>
          <HeadingRow headingTitle={t("involvementRecord")}></HeadingRow>
          <div className={`${CustomerStyle.engagementFromRow1MainWrapper} mt-2`}>
            <div
              className={`${Style.involvementRecord1FieldsWrapper} ${CustomerStyle.engagementFromRow1Header} ${Style.involvementRecord2FieldsGrid} p-2`}
            >
              <span className={CustomerStyle.engagementLabels}></span>
              <span className={CustomerStyle.engagementLabels}>
                {t("workingDay")}
              </span>
              <span className={CustomerStyle.engagementLabels}>
                {t("howToRespond")}
              </span>
              <span className={CustomerStyle.engagementLabels}>
                {t("worker")}
              </span>
              <span className={CustomerStyle.engagementLabels}>
              </span>
            </div>
            {formState.engagement.map((eng: {
              id: string; workingDay: any; content: any; worker: any;
            }, index: React.Key | null | undefined) => (
              <div
                key={index}
                className={`${Style.involvementRecord1FieldsWrapper} ${Style.involvementRecord2FieldsGrid} ${Style.borderBottom} pl-1 pr-1`}
              >
                <small className="mt-1">{Number(index) + 1}</small>
                <InputDateField
                  name={`engagement[${index}].workingDay`}
                  value={eng.workingDay || ""}
                  onChange={handleInputChange}
                  placeholder={t("workingDay")}
                  disabled={(!isAuthenticated && eng.id != '_new') ? true : false}
                  validations={(eng.content || eng.worker) && [{ type: "required" }]}
                  errorText={errors[`engagement[${index}].workingDay`]}
                />
                <TextAreaField
                  name={`engagement[${index}].content`}
                  value={eng.content || ""}
                  onChange={handleInputChange}
                  placeholder={t("howToRespond")}
                  disabled={(!isAuthenticated && eng.id != '_new') ? true : false}
                  validations={(  eng.worker) && [{ type: "required" }]}
                  errorText={errors[`engagement[${index}].content`]}
                />
                <CustomSelectField
                  name={`engagement[${index}].worker`}
                  options={users}
                  value={eng.worker || ""}
                  onChange={handleInputChange}
                  placeholder={t("worker")}
                  disabled={(!isAuthenticated && eng.id != '_new') ? true : false}
                  className="mb-1"
                  validations={( eng.content) && [{ type: "required" }]}
                  errorText={errors[`engagement[${index}].worker`]}
                />
                    
                {
                  (isAuthenticated && eng.id != '_new') && <Button
                    text={t("remove")}
                    type="danger"
                    size="small"
                    // className={`${InterviewStyle.customizeRemoveBtn}`}
                    onClick={() => handleRemoveClick(index, "engagement")}
                    icon={
                      <Image
                        src={bin}
                        alt="Delete Icon"
                        width={15}
                        height={15}
                      />
                    }
                  />
                }
              </div>
            ))}
          </div>
        </Form>

        {showWorkLogConfirm && (
          <ConfirmationBox
            isOpen={showWorkLogConfirm}
            title={t("この作業ログを削除してもよろしいですか？")}
            secondText="この操作は元に戻せません。"
            onCancel={() => setShowWorkLogConfirm(false)}
            onConfirm={confirmRemoveWorkLog}
          />
        )}

        {showEngagementConfirm && (
          <ConfirmationBox
            isOpen={showEngagementConfirm}
            title={t("この関与記録を削除してもよろしいですか？")}
            secondText="この操作は元に戻せません。"
            onCancel={() => setShowEngagementConfirm(false)}
            onConfirm={confirmRemoveEngagement}
          />
        )}

      </AuthMiddleware>
    </>
  );
}
