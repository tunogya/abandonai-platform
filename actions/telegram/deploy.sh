pip3 install --target ./package requests upstash_redis boto3 --upgrade
cd package
zip -r ../my_deployment_package.zip .
cd ..
zip my_deployment_package.zip dummy_lambda.py