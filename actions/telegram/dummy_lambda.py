import os
import requests
from upstash_redis import Redis
import boto3

# pip3 install --target ./package requests upstash_redis boto3 --upgrade
# cd package
# zip -r ../my_deployment_package.zip .
# cd ..
# zip my_deployment_package.zip dummy_lambda.py

def lambda_handler(event, context):
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])

    chat_id = None
    text = None
    parse_mode = None
    agent_id = None

    response = None

    for parameter in parameters:
        if parameter['name'] == 'chat_id':
            chat_id = parameter['value']
        elif parameter['name'] == 'text':
            text = parameter['value']
        elif parameter['name'] == 'parse_mode':
            parse_mode = parameter['value']
        elif parameter['name'] == 'agent_id':
            agent_id = parameter['value']

    redis = Redis(url=os.environ['UPSTASH_REDIS_REST_URL'], token=os.environ['UPSTASH_REDIS_REST_TOKEN'])

    bot_token = redis.get('telegrambottoken:{}'.format(agent_id))
    if not bot_token:
        return {
            'actionGroup': actionGroup,
            'function': function,
            'functionResponse': {
                'responseBody': {
                    'TEXT': {
                        'body': 'Error: Bot token not found for agent ID {}'.format(agent_id)
                    }
                }
            }
        }

    if function == "sendMessage":
        try:
            url = "https://api.telegram.org/bot{}/sendMessage".format(bot_token)
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
            response = requests.post(url, data=data, headers=headers)
        except:
            raise Exception("Error: {}".format(response.text))
    elif function == "sendVoice":
        try:
            polly_client = boto3.Session().client('polly')
            response = polly_client.synthesize_speech(VoiceId='Ruth',
                                                      OutputFormat='ogg',
                                                      Text = text,
                                                      Engine = 'generative')
            file_name = "output.ogg"
            with open(file_name, 'wb') as file:
                file.write(response['AudioStream'].read())
            url = "https://api.telegram.org/bot{}/sendVoice".format(bot_token)
            with open(file_name, 'rb') as voice_file:
                data = {
                    "chat_id": chat_id,
                }
                files = {
                    "voice": voice_file
                }
                response = requests.post(url, data=data, files=files)
        except:
            raise Exception("Error: {}".format(response.text))
    # elif function == "sendPhoto":
    #     try:
    #         url = "https://api.telegram.org/bot{}/sendPhoto".format(bot_token)
    #         data = {
    #             "chat_id": chat_id,
    #             "photo": text
    #         }
    #         headers = {
    #             "Content-Type": "application/json"
    #         }
    #         response = requests.post(url, data=data, headers=headers)
    #     except:
    #         raise Exception("Error: {}".format(response.text))
    # elif function == "sendVideo":
    #     try:
    #         url = "https://api.telegram.org/bot{}/sendVideo".format(bot_token)
    #         data = {
    #             "chat_id": chat_id,
    #             "audio": text
    #         }
    #         headers = {
    #             "Content-Type": "application/json"
    #         }
    #         response = requests.post(url, data=data, headers=headers)
    #     except:
    #         raise Exception("Error: {}".format(response.text))
    # elif function == "sendDocument":
    #     try:
    #         url = "https://api.telegram.org/bot{}/sendDocument".format(bot_token)
    #         data = {
    #             "chat_id": chat_id,
    #             "document": text
    #         }
    #         headers = {
    #             "Content-Type": "application/json"
    #         }
    #         response = requests.post(url, data=data, headers=headers)
    #     except:
    #         raise Exception("Error: {}".format(response.text))
    # elif function == "getFile":
    #     try:
    #         url = "https://api.telegram.org/bot{}/getFile".format(bot_token)
    #         data = {
    #             "file_id": text
    #         }
    #         headers = {
    #             "Content-Type": "application/json"
    #         }
    #         response = requests.post(url, data=data, headers=headers)
    #     except:
    #         raise Exception("Error: {}".format(response.text))

    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': {
                "TEXT": {
                    "body": "Response: {}".format(response.text)
                }
            }
        }
    }

    dummy_function_response = {'response': action_response, 'messageVersion': event['messageVersion']}

    return dummy_function_response
