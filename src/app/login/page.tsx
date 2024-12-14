"use client";

import { useState } from 'react';
import { login } from '../serverAction/serverAction';
import { useRouter } from 'next/navigation';

export default function Home() {
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
        <div className='bg-white h-screen flex justify-center items-center'>
            <div className='w-96 h-auto p-10 shadow-lg rounded-lg ' >
                <h2 className='text-sm text-center'>Welcome to</h2>
                <h1 className='text-blue-400 text-4xl font-bold text-center mb-6'>POOJECT</h1>
                    <form action={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto text-black">
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="p-2 border border-blue-400 rounded w-full"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="p-2 border border-blue-400 rounded w-full"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="text-xl p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Log in
                    </button>
                    <div> Do not have an acount? <a href='register' className='text-blue-400 font-bold'>Register</a></div>
                </form>
            </div>
        </div>
    )
}