import React from 'react';
import { useRouter } from 'next/router';
import InquiryTab from '@/components/inquiry-tabs/InquiryTab';
import InquiryTabLayout from '@/components/inquiry-tabs/InquiryTabLayout';

const InquiryEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // You can access the ID here: id as string
  // For example: console.log('Editing inquiry with ID:', id);

  return (
    <InquiryTabLayout>
      <h1>Editing inquiry with ID: {id}</h1>
      <InquiryTab />
    </InquiryTabLayout>
  );
};

export default InquiryEditPage;
