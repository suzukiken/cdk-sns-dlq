import * as cdk from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as sns from '@aws-cdk/aws-sns';
import * as iam from '@aws-cdk/aws-iam';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as lambda from '@aws-cdk/aws-lambda';
import { PythonFunction } from "@aws-cdk/aws-lambda-python";

export class CdksnsDlqStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLowerCase().replace("stack", "")

    const topic = new sns.Topic(this, 'topic', {
      topicName: PREFIX_NAME + '-topic'
    })
    
    const lambda_function = new PythonFunction(this, "lambda_function", {
      entry: "lambda",
      index: "index.py",
      handler: "lambda_handler",
      functionName: PREFIX_NAME + "-function",
      runtime: lambda.Runtime.PYTHON_3_8,
      timeout: cdk.Duration.seconds(3),
    })
    
    topic.addSubscription(new subscriptions.LambdaSubscription(lambda_function))
    
    const dead_letter_queue = new sqs.Queue(this, 'dead_letter_queue', {
      queueName: PREFIX_NAME + '-dead_letter_queue',
      retentionPeriod: cdk.Duration.days(10),
    })
    
    const statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [dead_letter_queue.queueArn],
      actions: ['SQS:SendMessage'],
      conditions: { ArnEquals: { 'aws:SourceArn': topic.topicArn } },
      principals: [ new iam.ServicePrincipal('sns.amazonaws.com') ]
    })
    
    dead_letter_queue.addToResourcePolicy(statement)
    
    new sns.Subscription(this, 'subscription', {
      endpoint: lambda_function.functionArn,
      protocol: sns.SubscriptionProtocol.LAMBDA,
      topic,
      deadLetterQueue: dead_letter_queue,
    })
  }
}
