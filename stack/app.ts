import {
  Bucket,
  EventBus,
  Function,
  Queue,
  StackContext,
} from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

export function AppStack({ stack }: StackContext) {
  const bucketName = `happy-birthday--files--${stack.stage}`;
  const deleteBucketOnStackDelete = stack.stage !== "local";

  const eventBus = new EventBus(stack, "EventBus", {
    cdk: {
      eventBus: {
        eventBusName: `happy-birthday--${stack.stage}`,
      },
    },
  });

  // 👇 Create a new bucket to store application assets.
  const bucket = new Bucket(stack, "Bucket", {
    cdk: {
      bucket: {
        bucketName,
        transferAcceleration: true,
        encryption: s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: deleteBucketOnStackDelete
          ? RemovalPolicy.DESTROY
          : RemovalPolicy.RETAIN,
        autoDeleteObjects: deleteBucketOnStackDelete,
      },
    },
  });

  // 👇 Create Lambda to send a birthday message via email.
  const sendMessageEmailLambda = new Function(stack, "SendMessageEmailLambda", {
    functionName: `send-message-email--${stack.stage}`,
    handler: "src/handler/event/send-message-email.handler",
  });

  // 👇 Create a new Queue to push events to the `sendMessageEmailLambda` handler.
  const sendMessageEmailQueue = new Queue(stack, "SendMessageEmailQueue", {
    cdk: {
      queue: {
        queueName: `happy-birthday--send-message-email--${stack.stage}`,
        // 🎯 TODO: add a dead-letter queue.
      },
    },
    consumer: {
      function: sendMessageEmailLambda,
      cdk: {
        eventSource: {
          batchSize: 1,
        },
      },
    },
  });

  // 👇 Subscribe the `sendMessageEmailQueue` to the event bus.
  new events.Rule(stack, "SendMessageEmailQueueRule", {
    eventBus: eventBus.cdk.eventBus,
    targets: [new targets.SqsQueue(sendMessageEmailQueue.cdk.queue)],
    eventPattern: { source: ["happy-birthday.send-message.email"] },
  });

  // 👇 Create Lambda to send a birthday message via sms.
  const sendMessageSMSLambda = new Function(stack, "SendMessageSMSLambda", {
    functionName: `send-message-sms--${stack.stage}`,
    handler: "src/handler/event/send-message-sms.handler",
  });

  // 👇 Create a new Queue to push events to the `sendMessageSMSLambda` handler.
  const sendMessageSMSQueue = new Queue(stack, "SendMessageSMSQueue", {
    cdk: {
      queue: {
        queueName: `happy-birthday--send-message-sms--${stack.stage}`,
        // 🎯 TODO: add a dead-letter queue.
      },
    },
    consumer: {
      function: sendMessageSMSLambda,
      cdk: {
        eventSource: {
          batchSize: 1,
        },
      },
    },
  });

  // 👇 Subscribe the `sendMessageSMSQueue` to the event bus.
  new events.Rule(stack, "SendMessageSMSQueueRule", {
    eventBus: eventBus.cdk.eventBus,
    targets: [new targets.SqsQueue(sendMessageSMSQueue.cdk.queue)],
    eventPattern: { source: ["happy-birthday.send-message.sms"] },
  });

  // 👇 Create a handler to identify friend's birthdays and publish events to send
  // happy birthday messages.
  const happyBirthdayLambda = new Function(stack, "HappyBirthday", {
    functionName: `happy-birthday--${stack.stage}`,
    handler: "src/handler/cron/happy-birthday.handler",
    initialPolicy: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${bucket.bucketArn}/*`],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["events:PutEvents"],
        resources: [eventBus.cdk.eventBus.eventBusArn],
      }),
    ],
    environment: {
      BUCKET_NAME: bucketName,
      EVENT_BUS_ARN: eventBus.cdk.eventBus.eventBusArn,
    },
  });

  // 👇 Stack outputs.
  stack.addOutputs({
    EventBusArn: eventBus.eventBusArn,
  });
}
