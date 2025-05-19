import React, { useState, useEffect } from 'react';
import styles from '../../styles/pages/settings.module.scss'; // Update the path accordingly
import { useLanguage } from '@/localization/LocalContext';
import { ProjectLegalUpdateLayout1 } from './project-confirm-update-tab';
import InvolvementRecordTabLayout from './involvement-record-tab';
import InterviewInquiryHisotryLayout from './interview-inquiry-history-tab';

interface ProjectConfirmedTabsProps {
    onMainAppTypeChange?: (appType: string) => void;
    onDisableFormChange?: (disable: boolean) => void; // New prop to pass disableForm state up to the parent
    disabledForm?: any
  }
  
  const ProjectConfirmedTabs: React.FC<ProjectConfirmedTabsProps> = ({ onMainAppTypeChange, onDisableFormChange, disabledForm }) => {

    const { t } = useLanguage();

    // Helper function to safely set the tab from URL hash
    const getTabFromHash = () => {
        const hash = window.location.hash.replace('#', '');
        switch (hash) {
            case 'basicDecedentInfo':
            case 'involvementRecord':
            case 'interviewInquiryHistoryBeforeOrder':
                return hash;
            default:
                return 'basicDecedentInfo'; // Default tab
        }
    };

    // State for active tab initialized from URL hash
    const [activeTab, setActiveTab] = useState(getTabFromHash());

    // Effect to update tab based on URL hash change
    useEffect(() => {
        const handleHashChange = () => {
            setActiveTab(getTabFromHash());
        };

        window.addEventListener('hashchange', handleHashChange, false);

        return () => { 
            window.removeEventListener('hashchange', handleHashChange, false);
        };
    }, []);

    // Update URL hash when tab changes
    const changeTab = (newTab: string) => {
        window.location.hash = newTab;
    };

    const [applicationType, setApplicationType] = useState('');

    const handleApplicationTypeChange = (newState: React.SetStateAction<string>) => {
        console.log('newState', newState)
        setApplicationType(newState);
        
        // onMainAppTypeChange(newState as any);
    };

    // const [disableForm, setDisableForm] = useState(false);

    // Function to be passed to the child component
    const handleDisableFormChange = (disable: boolean | ((prevState: boolean) => boolean)) => {
    //   setDisableForm(disable);
    }
    
    


    const renderTabContent = () => {
        switch (activeTab) {
            case 'basicDecedentInfo':
                return <div><ProjectLegalUpdateLayout1 onApplicationTypeChange={handleApplicationTypeChange}   disableForm={disabledForm}
                onDisableFormChange={onDisableFormChange} 
/></div>;
            case 'involvementRecord':
                return <div><InvolvementRecordTabLayout/></div>;
            case 'interviewInquiryHistoryBeforeOrder':
                return <div><InterviewInquiryHisotryLayout/></div>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className={`${styles.tabContainer} mb-2`}>
                <div className={styles.tabs}>
                    <div className={`d-flex ${styles.tabsWrapper}`}>
                        
                        <div
                            className={activeTab === 'basicDecedentInfo' ? `${styles.tab} ${styles.active}` : styles.tab}
                            onClick={() => changeTab('basicDecedentInfo')}
                        >
                            {t('basicDecedentInfo')}
                        </div>
                        <div
                            className={activeTab === 'involvementRecord' ? `${styles.tab} ${styles.active}` : styles.tab}
                            onClick={() => changeTab('involvementRecord')}
                        >
                            {t('involvementRecordWorkLog')}
                        </div>
                        <div
                            className={activeTab === 'interviewInquiryHistoryBeforeOrder' ? `${styles.tab} ${styles.active}` : styles.tab}
                            onClick={() => changeTab('interviewInquiryHistoryBeforeOrder')}
                        >
                            {t('interviewInquiryHistoryBeforeOrder')}
                        </div>
                        {/* Add other tabs similarly */}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ProjectConfirmedTabs;
