'use client'

import { useEffect, useState } from "react";
import Spinner from "./LoadingSpinner";

interface Bug {
    id: string
    product: string
    description: string
    submittedBy: string
}

export default function BugDisplay() {

    const [data, setData] = useState<Array<Bug>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('/api/bugs/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => setData(data))
            .then((_) => setIsLoading(false))
    }, [])

    return <div className="min-w-full py-4">
        {
            isLoading ? <Spinner/> : 
            <table className="min-w-full text-center">
            <tbody>
                <tr className="border-b-2">
                    <th>Product</th>
                    <th>Description</th>
                    <th>Submitted by</th>
                </tr>
                {
                    data.map((val, i) => {
                        return <tr key={i}>
                            <td>{val.product}</td>
                            <td>{val.description}</td>
                            <td>{val.submittedBy}</td>
                        </tr>
                    })
                }
            </tbody>
        </table>
        }

        
    </div>
}