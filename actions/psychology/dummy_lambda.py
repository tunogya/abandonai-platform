import os
from upstash_redis import Redis
import telebot

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

    if function == "executeCQL":
        try:





            bot.send_message(chat_id, text, parse_mode=parse_mode)
        except:
            raise Exception("Error: Fail to send message")

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
