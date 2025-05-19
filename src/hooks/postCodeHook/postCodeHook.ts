import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/components/use-debounce/use-debounce';

export const usePostCodeLookup = (postCode: string) => {
    const [data, setData] = useState({ prefCode: null, address: null });
    const debouncedPostCode = useDebounce(postCode, 500); // Debounce the postCode

    
  // Add reset function
  const resetPostCodeData = useCallback(() => {
    setData({ prefCode: null, address: null });
  }, []);
  
    useEffect(() => {
        const fetchPostCodeData = async () => {
            if (postCode && postCode.length > 6) {
                try {
                    const response = await fetch(
                        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postCode}`
                    );
                    const jsonData = await response.json();

                    if (jsonData.status === 200 && jsonData.results && jsonData.results.length > 0) {
                        const result = jsonData.results[0];
                        const addressLocal = result.address2 + result.address3;
                        const prefCode = result.prefcode;

                        setData({ prefCode, address: addressLocal });
                    }
                } catch (error) {
                    console.error("Error fetching postcode data:", error);
                    setData({ prefCode: null, address: null });
                }
            }
        };
        if (debouncedPostCode && debouncedPostCode.length > 6) {
            fetchPostCodeData();
        }
    }, [debouncedPostCode, postCode]);

    return { ...data, resetPostCodeData };
};
