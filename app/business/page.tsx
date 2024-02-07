import Link from "next/link";
import Button from "../components/Button";
import BusinessDisplay from "../components/BusinessDisplay";
import LinkButton from "../components/LinkButton";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <div className="">
                <LinkButton href={"/"}>
                    Home
                </LinkButton>
                <h1 className="text-3xl py-5">
                    Manage a Business
                </h1>
                <BusinessDisplay />
                <LinkButton href={"/business/register"}>
                    Register a New Business
                </LinkButton>
            </div>
        </main>
    );
}
