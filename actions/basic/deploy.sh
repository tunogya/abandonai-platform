#!/bin/bash

# Extreme Geek Mode: Booting the ABANDON AI PLATFORM PROGRAM 🚀
echo "Initiating ABANDON AI PLATFORM PROGRAM... *Deploying to AWS Lambda* 🛠️"
echo "============================================================="

# Packaging Phase: Clean slate, incoming binaries. 💥
echo "Packing... 🧳"
rm -rf package
rm -rf my_deployment_package.zip
echo "Clearing previous artifacts... Done ✅"

echo "Fetching and installing dependencies... 🔥"
pip3 install --platform manylinux2014_aarch64 --only-binary=:all: --target ./package boto3 httpx pillow --upgrade --disable-pip-version-check

# Transition to the packaging folder 🎁
cd package
echo "Zipping dependencies... 🔐"
zip -r ../my_deployment_package.zip . > /dev/null 2>&1
cd ..

# Adding the lambda entry point 🧑‍💻
echo "Including dummy_lambda.py to the zip archive... 🗂️"
zip my_deployment_package.zip dummy_lambda.py > /dev/null 2>&1

echo "Packaging Complete 🎉"
echo "============================================================="

# AWS Lambda Deployment Phase 🚀
echo "Deploying to AWS Lambda... 🎯"

# AWS Lambda Update - Function: BasicAction-jv0e4 🌩️
aws lambda update-function-code --function-name BasicAction-jv0e4 --zip-file fileb://my_deployment_package.zip --region us-west-2 --no-cli-pager

# Deployment success message ✨
echo "Lambda function 'BasicAction-jv0e4' successfully updated! 🎉"
echo "============================================================="