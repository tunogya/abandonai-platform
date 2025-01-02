import {NextRequest} from "next/server";

const POST = async (req: NextRequest) => {
  const body = await req.json()

  console.log(body)

  return Response.json({
    ok: true,
  });
};

export {POST}