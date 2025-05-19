import React, { useState, useEffect } from "react";
import styles from "../../styles/components/molecules/pagination.module.scss"; // Assuming you have some CSS module
import SelectField from "../select-field/select-field";
import { useLanguage } from "@/localization/LocalContext";

type PaginationProps = {
  currentPage: number| null;
  lastPage: number| null;
  onFirst: () => void;
  onLast: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPageClick: (page: number) => void;
  onRowLimitChange?: (newLimit: string) => void; // Add this line
  surroundingPages?: number;
  totalNumber: number | string | null;
  fromPage: number| null;
  toPage: number| null;
  recordLimit?: string;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage  ,
  lastPage,
  onFirst,
  onLast,
  onPrev,
  onNext,
  onPageClick,
  surroundingPages = 4,
  totalNumber,
  fromPage,
  toPage,
  onRowLimitChange,
  recordLimit
}) => {
  
  const { t } = useLanguage();
  const [rowLimit, setRowLimit] = useState(recordLimit || '50');
  const rowLimitOptions = [
    { label: t('page25'), value: "25" },
    { label: t('page50'), value: "50" },
    { label: t('page100'), value: "100" },
  ];
  useEffect(() => {
    if(recordLimit)
    setRowLimit(recordLimit);   
  }, [recordLimit]);
  const handleRowLimitChange = (selectedValue: string) => {
    setRowLimit(selectedValue);
    if (onRowLimitChange) {
      onRowLimitChange(selectedValue); 
    }
    
  };

  const getPageNumbers = () => {
    const pages = [];
    const current = currentPage ?? 1; 
    const last = lastPage ?? 1;  

    let startPage = Math.max(current - surroundingPages, 1);
    let endPage = Math.min(current + surroundingPages, last);

    if (current <= surroundingPages + 1) {
      endPage = Math.min(surroundingPages * 2 + 1, last);
    }

    if (current > last - surroundingPages) {
      startPage = Math.max(last - surroundingPages * 2, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const formattedTotalNumber = totalNumber == null ? "0件" : `${totalNumber}件`;
  return (
    <div className="d-flex justify-content-between align-items-end mt-1">
      <div className={styles.pageInfoDetail}>
      該当件数 {formattedTotalNumber}（{fromPage}-{toPage}件を表示中）
      </div>
      <div className="d-flex gap-1 align-items-end">
        <div className={styles.paginationWrapper}>
        <button onClick={onFirst} disabled={currentPage === 1}>
          &lt;&lt;
        </button>
        <button onClick={onPrev} disabled={currentPage === 1}>
          &lt;
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageClick(page)}
            className={`${
              currentPage === page ? styles.activePage : ""
            } bg-white`}
          >
            {page}
          </button>
        ))}

        <button onClick={onNext} disabled={currentPage === lastPage}>
          &gt;
        </button>
        <button onClick={onLast} disabled={currentPage === lastPage}>
          &gt;&gt;
        </button>
      </div>
      <SelectField
        name="rowLimit"
        value={rowLimit}
        options={rowLimitOptions}
        placeholder={t("Select row limit")}
        onChange={(e) => handleRowLimitChange(e.target.value)}
        parentClassName={`${styles.recordLimitDropdown} mb-0`}
      /></div>
    </div>
  );
};

export default Pagination;
