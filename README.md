# abandon.ai

## DynamoDB Schema Design Review

1. object customer
   PK: <user.sub>, SK: "customer"|"customer#test"
   GPK: "customer", GSK: <customer.id>
2. object items
   PK: <user.sub>, SK: <items#series.id>
3. object series
   PK: <user.sub>, SK: <series#series.id>
4. object connect.account
   PK: <user.sub>, SK: "connect.account"|"connect.account#test"
5. object transfer
   PK: <user.sub>, SK: <transfer#uuid.v4>
6. object checkout.session
   PK: <user.sub>, SK: <session.id>
6. TODO: object customer.balance
   PK: <user.sub>, SK: "customer.balance"|""customer.balance#test"
7. TODO: object series.public
   PK: <series#series.id>, SK: "series.public"
