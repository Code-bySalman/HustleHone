"use client"
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png"; 
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import {dark} from "@clerk/themes"
import { useTheme } from "next-themes";

export default function Navbar() {
  const {theme} = useTheme();
  return (
    <header className="shadow-sm dark:shadow-gray-300 p-4 border-b-4 bg-white dark:bg-black border-black dark:border-white">
      <div className=" mx-4  flex max-w-9xl justify-between items-center gap-3">
       
        <Link href={"/"} className="flex items-center gap-3">
           <Image src={logo} alt="Logo" width={100} height={130} className="rounded-sm"/>
           <span className="text-3xl font-bold tracking-tighter text-black dark:text-white">
            HustleHone
           </span>
        </Link>
        <div className="flex items-center gap-3">
        <ThemeToggle/>
        <UserButton 
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
            elements: {
                AvatarBox: {
                    width: 35,
                    height: 35,
                }
             
            },
        }}>
            <UserButton.MenuItems>
                <UserButton.Link label="Billing"
                labelIcon={<CreditCard className="size-4"/> }
                href="/billing"
                />
            </UserButton.MenuItems>
        </UserButton>
        </div>
      </div>
    </header>
  );
}