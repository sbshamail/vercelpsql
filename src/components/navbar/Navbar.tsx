"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session }: any = useSession();
    return (
        <div>
            <ul className="flex justify-between m-10 item-center">
                <div>
                    <Link href="/">
                        <li>Home</li>
                    </Link>
                </div>
                <div className="flex gap-10">
                    {!session ? (
                        <>
                            <Link href="/auth/login">
                                <li>Login</li>
                            </Link>
                            <Link href="/auth/register">
                                <li>Register</li>
                            </Link>
                        </>
                    ) : (
                        <>
                             {session.user?.email} 
                            <li>
                                <button
                                    onClick={() => {
                                        signOut();
                                    }}
                                    className="p-2 px-5 -mt-1 bg-blue-800 rounded-full"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </div>
            </ul>
        </div>
    );
};

export default Navbar;
