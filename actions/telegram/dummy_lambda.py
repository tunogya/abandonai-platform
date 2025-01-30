import os
from upstash_redis import Redis
import boto3
import telebot
from io import BytesIO
import base64
import json

def lambda_handler(event, context):
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])

    chat_id = None
    text = None
    parse_mode = None
    agent_id = None
    photo_uri = None
    prompt = None

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
        elif parameter['name'] == 'photo_uri':
            photo_uri = parameter['value']
        elif parameter['name'] == 'prompt':
            prompt = parameter['value']

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

        elif function == "viewPhoto":
            try:
                s3_client = boto3.client('s3')
                s3_response_object = s3_client.get_object(Bucket="XXXXXXXXXX", Key=photo_uri)
                buffer = BytesIO(s3_response_object['Body'].read())
                image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
                bedrock_runtime_client = boto3.client('bedrock-runtime')
                payload = {
                    "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "image": {
                                        "format": "jpeg",
                                        "source": {
                                            "bytes": image_base64
                                        }
                                    }
                                },
                                {
                                    "text": prompt
                                }
                            ]
                        }
                    ],
                    "inferenceConfig": {"maxTokens": 512, "temperature": 0.5, "topP": 0.9}
                }
                response = bedrock_runtime_client.invoke_model(
                    body=payload
                )
                response_data = response["body"].read()
                response_json = json.loads(response_data)
                function_response = response_json.get("output", {}).get("message", {}).get("content", [{}])[0].get("text")
            except Exception as e:
                function_response = f"View Photo Failed"
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