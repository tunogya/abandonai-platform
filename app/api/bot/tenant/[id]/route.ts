import {NextRequest} from "next/server";

const POST = async (req: NextRequest, {params}: never) => {
  const {id} = await params;
  const body = await req.json()

  console.log(body)
  console.log(id)

  return Response.json({
    ok: true,
  });
};

export {POST}