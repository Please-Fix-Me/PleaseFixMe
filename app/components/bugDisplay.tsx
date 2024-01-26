'use client'

import { useEffect, useState } from "react";

interface Bug {
    id: string
    product: string
    description: string
    submittedBy: string
}

export default function BugDisplay() {

    const [data, setData] = useState<Array<Bug>>([]);

    useEffect(() => {
        fetch('/api/bugs/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => setData(data))
    }, [])

    return <div className="min-w-full py-4">
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
    </div>
}