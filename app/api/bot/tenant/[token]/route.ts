import {NextRequest} from "next/server";

const POST = async (req: NextRequest, {params}: { params: { token: string } }) => {
  const {token} = await params;
  const body = await req.json()

  console.log(body)
  console.log(token)

  return Response.json({
    ok: true,
  });
};

export {POST}