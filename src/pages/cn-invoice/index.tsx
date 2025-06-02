import Button from "@/components/button/button";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import { useLanguage } from "@/localization/LocalContext";
import React from "react";
import { FaRegAddressCard } from "react-icons/fa";
import { getPlansPage, PAGE_SIZE, PlansPage } from "../index";
import Style from "../../styles/pages/cnInvoice.module.scss";
import { useRouter } from "next/router";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import ImageLabel from "@/components/image-lable/image-lable";

export default function CnInvoice() {
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
    setPlans(getPlansPage(page, 20));
  }, [page]);

  const handleFormSubmit = () => {
    // Check if at least one filter has a value
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasValue) {
      alert(t("invoicePage.alert.selectOneFilter"));
      return;
    }

    // TODO: Add your filter logic here
    console.log("Form values:", formValues);
  };

  const handleDateChange = (value: string | string[] | { target: { value: string } }) => {
    let dateValue = "";
    
    if (Array.isArray(value)) {
      dateValue = value.join(" - ");
    } else if (typeof value === "object" && "target" in value) {
      dateValue = value.target.value;
    } else if (typeof value === "string") {
      dateValue = value;
    }

    setFormValues((prev) => ({
      ...prev,
      date: dateValue,
    }));
  };

  return (
    <ClientSection heading={t("invoicePage.invoice")}>
      <div className={Style.tabsWrapper}>
        <Button
          className={tab === "upcoming" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("upcoming")}
          text={t("invoicePage.tabs.billingCurr")}
          type="secondary"
        />
        <Button
          className={tab === "past" ? Style.activeTab : Style.tab}
          onClick={() => handleTabChange("past")}
          text={t("invoicePage.tabs.billingPrev")}
          type="secondary"
        />
      </div>
      <Form className={Style.formGrid} onSubmit={handleFormSubmit}>
        <CustomSelectField
          label={t("invoicePage.form.contract")}
          name="contract"
          value={formValues.contract}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, contract: e.target.value }))
          }
          options={[
            { label: "Basic", value: "basic" },
            { label: "Premium", value: "premium" },
            { label: "Enterprise", value: "enterprise" },
          ]}
        />

        <div className={Style.fieldGroup}>
          <InputDateField
            label={t("invoicePage.form.date")}
            name="date"
            value={formValues.date}
            onChange={handleDateChange}
            isRange={true}
            startPlaceholder={t("invoicePage.form.startDatePlaceholder")}
            endPlaceholder={t("invoicePage.form.endDatePlaceholder")}
            icon={<FaRegAddressCard />}
            showFormat={true}
          />
        </div>

        <div className={Style.formButton}>
          <Button htmlType="submit" type="primary" text={t("invoicePage.form.display")} />
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
                  heading={plan.date + " " + t("invoicePage.invoice")}
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
                          window.open("/api/download-invoice", "_blank")
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
        <div className={Style.tabContent}>{t("invoicePage.tab2Content")}</div>
      )}
    </ClientSection>
  );
}
