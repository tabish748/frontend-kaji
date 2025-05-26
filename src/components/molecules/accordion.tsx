import React, { useState } from "react";
import styles from "../../styles/components/molecules/accordion.module.scss";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface AccordionItemProps {
  heading: string;
  label: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  heading,
  label,
  children,
  isOpen = false,
  onToggle,
}) => {
  return (
    <div className={styles.accordionItem}>
      <button
        className={styles.accordionLabel}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`panel-${label}`}
      >
        <div>
          {heading}{" "}
          {label ? <span className={styles.labelWarn}> {label} </span> : ""}
        </div>
        <span className={styles.accordionIcon}>
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>
      <div
        id={`panel-${label}`}
        className={
          isOpen
            ? `${styles.accordionPanel} ${styles.panelOpen}`
            : `${styles.accordionPanel} ${styles.panelClosed}`
        }
      >
        <div className={styles.panelContent}>{children}</div>
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.accordionWrapper}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<AccordionItemProps>,
            {
              isOpen: openIndex === index,
              onToggle: () =>
                setOpenIndex((currentIndex) =>
                  currentIndex === index ? null : index
                ),
            }
          );
        }
        return child;
      })}
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
