import { ReactNode } from "react";
import styles from "../../styles/components/molecules/client-section.module.scss";

interface ClientSectionProps {
  heading: string;
  children: ReactNode;
}

const ClientSection = ({ heading, children }: ClientSectionProps) => {
  return (
    <div className={styles.clientSectionContainer}>
      <h2 className={styles.clientSectionHeading}>{heading}</h2>
      <div className={styles.clientSectionContent}>{children}</div>
    </div>
  );
};

export default ClientSection;
