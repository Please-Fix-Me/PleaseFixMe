'use client'

import { useEffect, useState } from 'react';
import Button from './Button';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import Link from 'next/link';

type FormData = {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
};

export default function BusinessForm() {
    const [formData, setFormData] = useState<FormData>({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [requestFinished, setRequestFinished] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const businessName = searchParams.get("name")

    useEffect(() => {
        if (!requestFinished) {
            fetch('/api/business/?name=' + businessName, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => res.json())
                .then((res) => res[0])
                .then((res) => {
                    delete res._id
                    delete res.id
                    setFormData(res)
                    setIsLoading(false)
                })
        }
    }, [businessName, isLoading, requestFinished])

    const handleDelete = (e: any) => {
        e.preventDefault();
        setIsLoading(true)

        fetch('/api/business/?name=' + businessName, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
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
                console.log(data);
                alert("Business " + businessName + " deleted.");
                setRequestFinished(true)
                setIsLoading(false)
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Deleting business was not successful.\n" + error.data.message)
                setIsLoading(false)
            });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)

        fetch('/api/business/', {
            method: "PUT",
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
                alert("Business " + businessName + " updated!");
                setIsLoading(false)
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Registering business was not successful.\n" + error.data.message)
            });
    };

    return (
        <div className="min-w-full py-4">
            {
                isLoading ? <LoadingSpinner /> :
                    requestFinished ? <Button>
                        <Link href={'/business'}>Go back to businesses</Link>
                    </Button> :
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <label className="block">
                                    Business Name: {businessName}
                                </label>

                                <label className="block">
                                    Contact Person Name:
                                    <input name="contactName" value={formData.contactName} onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
                                </label>

                                <label className="block">
                                    Contact Email Address:
                                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
                                </label>

                                <label className="block">
                                    Contact Phone Number:
                                    <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
                                </label>

                                <Button>
                                    <input type="submit" className='cursor-pointer' />
                                </Button>
                            </form>
                            <div className='bg-white h-1 my-3'></div>
                            <Button>
                                <div onClick={handleDelete}>
                                    Delete
                                </div>
                            </Button>
                        </div>
            }
        </div>


    );
}