// TabsHeader.tsx
import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss"; // Update the path accordingly
import { useLanguage } from "@/localization/LocalContext";

interface Props {
  activeTab: string;
  showInquiryTab: boolean;
  showInterviewTab: boolean;
  showProjectLegalTab: boolean;
  showProjectConfirmedTab: boolean;
  showProjectRevisedTab: boolean;
  showProjectDuringLifeTab: boolean;
  inquiryHref?: string;
  interviewHref?: string;
  projectLegalHref?: string;
  projectConfirmedHref?: string;
  projectRevisedHref?: string;
  projectDuringLifeHref?: string;
}

const InterviewInquiryTabs: React.FC<Props> = ({
  activeTab,
  showInquiryTab,
  showInterviewTab,
  showProjectLegalTab,
  showProjectConfirmedTab,
  showProjectRevisedTab,
  showProjectDuringLifeTab,
  inquiryHref,
  interviewHref,
  projectLegalHref,
  projectConfirmedHref,
  projectRevisedHref,
  projectDuringLifeHref,
}) => {
  const { t } = useLanguage();
   
  console.log('showProjectduringlife', showProjectDuringLifeTab)
  return (
    <div className={`${styles.tabContainer} mb-2`}>
      <div className={styles.tabs}>
        <div className={`d-flex ${styles.tabsWrapper}`}>
          {showInquiryTab && inquiryHref && (
            <Link href={inquiryHref} passHref>
              <div
                className={
                  activeTab === "inquiry"
                    ? `${styles.tab} ${styles.active}`
                    : styles.tab
                }
              >
                {t("inquiryManagement")}
              </div>
            </Link>
          )}

          {showInterviewTab && interviewHref && (
            <Link href={interviewHref} passHref>
              <div
                className={
                  activeTab === "interview"
                    ? `${styles.tab} ${styles.active}`
                    : styles.tab
                }
              >
                {t("interviewManagement")}
              </div>
            </Link>
          )}
          {showProjectLegalTab && projectLegalHref && (
            <Link href={projectLegalHref} passHref>
              <div
                className={
                  activeTab === "projectLegal"
                    ? `${styles.tab} ${styles.active}`
                    : styles.tab
                }
              >
                {t("projectLegal")}
              </div>
            </Link>
          )}
          {showProjectConfirmedTab && projectConfirmedHref && (
            <Link href={projectConfirmedHref} passHref>
              <div
                className={
                  activeTab === "projectConfirmed"
                    ? `${styles.tab} ${styles.active}`
                    : styles.tab
                }
              >
                {t("projectSozokuConfirmed")}
              </div>
            </Link>
          )}

          {showProjectRevisedTab && projectRevisedHref && (
            <Link href={projectRevisedHref} passHref>
              <div
                className={
                  activeTab === "projectRevised"
                    ? `${styles.tab} ${styles.active}`
                    : styles.tab
                }
              >
                {t("案件管理 ❘ 相続税(修正)")}
              </div>
            </Link>
          )}

          
 

          {showProjectDuringLifeTab && projectDuringLifeHref && (
            <Link href={projectDuringLifeHref} passHref>
              <div
                className={
                  activeTab === "projectDuringLife"
                    ? `${styles.tab} ${styles.active}`
                    : styles.tab
                }
              >
                {t("案件管理 | 生前")}
              </div>
            </Link>
          )}


        </div>
      </div>
    </div>
  );
};

export default InterviewInquiryTabs;
