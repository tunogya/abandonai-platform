import boto3
import time

import json


def lambda_handler(event, context):
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])

    chat_id = None
    notes = None
    attachments = None
    function_response = None

    for parameter in parameters:
        if parameter['name'] == 'chat_id':
            chat_id = parameter['value']
        elif parameter['name'] == 'notes':
            notes = parameter['value']
        elif parameter['name'] == 'attachments':
            attachments = parameter['value']

    try:
        if function == "newTreatmentRecord":
            try:
                # use dynamodb to store the treatment record
                dynamodb = boto3.resource('dynamodb',  region_name='us-west-2')
                table = dynamodb.Table('judy')
                response = table.put_item(
                    Item={
                        'PK': 'USER#{}'.format(chat_id),
                        'SK': 'TR#{}'.format(str(time.time())),
                        'type': 'TREATMENT_RECORD',
                        'chat_id': chat_id,
                        'notes': notes,
                        'attachments': attachments,
                        'create_at': int(time.time()),
                    }
                )
                function_response = "Success: Treatment record created"
            except:
                function_response = "Error: Fail to send message"
                raise
        elif function == "getTreatmentRecords":
            try:
                # get the latest 10 treatment records
                dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
                table = dynamodb.Table('judy')
                response = table.query(
                    KeyConditionExpression='PK = :pk',
                    ExpressionAttributeValues={
                        ':pk': 'USER#{}'.format(chat_id)
                    },
                    ScanIndexForward=False,
                    Limit=10
                )
                items = response['Items']
                # return as json string
                function_response = json.dumps(items)
            except:
                function_response = "Error: Fail to send message"
                raise
    except:
        raise
    finally:
        action_response = {
            'actionGroup': actionGroup,
            'function': function,
            'functionResponse': {
                'responseBody': {
                    "TEXT": {
                        "body": function_response
                    }
                }
            }
        }

        dummy_function_response = {'response': action_response, 'messageVersion': event['messageVersion']}

        return dummy_function_response
