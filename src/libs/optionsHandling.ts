export const introduceByTypesOptions = [
    { value: "tax", label: "税務部" },
    { value: "legal", label: "法務部" },
];

export const statusValidInvalidOptions = [
    { value: "1", label: "有効" },
    { value: "0", label: "無効" },
];

export const situationValidOptions = [
    { value: "0", label: "なし" },
    { value: "1", label: "あり" },
];

export const customerSituationValidOptions = [
    { value: "1", label: "追う" },
    { value: "2", label: "追わない" },
];

export const searchForOptions = [
    { value: "customer", label: "顧客" },
    { value: "family", label: "潜在顧客" },
];

export const phoneTypeOptions = [
    { value: "mobile", label: "携帯" },
    { value: "landline", label: "自宅" },
];

export const questionAirOptions = [
    { value: "2", label: "空白" },
    { value: "1", label: "受領済み" },
];
export const propertyOrderDetailOptions = [
    { value: "5", label: "不動産" },
    { value: "6", label: "弁護士" },
    { value: "7", label: "IFA" },
];

export const assetsOptions = [
    { value: "cash_deposit", label: "現預金" },
    { value: "stock", label: "有価証券" },
    { value: "property", label: "不動産" },
    { value: "life_insurance", label: "生命保険" },

];

export const genderOptions = [
    {
        "value": '1',
        "label": "男"
    },
    {
        "value": '2',
        "label": "女"
    },
    {
        "value": '3',
        "label": "未回答"
    }
];

export const spouseOptions = [
    {
        "value": '1',
        "label": "有"
    },
    {
        "value": '3',
        "label": "無"
    },
    {
        "value": '2',
        "label": "未回答"
    },
];

export const handiCappedOptions = [
    {
        "value": '1',
        "label": "認知症"
    },
    {
        "value": '2',
        "label": "未成年"
    },
    {
        "value": '3',
        "label": "障害者"
    }
];

export const spouseCheckBoxOptions = [
    {
        "value": '1',
        "label": "認知症"
    },
    {
        "value": '2',
        "label": "未成年"
    },
    {
        "value": '3',
        "label": "障害者"
    }
];


const currentYear = new Date().getFullYear();

export const getDynamicJapaneseYears = () => {
    // Define the Japanese eras with their start and end years
    const eras = [
        { name: '明治', start: 1868, end: 1912 },
        { name: '大正', start: 1912, end: 1926 },
        { name: '昭和', start: 1926, end: 1989 },
        { name: '平成', start: 1989, end: 2019 },
        { name: '令和', start: 2019, end: new Date().getFullYear() + 1 } // Assuming current era is 令和
    ];

    let yearOptions: { label: string; value: string; }[] = [];

    eras.forEach(era => {
        for (let year = era.start; year < era.end; year++) {
            let eraYear = year - era.start + 1;
            let label = `${year} (${era.name}${eraYear}年)`;
            yearOptions.push({ label, value: year.toString() });
        }
    });

    return yearOptions;
};

export const yearOptions = getDynamicJapaneseYears();


export const monthOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' }
];

export const dayOptions = Array.from({ length: 31 }, (_, index) => ({
    value: (index + 1).toString(),
    label: (index + 1).toString(),
}));

export const projectTypeOptions = [
    { value: 'inheritance', label: '相続' },
    { value: 'during_life', label: '生前' },
    { value: 'others', label: 'その他' },
    { value: 'all', label: 'すべて' },

];


export const displayUnitsOptions = [
    { value: 'area', label: 'エリア' },
    { value: 'office', label: 'オフィス' },
    { value: 'employee', label: '紹介元' },
];


export const userTypes = [
    { value: 'sales', label: '営業' },
    { value: 'team_leader', label: 'チームリーダー' },
    { value: 'judicial', label: '司法書士' },
];

export const keyMapParam: any = {
    interviewMc: "interviewer1_id",
    worker: "worker1_id",
    manager: "manager_id",
    projectType: "project_category",
    taxOfficeShippingEndDate: "taxOffice_shipping_end_date",
    taxOfficeShippingStartDate: "taxOffice_shipping_start_date",
    valid: "taxoffice_shipping_date_exists",
    introducedBy: "introduced_by",
  };

  export const keyMapParamLegal: any = {
    searchKeyword: "search_keyword",
    proposalNumberChar: "proposal_number_char",
    proposalNumber: "proposal_number",
    decedentName: "decedent_name",
    opportunityStatus: "opportunity_status",
    interviewerId: "interviewer_id",
    workerId: "worker_id",
    officeId: "office_id",
    financialOfficerId: "financial_officer_id",
    heirName: "heir_name",
    projectCategory: "project_category",
    progressStatus: "progress_status",
    limit: "limit", 
  };
  