import React from "react";
import { useLanguage } from "../../localization/LocalContext";
import AuthMiddleware from "@/components/auth-middleware/auth-middleware";
import Head from "next/head";
import HeadingRow from "@/components/heading-row/heading-row";
import Style from "../../styles/pages/involvement-record.module.scss";
import CustomerStyle from "../../styles/pages/customer-create.module.scss";
import InputField from "@/components/input-field/input-field";
import search from "../../../public/assets/svg/search.svg";
import { Form } from "@/components/form/form";
import { Key, useEffect, useState } from "react";
import SelectField from "@/components/select-field/select-field";
import Button from "@/components/button/button";
import RadioField from "@/components/radio-field/radio-field";
import Image from "next/image";
import CustomerSearchModal from "@/components/customer-search/customer-search";
import CustomSelectField from "@/components/custom-select/custom-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import InputDateField from "@/components/input-date/input-date";
import HeadingBreadcrumb from "@/components/heading-breadcrumb/heading-breadcrumb";
import { genderOptions } from "@/libs/optionsHandling";
import { fetchInterviewInquiryHistory } from "@/app/features/project/interviewInquiryHistoryShowSlice";
import { getParamValue } from "@/libs/utils";
import TextAreaField from "../text-area/text-area";

export default function InterviewInquiryHisotryLayout() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();

  const [formState, setFormState] = useState({
    interviewDate: "",
    correspondingPerson: "",
    interviewLocation: "",
    interviewContent: "",
    estimatedAmount: "",
    inquiryAnswer: "",
  });

  useEffect(() => {
    const id = getParamValue("id");
    if (id != null) dispatch(fetchInterviewInquiryHistory(Number(id)));
  }, [dispatch]);

  const { inquiryDetails, interviewDetails, loading, users, locations } = useSelector(
    (state: RootState) => state.interviewInquiryHistoryShow
  );


  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const getUserNameById = (userId: number) => {
    return users ? users[userId] : "";
  };

  const getLocationNameById = (Id: number) => {
    return locations ? locations[Id] : "";
  };

  return (
    <>
      <Head>
        <title>
          {t(
            "面談履歴(受注前) / 問合せ履歴(受注前) ❘ 相続税(確定) ❘ 案件管理 ❘ 更新登録 ❘ 相続相談管理システム"
          )}
        </title>
      </Head>
      <AuthMiddleware>
        <HeadingRow
          headingTitle={t("interviewHistoryBeforeOrder")}
        ></HeadingRow>
        <div
          className={`${CustomerStyle.engagementFromRow1MainWrapper} mt-2 mb-2`}
        >
          <div
            className={`${Style.involvementRecord1FieldsWrapper} ${CustomerStyle.engagementFromRow1Header} ${Style.interviewInquiryHistory1FieldsGrid} p-2`}
          >
            <span className={CustomerStyle.engagementLabels}></span>
            <span className={CustomerStyle.engagementLabels}>
              {t("existInterviewDate")}
            </span>
            <span className={CustomerStyle.engagementLabels}>
              {t("correspondingPerson")}
            </span>
            <span className={CustomerStyle.engagementLabels}>
              {t("interviewLocation")}
            </span>
            <span className={CustomerStyle.engagementLabels}>
              {t("interviewDescription")}
            </span>
            <span className={CustomerStyle.engagementLabels}>
              {t("existEstimatedAmount")}
            </span>
          </div>
          {interviewDetails &&
            interviewDetails?.map((item, index) => (
              <div
                className={`${Style.involvementRecord1FieldsWrapper} ${Style.interviewInquiryHistory1FieldsGrid} ${Style.borderBottom} pl-2 pr-2`}
                key={index}
              >
                <small className="mt-1">{index + 1}</small>
                <InputDateField
                  name="interview_date"
                  value={item.combined_date_hour}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("existInterviewDate")}
                  readOnly={true}
                  inputType="datetime-local"
                />
                <InputField
                  name="correspondingPerson"
                  value={getUserNameById(item.interviewer1)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("correspondingPerson")}
                  readOnly={true}
                />
                <InputField
                  name="interviewLocation"
                  value={getLocationNameById(item.location_id)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("interviewLocation")}
                  readOnly={true}
                />

                <TextAreaField
                  name="interviewContent"
                  value={item.description}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("interviewDescription")}
                  readOnly={true}
                />
                <InputField
                  name="estimatedAmount"
                  value={String(item.estimated_amount)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("existEstimatedAmount")}
                  readOnly={true}
                />

              </div>
            ))}
        </div>
        <HeadingRow headingTitle={t("inquiryHistoryBeforeOrder")}></HeadingRow>

        <div
          className={`${CustomerStyle.engagementFromRow1MainWrapper} mt-2`}
        >
          <div
            className={`${Style.involvementRecord1FieldsWrapper} ${CustomerStyle.engagementFromRow1Header} ${Style.interviewInquiryHistory2FieldsGrid} p-2`}
          >
            <span className={CustomerStyle.engagementLabels}></span>
            <span className={CustomerStyle.engagementLabels}>
              {t("inquiryRequestedDate")}
            </span>
            <span className={CustomerStyle.engagementLabels}>
              {t("correspondingPerson")}
            </span>
            <span className={CustomerStyle.engagementLabels}>
              {t("問合せ内容")}
            </span>
            <span className={CustomerStyle.engagementLabels}>
              {t("answer")}
            </span>
          </div>
          {
            inquiryDetails && inquiryDetails?.map((item, index) => (
              <div
                className={`${Style.involvementRecord1FieldsWrapper} ${Style.interviewInquiryHistory2FieldsGrid} ${Style.borderBottom} pl-2 pr-2`} key={index}
              >
                <small>{index + 1}</small>
                <InputDateField
                  name="inquiry_date"
                  value={item.combined_date_hour}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("inquiryRequestedDate")}
                  readOnly={true}
                  inputType="datetime-local"
                />
                <InputField
                  name="correspondingPerson"
                  value={getUserNameById(item.corresponding_person_id)}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("correspondingPerson")}
                  readOnly={true}
                />
                {/* <InputField
                  name="estimatedAmount"
                  value={formState.estimatedAmount}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("existEstimatedAmount")}
                  readOnly={true}
                /> */}
                <TextAreaField
                  name="interviewContent"
                  value={item.inquiry}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("interviewDescription")}
                  readOnly={true}
                />
                <TextAreaField
                  name="inquiryAnswer"
                  value={item.answer}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("answer")}
                  readOnly={true}
                />

              </div>
            ))
          }

        </div>
      </AuthMiddleware>
    </>
  );
}
