// validationSchema/auth.ts

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// Login Schema
export const loginSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email").required("Please fill this field"),
    password: Yup.string().required("Please fill this field").min(6, "Please enter a minimum of 6 characters for the password.")
});

// Custom hook for login validation
export const useLoginValidation = () => useForm({
    resolver: yupResolver(loginSchema)
});

// Register Schema
export const registerSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    cnfPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Confirm Password is required"),
    terms: Yup.boolean().oneOf([true], "You must agree to the terms and conditions").required(),
});

// Custom hook for register validation
export const useRegisterValidation = () => useForm({
    resolver: yupResolver(registerSchema)
});

