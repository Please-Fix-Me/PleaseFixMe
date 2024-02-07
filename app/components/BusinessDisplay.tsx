'use client'

import { useEffect, useState } from "react";
import Spinner from "./LoadingSpinner";
import Button from "./Button";
import Link from "next/link";
import LinkButton from "./LinkButton";

export default function BusinessDisplay() {

    const [data, setData] = useState<Array<string>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('/api/business/auth', {
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
    }, [])

    return <div className="min-w-full py-4">
        {
            isLoading ? <Spinner/> : 
            <table className="min-w-full text-center">
            <tbody>
                <tr className="border-b-2">
                    <th>Business</th>
                    <th>Offerings</th>
                    <th>Preferences</th>
                </tr>
                {
                    data.map((val, i) => {
                        return <tr key={i}>
                            <td>{val}</td>
                            <td>
                                <LinkButton href={"/business/offering?name=" + val}>
                                    &#128214;
                                </LinkButton>
                            </td>
                            <td>
                                <LinkButton href={"/business/edit?name=" + val}>
                                    &#9881;
                                </LinkButton>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
        }

        
    </div>
}