import Link from "next/link";
import Button from "../../components/Button";
import RegisterBusinessForm from "../../components/RegisterBusinessForm";
import LinkButton from "@/app/components/LinkButton";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <div className="">
                <LinkButton href={"/"}>
                    Home
                </LinkButton>
                <h1 className="text-3xl py-5">
                    Register a Business
                </h1>
                <RegisterBusinessForm/>
            </div>
        </main>
    );
}
