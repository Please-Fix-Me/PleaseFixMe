'use client'

import Link from "next/link";
import Button from "../../../components/Button";
import { useState } from "react";
import { useSearchParams } from 'next/navigation'
import OfferingsList from "@/app/components/OfferingsList";
import AddOfferingForm from "@/app/components/AddOfferingForm";
import LinkButton from "@/app/components/LinkButton";


export default function Home() {

    const searchParams = useSearchParams();
    const businessName = searchParams.get("name");

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <div className="min-w-full">
                <LinkButton href={"/"}>
                    Home
                </LinkButton>
                {" > "}
                <LinkButton href={"/business"}>
                    Businesses
                </LinkButton>
                {" > "}
                <LinkButton href={"/business/offering?name=" + businessName}>
                    {businessName} offerings
                </LinkButton>
                <h1 className="text-3xl py-5 text-center">
                    Add Offering for {businessName}
                </h1>
                <div className="min-w-full flex flex-col items-center">
                    <div className="w-96">
                        <AddOfferingForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
