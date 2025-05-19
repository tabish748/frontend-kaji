// DashboardTable.tsx

import React, { useEffect, useRef, useState } from "react";
import Style from "../../styles/pages/dashboard.module.scss";
import { useLanguage } from "@/localization/LocalContext";
import { addCommas } from "@/libs/utils";
interface DashboardTableProps {
  mcData: any;
  othersData: any;
  areaData: any;
  officeData?: any;
  grandData: any;
  tab?: string;
  displayUnit?: string;
  searchType?: string;
  officeColors?: any;
  areaColors?: any;
}

const DashboardTable: React.FC<DashboardTableProps> = ({
  mcData:mcData1,
  othersData,
  areaData:areaData1,
  grandData,
  tab,
  officeData:officeData1,
  displayUnit,
  officeColors,
  areaColors,
  searchType
}) => {
  const [mcData, setMcData] = useState(mcData1);
  const [areaData, setAreaData] = useState(areaData1);
  const [officeData, setOfficeData] = useState(officeData1);
  
  useEffect(() => {
    if(mcData1)
      setMcData(mcData1)
    if(areaData1)
      setAreaData(areaData1)
    if(officeData1)
      setOfficeData(officeData1)
  },[mcData1, areaData1, officeData1])

  const dP = displayUnit;
  
  const { t } = useLanguage();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.scrollLeft = tableContainer.scrollWidth;
    }
  }, [mcData, othersData, areaData, officeData, grandData, tab, displayUnit]);


  const sortData = (data:any, key:any, propKey:any, direction:any) => {
    const sortedEntries = Object.entries(data).sort((a:any, b:any) => {
      const aVal = a[1][key][propKey] !== undefined ? a[1][key][propKey] : 0;
      const bVal = b[1][key][propKey] !== undefined ? b[1][key][propKey] : 0;
  
    
      // Normalize values if they are strings with commas, percentages or similar formats
      const normalizeValue = (value:string) => {
        if (typeof value === 'string') {
          if (value.includes('%')) {
            return parseFloat(value.replace('%', ''));
          }
          if (value.includes(',')) {
            return parseFloat(value.replace(/,/g, ''));
          }
        }
        return value;
      };
  
      const normalizedAVal = normalizeValue(aVal);
      const normalizedBVal = normalizeValue(bVal);
  
      
  
      if (normalizedAVal < normalizedBVal) return direction === 'asc' ? -1 : 1;
      if (normalizedAVal > normalizedBVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  
    
  
    // Convert sorted array back to object
    return sortedEntries.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  };
  const handleSort = (fullKey: string) => {
    const index = fullKey.indexOf('_');  // Find the position of the first underscore
    const key = fullKey.substring(0, index);  // Extract everything before the first underscore
    const propKey = fullKey.substring(index + 1);  // Extract everything after the first underscore
  
    const direction = sortConfig.key === fullKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: fullKey, direction });
  
    // Sort each dataset independently and update their states
    const sortedMcData = sortData(mcData, key, propKey, direction);
    const sortedAreaData = sortData(areaData, key, propKey, direction);
    const sortedOfficeData = sortData(officeData, key, propKey, direction);
    
    setMcData(sortedMcData);
    setAreaData(sortedAreaData);
    setOfficeData(sortedOfficeData);
  };
  


  // const sortData = (data: { [x: string]: any; }, key: string, direction: string) => {
  //   // Convert object of objects into an array of objects
  //   alert('yes')
  //   const dataArray = Object.keys(data).map(key => {
  //     return { key, ...data[key] };
  //   });
  
  //   // Sort the array
  //   const sortedArray = dataArray.sort((a, b) => {
  //     alert('test')
  //     const aVal = a[key];
  //     const bVal = b[key];
  //     if (aVal < bVal) {
  //       return direction === 'asc' ? -1 : 1;
  //     }
  //     if (aVal > bVal) {
  //       return direction === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });
  
  //   // Convert array back to object if necessary
  //   const sortedData = {};
  //   sortedArray.forEach(item => {
  //     sortedData[item.key] = { ...item };
  //     delete sortedData[item.key].key; // Remove the key property added for sorting
  //   });
  
  //   return sortedData;
  // };
  
  function renderTableHeaders(headerData: any) {
    if (!headerData || Object.keys(headerData).length === 0) {
      return null;
    }
  
    let mainHeaders = [
      <th key="base-header" className="stickyTh z-1000" rowSpan={2}>
        {displayUnit === 'area' && "エリア"}
        {displayUnit === 'office' && t("オフィス")}
        {displayUnit === 'employee' && t("オフィス")}
      </th>,
      <th key="mc-header" className="stickyTh z-1000" rowSpan={2}>
        {(displayUnit === 'area' || displayUnit === 'office') && ''}
        {(displayUnit === 'employee') && 'MC'}
      </th>,
    ];
  
    let subHeaders: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | React.JSX.Element[] | null | any | undefined = [] ;
    const firstItemKey = Object.keys(headerData)[0];
    const firstItem = headerData[firstItemKey];
  
    Object.keys(firstItem).forEach((key) => {
      if (key !== "Base" && key !== "MC" && key !== "Worker") {
        const properties = firstItem[key];
        let colSpanForDate = Object.keys(properties).length;
  
        mainHeaders.push(
          <th className={`stickyTh month-border`} key={`${key}-header`} colSpan={colSpanForDate}>
            {t(key)}
          </th>
        );
  
        Object.keys(properties).forEach((propKey, index) => { 
          const isLastInGroup = index === Object.keys(properties).length - 1;
          subHeaders.push(
            <th 
              key={`${key}-${propKey}-header`} 
              className={`sub-header stickyTh2 ${isLastInGroup ? 'month-border' : ''}`}
            >
              <div className="header-text" onClick={() => handleSort(`${key}_${propKey}`)}>
                {t(propKey)} 
                {sortConfig.key === `${key}_${propKey}` && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </div>
            </th>
          );
        });
      }
    });
  
    return (
      <thead>
        <tr>{mainHeaders}</tr>
        <tr>{subHeaders}</tr>
      </thead>
    );
  }
  


  const renderTableRow = (data: any, index: string) => {
    
    let matchingOfficeColor;
    if (searchType == 'office' || searchType == 'employee') {
      matchingOfficeColor = officeColors?.find(
        (office: any) => office.office_name === data?.Base
      );
    }
    if (searchType == 'area') {
      matchingOfficeColor = areaColors?.find(
        (item: any) => item.name === data?.Base
      );
    }

    const rowStyle = matchingOfficeColor?.bg_color
      ? {
        backgroundColor: matchingOfficeColor.bg_color == null ? 'transparent' : matchingOfficeColor.bg_color,
        color: matchingOfficeColor.font_color == null ? 'transparent' : matchingOfficeColor.font_color,
      }
      : {};
    return (
      <tr style={rowStyle} key={`data-row-${index}`}>
        <td style={rowStyle}>{data?.Base}</td>
        <td style={rowStyle}>
          {data?.MC || data?.others || data?.office_total || data?.grand_total}
        </td>

        {Object.entries(data).map(([key, value]: any) => {
          if (
            typeof value === "object" &&
            value !== null &&
            key !== "others" &&
            key !== "総計"
          ) {
            return (
              <>
                {tab === "inquiry" ? (
                  <>
                    <td>{addCommas(value?.inquiry_count)}</td>
                    <td>{addCommas(value?.appointment_count)}</td>
                    <td className="month-border">{value?.attraction_rate}</td>
                  </>
                ) : tab === "tab6" ? (
                  <>
                    <td>{addCommas(value?.count)}</td>
                    <td className="month-border">{value?.amount}</td>
                  </>
                ) : (
                  <>
                    <td>{addCommas(value?.interview_count)}</td>
                    <td>{addCommas(value?.contract_count)}</td>
                    <td>{value?.contract_rate}</td>
                    <td>{value?.estimated_amount}</td>
                    <td className="month-border">{value?.order_price}</td>
                  </>
                )}

                {/* {tab == "inquiry" ? (
                  <>
                    <td>{value?.inquiry_count}</td>
                    <td>{value?.appointment_count}</td>
                    <td>{value?.attraction_rate}</td>
                  </>
                ) : (
                  <>
                    <td>{value?.interview_count}</td>
                    <td>{value?.contract_count}</td>
                    <td>{value?.contract_rate}</td>
                    <td>{value?.estimated_amount}</td>
                    <td>{value?.order_price}</td>
                  </>
                )} */}
              </>
            );
          }
          return null;
        })}
      </tr>
    );
  };

  const renderTableBody = () => {

    const mcRows = Object.entries(mcData || {}).map(([key, data]) =>
      renderTableRow(data, key)
    );
    const otherRows = Object.entries(othersData || {}).map(([key, data]) =>
      renderTableRow(data, key)
    );
    const areaRows = Object.entries(areaData || {}).map(([key, data]) =>
      renderTableRow(data, key)
    );
    const officeRows = Object.entries(officeData || {}).map(([key, data]) =>
      renderTableRow(data, key)
    );
    const grandRows = Object.entries(grandData || {}).map(([key, data]) =>
      renderTableRow(data, key)
    );

    return (
      <>
        {mcRows}
        {otherRows}
        {areaRows}
        {officeRows}
        {grandRows}
      </>
    );
  };

  return (
    <div className={Style.tableContainer} ref={tableContainerRef}>
      <table>
        {renderTableHeaders(
          Object.keys(mcData).length > 0
            ? mcData
            : Object.keys(othersData).length > 0
              ? othersData
              : Object.keys(areaData).length > 0
                ? areaData
                : officeData
        )}

        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
