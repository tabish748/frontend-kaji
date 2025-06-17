import React from 'react';
import InquiryTab from '@/components/inquiry-tabs/InquiryTab';
import InquiryTabLayout from '@/components/inquiry-tabs/InquiryTabLayout';

const InquiryCreatePage: React.FC = () => {
  return (
    <InquiryTabLayout>
      <InquiryTab />
    </InquiryTabLayout>
  );
};

export default InquiryCreatePage;
