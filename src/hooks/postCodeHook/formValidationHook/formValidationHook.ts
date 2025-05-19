// // hooks/useFormWithValidation.js
// import { useState, useCallback } from 'react';

// const useFormWithValidation = (initialState: any, validators: any, onSubmit: (arg0: any) => any) => {
//   const [formState, setFormState] = useState(initialState);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const validate = useCallback((name: string | number, value: any) => {
//     if (validators[name]) {
//       for (const validation of validators[name]) {
//         const error = validation(value, formState);
//         if (error) return error;
//       }
//     }
//     return null;
//   }, [formState, validators]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     const error = validate(name, value);
//     setFormState((prev: any) => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: error }));
//   }, [validate]);

//   const handleBlur = useCallback((e: { target: { name: any; value: any; }; }) => {
//     const { name, value } = e.target;
//     const error = validate(name, value);
//     setErrors(prev => ({ ...prev, [name]: error }));
//   }, [validate]);

//   const handleSubmit = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     let isValid = true;
//     const newErrors = {};
//     Object.keys(formState).forEach(name => {
//       const value = formState[name];
//       const error = validate(name, value);
//       if (error) {
//         isValid = false;
//         newErrors[name] = error;
//       }
//     });

//     setErrors(newErrors);
//     if (isValid) {
//       await onSubmit(formState);
//     }
//     setIsSubmitting(false);
//   };

//   return { formState, handleChange, handleBlur, handleSubmit, errors, isSubmitting };
// };

// export default useFormWithValidation;
