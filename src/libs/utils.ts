export const handleNoRecordFound = (router: any , setMessage: { (value: any): void; (arg0: string): void; }, setType: any, redirectPath: string ) => {
  setMessage(['レコードが見つかりませんでした。']);
  setType('fail');
  // setTimeout(() => { 
  //   router.push(redirectPath);
  // }, 2000);
}

export function addCommas(input: any) {
  

  // Convert input to a string to handle various input types
  let str = String(input);

  // Extract any leading or trailing non-numeric characters (e.g., currency symbols, percentages)
  const leadingSymbols = str.match(/^[^\d-]*/)?.[0] || "";
  const trailingSymbols = str.match(/[^\d]*$/)?.[0] || "";

  // Extract the numeric part including a possible leading negative sign
  const numericPart = str.replace(/[^\d.-]/g, '');

  // Convert to a number to handle strings or other input types
  const num = Number(numericPart);

  

  // Check if the input is a valid number
  if (!isNaN(num) && numericPart !== '') {
    // Convert to string and add commas
    const formattedNumber = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Reattach the symbols to the formatted number
    return `${leadingSymbols}${formattedNumber}${trailingSymbols}`;
  }

  // Return the original input if the input is not a valid number
  return input;
}

export function extractDateNeglectTime(timestamp: any) {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);
  
  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const res = `${year}/${month}/${day}`
  
  // Return the formatted date in YYYY/MM/DD format
  return res;
}


export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: January is 0
  const year = date.getFullYear();

  return `${year}年${month}月${day}日 `;
};
export function extractDate(datetimeStr: string) {
  if(datetimeStr)
    {
      const [datePart] = datetimeStr?.split(' ');
      const [year, month, day] = datePart.split('-');
     
      return `${year}/${month}/${day}`;
    }
}
export function extractDateFromISO(datetimeStr: string) {
  return datetimeStr.split('T')[0]; 
}
export function extractDateFromTimeAndSlashes(datetimeStr: string) {
  const [datePart] = datetimeStr.split('T'); // Split date from time
  const [year, month, day] = datePart.split('-'); // Split year, month, and day

  // Format date as desired: ${year}/${month}/${day}
  return `${year}/${month}/${day}`;
}
export const extractDay = (date: Date): string => {
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

  return `(${daysOfWeek[dayIndex]})`;
};

export function scrollToTopSmooth() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
export const getParamValue = (key: string): string | null => {
  // Assuming 'window.location.href' is available (this function should be used in a browser environment)
  const parsedUrl = new URL(window.location.href);
  return parsedUrl.searchParams.get(key);
};

export const scrollToTop = () => {
  document.documentElement.scrollTop = 0;  // For modern browsers
  document.body.scrollTop = 0;  // For Safari
}

