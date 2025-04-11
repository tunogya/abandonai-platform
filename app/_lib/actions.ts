"use server";

import stripe from "@/app/_lib/stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
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
        owner: series.owner,
        price: price,
        product: product,
        object: "series",
        GPK: "series",
        GSK: product.id,
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

export const deleteSeries = async (series: {
  owner: string,
  product: {
    id: string,
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
  const connectAccountId = Item.id;
  try {
    await Promise.all([
      docClient.send(new UpdateCommand({
        TableName: "abandon",
        Key: {
          PK: series.owner,
          SK: series.product.id,
        },
        UpdateExpression: "set #active = :active",
        ExpressionAttributeNames: {
          "#active": "active",
        },
        ExpressionAttributeValues: {
          ":active": false,
        },
      })),
      // 在 connect 账户中，归档商品
      stripe.products.update(series.product.id, {
        active: false,
      }, {
        stripeAccount: connectAccountId,
      }),
    ]);
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
    const id = uuidv4();
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: box.series,
        SK: id,
        name: box.name,
        description: box.description,
        image: box.image,
        owner: box.owner,
        object: "box",
        supply: box.supply,
        available: box.supply,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        GPK: "box",
        GSK: id,
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

export const createTopupLink = async (user: {
  sub: string,
  email: string,
  name: string,
}, prod_id: string) => {
  try {
    // 从数据库中获取用户的消费者记录
    const {Item} = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: user.sub,
        SK: isTestMode ? "customer_test" : "customer",
      },
    }))
    // 如果不存在，则创建一个消费者
    let customer;
    if (!Item) {
      const _customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      await docClient.send(new PutCommand({
        TableName: "abandon",
        Item: {
          PK: user.sub,
          SK: isTestMode ? "customer_test" : "customer",
          id: _customer.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          object: "customer",
          GPK: "customer",
          GSK: user.sub,
        },
      }));
      customer = _customer.id;
    } else {
      // 如果存在，则获取其 id
      customer = Item.id;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: isTestMode ? "price_1RCnbLFPRjptKGEx89Iuqlxr" : "price_1RCo4WFPRjptKGExvuO0s63y", // for test
        quantity: 1,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 5000,
        }
      }],
      customer: customer,
      mode: "payment",
      success_url: `${process.env.APP_BASE_URL}/s/${prod_id}`,
      cancel_url: `${process.env.APP_BASE_URL}/s/${prod_id}`,
      payment_intent_data: {
        setup_future_usage: "on_session",
      }
    });
    return {
      ok: true,
      url: session.url
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      error: e
    }
  }
}
