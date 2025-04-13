# abandon.ai

## Dynamodb Design

1. object customer
    PK: <user.sub>, SK: "customer"|"customer.test"
2. object logs
    PK: <ser#series.id>, SK: "logs"
3. object customer.balance
    PK: <customer.id>, SK: "customer.balance"
4. object items
    PK: <user.sub>, SK: <items#series.id>
5. object series
    PK: <user.sub>, SK: <ser#series.id>
6. object connect.account
    PK: <user.sub>, SK: "connect.account"|"connect.account.test"
7. object transfer
    PK: <user.sub>, SK: "tx#uuid.v4"