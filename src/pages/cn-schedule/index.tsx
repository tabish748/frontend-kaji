import Button from "@/components/button/button";
import ClientSection from "@/components/client-section/client-section";
import ImageLabel from "@/components/image-lable/image-lable";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import { useLanguage } from "@/localization/LocalContext";
import React, { useState } from "react";
import Style from "../../styles/pages/cnSchedule.module.scss";
import { BiHomeAlt2 } from "react-icons/bi";
import { FaRegAddressCard } from "react-icons/fa";
import { GiAlarmClock } from "react-icons/gi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { getPlansPage, PAGE_SIZE, PlansPage } from "../index";
import { useRouter } from "next/router";

export default function CnSchedule() {
  const { t } = useLanguage();
  const [page, setPage] = React.useState<number>(1);
  const [plans, setPlans] = React.useState<PlansPage>(
    getPlansPage(1, PAGE_SIZE)
  );
  const router = useRouter();

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
                      icon={<IoDocumentTextOutline />}
                      label={`${t("clientDashboard.request")}:`}
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
        <div className={Style.tabContent}>
          {t("Tab 2 content goes here.")}
        </div>
      )}
    </ClientSection>
  );
}
