# abandon.ai

## Dynamodb Design

1. Get customer info of stripe.
    PK: <user.sub>, SK: "customer"|"customer_test"
2. Get public logs of series
    PK: <ser#series.id>, SK: "logs"
3. Get customer balance of stripe
    PK: <customer.id>, SK: "customer.balance"
4. Get my items
    PK: <user.sub>, SK: <ser#series.id>
5. Get info of series
    PK: <user.sub>, SK: <ser#series.id>
6. Get connect account
    PK: <user.sub>, SK: "connect_account"|"connect_account_test"