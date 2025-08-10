import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page(){
    return <main className="max-w-7xl mx-auto px-3 py-6 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white">Billing Success</h1>
        <p className="text-gray-700 dark:text-gray-300">
            Your billing was successful! Thank you for your support.
        </p>
        <Button  asChild>
         <Link href="/resumes">Go to resumes</Link>
        </Button>
    </main>
}