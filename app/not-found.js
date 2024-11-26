import Link from "next/link";
export default function NotFound() {
  return (
    <div className="m-5 flex gap-3 items-center justify-center">
      <p>Page not found</p>
      <Link
        href="/"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Go to homepage
      </Link>
    </div>
  );
}
