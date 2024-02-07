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
            isLoading ? <Spinner /> :
                <div>
                    <table className="min-w-full text-center">
                        <tbody>
                            <tr className="border-b-2">
                                <th className="px-2">Business</th>
                                <th className="px-2">Offerings</th>
                                <th className="px-2">Preferences</th>
                            </tr>
                            {
                                data.map((val, i) => {
                                    return <tr key={i}>
                                        <td>{val}</td>
                                        <td>
                                            <LinkButton href={"/business/offering?name=" + val}>
                                                <div className="text-xl my-1">
                                                    &#128214;
                                                </div>
                                            </LinkButton>
                                        </td>
                                        <td>
                                            <LinkButton href={"/business/edit?name=" + val}>
                                                <div className="text-3xl ">
                                                    &#9881;
                                                </div>
                                            </LinkButton>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    <div className="pt-3">
                        <LinkButton href={"/business/register"}>
                            Register a New Business
                        </LinkButton>
                    </div>
                </div>
        }


    </div>
}