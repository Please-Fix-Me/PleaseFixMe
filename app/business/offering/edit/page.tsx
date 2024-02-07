'use client'

import Link from "next/link";
import Button from "../../../components/Button";
import EditBusinessForm from "@/app/components/EditBusinessForm";
import { useState } from "react";
import { useSearchParams } from 'next/navigation'
import EditOfferingForm from "@/app/components/EditOfferingForm";
import LinkButton from "@/app/components/LinkButton";

export default function Home() {

    const searchParams = useSearchParams();
    const businessName = searchParams.get("businessName")
    const offeringName = searchParams.get("name")

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <div className="">
                <LinkButton href={"/"}>
                    Home
                </LinkButton>
                <h1 className="text-3xl py-5">
                    Edit {offeringName}
                </h1>
                <EditOfferingForm />
            </div>
        </main>
    );
}
