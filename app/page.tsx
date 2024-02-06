import BugDisplay from "./components/BugDisplay";
import Link from 'next/link';
import Button from "./components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className="">
        <h1 className="text-3xl pb-5">
          Welcome to PleaseFixMe!
        </h1>
        <p>We are working on building the application and will have a version live soon.</p>
        <BugDisplay/>
        <Button>
          <Link href={"/business"}>Business Management</Link>
        </Button>
      </div>
    </main>
  );
}
