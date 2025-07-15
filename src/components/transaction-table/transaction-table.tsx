import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Using Next.js Image component for better performance and SEO
import SelectField from '../select-field/select-field';
import InputField from '../input-field/input-field';
import InputDateField from '../input-date/input-date';
import LegalStyle from "../../styles/pages/project-legal.module.scss"
import { useLanguage } from '@/localization/LocalContext';
import TextAreaField from '../text-area/text-area';
// import JoditEditor from "jodit-react";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(
    () => import('jodit-react').then(mod => mod.default), // Change this line if JoditEditor is a default export
    { ssr: false }
);

interface Branch {
    bankBranch: string;
    commission: string;
    seal: string;
    transfer: string;
    contactPersonName: string;
    contactPersonPhone: string;
    content: string;
    docSubmissionDate: string;
    estimatedCompletionDate: string;
    completionDate: string;
}

interface Comment {
    id: string;
    commentDate: string;
    comment: string;
}

interface Transaction {
    bank_name: string | undefined;
    id: string;
    bankName: string;
    workerId: string;
    branches: Branch[];
    sectionType: string;
    transComments: Comment[];
}

interface TransactionTableProps {
    transactions: any;
    handleInputChange: any;
    handleCheckboxChange: (index: number, subIndex: number) => void;
    toggleAllCheckboxes: (transactionIndex: number, isChecked: boolean) => void;
    addNewBranch: (index: number) => void;
    deleteBranch: (transactionIndex: number, branchIndex: number) => void;
    addNewComment: (index: number) => void;
    deleteComment: (transactionIndex: number, commentIndex: number) => void;
    selectedRows: { [key: string]: boolean };
    updateSelectedRows: any;
    usersOpt: any;
    removeTransaction: any;
    showRemoveTransactionBtn: any;
    sealOpt: any;
    type: any;
    errors?: any;

}

