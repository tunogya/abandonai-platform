import json
import os
import requests

# pip3 install --target ./package requests --upgrade
# cd package
# zip -r ../my_deployment_package.zip .
# cd ..
# zip my_deployment_package.zip dummy_lambda.py

# {
#   "Version": "2012-10-17",
#   "Id": "default",
#   "Statement": [
#     {
#       "Sid": "agentsInvokeFunction",
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "bedrock.amazonaws.com"
#       },
#       "Action": "lambda:invokeFunction",
#       "Resource": "arn:aws:lambda:us-east-1:913870644571:function:TelegramAction-hwwal"
#     }
#   ]
# }

def lambda_handler(event, context):
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])
    print(event)
    print("function: {}".format(function))
    print("Parameters: {}".format(parameters))

    chat_id = None
    text = None
    parse_mode = None

    response = None

    return {
        "response": {
            'actionGroup': actionGroup,
            'function': function,
            'functionResponse': {
                'responseBody': "ok"
            },
        "messageVersion": event['messageVersion'],
    }

    for parameter in parameters:
        if parameter['name'] == 'chat_id':
            chat_id = parameter['value']
        elif parameter['name'] == 'text':
            text = parameter['value']
        elif parameter['name'] == 'parse_mode':
            parse_mode = parameter['value']

        if function == "sendMessage":
            try:
                url = "https://api.telegram.org/bot{}/sendMessage".format(os.environ['TELEGRAM_BOT_TOKEN'])
                if parse_mode:
                    data = {
                        "chat_id": chat_id,
                        "text": text,
                        "parse_mode": parse_mode
                    }
                else:
                    data = {
                        "chat_id": chat_id,
                        "text": text,
                    }
                headers = {
                    "Content-Type": "application/json"
                }
                response = requests.post(url, data=json.dumps(data), headers=headers)
                print("Response: {}".format(response.text))
            except:
                print("Error: {}".format(response.text))
                raise Exception("Error: {}".format(response.text))
        elif function == "sendPhoto":
            try:
                url = "https://api.telegram.org/bot{}/sendPhoto".format(os.environ['TELEGRAM_BOT_TOKEN'])
                if parse_mode:
                    data = {
                        "chat_id": chat_id,
                        "photo": text,
                        "parse_mode": parse_mode
                    }
                else:
                    data = {
                        "chat_id": chat_id,
                        "photo": text
                    }
                headers = {
                    "Content-Type": "application/json"
                }
                response = requests.post(url, data=json.dumps(data), headers=headers)
                print("Response: {}".format(response.text))
            except:
                print("Error: {}".format(response.text))
                raise Exception("Error: {}".format(response.text))
        elif function == "sendVideo":
            try:
                url = "https://api.telegram.org/bot{}/sendVideo".format(os.environ['TELEGRAM_BOT_TOKEN'])
                if parse_mode:
                    data = {
                        "chat_id": chat_id,
                        "audio": text,
                        "parse_mode": parse_mode
                    }
                else:
                    data = {
                        "chat_id": chat_id,
                        "audio": text
                    }
                headers = {
                    "Content-Type": "application/json"
                }
                response = requests.post(url, data=json.dumps(data), headers=headers)
                print("Response: {}".format(response.text))
            except:
                print("Error: {}".format(response.text))
                raise Exception("Error: {}".format(response.text))
        elif function == "sendDocument":
            try:
                url = "https://api.telegram.org/bot{}/sendDocument".format(os.environ['TELEGRAM_BOT_TOKEN'])
                if parse_mode:
                    data = {
                        "chat_id": chat_id,
                        "document": text,
                        "parse_mode": parse_mode
                    }
                else:
                    data = {
                        "chat_id": chat_id,
                        "document": text
                    }
                headers = {
                    "Content-Type": "application/json"
                }
                response = requests.post(url, data=json.dumps(data), headers=headers)
                print("Response: {}".format(response.text))
            except:
                print("Error: {}".format(response.text))
                raise Exception("Error: {}".format(response.text))
        elif function == "getFile":
            try:
                url = "https://api.telegram.org/bot{}/getFile".format(os.environ['TELEGRAM_BOT_TOKEN'])
                data = {
                    "file_id": text
                }
                headers = {
                    "Content-Type": "application/json"
                }
                response = requests.post(url, data=json.dumps(data), headers=headers)
                print("Response: {}".format(response.text))
            except:
                print("Error: {}".format(response.text))
                raise Exception("Error: {}".format(response.text))

    responseBody = {
        "TEXT": {
            "body": "Response: {}".format(response.text)
        }
    }

    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': responseBody
        }
    }

    dummy_function_response = {'response': action_response, 'messageVersion': event['messageVersion']}
    print("Response: {}".format(dummy_function_response))

    return dummy_function_response
