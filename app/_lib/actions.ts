"use server";

import stripe from "@/app/_lib/stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from "uuid";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

export const createSeries = async (series: {
  owner: string,
  product: {
    name: string,
    description?: string,
    image?: string,
  },
  price: {
    unit_amount: number,
    currency: string,
  },
}) => {
  const {Item} = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: series.owner,
      SK: isTestMode ? "connect_account_test" : "connect_account",
    },
  }))
  if (!Item) {
    return {ok: false, error: "Connect account not found"}
  }
  // 查询 connectAccountId
  const connectAccountId = Item.id;
  // 在 connect 账户中，创建商品
  try {
    const product = await stripe.products.create({
      name: series.product.name,
      description: series.product.description ? series.product.description : undefined,
      images: series.product.image ? [series.product.image] : undefined,
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
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: series.owner,
        SK: product.id,
        price: price,
        product: product,
        object: "series",
      },
    }));
    return {ok: true}
  } catch (e) {
    console.log(e)
    return {ok: false, error: e}
  }
}

export const createBox = async (box: {
  owner: string,
  supply: number,
  description: string,
  series: string,
  image: string,
  name: string,
}) => {
  try {
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: box.series,
        SK: uuidv4(),
        name: box.name,
        description: box.description,
        image: box.image,
        owner: box.owner,
        object: "box",
        supply: box.supply,
        available: box.supply,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }));
    return {ok: true}
  } catch (e) {
    console.log(e)
    return {ok: false, error: e}
  }

}

export const createLoginLink = async (connectedAccountId: string) => {
  try {
    const accountLink = await stripe.accounts.createLoginLink(connectedAccountId);
    return {
      ok: true,
      url: accountLink.url
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      error: e
    }
  }
}


