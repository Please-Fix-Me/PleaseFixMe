'use client'

import { useEffect, useState } from 'react';
import Button from './Button';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import Link from 'next/link';
import Spinner from './LoadingSpinner';

type ResponseData = {
    name: string;
    businessName: string
};

export default function OfferingsList() {

    const searchParams = useSearchParams();
    const businessName = searchParams.get("name")

    const [data, setData] = useState<Array<ResponseData>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('/api/business/offering?businessName=' + businessName, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    res = res.result
                    setData(res)
                    setIsLoading(false)
                } else {
                    alert(res.result)
                    setIsLoading(false)
                }
            })
    }, [businessName, data])

    return <div className="min-w-full py-4">
        {
            isLoading ? <Spinner/> : 
            <table className="min-w-full text-center">
            <tbody>
                <tr className="border-b-2">
                    <th>Offering</th>
                    <th>Edit</th>
                </tr>
                {
                    data.map((val, i) => {
                        return <tr key={i}>
                            <td>{val.name}</td>
                            <td>
                                <Button>
                                    <Link href={"/business/offering/edit?name=" + val.name + '&businessName=' + val.businessName}>&#9881;</Link>
                                </Button>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
        }
        <Button>
                <Link href={"/business/offering/add?name=" + businessName}>Add a New Offering</Link>
            </Button>
        
    </div>

}