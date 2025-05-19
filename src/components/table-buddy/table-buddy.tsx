import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/molecules/table-buddy.module.scss";
import { useLanguage } from "@/localization/LocalContext";
import Image from "next/image";
import Button from "../button/button";
import { SortingIcon } from "@/libs/svgIcons";
import debounce from 'lodash/debounce'; // You might need to install lodash or just its debounce module

interface Column {
  header: string;
  accessor: string;
  cellStyle?: any;
  isSort?: boolean;
}

interface TableBuddyProps {
  columns: Column[];
  data: any[];
  loading: boolean;
  onSort?: (accessor: string) => void;
  sortedColumn?: string | null; // Add this
  sortDirection?: "asc" | "desc" | ""; // Add this:
  fixedColumns?: boolean;
  isForm?: boolean;
  isSubmitLoading?: boolean;
  onSubmit?: () => void;
  onCheckboxChange?: (
    id: string,
    isChecked: boolean,
    checkboxType: string
  ) => void;
  checkedItems?: { [key: string]: { [key: string]: boolean } };
  getRowStyle?: any;
  onCheckedItemsChange?: (newCheckedItems: {
    [key: string]: { [key: string]: boolean };
  }) => void; // Add this line
  className?: string;
  stickyHeaders?: boolean;
}

