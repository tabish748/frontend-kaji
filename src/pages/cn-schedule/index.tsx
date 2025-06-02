import Button from "@/components/button/button";
import ClientSection from "@/components/client-section/client-section";
import ImageLabel from "@/components/image-lable/image-lable";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import { useLanguage } from "@/localization/LocalContext";
import React, { useState } from "react";
import Style from "../../styles/pages/cnSchedule.module.scss";
import { BiCalendar, BiHomeAlt2 } from "react-icons/bi";
import { FaRegAddressCard } from "react-icons/fa";
import { GiAlarmClock } from "react-icons/gi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { getPlansPage, PAGE_SIZE, PlansPage } from "../index";
import { useRouter } from "next/router";
import { Form } from "@/components/form/form";
import RadioField from "@/components/radio-field/radio-field";
import InputDateField from "@/components/input-date/input-date";
import CustomSelectField from "@/components/custom-select/custom-select";
import InputField from "@/components/input-field/input-field";
import { BsPaperclip } from "react-icons/bs";

export default function CnSchedule() {
  const { t } = useLanguage();
  const [page, setPage] = React.useState<number>(1);
  const [plans, setPlans] = React.useState<PlansPage>(
    getPlansPage(1, PAGE_SIZE)
  );
  const router = useRouter();

  // Form state to track form values
  const [formValues, setFormValues] = React.useState({
    service: "",
    plan: "",
    contract: "",
    date: "",
  });

  // Tab state from query param
  const tab = router.query.tab === "past" ? "past" : "upcoming";

  const handleTabChange = (tabValue: "upcoming" | "past") => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: tabValue },
      },
      undefined,
      { shallow: true }
    );
  };

  React.useEffect(() => {
    setPlans(getPlansPage(page, PAGE_SIZE));
  }, [page]);

  const handleFormSubmit = () => {
    // Check if at least one filter has a value
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasValue) {
      alert(t("schedulePage.alert.selectOneFilter"));
      return;
    }

    // TODO: Add your filter logic here
    console.log("Form values:", formValues);
  };

  return (
    <ClientSection heading={t("clientDashboard.schedule")}>
      <div className={Style.tabsWrapper}>
        <Button
          className={tab === "upcoming" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("upcoming")}
          text={t("schedulePage.tabs.upcomingSchedule")}
          type="secondary"
        />
        <Button
          className={tab === "past" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("past")}
          text={t("schedulePage.tabs.pastSchedule")}
          type="secondary"
        />
      </div>
      <Form className={Style.formGrid} onSubmit={handleFormSubmit}>
        <CustomSelectField
          label={t("schedulePage.form.service")}
          name="service"
          value={formValues.service}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, service: e.target.value }))
          }
          options={[
            { label: t("aboutPage.basic"), value: "basic" },
            { label: t("aboutPage.premium"), value: "premium" },
            { label: t("aboutPage.enterprise"), value: "enterprise" },
          ]}
        />
        <CustomSelectField
          label={t("schedulePage.form.plan")}
          name="plan"
          value={formValues.plan}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, plan: e.target.value }))
          }
          options={[
            { label: t("aboutPage.basic"), value: "basic" },
            { label: t("aboutPage.premium"), value: "premium" },
            { label: t("aboutPage.enterprise"), value: "enterprise" },
          ]}
        />
        <CustomSelectField
          label={t("schedulePage.form.contract")}
          name="contract"
          value={formValues.contract}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, contract: e.target.value }))
          }
          options={[
            { label: t("aboutPage.basic"), value: "basic" },
            { label: t("aboutPage.premium"), value: "premium" },
            { label: t("aboutPage.enterprise"), value: "enterprise" },
          ]}
        />

        <div className={Style.fieldGroup}>
          <InputDateField
            label={t("schedulePage.form.date")}
            name="date"
            value="2025-04-14 to 2025-04-19"
            isRange={true}
            startPlaceholder={t("schedulePage.form.startDatePlaceholder")}
            endPlaceholder={t("schedulePage.form.endDatePlaceholder")}
            icon={<BiCalendar />}
          />
        </div>

        <div className={Style.formButton}>
          <Button htmlType="submit" type="primary" text={t("schedulePage.form.display")} />
        </div>
      </Form>
      {tab === "upcoming" && (
        <Accordion
          page={page}
          totalPages={plans.totalPages}
          onPageChange={setPage}
        >
          {plans.data.map(
            (plan, index) =>
              !plan?.label && (
                <AccordionItem
                  key={index + (page - 1) * PAGE_SIZE}
                  heading={plan.date}
                  label={plan.label}
                >
                  <div className={Style.accordionContent}>
                    <ImageLabel
                      icon={<FaRegAddressCard />}
                      label={`${t("clientDashboard.staff")}: `}
                      className={Style.accordionLabel}
                    />
                    <p>{plan.staff}</p>
                    <ImageLabel
                      icon={<BiHomeAlt2 />}
                      label={`${t("clientDashboard.service")}:`}
                      className={Style.accordionLabel}
                    />
                    <p>{plan.service}</p>
                    <ImageLabel
                      icon={<GiAlarmClock />}
                      label={`${t("clientDashboard.time")}: `}
                      className={Style.accordionLabel}
                    />
                    <p>{plan.time}</p>
                    <ImageLabel
                      icon={<BsPaperclip />}
                      label={`${t("schedulePage.report")}:`}
                      className={Style.accordionLabel}
                    />
                    <div className={`${Style.buttonContainer} d-flex gap-1`}>
                      <Button text={t("buttons.pafDownload")} />
                    </div>
                  </div>
                </AccordionItem>
              )
          )}
        </Accordion>
      )}
      {tab === "past" && (
        <div className={Style.tabContent}>{t("schedulePage.tab2Content")}</div>
      )}
    </ClientSection>
  );
}
