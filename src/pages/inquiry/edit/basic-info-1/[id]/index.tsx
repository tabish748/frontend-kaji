import React from 'react';
import { useRouter } from 'next/router';
import BasicInfo1TabEdit from '@/components/inquiry-tabs/BasicInfo1TabEdit';
import InquiryTabLayout from '@/components/inquiry-tabs/InquiryTabLayout';

const BasicInfo1EditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // You can access the ID here: id as string
  // For example: console.log('Editing BasicInfo1 with ID:', id);

  return (
    <InquiryTabLayout>
      <BasicInfo1TabEdit />
    </InquiryTabLayout>
  );
};

export default BasicInfo1EditPage; 