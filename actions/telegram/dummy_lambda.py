import os
from upstash_redis import Redis
import boto3
import telebot
from datetime import datetime

# pip3 install --target ./package upstash_redis boto3 telebot --upgrade
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
    bot = telebot.TeleBot(bot_token)

    if function == "sendMessage":
        try:
            bot.send_message(chat_id=chat_id, text=text, parse_mode=parse_mode)
        except:
            raise Exception("Error: Fail to send message")
    elif function == "sendVoice":
        try:
            polly_client = boto3.Session().client('polly')
            response = polly_client.synthesize_speech(VoiceId='Ruth',
                                                      OutputFormat='ogg_vorbis',
                                                      Text = text,
                                                      Engine = 'generative')
            if "AudioStream" not in response or response['AudioStream'] is None:
                raise ValueError("Polly synthesis failed: No AudioStream in response")

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            temp_dir = "/tmp"
            file_name = os.path.join(temp_dir, f"output_{timestamp}.ogg")
            with open(file_name, 'wb') as file:
                file.write(response['AudioStream'].read())
            with open(file_name, 'rb') as voice_file:
                bot.send_voice(chat_id=chat_id, voice=voice_file)
        except boto3.exceptions.Boto3Error as e:
            print(f"Error with AWS Polly: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': {
                "TEXT": {
                    "body": "Response: Send Success"
                }
            }
        }
    }

    dummy_function_response = {'response': action_response, 'messageVersion': event['messageVersion']}

    return dummy_function_response
