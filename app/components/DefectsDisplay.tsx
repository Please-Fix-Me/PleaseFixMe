'use client'

import { useEffect, useState } from 'react';
import Button from './Button';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import Link from 'next/link';
import Spinner from './LoadingSpinner';
import LinkButton from './LinkButton';

type ResponseData = {
    id: string
    name: string
    offeringName: string
    businessName: string
    status: string
    severity: number
};

export default function DefectsDisplay() {

    const searchParams = useSearchParams();
    const businessName = searchParams.get("businessName")
    const offeringName = searchParams.get("offeringName")

    const [data, setData] = useState<Array<ResponseData>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('/api/business/offering/defect?businessName=' + businessName + '&offeringName=' + offeringName, {
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
    }, [businessName, offeringName])

    return <div className="min-w-full py-4">
        {
            isLoading ? <Spinner /> :
                <div>
                    <table className="min-w-full text-center">
                        <tbody>
                            <tr className="border-b-2">
                                <th className="px-2">Name</th>
                                <th className='px-2'>Severity</th>
                                <th className="px-2">Status</th>
                                <th className="px-2">More</th>
                            </tr>
                            {
                                data.map((val, i) => {
                                    return <tr key={i}>
                                        <td>{val.name}</td>
                                        <td>{val.severity}</td>
                                        <td>{val.status}</td>
                                        <td>
                                            <LinkButton href={"/business/offering/defect/view?id=" + val.id + '&businessName=' + val.businessName + '&offeringName=' + val.offeringName}>
                                                ...
                                            </LinkButton>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
        }
    </div>
}