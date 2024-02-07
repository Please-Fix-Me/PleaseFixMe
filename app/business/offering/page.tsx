'use client'

import Link from "next/link";
import Button from "../../components/Button";
import { useState } from "react";
import { useSearchParams } from 'next/navigation'
import OfferingsList from "@/app/components/OfferingsList";
import LinkButton from "@/app/components/LinkButton";


type FormData = {
    password: string;
};

export default function Home() {
    const [formData, setFormData] = useState<FormData>({
        password: ''
    });
    const [isAuth, setIsAuth] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const searchParams = useSearchParams();
    const businessName = searchParams.get("name")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch('/api/business/auth/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: businessName,
                password: formData.password
            })
        })
            .then(res => {
                if (!res.ok) {
                    // If the response status is not ok, parse the response body as JSON and return a Promise that rejects with the error message and data.
                    return res.json().then(data => Promise.reject({ status: res.status, data }));
                }
                // If the response status is ok, parse the response body as JSON.
                return res.json();
            })
            .then(data => {
                // Handle the data from the successful response.
                setIsAuth(true)
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Authentication was not successful.\n" + error.data.message)
            });
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <div className="">
                <LinkButton  href={"/"}>
                    Home
                </LinkButton>
                <h1 className="text-3xl py-5">
                    Edit {businessName} Offerings
                </h1>
                {
                    isAuth ? <OfferingsList /> :
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                Password:
                                <input name="password" value={formData.password} onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
                            </label>

                            <Button>
                                <input type="submit" className='cursor-pointer' />
                            </Button>
                        </form>
                }


            </div>
        </main>
    );
}
