import React, { useState } from "react";
import styles from "../../styles/components/molecules/accordion.module.scss";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface AccordionItemProps {
  heading: React.ReactNode;
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
        type="button"
        className={styles.accordionLabel}
        onClick={() => {
          console.log("AccordionItem button clicked:", { heading, isOpen });
          onToggle?.();
        }}
        aria-expanded={isOpen}
        aria-controls={`panel-${label}`}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {heading}
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
  openIndex?: number | null;
  onToggle?: (index: number) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  page = 1,
  totalPages = 1,
  onPageChange,
  openIndex: externalOpenIndex,
  onToggle: externalOnToggle,
}) => {
  const [internalOpenIndex, setInternalOpenIndex] = useState<number | null>(null);

  const isControlled = externalOpenIndex !== undefined && externalOnToggle !== undefined;
  const openIndex = isControlled ? externalOpenIndex : internalOpenIndex;

  const handleToggle = (index: number) => {
    console.log("Accordion toggle clicked - index:", index, "current openIndex:", openIndex);
    
    if (isControlled) {
      externalOnToggle!(index);
    } else {
      setInternalOpenIndex((currentIndex) => {
        const newIndex = currentIndex === index ? null : index;
        console.log("Setting new openIndex:", newIndex);
        return newIndex;
      });
    }
  };

  return (
    <div className={styles.accordionWrapper}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<AccordionItemProps>,
            {
              isOpen: openIndex === index,
              onToggle: () => {
                console.log("Child accordion clicked:", index);
                handleToggle(index);
                (child as React.ReactElement<AccordionItemProps>).props.onToggle?.();
              },
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
              // disabled={page === i + 1}
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
