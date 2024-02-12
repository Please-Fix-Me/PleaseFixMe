'use client'

import { useEffect, useState } from 'react';
import Button from './Button';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import Link from 'next/link';
import LinkButton from './LinkButton';

type FormData = {
    name: string;
    description: string;
    businessName: string
};

export default function EditOfferingForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        businessName: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [toggleRefreshState, setToggleRefreshState] = useState<boolean>(true);
    const [requestFinished, setRequestFinished] = useState<boolean>(false);

    const refresh = () => {
        setToggleRefreshState(!toggleRefreshState)
    }

    const searchParams = useSearchParams();
    const businessName = searchParams.get("businessName")
    const offeringName = searchParams.get("name")

    useEffect(() => {
        if (!requestFinished) {
            setIsLoading(true)
            fetch('/api/business/offering/?businessName=' + businessName + "&name=" + offeringName, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        res = res.result[0]
                        delete res._id
                        delete res.id
                        setFormData(res)
                    } else {
                        alert(res.result)
                    }
                    setIsLoading(false)
                })
        }
    }, [businessName, offeringName, requestFinished, toggleRefreshState])

    const handleDelete = (e: any) => {
        e.preventDefault();
        setIsLoading(true)

        fetch('/api/business/offering/?businessName=' + businessName + "&name=" + offeringName, {
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
                alert("Products " + offeringName + " deleted.");
                setRequestFinished(true)
                refresh()
                setIsLoading(false)
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Deleting product was not successful.\n" + error.data.message)
                setIsLoading(false)
            });
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)

        fetch('/api/business/offering/', {
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
                // Force a reload
                refresh()

                // Handle the data from the successful response.
                alert("Product " + offeringName + " updated!");
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Updating product was not successful.\n" + error.data.message)
            });
    };

    return (
        <div className="min-w-full py-4">
            {
                isLoading ? <LoadingSpinner /> :
                    requestFinished ? <LinkButton href={'/business/offering?name=' + businessName}>
                    Return to {businessName} products
                </LinkButton> :
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <label className="block">
                                    Product Name: { offeringName }
                                </label>
                                <label className="block">
                                    Product Description:
                                    <textarea name="description" value={formData.description} onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
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