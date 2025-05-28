import Button from "@/components/button/button";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import { useLanguage } from "@/localization/LocalContext";
import React from "react";
import { FaRegAddressCard } from "react-icons/fa";
import { getPlansPage, PAGE_SIZE, PlansPage } from "../index";
import Style from "../../styles/pages/cnQuotation.module.scss";
import { useRouter } from "next/router";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import ImageLabel from "@/components/image-lable/image-lable";

export default function CnQuotation() {
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
    setPlans(getPlansPage(page, 20));
  }, [page]);

  const handleFormSubmit = () => {
    // Check if at least one filter has a value
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasValue) {
      alert(t("quotationPage.alert.selectOneFilter"));
      return;
    }

    // TODO: Add your filter logic here
    console.log("Form values:", formValues);
  };

  return (
    <ClientSection heading={t("quotationPage.quotation")}>
      <div className={Style.tabsWrapper}>
        <Button
          className={tab === "upcoming" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("upcoming")}
          text={t("quotationPage.tabs.billingCurr")}
          type="secondary"
        />
        <Button
          className={tab === "past" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("past")}
          text={t("quotationPage.tabs.billingPrev")}
          type="secondary"
        />
      </div>
      <Form className={Style.formGrid} onSubmit={handleFormSubmit}>
        <div className={Style.fieldGroup}>
          <InputDateField
            label={t("quotationPage.form.date")}
            name="date"
            value="2025-04-14 to 2025-04-19"
            isRange={true}
            startPlaceholder={t("quotationPage.form.startDatePlaceholder")}
            endPlaceholder={t("quotationPage.form.endDatePlaceholder")}
            icon={<FaRegAddressCard />}
          />
        </div>

        <div className={Style.formButton}>
          <Button
            htmlType="submit"
            type="primary"
            text={t("quotationPage.form.display")}
          />
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
                  heading={plan.date + " " + t("quotationPage.quotation")}
                  label={plan.label}
                >
                  <div className={Style.accordionContent}>
                    <ImageLabel
                      icon={<FaRegAddressCard />}
                      label={plan.staff}
                      className={Style.accordionLabel}
                    />
                    <div className={`${Style.buttonContainer}`}>
                      <Button
                        text={t("buttons.pafDownload")}
                        onClick={() =>
                          window.open("/api/download-quotation", "_blank")
                        }
                      />
                    </div>
                  </div>
                </AccordionItem>
              )
          )}
        </Accordion>
      )}
      {tab === "past" && (
        <div className={Style.tabContent}>{t("quotationPage.tab2Content")}</div>
      )}
    </ClientSection>
  );
}
