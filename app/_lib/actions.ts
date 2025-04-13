"use server";

import stripe from "@/app/_lib/stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from "uuid";
import {User} from "@auth0/nextjs-auth0/types";

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
      SK: isTestMode ? "connect.account#test" : "connect.account",
    },
  }))
  if (!Item) {
    return {ok: false, error: "Connect account not found"}
  }
  // query connectAccountId
  const connectAccountId = Item.id;
  // In the connect account, create a product.
  try {
    const ser_id = uuidv4();
    const product = await stripe.products.create({
      id: ser_id,
      name: series.product.name,
      description: series.product.description ? series.product.description : undefined,
      images: series.product.image ? [series.product.image] : undefined,
      url: `https://abandon.ai/s/${ser_id}`,
    }, {
      stripeAccount: connectAccountId,
    });
    const price = await stripe.prices.create({
      unit_amount: series.price.unit_amount,
      currency: series.price.currency,
      product: ser_id,
    }, {
      stripeAccount: connectAccountId,
    });
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: series.owner,
        SK: `series#${ser_id}`,
        series: ser_id,
        owner: series.owner,
        price: price,
        product: product,
        object: "series",
        GPK: "series",
        GSK: ser_id,
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
      SK: isTestMode ? "connect.account#test" : "connect.account",
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
      // In the connect account, archived products
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
    await docClient.send(new UpdateCommand({
      TableName: "abandon",
      Key: {
        PK: box.owner,
        SK: `series#${box.series}`,
      },
      UpdateExpression: "set #boxes = list_append(if_not_exists(#boxes, :empty_list), :box)",
      ExpressionAttributeNames: {
        "#boxes": "boxes",
      },
      ExpressionAttributeValues: {
        ":box": [{
          id: id,
          name: box.name,
          description: box.description,
          image: box.image,
          object: "box",
          supply: box.supply,
          available: box.supply,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
        ":empty_list": [],
      },
    }))
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

export const createTopupLink = async (customer: string, success_url: string) => {
  try {
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
      currency: "usd",
      customer: customer,
      mode: "payment",
      success_url: success_url,
      cancel_url: success_url,
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

export const openBox = async (amount: number, customer: string, series: string, owner: string, user: User) => {
  try {
    // Check balance first, make sure enough to do this deal
    const {Item: balance } = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: customer,
        SK: "customer.balance",
      },
    }));
    const userBalance = balance ? balance.balance * -1 : 0;
    if (userBalance < amount) {
      return {
        ok: false,
        error: "Insufficient balance",
      }
    }
    // Query the detailed information of the blind box from the database.
    const { Item: seriesInfo } = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: owner,
        SK: `series#${series}`,
      },
    }));
    const boxes = seriesInfo?.boxes;
    if (boxes.length === 0) {
      return {
        ok: false,
      }
    }

    let selected;
    const total = boxes.reduce((sum: number, p: {
      available: number
    }) => sum + p.available, 0);
    let rand = Math.floor(Math.random() * total);
    for (const box of boxes) {
      if (rand < box.available) {
        box.available  -= 1;
        selected = box;
      }
      rand -= box.available;
    }
    if (!selected) {
      return {
        ok: false,
      }
    }
    // update now boxes info
    await docClient.send(new UpdateCommand({
      TableName: "abandon",
      Key: {
        PK: owner,
        SK: `series#${series}`,
      },
      UpdateExpression: "set boxes = :boxes",
      ExpressionAttributeValues: {
        ":boxes": boxes,
      },
    }));
    const item = {
      id: uuidv4(),
      name: selected.name,
      description: selected.description,
      image: selected.image,
      object: "box",
      shared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    // Deduct from the user's quota, calculate the positive number
    await Promise.all([
      // add info to my items
      docClient.send(new UpdateCommand({
        TableName: "abandon",
        Key: {
          PK: user.sub,
          SK: `items#${series}`,
        },
        UpdateExpression: "set #items = list_append(if_not_exists(#items, :empty_list), :item)",
        ExpressionAttributeNames: {
          "#items": "items",
        },
        ExpressionAttributeValues: {
          ":item": [item],
          ":empty_list": [],
        },
      })),
      // add info to logs
      docClient.send(new UpdateCommand({
        TableName: "abandon",
        Key: {
          PK: `series#${series}`,
          SK: `series.public`,
        },
        UpdateExpression: "set #logs = list_append(if_not_exists(#logs, :empty_list), :log)",
        ExpressionAttributeNames: {
          "#logs": "logs",
        },
        ExpressionAttributeValues: {
          ":log": [{
            user: user,
            item: item,
            createdAt: new Date().toISOString(),
          }],
          ":empty_list": [],
        },
      })),
      // balance transfer from customer at stripe
      stripe.customers.createBalanceTransaction(customer as string, {
        amount: amount,
        currency: "usd",
        description: "Top-up",
      }),
      // balance transfer from customer at dynamodb
      docClient.send(new UpdateCommand({
        TableName: "abandon",
        Key: {
          PK: customer as string,
          SK: "customer.balance",
        },
        // Update user balance, increase by amount_subtotal * -1
        UpdateExpression: "SET balance = if_not_exists(balance, :zero) + :delta, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":delta": amount,
          ":zero": 0,
          ":updatedAt": new Date().toISOString(),
        },
      }))
    ]);
    // Distribute accounts to connect users
    const { Item: connect_account } = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: owner,
        SK: isTestMode ? "connect.account#test" : "connect.account",
      },
    }));
    if (connect_account) {
      try {
        await stripe.transfers.create({
          amount: amount * 0.7,
          currency: 'usd',
          destination: connect_account.id,
          transfer_group: series,
        });
        const _id = uuidv4();
        await docClient.send(new PutCommand({
          TableName: "abandon",
          Item: {
            PK: user.sub,
            SK: `transfer#${_id}`,
            amount: amount * 0.7,
            currency: 'usd',
            destination: connect_account.id,
            transfer_group: series,
            user: user,
            status: "paid",
            object: "transfer",
            createdAt: new Date().toISOString(),
            GPK: "transfer",
            GSK: `transfer#${_id}`,
          },
        }));
      } catch {
        const _id = uuidv4();
        await docClient.send(new PutCommand({
          TableName: "abandon",
          Item: {
            PK: user.sub,
            SK: `transfer#${_id}`,
            amount: amount * 0.7,
            currency: 'usd',
            destination: connect_account.id,
            transfer_group: series,
            user: user,
            status: "draft",
            object: "transfer",
            createdAt: new Date().toISOString(),
            GPK: "transfer",
            GSK: `transfer#${_id}`,
          },
        }))
      }
    }
    return {
      ok: true,
    }
  } catch (e) {
    console.log(e);
    // If the payment fails, return an error.
    return {
      ok: false,
      error: e,
    }
  }
}
