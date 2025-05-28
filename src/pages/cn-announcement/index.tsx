import Button from "@/components/button/button";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import { useLanguage } from "@/localization/LocalContext";
import React from "react";
import { FaRegAddressCard } from "react-icons/fa";
import { getPlansPage, PAGE_SIZE, PlansPage } from "../index";
import Style from "../../styles/pages/cnAnnouncement.module.scss";
import { useRouter } from "next/router";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import ImageLabel from "@/components/image-lable/image-lable";

export default function CnAnnouncement() {
  const { t } = useLanguage();
  const [page, setPage] = React.useState<number>(1);
  const [plans, setPlans] = React.useState<PlansPage>(
    getPlansPage(1, PAGE_SIZE)
  );
  const router = useRouter();

  // Form state to track form values
  const [formValues, setFormValues] = React.useState({
    date: "",
  });

  // Tab state from query param
  const tab = router.query.tab === "previous" ? "previous" : "current";

  const handleTabChange = (tabValue: "current" | "previous") => {
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
    setPlans(getPlansPage(page, 20));
  }, [page]);

  const handleFormSubmit = () => {
    // Check if at least one filter has a value
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasValue) {
      alert(t("announcementPage.alert.selectOneFilter"));
      return;
    }

    // TODO: Add your filter logic here
    console.log("Form values:", formValues);
  };

  return (
    <ClientSection heading={t("announcementPage.announcement")}>
      <div className={Style.tabsWrapper}>
        <Button
          className={tab === "current" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("current")}
          text={t("announcementPage.tabs.current")}
          type="secondary"
        />
        <Button
          className={tab === "previous" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("previous")}
          text={t("announcementPage.tabs.previous")}
          type="secondary"
        />
      </div>
      <Form className={Style.formGrid} onSubmit={handleFormSubmit}>
        <div className={Style.fieldGroup}>
          <InputDateField
            label={t("announcementPage.form.date")}
            name="date"
            value="2025-04-14 to 2025-04-19"
            isRange={true}
            startPlaceholder={t("announcementPage.form.startDatePlaceholder")}
            endPlaceholder={t("announcementPage.form.endDatePlaceholder")}
            icon={<FaRegAddressCard />}
          />
        </div>
        <div className={Style.formButton}>
          <Button
            htmlType="submit"
            type="primary"
            text={t("announcementPage.form.display")}
          />
        </div>
      </Form>
      {tab === "current" && (
        <Accordion
          page={page}
          totalPages={plans.totalPages}
          onPageChange={setPage}
        >
          {plans.data.map(
            (plan, index) =>
              !plan?.label && (
                <AccordionItem
                  key={index}
                  heading={plan.date + " " + t("announcementPage.announcement")}
                  label={plan.label}
                >
                  <div className={Style.accordionContent}>
                    <ImageLabel
                      icon={<FaRegAddressCard />}
                      label={t("clientDashboard.publication") + ":"}
                      className={Style.accordionLabel}
                    />
                    <p>{`${plan.date} ${plan.time}`}</p>
                    <ImageLabel
                      icon={<FaRegAddressCard />}
                      label={t("clientDashboard.detail") + ":"}
                      className={Style.accordionLabel}
                    />
                    <p>
                      {plan.label +
                        "lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 lorem 23 "}
                    </p>
                  </div>
                </AccordionItem>
              )
          )}
        </Accordion>
      )}
      {tab === "previous" && (
        <div className={Style.tabContent}>
          {t("announcementPage.tab2Content")}
        </div>
      )}
    </ClientSection>
  );
}
