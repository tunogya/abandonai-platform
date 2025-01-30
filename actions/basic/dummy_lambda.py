import boto3
import io
import base64
import json
import httpx
from PIL import Image

AVAILABLE_FORMAT = {"jpeg", "png", "gif", "webp"}
MAX_SIZE = 1568

def preprocessing_image(image_url, target_format=None, re_encoding=False):
    # download image from url
    image_data = httpx.get(image_url).content
    # or read from local
    # image_data = open(image_url, "rb").read()

    # load image to PIL
    image_pil = Image.open(io.BytesIO(image_data))

    # check image format if need re enconding
    image_format = image_pil.format.lower()
    target_format = target_format if target_format else image_format
    if target_format not in AVAILABLE_FORMAT:
        # set to webp by default
        target_format = "webp"
    re_encoding = re_encoding or (target_format != image_format)

    # check image size if need resize
    width, height = image_pil.size
    max_size = max(width, height)
    if max_size > MAX_SIZE:
        width = round(width * MAX_SIZE / max_size )
        height = round(height * MAX_SIZE / max_size )
        image_pil = image_pil.resize((width, height))
        re_encoding = True

    if re_encoding:
        buffer = io.BytesIO()
        # quality: 75 by default | 100 for lossless compression
        image_pil.save(buffer, format=target_format, quality=75)
        image_data = buffer.getvalue()

    image_base64 = base64.b64encode(image_data).decode("utf-8")
    return image_base64, target_format

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
                image_base64, image_format = preprocessing_image(photo_uri, target_format="webp")
                body = json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 2048,
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image",
                                    "source": {
                                        "type": "base64",
                                        "media_type": f"image/{image_format}",
                                        "data": image_base64,
                                    },
                                },
                                {
                                    "type": "text",
                                    "text": prompt
                                }
                            ],
                        }
                    ],
                }, ensure_ascii=False)
                bedrock_runtime = boto3.client('bedrock-runtime', region_name="us-west-2")
                response = bedrock_runtime.invoke_model(
                    body=body, modelId="anthropic.claude-3-5-sonnet-20241022-v2:0"
                )
                function_response = json.loads(response.get('body').read())["content"][0]["text"]
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