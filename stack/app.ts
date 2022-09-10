import { Bucket, Function, StackContext } from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

export function AppStack({ stack }: StackContext) {
  const bucketName = `happy-birthday--files--${stack.stage}`;
  const deleteBucketOnStackDelete = stack.stage !== "local";

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
    ],
    environment: {
      BUCKET_NAME: bucketName,
    },
  });
}
