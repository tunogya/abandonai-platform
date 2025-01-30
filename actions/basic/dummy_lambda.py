import boto3
from io import BytesIO
import base64
import json

def lambda_handler(event, context):
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])

    photo_uri = None
    prompt = None

    function_response = None

    for parameter in parameters:
        if parameter['name'] == 'photo_uri':
            photo_uri = parameter['value']
        elif parameter['name'] == 'prompt':
            prompt = parameter['value']

    try:
        if function == "viewPhoto":
            try:
                s3_client = boto3.client('s3')
                s3_response_object = s3_client.get_object(Bucket="abandon.ai", Key=photo_uri)
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
                print(e)
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