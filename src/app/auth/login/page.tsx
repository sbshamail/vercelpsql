"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from 'next/link'

const Login = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [values, setValues] = useState<any>({
    email: "",
    password: ""
  })
  const { email, password } = values;
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

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

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log(res)
    if (res?.error) {
      setErrorMessage("Invalid email or password");
    }
    else if (res?.url) router.replace("/");
    else {
      setErrorMessage("");
    }

  }

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-black/50 shadow-2xl shadow-blue-800 p-8 rounded w-96">
          <h1 className="text-4xl text-center font-semibold mb-8">Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
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
              Login
            </button>
            <p className="text-red-600 text-[16px] mb-4">{errorMessage && errorMessage}</p>
          </form>
          <button
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            onClick={() => {
              signIn("github");
            }}
          >
            Sign In with Github
          </button>
          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            className="block text-center text-blue-500 hover:underline mt-2"
            href="/register"
          >
            Register Here
          </Link>
        </div>
      </div>
    )
  )
}

export default Login