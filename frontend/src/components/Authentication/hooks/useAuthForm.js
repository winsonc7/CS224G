// hooks/useAuthForm.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authSchema } from '../utils/schema';

const defaultValues = {
  fullName: '',
  preferredName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  disclaimer: false,
  credentials: '',
  practice: ''
};

export const useAuthForm = (isLogin, { onSignInSuccess, onSignUpSuccess, signIn, signUp, userType = 'client' }) => {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm({
    defaultValues,
    resolver: yupResolver(authSchema),
    mode: 'onChange',
    context: { isSignup: !isLogin, userType }
  });

  const onSubmit = async (data) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        // Login flow
        const { error: signInError } = await signIn({
          email: data.email,
          password: data.password
        });
        
        if (signInError) {
          throw signInError;
        }
        
        onSignInSuccess();
      } else {
        // Prepare user data based on user type
        const userData = {
          full_name: data.fullName,
          preferred_name: data.preferredName,
          date_of_birth: data.dateOfBirth,
          disclaimer_accepted: data.disclaimer,
          disclaimer_accepted_at: new Date().toISOString(),
          user_type: userType
        };
        
        // Add therapist-specific fields if applicable
        if (userType === 'therapist') {
          userData.credentials = data.credentials;
          userData.practice = data.practice;
        }
        
        // Signup flow - directly attempt signup without checking email
        const { error: signUpError } = await signUp({
          email: data.email,
          password: data.password,
          options: {
            data: userData
          }
        });
        
        if (signUpError) {
          throw signUpError;
        }
        
        onSignUpSuccess();
      }
    } catch (err) {
      // Handle and display any errors
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    error,
    reset,
    setValue,
    getValues
  };
};