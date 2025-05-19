import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkPhoneExists } from '@/app/features/generals/isPhoneExistSlice'; // Adjust the import path as needed
import { RootState } from '@/app/store';
import { AppDispatch } from '@/app/store'; // Adjust the import path as needed
import { resetPhoneExistState } from '@/app/features/generals/isPhoneExistSlice';
export const useCheckPhoneExist = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const [isChecking, setIsChecking] = useState(false);
  const [phoneExists, setPhoneExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

  const checkPhone = useCallback(async (id: any, phone: string, searchType: string) => {
    setIsChecking(true);
    setError(null);
    // setMessage(null);
    try {
      const resultAction = await dispatch(checkPhoneExists({ id, phone, searchType })).unwrap();
      setPhoneExists(resultAction.exists);
    //   setMessage(resultAction.message);
    } catch (err) {
    //   setError(err.message || 'Failed to check phone number.');
    } finally {
      setIsChecking(false);
    }
  }, [dispatch]);

  const resetCheckPhone = useCallback(() => {
    dispatch(resetPhoneExistState());
    setPhoneExists(null);
    setError(null);
  }, [dispatch]);

  // Optionally, use useSelector to directly access the state managed by the slice
  // This approach assumes your slice updates a similar state structure as in the example
  const {exists: phoneExistState, errorMessages, message, } = useSelector((state: RootState) => state.phoneExist);
 
  return { checkPhone, isChecking, phoneExistState, error, message, errorMessages, resetCheckPhone };
};
