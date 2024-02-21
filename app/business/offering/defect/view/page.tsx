'use client'

import Link from "next/link";
import Button from "../../../../components/Button";
import EditBusinessForm from "@/app/components/EditBusinessForm";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import EditOfferingForm from "@/app/components/EditOfferingForm";
import LinkButton from "@/app/components/LinkButton";
import Spinner from "@/app/components/LoadingSpinner";
import { ALLOWED_DEFECT_STATES } from "@/app/constants";
import { StatusChangeObj } from "@/app/utils/statusChange";
import Image from 'next/image'
import { Document as MongoDoc } from 'mongodb'

type ResponseData = {
    _id: string
    name: string
    offeringName: string
    businessName: string
    reportedByEmail: string
    status: string
    severity: number
    description: string
    downVotes: number
    upVotes: number
    statusChanges: StatusChangeObj[]
    statusChangeReason: string
    comments: MongoDoc[]
};

export default function Home() {

    const searchParams = useSearchParams();
    const businessName = searchParams.get("businessName")
    const offeringName = searchParams.get("offeringName")
    const adminAuth = searchParams.get("adminAuth") == "true" // Effectively "cast" to a bool
    const id = searchParams.get("id")

    const [data, setData] = useState<ResponseData>({
        _id: '',
        name: '',
        offeringName: '',
        businessName: '',
        reportedByEmail: '',
        status: '',
        severity: -1,
        description: '',
        upVotes: 0,
        downVotes: 0,
        statusChangeReason: '',
        statusChanges: [],
        comments: []
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [toggleRefreshState, setToggleRefreshState] = useState<boolean>(true);
    const [startingStatus, setStartingStatus] = useState<string>('')
    const [requestFinished, setRequestFinished] = useState<boolean>(false);

    const refresh = () => {
        setToggleRefreshState(!toggleRefreshState)
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        console.log(data)

        fetch('/api/business/offering/defect/', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
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
                alert("Defect updated!");
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Updating defect was not successful.\n" + error.data.message)
            });
    };

    const handleDelete = (e: any) => {
        e.preventDefault();
        setIsLoading(true)

        fetch('/api/business/offering/defect?id=' + id + "&name=" + data.name, {
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
                alert("Defect " + data.name + " deleted.");
                setRequestFinished(true)
                refresh()
                setIsLoading(false)
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Deleting defect was not successful.\n" + error.data.message)
                setIsLoading(false)
            });
    }

    const handleCommentDelete = (e: any, commentId: number) => {
        e.preventDefault();
        setIsLoading(true)

        fetch('/api/business/offering/defect?id=' + id + "&name=" + data.name + "&commentId=" + commentId, {
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
                alert("Comment deleted.");
                refresh()
                setIsLoading(false)
            })
            .catch(error => {
                // Handle any errors that occurred while making the request.
                console.error(`Error status: ${error.status}`, error.data);
                alert("Deleting comment was not successful.\n" + error.data.message)
                setIsLoading(false)
            });
    }

    useEffect(() => {
        if (!requestFinished) {
            fetch('/api/business/offering/defect?businessName=' + businessName + '&offeringName=' + offeringName + '&id=' + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        res = res.result[0]
                        setStartingStatus(res.status)
                        setData(res)
                        setIsLoading(false)
                    } else {
                        alert(res.result)
                        setIsLoading(false)
                    }
                })
        }
    }, [businessName, id, offeringName, requestFinished, toggleRefreshState])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <Image
                className="absolute inset-1"
                src={"/favicon.ico"}
                alt={"PleaseFixMe Logo"}
                width={100}
                height={100}
            />
            <div className="min-w-full pl-10">
                <LinkButton href={"/"}>
                    Home
                </LinkButton>
                {" > "}
                <LinkButton href={"/business"}>
                    Businesses
                </LinkButton>
                {" > "}
                <LinkButton href={"/business/offering?name=" + businessName}>
                    {businessName} products
                </LinkButton>
                {" > "}
                <LinkButton href={"/business/offering/defect?businessName=" + businessName + "&offeringName=" + offeringName + "&adminAuth=" + adminAuth}>
                    {offeringName} defects
                </LinkButton>
                <div className="min-w-full flex flex-col items-center">
                    <div className="mx-24">
                        {
                            isLoading ? <div className="pt-4">
                                <Spinner />
                            </div> : requestFinished ? <LinkButton href={"/business/offering/defect?businessName=" + businessName + "&offeringName=" + offeringName + "&adminAuth=" + adminAuth}>
                                Go back to defects
                            </LinkButton> :
                                <div>
                                    <h1 className="text-3xl py-5 text-center">
                                        {offeringName} - {data.name}
                                    </h1>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <label className="block">
                                            Name: {data.name}
                                        </label>
                                        <label className="block">
                                            Description: {data.description}
                                        </label>
                                        <label className="block">
                                            Project: {data.offeringName}
                                        </label>
                                        <label className="block">
                                            Business: {data.businessName}
                                        </label>
                                        <label className="block">
                                            Reported By: {data.reportedByEmail}
                                        </label>
                                        <label className="block">
                                            Severity: {data.severity}
                                        </label>
                                        <label className="block">
                                            Up Votes: {data.upVotes}
                                        </label>
                                        <label className="block">
                                            Down Votes: {data.downVotes}
                                        </label>
                                        <label className="block">
                                            <>Status: </>
                                            <select name="status" value={data.status} onChange={handleChange} className="text-black">
                                                {
                                                    ALLOWED_DEFECT_STATES.map((status) => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))
                                                }
                                            </select>
                                        </label>
                                        {
                                            startingStatus == data.status ? <></> :
                                                <label className="block">
                                                    Status Change Reason:
                                                    <textarea name="statusChangeReason" onChange={handleChange} required className="block mt-1 w-full p-2 border border-gray-300 rounded-md text-black" />
                                                </label>
                                        }

                                        <Button>
                                            <input type="submit" className='cursor-pointer' />
                                        </Button>
                                    </form>
                                    {
                                        adminAuth ? <>
                                            <div className='bg-white h-1 my-3'></div>
                                            <Button>
                                                <div onClick={handleDelete}>
                                                    Delete for SAFETY REASONS
                                                </div>
                                            </Button>
                                        </> : <></>
                                    }
                                    <div className='bg-white h-1 my-3'></div>
                                    {
                                        data.statusChanges ? <div>
                                            <h2 className="text-2xl text-center">
                                                Status Change Log
                                            </h2>
                                            <table className="min-w-full text-center">
                                                <tbody>
                                                    <tr className="border-b-2">
                                                        <th className="px-2 border-r">Status</th>
                                                        <th className='px-2'>Description of Change</th>
                                                    </tr>
                                                    {
                                                        data.statusChanges.map((obj, i) => (
                                                            <tr key={i} className="border-b">
                                                                <td className="border-r">{obj.status}</td>
                                                                <td>{obj.reason}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>

                                        </div> : <></>
                                    }
                                    <div className='bg-white h-1 my-3'></div>
                                    {
                                        data.comments ? <div>
                                            <h2 className="text-2xl text-center">
                                                User Comments
                                            </h2>
                                            <table className="min-w-full text-center">
                                                <tbody>
                                                    <tr className="border-b-2">
                                                        <th className="px-2 border-r">Comment</th>
                                                        <th className='px-2'>Posted At</th>
                                                        {
                                                            adminAuth
                                                                ? <th className="px-2 border-l">Mod. Delete</th>
                                                                : <></>
                                                        }
                                                    </tr>
                                                    {
                                                        data.comments.map((obj, i) => (
                                                            <tr key={i} className="border-b">
                                                                <td className="border-r">{obj.details}</td>
                                                                <td>{new Date(obj.reportedOn).toLocaleString()}</td>
                                                                {adminAuth
                                                                    ? <td className="border-l">
                                                                        <Button>
                                                                            <div onClick={e => handleCommentDelete(e, obj._id)}>
                                                                                X
                                                                            </div>
                                                                        </Button>
                                                                    </td>
                                                                    : <></>}
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div> : <></>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}
