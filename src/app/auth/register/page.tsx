"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import Link from 'next/link'
import { useSession } from "next-auth/react";

const Register = () => {
    const { status: sessionStatus } = useSession();
    const router = useRouter();
    const [values, setValues] = useState<any>({
        username: "",
        email: "",
        password: ""
    })
    const { username, email, password } = values;
    const [errorMessage, setErrorMessage] = useState("");

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleEvent = (event: any) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value })
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            setErrorMessage("Email is invalid");
            return;
        }
        try {
            const res = await fetch("http://localhost:3000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!res.ok) {
                return setErrorMessage("This email is already registered");
            }
            setErrorMessage("");
            router.push("/auth/login");

        } catch (error) {
            setErrorMessage("This email is already registered");
            console.log(error);
        }
    }

    return (
        sessionStatus !== "authenticated" && (
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="bg-black/50 shadow-2xl shadow-blue-800 p-8 rounded w-96">
                    <h1 className="text-4xl text-center font-semibold mb-8">Register</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                            placeholder="Email"
                            name='username'
                            value={username || ""}
                            onChange={handleEvent}
                            required
                        />
                        <input
                            type="email"
                            className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                            placeholder="Email"
                            name='email'
                            value={email || ""}
                            onChange={handleEvent}
                            required
                        />
                        <input
                            type="password"
                            className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                            placeholder="Password"
                            name='password'
                            value={password || ""}
                            onChange={handleEvent}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-600"
                        >
                            {" "}
                            Register
                        </button>
                        <p className="text-red-600 text-[16px] mb-4">{errorMessage && errorMessage}</p>
                    </form>
                    <div className="text-center text-gray-500 mt-4">- OR -</div>
                    <Link
                        className="block text-center text-blue-500 hover:underline mt-2"
                        href="/login"
                    >
                        Login with an existing account
                    </Link>
                </div>
            </div>
        )
    )
}

export default Register