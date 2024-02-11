'use client'

import Link from "next/link";
import Button from "../../../components/Button";
import EditBusinessForm from "@/app/components/EditBusinessForm";
import { useState } from "react";
import { useSearchParams } from 'next/navigation'
import EditOfferingForm from "@/app/components/EditOfferingForm";
import LinkButton from "@/app/components/LinkButton";
import DefectsDisplay from "@/app/components/DefectsDisplay";

export default function Home() {

    const searchParams = useSearchParams();
    const businessName = searchParams.get("businessName")
    const offeringName = searchParams.get("offeringName")
    const id = searchParams.get("id")

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
                    {businessName} products
                </LinkButton>
                <h1 className="text-3xl py-5 text-center">
                    {offeringName} defects
                </h1>
                <div className="min-w-full flex flex-col items-center">
                    <div className="w-96">
                        <DefectsDisplay />
                    </div>
                </div>
            </div>
        </main>
    );
}
