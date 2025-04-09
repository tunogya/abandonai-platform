import Link from "next/link";

const Page = () => {
  return (
    <div>
      Success
      <Link href={"/create"}>
        Create box
      </Link>
    </div>
  )
}

export default Page;