export const getCurrentDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`; // Adjust format as necessary
};

export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Pad the month, day, hours, and minutes with leading zeros, if necessary
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  
  return `${year}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}`;
};

export function getCurrentDateTimeForCustomDate() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  let hour = now.getHours().toString();
  let minute = now.getMinutes().toString();

  // Ensure two digits
  hour = hour.padStart(2, '0');
  minute = minute.padStart(2, '0');

  return `${date}T${hour}:${minute}`;
}


export function calculateDaysDifference(selectedDate: string) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset the time portion to midnight

  const targetDate = new Date(selectedDate);
  targetDate.setHours(0, 0, 0, 0); // Reset the time portion to midnight

  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (timeDifference < 0) {

    return `${Math.abs(daysDifference)} 日`;
  } else {
    // If the selected date is in the future
    return `${-daysDifference} 日`; // Return negative integer
  }
}


export function evaluateDate(selectedDate: string) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to start of the current day

  const targetDate = new Date(selectedDate);
  targetDate.setHours(0, 0, 0, 0); // Set to start of the target day

  const timeDifference = targetDate.getTime() - currentDate.getTime();

  // Check if the selected date is in the past
  if (timeDifference < 0) {
    return "期限後"; // Japanese for "Past Date"
  }

  // Check if the selected date is today
  if (timeDifference === 0) {
    return "0"; // Selected date is today
  }

  // If the selected date is in the future
  const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
  return `${daysRemaining}`; // Return the number of days remaining
}

// export function calculateThreeYearsLaterAndDays(selectedDate: string) {
//   if (isNaN(Date.parse(selectedDate))) {
//     console.error('Invalid date provided:', selectedDate);
//     return {
//       futureDate: null, // or use undefined or an appropriate default value
//       daysInNextThreeYears: null
//     };
//   }
//   const startDate = new Date(selectedDate);
//   const endDate = new Date(selectedDate);
//   endDate.setFullYear(startDate.getFullYear() + 3); // Add 3 years

//   // Get current date at midnight
//   const now = new Date();
//   const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

//   // Calculate the difference in days
//   const timeDifference = endDate.getTime() - currentDate.getTime();
//   const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

//   console.log('enddate', endDate, selectedDate)
//   return {
//     futureDate: endDate?.toISOString().split('T')[0].replace(/-/g, '/'), // Returns date in 'YYYY/MM/DD' format
//     daysInNextThreeYears: `${daysDifference} 日`
//   };
  
// }


export function calculateThreeYearsLaterAndDays(selectedDate: string) {
  if (isNaN(Date.parse(selectedDate))) {
    console.error('Invalid date provided:', selectedDate);
    return {
      futureDate: null, // or use undefined or an appropriate default value
      daysInNextThreeYears: null
    };
  }

  const startDate = new Date(selectedDate);
  const endDate = new Date(selectedDate);
  endDate.setFullYear(startDate.getFullYear() + 3); // Add 3 years

  // Get current date at midnight
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // Calculate the difference in days
  const timeDifference = endDate.getTime() - currentDate.getTime();
  let daysDifference: any = Math.floor(timeDifference / (1000 * 3600 * 24));

  

  // Check if daysDifference is negative
  if (Number(daysDifference) < 0) {
    daysDifference = "期限後";
  } else {
    daysDifference = `${daysDifference} 日`;
  }

  return {
    futureDate: endDate.toISOString().split('T')[0].replace(/-/g, '/'), // Returns date in 'YYYY/MM/DD' format
    daysInNextThreeYears: daysDifference
  };
}


export function getDateAfterWeeks(start_date_str: string, weeks: number) {
  // Check if start_date_str is defined and is a string
  if (typeof start_date_str !== 'string') {
    return null; // or you can return a default value or throw an error
  }

  // Parse the start date string in YYYY-MM-DD format
  const [year, month, day] = start_date_str.split("-").map(Number);
  const start_date = new Date(year, month - 1, day);

  // Calculate the number of days to add (weeks * 7)
  const days_to_add = weeks * 7;

  // Add the days to the start date
  start_date.setDate(start_date.getDate() + days_to_add);

  // Format the date back to YYYY-MM-DD
  const end_year = start_date.getFullYear();
  const end_month = String(start_date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const end_day = String(start_date.getDate()).padStart(2, '0');

  return `${end_year}/${end_month}/${end_day}`;
}



export const extractDaysFromString = (daysString?: string | null): number | null => {
  if (!daysString) {
    // If the input is null, undefined, or an empty string, return null
    return null;
  }

  const daysMatch = daysString.match(/\d+/); // Match digits only
  return daysMatch ? parseInt(daysMatch[0], 10) : null; // Return null if no digits found
};

export const getNumbersFromString = (str: any) => {
  const matches = str.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

// utils.ts
export const showOfficeTag = (id: string, name: string) => {
  const colorClasses: any = {
    "1": "magenta-bag",
    "2": "geekBlue-bag",
    "3": "green-bag",
    "4": "gold-bag",
    "5": "purple-bag",
    "6": "cyan-bag",
    "8": "orange-bag",
    "9": "magenta-bag",
    "10": "volcano-bag",
    "11": "red-bag",
    "12": "magenta-bag"
  };

  const className = colorClasses[id] || "default-bag";

  return { id, name, className };
};


export function calculateAge(dob: any) {
  if(!dob)
    return ''
  // Convert dob to Date object if it's not already one
  const dateOfBirth = new Date(dob);

  // Get today's date
  const today = new Date();

  // Calculate age
  let age = today.getFullYear() - dateOfBirth.getFullYear();

  // Adjust age if today's date is before the birth date
  const m = today.getMonth() - dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return `${age} 歳`;
}

export function formatSubmissionMonth(monthString: string) {
  if (!monthString) return '';

  const [year, month] = monthString.split('-');
  const date = `${year}年${parseInt(month, 10)}月`;
  return date;
}

export const replaceDashesWithSlashes = (input: any) => {
  
  if(input)
  {
    const res = input?.replace(/-/g, '/');
    
    return res
  }
};

export const replaceSlashesWithDashes = (input: any) => {
  if (input) {
    return input.replace(/\//g, '-');
  }
  return input;
};

export const getCurrentMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month < 10 ? `0${month}` : month}`;
};

