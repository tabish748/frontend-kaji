import ClientSection from "@/components/client-section/client-section";
import Accordion, { AccordionItem } from "@/components/molecules/accordion";
import ImageLabel from "@/components/image-lable/image-lable";
import { useLanguage } from "@/localization/LocalContext";
import React, { useState } from "react";
import Style from "../styles/pages/clientIndex.module.scss";
import { BiHomeAlt2 } from "react-icons/bi";
import { GiAlarmClock } from "react-icons/gi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import Button from "@/components/button/button";
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

const ANNOUNCEMENTS = [
  {
    date: "25/05/2025",
    time: "09:00",
    title: "システム利用開始のお知らせ",
    detail:
      "クライアントシステムの利用可能となりました。利用者IDなどは担当より連絡がございます。ご請求書などはホンスステムからご確認できるようになりました。",
  },
  {
    date: "20/05/2025",
    time: "15:00",
    title: "メンテナンス完了",
    detail:
      "システムメンテナンスが完了しました。ご協力ありがとうございました。",
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

export default function Home() {
  const { t } = useLanguage();
  const [page, setPage] = React.useState<number>(1);
  const [plans, setPlans] = React.useState<PlansPage>(
    getPlansPage(1, PAGE_SIZE)
  );

  const [errors, setErrors] = useState<any>({});

  React.useEffect(() => {
    setPlans(getPlansPage(page, PAGE_SIZE));
  }, [page]);

  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <div className="d-flex flex-column gap-2">
      {/* Schedule Section */}
      <ClientSection heading={t("clientDashboard.title")}>
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
                  <Button text={t("buttons.rescheduling")} />
                  <Button text={t("buttons.cancel")} />
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </ClientSection>

      {/* Announcement Section */}
      <ClientSection heading={t("clientDashboard.announcement")}>
        <div className={Style.announcementContainer}>
          <Accordion page={1} totalPages={1} onPageChange={() => {}}>
            {ANNOUNCEMENTS.map((item, idx) => (
              <AccordionItem key={idx} heading={`${item.date} ${item.title || ''}`} label="">
                <div className={Style.accordionContent}>
                  <ImageLabel
                    icon={<FaRegAddressCard />}
                    label={t("clientDashboard.publication") + ":"}
                    className={Style.accordionLabel}
                  />
                  <p>{`${item.date} ${item.time}`}</p>
                  <ImageLabel
                    icon={<FaRegAddressCard />}
                    label={t("clientDashboard.detail") + ":"}
                    className={Style.accordionLabel}
                  />
                  <p>{item.detail}</p>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ClientSection>
    </div>
  );
}
