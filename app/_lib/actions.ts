"use server";

import stripe from "@/app/_lib/stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuidv4} from "uuid";
import {User} from "@auth0/nextjs-auth0/types";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {s3Client} from "@/app/_lib/s3";

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
  // In the connect account, create a product.
  try {
    const ser_id = uuidv4();
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: series.owner,
        SK: `series#${ser_id}`,
        series: ser_id,
        owner: series.owner,
        price: series.price,
        product: series.product,
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

export const updateSeries = async (series: {
  id: string,
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
  try {
    await docClient.send(new UpdateCommand({
      TableName: "abandon",
      Key: {
        PK: series.owner,
        SK: `series#${series.id}`,
      },
      UpdateExpression: "set #product = :product, #price = :price, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#product": "product",
        "#price": "price",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":product": series.product,
        ":price": series.price,
        ":updatedAt": new Date().toISOString(),
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
      SK: "connect.account",
    },
  }))
  if (!Item) {
    return {ok: false, error: "Connect account not found"}
  }
  try {
    await docClient.send(new UpdateCommand({
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
    }))
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
        price: "price_1RCnbLFPRjptKGEx89Iuqlxr", // TODO: check for prod price
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
        PK: user.sub,
        SK: "customer",
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
      docClient.send(new PutCommand({
        TableName: "abandon",
        Item: {
          PK: user.sub,
          SK: `items#${series}#${item.id}`,
          ...item,
          GPK: `items#${series}`,
          GSK: item.id,
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
          PK: user.sub,
          SK: "customer",
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
        SK: "connect.account",
      },
    }));
    if (connect_account) {
      try {
        // maybe it will transfer fail
        await stripe.transfers.create({
          amount: amount * 0.7,
          currency: 'usd',
          destination: connect_account.id,
          transfer_group: series,
        });
        // if success
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
        // if transfer fail
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
      item: item,
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

export const getS3SignedUrl= async (key: string, contentType: string) => {
  const
    command = new PutObjectCommand({
      Bucket: "abandon.ai",
      Key: key,
      ContentType: contentType,
    });
  // @ts-ignore
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5,
  });
  return {
    ok: true,
    url: url,
  }
}

export const getBalance = async () => {
  return {
    ok: true,
    balance: 0,
  }
}

export const getMyItems = async () => {
  return {
    ok: true,
    items: [],
  }
}

export const getSeriesLogs = async () => {
  return {
    ok: true,
    logs: [],
  }
}

export const getSeriesInfo = async () => {
  return {
    ok: true,
    series: {},
  }
}