const TableBuddy: FC<TableBuddyProps> = ({
  columns,
  data,
  loading,
  onSort,
  sortedColumn,
  sortDirection,
  fixedColumns = false,
  isForm = false,
  onSubmit,
  onCheckboxChange,
  checkedItems = {},
  onCheckedItemsChange,
  isSubmitLoading,
  className,
  stickyHeaders=true
}) => {
  const { t } = useLanguage();
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {}
  );
  const tableRef = useRef<HTMLTableElement>(null);
  const [widthsCalculated, setWidthsCalculated] = useState(false);
  const lastKnownScrollPosition = useRef(0);
  const scrollThreshold = 250;
  const bufferZone = 50; 
  const lastScrollY = useRef(window.scrollY);

  const checkHeaderState = debounce(() => {
    const currentScrollY = window.scrollY;
    if ((currentScrollY > scrollThreshold + bufferZone && !isHeaderFixed) ||
        (currentScrollY < scrollThreshold - bufferZone && isHeaderFixed)) {
      setIsHeaderFixed(!isHeaderFixed);
      if (!widthsCalculated) {
        calculateWidths();
        setWidthsCalculated(true);
      }
    }
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', checkHeaderState);
    return () => {
      window.removeEventListener('scroll', checkHeaderState);
    };
  }, [isHeaderFixed]);

  // const handleScroll = debounce(() => {
  //   const scrollY = window.scrollY;
  //   const bufferZone = 50; // Adjust this value to increase or decrease the buffer zone
  //   let shouldBeFixed = isHeaderFixed;

  //   if (scrollY > 250 && scrollY > lastKnownScrollPosition.current + bufferZone) {
  //     shouldBeFixed = true;
  //   } else if (scrollY < 250 || scrollY < lastKnownScrollPosition.current - bufferZone) {
  //     shouldBeFixed = false;
  //   }

  //   lastKnownScrollPosition.current = scrollY;
  //   setIsHeaderFixed(shouldBeFixed);

  //   if (!widthsCalculated && shouldBeFixed) {
  //     calculateWidths();
  //     setWidthsCalculated(true);
  //   }
  // }, 100);
  
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [widthsCalculated]);

  useEffect(() => {
    const onResize = () => {
      if (widthsCalculated) {
        calculateWidths();
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [widthsCalculated, data]);

  const calculateWidths = () => {
    if (!tableRef.current) return;

    const table = tableRef.current;
    const tbodyCells = table.querySelectorAll("tbody tr:first-child td");
    const theadCells = table.querySelectorAll("thead th");

    tbodyCells.forEach((cell, index) => {
      const width = (cell as HTMLElement).offsetWidth;
      if(stickyHeaders)
       (theadCells[index] as HTMLElement).style.width = `${width}px`;
    });
  };

  // const renderCellContent = (content: ReactNode) => {
  //   if (React.isValidElement(content)) {
  //     return content;
  //   }
  //   return <span>{content}</span>;
  // };
  const renderCellContent = (content: ReactNode, cellStyle?: string) => {
    // Check if the content is a React element (e.g., custom component).
    if (React.isValidElement(content)) {
      // If the content is a React element, render it directly.
      // Optionally, you can apply additional styles or classes here as well.
      return <div style={{width: 'fit-content'}} className={`${cellStyle ? styles[cellStyle] : ''} ${styles.tableCell}`}>{content}</div>;
    } else {
      // For simple text or numeric content, render within a span.
      // Apply any determined styles or classes.

      return <span className={cellStyle ? styles[cellStyle] : ''}>{content}</span>;
    }
  };

  const showCheckBoxInListing = (
    id: string,
    dataValue: string | null,
    checkboxType: string
  ) => {
    const checkboxKey = checkboxType === "checkbox" ? "checkbox1" : "checkbox2";
    const isHeaderChecked = checkedState[checkboxType] || false; // Check if the header checkbox is checked
    let isChecked;

    // If the header checkbox is checked, all checkboxes should be checked unless individually unchecked
    if (isHeaderChecked) {
      isChecked = checkedItems[checkboxKey][id] !== false; // false only if individually unchecked
    } else {
      // If the header checkbox is not checked, use individual checkbox state
      isChecked = checkedItems[checkboxKey][id] || false;
    }
    
    return (dataValue == null || dataValue == 'null' || dataValue === "") ? (
      <input
        type="checkbox"
        id={`checkbox-${checkboxType}-${id}`}
        name={`checkbox-${checkboxType}-${id}`}
        checked={isChecked}
        onChange={(e) =>
          onCheckboxChange &&
          onCheckboxChange(id, e.target.checked, checkboxKey)
        }
      />
    ) : (
      "入金済"
    );
  };

  const isCheckboxColumn = (accessor: string) => {
    return accessor === "checkbox" || accessor === "checkbox2";
  };

  const handleHeaderCheckboxChange = (accessor: string) => {
    const isAllChecked = !checkedState[accessor] || false;
    const newCheckedState = { ...checkedState, [accessor]: isAllChecked };
    let newCheckedItems = { ...checkedItems };
    const checkboxKey = accessor === "checkbox" ? "checkbox1" : "checkbox2";
    newCheckedItems[checkboxKey] = newCheckedItems[checkboxKey] || {};
    data.forEach((row) => {
      newCheckedState[`${row.id}-${checkboxKey}`] = !isAllChecked;
      if (!isAllChecked) {
        const { [row.id]: _, ...rest } = newCheckedItems[checkboxKey];
        newCheckedItems[checkboxKey] = rest;
      } else {
        newCheckedItems[checkboxKey][row.id] = true;
      }
    });
    setCheckedState(newCheckedState);
    if (onCheckedItemsChange) {
      onCheckedItemsChange(newCheckedItems);
    }
  };



  return (
    <div
      className={`${styles.tableContainer} ${className || ""} ${fixedColumns ? styles.fixedColumns : ""
        }  ${isHeaderFixed ? styles.headerFixed : ""}`}
    >
      {loading && (
        <div className={styles.overlay}>
          <div className={styles.loader}></div>
        </div>
      )}

      <table className={`${styles.table} `} ref={tableRef}>
        <thead  >
          {/* {isHeaderFixed && <tr className={styles.headerPlaceholder}><th colSpan={columns.length}></th></tr>} */}
          <tr className={stickyHeaders == true ? styles.stickyTableHeader : ''}>
            {columns.map((col, index) =>
            (
              <th
                key={index}
                style={{
                  cursor: isCheckboxColumn(col.accessor)
                    ? "default"
                    : "pointer",
                }}
                onClick={() => {
                  if (!isCheckboxColumn(col.accessor) && col.isSort !== false && onSort) {
                    onSort(col.accessor);
                  }
                }
                }
              >
                <div className="d-flex">
                  {isCheckboxColumn(col.accessor) ? (
                    // Render a checkbox for checkbox columns
                    <>
                      <input
                        type="checkbox"
                        checked={checkedState[col.accessor] || false}
                        onChange={() =>
                          handleHeaderCheckboxChange(col.accessor)
                        }
                      />{" "}
                      &nbsp;
                      <p>{col.accessor == "checkbox" ? "着手金" : "残金"}</p>
                    </>
                  ) : (
                    // For other columns, render header and sorting arrows
                    <>
                      {col.header}
                      {col.header !== "" && (
                        <div className={styles.arrowWrapper}>
                          <span
                            className={`${styles.arrow} ${styles.arrowUp} 
                              ${sortedColumn === col.accessor &&
                                sortDirection === "asc"
                                ? styles.arrowActive
                                : ""
                              }`}
                          >
                            {/* <Image
                              src="/assets/svg/sorting-icon.svg"
                              alt="icon"
                              width={10}
                              height={10}
                            /> */}
                            {col.isSort == false ? '' : (onSort && <SortingIcon className={styles.arrowSvg} />)}


                          </span>
                          <span
                            className={`${styles.arrow} ${styles.arrowDown}
                              ${sortedColumn === col.accessor &&
                                sortDirection === "desc"
                                ? styles.arrowActive
                                : ""
                              }`}
                          >
                            {col.isSort == false ? '' : (onSort && <SortingIcon className={styles.arrowSvg} />)}

                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${row.isDangerHighlighted ? styles.dangerHighlightedRow : ""
                  } ${row.isWarnHighlighted ? styles.warnHighlightedRow : ""}`}
              >
                {columns.map((col, colIndex) => {
                  // Determine the cell's content based on the column accessor.
                  const cellValue = row[col.accessor];
                  // Determine the cell's style if a cellStyle function is provided for this column.
                  const cellStyle = col.cellStyle
                    ? col.cellStyle(cellValue)
                    : undefined;

                  if (
                    col.accessor === "checkbox" ||
                    col.accessor === "checkbox2"
                  ) {
                    // For checkbox columns, render a checkbox with specific logic.
                    return (
                      <td key={colIndex}>
                        {showCheckBoxInListing(
                          row.id,
                          col.accessor === "checkbox"
                            ? row.prgrsPaymentDate
                            : row.prgrsBalanceDepositDate,
                          col.accessor
                        )}
                      </td>
                    );
                  } else {
                    // For other columns, render the cell content.
                    // Apply the determined cell style directly to the cell or use a className from your styles module.
                    return (
                      <td key={colIndex} className={`${styles[cellStyle as any]}`}>
                        {renderCellContent(cellValue)}
                      </td>
                    );
                  }
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                {t("recordNotFound")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isForm && (
        <div className={styles.formSubmitButtonContainer}>
          <Button
            text={t("tableFormSubmitBtn")}
            type="primary"
            isLoading={isSubmitLoading}
            size="small"
            fullWidth={false}
            className={styles.submitBtn}
            onClick={() => onSubmit && onSubmit()}
          />
        </div>
      )}
    </div>
  );
};

export default TableBuddy;
