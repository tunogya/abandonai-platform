import Link from "next/link";

const Page = () => {
  return (
    <div>
      Error
      <Link href={"/series/create"}>
        Create series again
      </Link>
    </div>
  )
}

export default Page;