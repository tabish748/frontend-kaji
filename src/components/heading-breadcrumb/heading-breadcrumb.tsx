// HeadingBreadcrumb.tsx

import styles from "../../styles/components/molecules/heading-breadcrumb.module.scss"; // Assuming you have a CSS module for it.

interface HeadingBreadcrumbProps {
  title: string;
  breadcrumbs?: string[];
}

const HeadingBreadcrumb: React.FC<HeadingBreadcrumbProps> = ({
  title,
  breadcrumbs,
}) => {
  return (
    <div className={styles.breadcrumbContainer}>
      <div className="  d-flex align-items-center ">
        <div className={styles.primaryCircle}></div>
        <h1
          className={`${styles.headingBuddy} ${styles.dark} ${styles.heading}`}
        >
          {title}
        </h1>
      </div>

      {/* <div className={styles.breadCrumbTxt}>
        {breadcrumbs &&
          breadcrumbs.map((crumb, idx) => (
            <span key={idx} className={styles.crumb}>
              {crumb}
              {idx < breadcrumbs.length - 1 && " / "}
            </span>
          ))}
      </div> */}
    </div>
  );
};

export default HeadingBreadcrumb;
