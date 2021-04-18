#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdksnsDlqLambdaStack } from '../lib/cdksns-dlq-lambda-stack';
import { CdksnsDlqSqsStack } from '../lib/cdksns-dlq-sqs-stack';
import { CdksnsDlqSqsFifoStack } from '../lib/cdksns-dlq-sqs-fifo-stack';


const app = new cdk.App();
new CdksnsDlqLambdaStack(app, 'CdksnsDlqLambdaStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
new CdksnsDlqSqsStack(app, 'CdksnsDlqSqsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
new CdksnsDlqSqsFifoStack(app, 'CdksnsDlqSqsFifoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});