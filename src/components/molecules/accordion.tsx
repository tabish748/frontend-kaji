import React, { useState } from "react";
import styles from "../../styles/components/molecules/accordion.module.scss";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface AccordionItemProps {
  heading: string;
  label: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  heading,
  label,
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.accordionItem}>
      <button
        className={styles.accordionLabel}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`panel-${label}`}
      >
        <div>
          {heading} <span className="red"> {label} </span>
        </div>
        <span className={styles.accordionIcon}>
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>
      <div
        id={`panel-${label}`}
        className={
          open
            ? `${styles.accordionPanel} ${styles.panelOpen}`
            : `${styles.accordionPanel} ${styles.panelClosed}`
        }
        style={{ display: open ? "block" : "block" }}
      >
        {children}
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className={styles.accordionWrapper}>
      {children}
      {totalPages > 1 && onPageChange && (
        <div className={styles.pagination}>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? styles.activePage : ""}
              onClick={() => onPageChange(i + 1)}
              disabled={page === i + 1}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Accordion;
