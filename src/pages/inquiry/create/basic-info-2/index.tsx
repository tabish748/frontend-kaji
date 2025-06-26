import { useEffect } from 'react';
import { useRouter } from 'next/router';
import BasicInfo2Tab from '@/components/inquiry-tabs/BasicInfo2Tab';
import InquiryTabLayout from '@/components/inquiry-tabs/InquiryTabLayout';

export default function BasicInfo2Page() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the HK tab as the default
    router.replace('/inquiry/create/basic-info-2/hk');
  }, [router]);

  // Return null or a loading state while redirecting
  return null;
} 