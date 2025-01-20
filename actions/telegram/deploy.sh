pip3 install --target ./package upstash_redis boto3 telebot datetime --upgrade
cd package
zip -r ../my_deployment_package.zip .
cd ..
zip my_deployment_package.zip dummy_lambda.py