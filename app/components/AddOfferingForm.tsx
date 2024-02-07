'use client'

import { useState } from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LinkButton from './LinkButton';

type FormData = {
    name: string;
    businessName: string;
    description: string;
};

export default function BusinessForm() {

    const searchParams = useSearchParams();
    const businessName = searchParams.get("name")!;

    const [formData, setFormData] = useState<FormData>({
        name: '',
        businessName: businessName,
        description: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [requestFinished, setRequestFinished] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)

        fetch('/api/business/offering/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
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
                alert("Offering " + formData.name + " created.");
                setRequestFinished(true)
                setIsLoading(false)
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Adding offering was not successful.\n" + error.data.message)
                setIsLoading(false)
            });
    };

    return (
        <div className="min-w-full py-4">
            {
                isLoading ? <LoadingSpinner /> :
                    requestFinished ? <LinkButton href={'/business/offering?name=' + businessName}>
                        Return to {businessName} offerings
                    </LinkButton> :
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                Offering Name:
                                <input name="name" value={formData.name} onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
                            </label>

                            <label className="block">
                                Offering Description:
                                <textarea name="description" value={formData.description} onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
                            </label>

                            <Button>
                                <input type="submit" className='cursor-pointer' />
                            </Button>
                        </form>
            }
        </div>

    );
}