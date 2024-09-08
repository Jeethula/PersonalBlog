"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const pathname = usePathname();

    const nav = [
        { name: 'home', path: '/' },
        { name: 'tags', path: '/trending' },
        { name: 'write', path: '/write' },
        { name: 'about', path: '/about' },
    ]
    return (
        <nav className="flex gap-x-6 text-gray-500 bg-white sticky top-0 z-10 h-fit lg:mt-6 p-3 w-screen xl:px-56 md:px-24 sm:px-8 px-3 ">
            {nav.map((nav, index) => (
                <Link
                    key={index}
                    href={nav.path}
                    className={`text-lg ${pathname === (nav.path) ? 'text-pink-500 font-bold' : 'text-gray-500 font-semibold'}`}
                >
                    {nav.name}
                </Link>
            ))}
        </nav>
    )
}

export default Navbar