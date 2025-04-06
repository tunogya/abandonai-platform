import { auth0 } from "@/app/_lib/auth0";

const Page = async () => {
  const session = await auth0.getSession();

  return (
    <div className={"min-h-screen"}>
      <h1>Welcome to the Abandon</h1>
    </div>
  );
};

export default Page;