export const getNextThreeMonths = () => {
  const date = new Date();
  const currentMonth = date.getMonth(); // Gets the current month (0-11)
  date.setMonth(currentMonth + 2); // Set the month to three months in the future
  
  const year = date.getFullYear(); // Gets the year of the new date
  const month = date.getMonth() + 1; // Gets the month of the new date (1-12)
  
  return `${year}-${month < 10 ? `0${month}` : month}`;
};


export const getSecondLastMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 11); // Subtract 12 months to get the same month last year
  const year = date.getFullYear();
  const month = date.getMonth() + 1;  // Adding 1 because getMonth() returns months from 0-11
  return `${year}-${month < 10 ? `0${month}` : month}`;
};

export function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (Number.isInteger(num)) {
    return num.toString(); // Return integer part only if no decimal
  }
  return value; // Return as is if there's a decimal that's not .00
}


// helpers/generateDateTranslations.js
export const generateDateTranslations = (startYear: number, currentYear: number): Record<string, string> => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const translations: Record<string, string> = {};

  for (let year = currentYear; year >= startYear; year--) {
    monthNames.forEach((month, index) => {
      const monthIndex = index + 1;
      translations[`${month} ${year}`] = `${year}年${monthIndex.toString().padStart(2, '0')}月`;
    });
    translations[`${year} Total`] = `${year}年 合計`;
  }

  return translations;
};

// dateUtils.js

export const getFormattedDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getDateRangeForLastThreeDays = () => {
  const today = new Date();
  const previousDay1 = new Date(today);
  const previousDay2 = new Date(today);
  const previousDay3 = new Date(today);

  previousDay1.setDate(today.getDate() - 1);
  previousDay2.setDate(today.getDate() - 2);
  previousDay3.setDate(today.getDate() - 3);

  const minDate = getFormattedDate(previousDay3);
  const maxDate = getFormattedDate(today);

  return { minDate, maxDate };
};

export const formatToJapaneseYear = (dateString: any) => {
  if (!dateString) return '';

  // Split the date string by the hyphen, extracting year, month, and day
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    
    return '';  // Return empty string or handle as needed
  }

  const year = parts[0];
  const month = parseInt(parts[1], 10); // Parse month to remove any leading zeros
  const day = parseInt(parts[2], 10); // Parse day to remove any leading zeros

  // Format the date in Japanese style
  return `${year}年${month}月${day}日`;
}
export function removeDecimal(value: string | number) {
  if (typeof value === "number") {
    return Math.trunc(value);
  }
  if (typeof value === "string") {
    const parsedValue = parseFloat(value); 
    if (!isNaN(parsedValue)) {
      const t = Math.trunc(parsedValue); 
      return String(t);
    }
  }
  return '0'; // Return 0 if the input is not a valid number
}