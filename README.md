# abandon.ai

## Dynamodb Design

1. object customer
   PK: <user.sub>, SK: "customer"|"customer#test"
2. object items
   PK: <user.sub>, SK: <items#series.id>
3. object series
   PK: <user.sub>, SK: <series#series.id>
4. object connect.account
   PK: <user.sub>, SK: "connect.account"|"connect.account#test"
5. object transfer
   PK: <user.sub>, SK: <tx#uuid.v4>
6. object customer.balance
   PK: <customer.id>, SK: "customer.balance"
7. TODO: object series.public
   PK: <series#series.id>, SK: "series.public"
