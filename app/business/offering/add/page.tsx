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
            <div className="">
                <LinkButton href={"/"}>
                    Home
                </LinkButton>
                <h1 className="text-3xl py-5">
                    Add Offering for {businessName}
                </h1>
                <AddOfferingForm/>

            </div>
        </main>
    );
}
