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
pip3 install --target ./package boto3 --upgrade --quiet --disable-pip-version-check

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

# AWS Lambda Update - Function: PsychologyAction-3ojy1 🌩️
aws lambda update-function-code --function-name PsychologyAction-3ojy1 --zip-file fileb://my_deployment_package.zip --region us-west-2 --no-cli-pager

# Delete my_deployment_package.zip
rm -rf my_deployment_package.zip
rm -rf package

# Deployment success message ✨
echo "Lambda function 'PsychologyAction-3ojy1' successfully updated! 🎉"
echo "============================================================="