"use client";

import { useState } from 'react';
import { register } from '../serverAction/serverAction';

export default function Home() {
    const [errors, setErrors] = useState<{
        email?: string,
        password?: string,
        confirmPassword?: string,
        phone?: string
    }>({});

    const validateForm = (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const phone = formData.get("phone") as string;
        const newErrors: typeof errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = async (formData: FormData) => {
        const validationErrors = validateForm(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const result = await register(formData);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form action={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto text-black">
            <input 
                type="text" 
                name="firstName" 
                placeholder="First Name" 
                required 
                className="p-2 border rounded"
            />
            <input 
                type="text" 
                name="lastName" 
                placeholder="Last Name" 
                required 
                className="p-2 border rounded"
            />
            <div>
                <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone Number" 
                    required 
                    className="p-2 border rounded w-full"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    required 
                    className="p-2 border rounded w-full"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    required 
                    className="p-2 border rounded w-full"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
                <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Confirm Password" 
                    required 
                    className="p-2 border rounded w-full"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            <button 
                type="submit" 
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Register
            </button>
        </form>
    );
}