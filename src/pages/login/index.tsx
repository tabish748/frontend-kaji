import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Style from "../../styles/pages/login.module.scss";
import styles from "../../styles/components/organisms/dashboard-layout.module.scss";
import { useLanguage } from "../../localization/LocalContext";
import ClientSection from "@/components/client-section/client-section";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import ImageLabel from "@/components/image-lable/image-lable";
import { FaRegAddressCard } from "react-icons/fa";

// Simulate paginated server response
const PAGE_SIZE = 5;
type Plan = {
  date: string;
  staff: string;
  service: string;
  time: string;
  request: string;
  cancel: string;
  label: string;
};

interface PlansPage {
  data: Plan[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const ALL_PLANS: Plan[] = [
  {
    date: "23/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "14時00分～17時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "Canceled",
  },
  {
    date: "24/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "10時00分～13時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "25/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "09時00分～12時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "26/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "13時00分～16時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "27/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "15時00分～18時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "28/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "08時00分～11時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "29/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "11時00分～14時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "30/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "12時00分～15時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "31/05/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "16時00分～19時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
  {
    date: "01/06/2025",
    staff: "シェヴ 花子",
    service: "ベビーシッティング 3.0H",
    time: "17時00分～20時00分",
    request: "Rescheduling",
    cancel: "Cancel",
    label: "",
  },
];

function getPlansPage(page: number, pageSize: number): PlansPage {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: ALL_PLANS.slice(start, end),
    total: ALL_PLANS.length,
    page,
    pageSize,
    totalPages: Math.ceil(ALL_PLANS.length / pageSize),
  };
}

export default function Login() {
  const { t } = useLanguage();
  const [page, setPage] = React.useState<number>(1);
  const [plans, setPlans] = React.useState<PlansPage>(
    getPlansPage(1, PAGE_SIZE)
  );

  React.useEffect(() => {
    setPlans(getPlansPage(page, PAGE_SIZE));
  }, [page]);

  return (
    <ClientSection heading={t("login.title")}>
      <Accordion
        page={page}
        totalPages={plans.totalPages}
        onPageChange={setPage}
      >
        {plans.data.map((plan, index) => (
          <AccordionItem
            key={index + (page - 1) * PAGE_SIZE}
            heading={plan.date}
            label={plan.label}
          >
            <div className={styles.accordionContent}>
              <ImageLabel
                icon={<FaRegAddressCard />}
                label={`${t("login.staff")}: ${plan.staff}`}
                className={Style.accordionLabel}
              />
              <ImageLabel
                iconSrc="/assets/svg/Business icon (white).svg"
                label={`${t("login.service")}: ${plan.service}`}
                className={Style.accordionLabel}
              />
              <ImageLabel
                iconSrc="/assets/svg/calendar.svg"
                label={`${t("login.time")}: ${plan.time}`}
                className={Style.accordionLabel}
              />
              <ImageLabel
                iconSrc="/assets/svg/Schedule post icon (white).svg"
                label={`${t("login.request")}: ${plan.request}`}
                className={Style.accordionLabel}
              />
              <ImageLabel
                iconSrc="/assets/svg/bin.svg"
                label={`${t("login.cancel")}: ${plan.cancel}`}
                className={Style.accordionLabel}
              />
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </ClientSection>
  );
}
