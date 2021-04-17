import * as cdk from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as sns from '@aws-cdk/aws-sns';
import * as iam from '@aws-cdk/aws-iam';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';

export class CdksnsDlqSqsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLowerCase().replace("stack", "")

    const topic = new sns.Topic(this, 'topic', {
      topicName: PREFIX_NAME + '-topic'
    })
    
    const queue = new sqs.Queue(this, 'queue', {
      queueName: PREFIX_NAME + '-queue',
      retentionPeriod: cdk.Duration.days(10),
    })

    topic.addSubscription(new subscriptions.SqsSubscription(queue))
    
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
      endpoint: queue.queueArn,
      protocol: sns.SubscriptionProtocol.SQS,
      topic,
      deadLetterQueue: dead_letter_queue,
    })
  }
}
