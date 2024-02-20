import LinkButton from "./components/LinkButton";
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className="">
        <Image 
          className="absolute inset-1"
          src={"/favicon.ico"} 
          alt={"PleaseFixMe Logo"}
          width={100}
          height={100}
        />
        <h1 className="text-3xl pb-5">
          Welcome to PleaseFixMe!
        </h1>

        <p className="pt-3">
          If you are a user of products managed by PleaseFixMe and wish to report a defect, use the button below.
        </p>
        <LinkButton href={"http://pleasefixme.arawaksoftware.com/#/"}>
          Defect Reporting
        </LinkButton>

        <p className="pt-3">
          If you are a business administrator or moderator, click the button below.
        </p>
        <LinkButton href={"/business"}>
          Business Management
        </LinkButton>
      </div>
    </main>
  );
}