const TransactionTable: React.FC<TransactionTableProps> = ({
    transactions,
    handleInputChange,
    handleCheckboxChange,
    toggleAllCheckboxes,
    addNewBranch,
    deleteBranch,
    addNewComment,
    deleteComment,
    selectedRows,
    updateSelectedRows,
    usersOpt,
    removeTransaction,
    sealOpt,
    showRemoveTransactionBtn,
    type,
    errors
}) => {
   

    const editor = useRef(null);
    const editorRefs = useRef<(any | null)[]>([]);
    
    const { t } = useLanguage();
    const config = {
        readonly: false,
        toolbar: true,
        buttons: 'bold,italic,underline,strikethrough,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,align,undo,redo,|,hr,eraser,copyformat,|,symbol',
        removeButtons: ['video', 'file', 'audio', 'image', 'source', 'speechRecognize'],
        buttonsXS: 'bold,italic,|,font,fontsize',
        buttonsSM: 'bold,italic,|,font,fontsize',
        buttonsMD: 'bold,italic,|,font,fontsize',
    };
 
    
    const cellStyle: any = {
        border: '1px solid #e6ebf1',
        padding: '8px',
        textAlign: 'center',
        fontSize: '14px'
    };

    const cellStyleCheckBox: any = {
        border: '1px solid #e6ebf1',
        padding: '8px 8px 0px 8px',
        textAlign: 'center',
        fontSize: '14px'
    };

    const mergeStyles = (additionalStyles: { color: string; }) => {
        return { ...cellStyle, ...additionalStyles };
    };

    


    useEffect(() => {
        const newSelectedRows: { [key: string]: boolean } = {};
        transactions.forEach((transaction: { branches: any[]; }, index: any) => {
            transaction.branches.forEach((branch, subIndex) => {
                const key = `${index}-${subIndex}`;
                newSelectedRows[key] = branch.procedurePending === '1';
            });
        });
        updateSelectedRows(newSelectedRows);
    }, [transactions, updateSelectedRows]); // Added updateSelectedRows back to dependencies
    const editorContentRef = useRef<(string | null)[]>(transactions.map(() => null));

    return (
        <div className={LegalStyle.transactionTable} >
            {transactions?.map((item: {
                isCompleted: string;
                sectionType(e: React.ChangeEvent<HTMLInputElement>, index: React.Key | null | undefined, arg2: null, sectionType: any): void;
                notes: string | undefined;
                bankName: string | undefined;
                cancelComments: any; branches: any[]; workerId: string | number | undefined; bank_name: string | undefined; transComments: any[];
            }, index: React.Key | null | undefined) =>
                {
                //  const editorContentRef = useRef(item.notes);
                const handleEditorChange = (newContent: any) => {
                    editorContentRef.current = newContent;
                } 
                    const handleBlur =  () => {
                        
                        handleInputChange({
                            target: {
                                name: 'notes',
                                value: editorContentRef.current || item.notes
                            }
                        }, index, null, item.sectionType);
                    } 
                    return  (
                        <div key={index} className={LegalStyle.financeTableWrapper}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }} className="transactionTable">
                                <thead>
                                    <tr>
                                       
                                        <th>銀行・証券会社名</th>
                                        <th>支店名</th>
                                        <th>窓口連絡先</th>
                                        <th>内容</th>
                                        <th>書類提出日</th>
                                        <th>完了予定日</th>
                                        <th>完了日</th>
                                        <th>手数料</th>
                                        <th>振込</th>
                                        <th>実印</th>
                                        <th>操作</th>
                                        <th>保留</th> 
                                        <th>完了</th>
                                    </tr>
                                </thead>
                                <tbody key={`transaction-${index}`}> {/* Use React.Fragment for valid key prop */}
        
                                    {item?.branches?.map((branch: any, subIndex: number) => (
                                        <>
        
                                            <tr key={`${index}-${subIndex}`} className={
                                                item.isCompleted === '1' 
                                                    ? 'gray-background' 
                                                    : (selectedRows[`${index}-${subIndex}`] || branch.procedurePending === '1') 
                                                        ? 'orange-background' 
                                                        : ''
                                            }>
                                                 
                                                {subIndex === 0 && (
                                                    <td rowSpan={item?.branches?.length} className={(selectedRows[`${index}-${subIndex}`] || branch.procedurePending == '1') ? 'inactive-column' : ''} style={mergeStyles({ color: 'red' })}>
                                                        <InputField
                                                            name="bankName"
                                                            className={LegalStyle.tdMargin}
                                                            value={item?.bankName}
                                                            onChange={(e) => handleInputChange(e, index, null, item.sectionType, null, null)}
                                                            placeholder={t("securitiesCompanyName")}
                                                        />
                                                    </td>
                                                )}
                                                <td style={cellStyle}>
                                                    <InputField
                                                        name="bankBranch"
                                                        className={LegalStyle.tdMargin}
                                                        value={branch.bankBranch}
                                                        onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)} // Corrected
                                                        placeholder={t("branchName")}
                                                       
                                                    /></td>
                                                <td style={cellStyle}><InputField
                                                    name="contactPersonName"
                                                    className={LegalStyle.tdMargin}
                                                    value={branch.contactPersonName}
                                                    onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)} // Corrected
                                                    placeholder={t("contactInfo")}
                                                /></td>
                                                <td style={cellStyle}><InputField name="content" className={LegalStyle.tdMargin} value={branch.content} onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)}
                                                /></td>
                                                <td style={cellStyle}>
                                                    <InputDateField name="docSubmissionDate" className={LegalStyle.tdMargin} value={branch.docSubmissionDate} onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)}
                                                    /></td>
                                                <td style={cellStyle}><InputDateField name="estimatedCompletionDate" maxDate={false} className={LegalStyle.tdMargin} value={branch.estimatedCompletionDate} onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)}
                                                /></td>
                                                <td style={cellStyle}><InputDateField name="completionDate" className={LegalStyle.tdMargin} value={branch.completionDate} onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)}
                                                /></td>
                                                <td style={cellStyle}><InputField name="commission" className={`${LegalStyle.hide_number_arrows} ${LegalStyle.financeField}`} value={branch.commission} type='number' onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)}
                                                /></td>
                                                <td style={cellStyle}><InputField name="transfer" className={`${LegalStyle.financeField}`} value={branch.transfer} onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)}
                                                /></td>
                                                <td style={cellStyle}>
                                                    <SelectField
                                                        name="seal"
                                                        value={branch.seal}
                                                        options={sealOpt}
                                                        onChange={(e) => handleInputChange(e, index, subIndex, item.sectionType)} placeholder={t("regSeal")}
                                                        className={`${LegalStyle.typeDropList} ${LegalStyle.financeField}`}
                                                    />
                                                </td>
                                                <td style={cellStyle} className={(selectedRows[`${index}-${subIndex}`] || branch.procedurePending == '1') ? '' : ''} >
                                                    {
                                                        showRemoveTransactionBtn && <Image
                                                            src="/assets/svg/bin(red).svg"
                                                            width={25}
                                                            height={25}
                                                            alt="Delete Icon"
                                                            className={LegalStyle.binIcon}
                                                            onClick={() => deleteBranch(index as number, subIndex)}
                                                        />
                                                    }
                                                </td>
                                                
                                                <td style={cellStyleCheckBox}>
                                                <input type="checkbox" checked={selectedRows[`${index}-${subIndex}`]} onChange={() => handleCheckboxChange(index as number, subIndex)} /></td>
                                                {subIndex === 0 && (
                                                    <td rowSpan={item.branches.length} style={cellStyle}>
                                                            
        
                                                        <input type="checkbox"
                                                            checked={item.isCompleted == "1" ? true : false}
                                                            onChange={(e) => toggleAllCheckboxes(index as number, e.target.checked)}
                                                        />
                                                    </td>
                                                )}
                                                
                                                
                                            </tr>
                                           
                                        </>
                                    ))}
                                    <tr>
                                        <td colSpan={14} style={cellStyle} >
                                            <button type='button' className={LegalStyle.addNewBranchCmnt}  disabled={item.isCompleted === '1'}  onClick={() => addNewBranch(index as number)}>
                                                <Image
                                                    src="/assets/svg/add(blue).svg"
                                                    width={20}
                                                    height={25}
                                                    alt="Plus Icon"
                                                    className={LegalStyle.plusIconFrist}
                                                /></button>
                                        </td>
                                    </tr>
                                    {
                                        <tr>
                                            <td colSpan={14} style={cellStyle} >
                                                {/* <TextAreaField
                                                    name="notes"
                                                    value={item.notes}
                                                    onChange={(e) => handleInputChange(e, index, null, item.sectionType)} // Corrected
                                                    placeholder={t("remarks")}
                                                /> */}
                                                 <JoditEditor
                                                ref={(el) => editorRefs.current[index as any] = el}
                                                value={item.notes || ''}
                                                    config={config}
                                                        onBlur={handleBlur}
                                                        onChange={handleEditorChange}
                                                    />
                                            </td>
                                        </tr>
                                    }
                                    
                                    {(type === 'balance' ? item.transComments : item.cancelComments)?.map((comment: any, cIndex: number) => (
                                        <tr key={`comment-${index}-${cIndex}`}>
                                            <td colSpan={2} style={cellStyle}>
                                                <InputDateField
                                                    name="commentDate"
                                                    value={comment.commentDate}
                                                    onChange={(e) => handleInputChange(e, index, null, type, true, cIndex)}
                                                    placeholder={t("commentDate")}
                                                    // inputType="datetime-local"
                                                />
                                            </td>
                                            <td colSpan={9} style={cellStyle}>
                                                <TextAreaField
                                                    name="comment"
                                                    value={comment.comment}
                                                    // label={t("comment")}
                                                    className='mb-0'
                                                    placeholder={t("comment")}
                                                    onChange={(e) => handleInputChange(e, index, null, type, true, cIndex)}
        
                                                />
                                            </td>
        
        
        
        
                                            {<td colSpan={4} style={cellStyle}>
                                               {
                                                showRemoveTransactionBtn &&  <button type='button' onClick={() => deleteComment(index as number, cIndex)}>
                                                <Image
                                                    src="/assets/svg/bin(red).svg"
                                                    width={20}
                                                    height={25}
                                                    alt="Delete Icon"
                                                    className={LegalStyle.binIcon}
                                                />
                                            </button>
                                               }
                                            </td>}
        
                                        </tr>
                                    ))}
                                    {
                                        <td colSpan={15} style={cellStyle}> <button type='button'
                                            onClick={() => addNewComment(index as number)}>
                                            <Image
                                                src="/assets/svg/add(blue).svg"
                                                width={20}
                                                height={25}
                                                alt="Add Icon"
                                                className={LegalStyle.plusIcon}
                                            /></button></td>
                                    }
                                </tbody>
                            </table>
                            {
                                showRemoveTransactionBtn && <button className={LegalStyle.removeFinanceRow} type='button'
                                onClick={() => removeTransaction(index)}> &times;
                            </button> 
                            }
                            
                        </div>
                    )
                }
               )}
        </div>
    );
};

export default TransactionTable;
 