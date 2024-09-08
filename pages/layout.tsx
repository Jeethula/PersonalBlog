"use client"
import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AvatarGenerator } from 'random-avatar-generator';
import { nameByRace } from "fantasy-name-generator";
import { useEffect } from "react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
  });

export default function Layout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const generator = new AvatarGenerator();
    const avathar = generator.generateRandomAvatar();
    const name = nameByRace("human")
    localStorage.setItem("author", name as string);
    localStorage.setItem("authorImg", avathar);
    }, [])
      
    return (
        <div className={`${poppins.className} antialiased`}>
         <Toaster />
         <Navbar />
         <section className="flex-grow flex flex-col xl:mx-56 md:mx-24 sm:mx-8 mx-1 px-1">
              {children}
        </section>
        </div>
    );
    }