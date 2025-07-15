#!/bin/bash


awslocal s3 mb s3://mysamplebucket
awslocal s3api put-bucket-cors --bucket mysamplebucket --cors-configuration file:///etc/localstack/config/cors-config.json
