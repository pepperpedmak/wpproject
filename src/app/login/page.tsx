"use client";

import { useState } from 'react';
import { login } from '../serverAction/serverAction';
import { useRouter } from 'next/navigation';

export default function Home(){
    const router = useRouter();
    
    const [errors, setErrors] = useState<{
        email?: string,
        password?: string,
    }>({});

    const validateForm = (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const newErrors: typeof errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }
        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        return newErrors;
    }

    const handleSubmit = async (formData: FormData) => {
        const validationErrors = validateForm(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const result = await login(formData);
            router.push("/");
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='bg-white  h-screen'>
         <form action={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto text-black">
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
            <button 
                type="submit" 
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Login
            </button>
            <div>Don't have an acount? <a href='register' className='text-blue-500'>register</a></div>
         </form>
        </div>
    )
}