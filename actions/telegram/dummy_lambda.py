import os
from upstash_redis import Redis
import boto3
import telebot
from io import BytesIO

def lambda_handler(event, context):
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])

    chat_id = None
    text = None
    parse_mode = None
    agent_id = None
    function_response = None

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

    try:
        bot_token = redis.get('telegrambottoken:{}'.format(agent_id))
        if not bot_token:
            function_response = 'Error: Bot token not found for agent ID {}'.format(agent_id)
            raise Exception(function_response)

        bot = telebot.TeleBot(bot_token)

        if function == "sendMessage":
            try:
                bot.send_message(chat_id=chat_id, text=text, parse_mode=parse_mode)
                function_response = "Send Success"
            except Exception as e:
                function_response = f"Send Fail"
                raise

        elif function == "sendVoice":
            try:
                voiceId = redis.get('voice:{}'.format(agent_id))
                if not voiceId:
                    voiceId = 'Ruth'
                polly_client = boto3.Session().client('polly')
                response = polly_client.synthesize_speech(VoiceId=voiceId,
                                                          OutputFormat='ogg_vorbis',
                                                          Text = text,
                                                          Engine = 'generative')
                if "AudioStream" not in response or response['AudioStream'] is None:
                    function_response = "Send Fail: No AudioStream in response"
                    raise ValueError(function_response)

                audio_stream = BytesIO(response['AudioStream'].read())
                audio_stream.seek(0)
                bot.send_voice(chat_id=chat_id, voice=audio_stream)
                function_response = "Send Success"
            except boto3.exceptions.Boto3Error as e:
                function_response = f"Send Fail: Error with AWS Polly"
                raise
            except Exception as e:
                function_response = f"Send Fail: Unexpected error"
                raise

    except Exception:
        pass
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