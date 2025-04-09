"use server";

import stripe from "@/app/_lib/stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

export const createSeries = async (series: {
  owner: string,
  name: string,
  price: {
    unit_amount: number,
    currency: string,
  },
  description?: string,
  image?: string,
}) => {
  const {Item} = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: series.owner,
      SK: isTestMode ? "connect_account_test" : "connect_account",
    },
  }))
  if (!Item) {
    throw new Error("Connect account not found");
  }
  // 查询 connectAccountId
  const connectAccountId = Item.id;
  // 在 connect 账户中，创建商品
  const product = await stripe.products.create({
    name: series.name,
    description: series.description ? series.description : undefined,
    images: series.image ? [series.image] : undefined,
  }, {
    stripeAccount: connectAccountId,
  });
  const price = await stripe.prices.create({
    unit_amount: series.price.unit_amount,
    currency: series.price.currency,
    product: product.id,
  }, {
    stripeAccount: connectAccountId,
  });
  // 存储到 dynamodb
  await docClient.send(new PutCommand({
    TableName: "abandon",
    Item: {
      PK: series.owner,
      SK: product.id,
      id: series.name,
      price: price,
      product: product,
      object: "series",
    },
  }));
}

export const createBox = async () => {
  console.log("createBox");
}