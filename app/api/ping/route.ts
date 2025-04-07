import {NextRequest, NextResponse} from "next/server";
import {verifyToken} from "@/app/_lib/jwt";
import {unauthorized} from "next/navigation";

const POST = async (req: NextRequest) => {
  try {
    await verifyToken(req.headers.get("authorization")?.split(" ")?.[1]);
  } catch {
    unauthorized()
  }

  return new NextResponse("pong");
}

export {POST}