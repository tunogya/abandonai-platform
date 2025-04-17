# abandon.ai

## DynamoDB Schema Design Review

1. object customer
   PK: <user.sub>, SK: "customer"
   GPK: "customer", GSK: <customer.id>
2. object items
   PK: <user.sub>, SK: <items#series.id#item.id>
   GPK: <items#series.id>, SK: <item.id>
3. object series
   PK: <user.sub>, SK: <series#series.id>
4. object connect.account
   PK: <user.sub>, SK: "connect.account"
5. object transfer
   PK: <user.sub>, SK: <transfer#uuid.v4>
6. object checkout.session
   PK: <user.sub>, SK: <session.id>
