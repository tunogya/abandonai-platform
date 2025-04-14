import {NextRequest} from "next/server";
import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest, {params}: {
  params: Promise<{
    id: string
  }>
}) => {
  const {id} = await params;
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    IndexName: "GPK-GSK-index",
    // GPK = "series", GSK = id
    KeyConditionExpression: "GPK = :gpk AND GSK = :gsk",
    ExpressionAttributeValues: {
      ":gpk": "series",
      ":gsk": id,
    },
  }));
  if (!Items?.length) {
    return Response.json({
      ok: false,
      error: "Series not found",
    }, {
      status: 404,
    });
  }
  const series = Items[0];
  const totalAvailable = series?.boxes?.reduce((acc: number, item: any) => {
    return acc + item.available;
  }, 0) || 0;
  // Iterate through the series?.boxes array, sum up each item.supply, and obtain the totalSupply.
  const totalSupply = series?.boxes?.reduce((acc: number, item: any) => {
    return acc + item.supply;
  }, 0) || 0;

  return Response.json({
    ...series,
    boxes: undefined,
    items: undefined,
    totalAvailable,
    totalSupply,
  });
}

export {
  GET
}