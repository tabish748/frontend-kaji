import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { checkEmailExists } from '../pathToYourSlice/isEmailExistSlice';
import { checkEmailExists, resetEmailExistState } from '@/app/features/generals/isEmailExistSlice';
import { RootState } from '@/app/store';
// Updated to accept searchType
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '@/app/store'; // Adjust the import path as needed

export const useCheckEmailExist = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const [isChecking, setIsChecking] = useState(false);
    const [emailExists, setEmailExists] = useState<any>(false);
    const [error, setError] = useState<any>('');
    const [toast, setToast] = useState<any>({ message: "", type: "" });


    const checkEmail = useCallback(async (id: any, email: string, searchType: any) => {
        if (email.trim() === '') {
            setError('Email cannot be empty.');
            return;
        }
        setIsChecking(true);
        setError('');
        try {
            const resultAction = await dispatch(checkEmailExists({ id, email, searchType } as any));

            if (checkEmailExists.fulfilled.match(resultAction)) {
                setEmailExists(resultAction.payload.exists);
            } else {
                setError('Failed to check email.');
            }
        } catch (err) {
            setError('An error occurred.');
        } finally {
            setIsChecking(false);
        }
    }, [dispatch]);

    const resetCheckEmail = useCallback(() => {
        dispatch(resetEmailExistState());
        setEmailExists(null);
        setError(null);
      }, [dispatch]);

    const { exists, message, errorMessages } = useSelector((state: RootState) => state.emailExist);
    
    return { checkEmail, isChecking, emailExists, error, toast, exists, message, errorMessages, resetCheckEmail };

};
