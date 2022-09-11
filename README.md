# Happy Birthday

## Implementation

### Framework & Architecture

- Have built using the [https://sst.dev](https://sst.dev) framework and is built to deploy to AWS.
- Uses a serverless, event-driven architecture.
- AWS EventBridge is used for the event bus.
- For each event there is an AWS SQS instance subscribed to the event bus with a filter rule to define what events should be pushed to it.
- When an event is put onto the event bus, if it matches one of the defined filter rules, it will be pushed into the associated queue.
- The queue will pipe the events to Lambda instances, which will process them and execute any logic in response.
- IaC is located in `/stack`, the application code is located in `/src`.

### How It Works

- The `src/handler/cron/happy-birthday.ts` handler is scheduled to run at 9am every morning.
- When run, it loads the list of friends from a `friends.csv` file that's stored in an S3 bucket.
- The file is parsed and an event is published for each friend who's birthday is today.
- The event that's published depends on the message delivery medium for the friend.
  - The `happy-birthday.send-message.email` event is used to send message via email.
  - The `happy-birthday.send-message.sms` event is used to send message via SMS.
- The `src/handler/event/send-message-email.ts` && `src/handler/event/send-message-sms.ts` handlers are configured to respond to the corresponding events.
- When a matching event is detected, the `send-message-{medium}.ts` Lambda will be run, which will send the friend a birthday message using the corresponding medium.

## Getting It Working

This can be deployed to AWS in a development environment, where it should work, using SST's local-development capabilities. To do this:

- You'll need the AWS CLI configured with a set of IAM access key.
- I didn't have time to documented the minimum permissions required that should be associated with the IAM user, so you might just need to go with admin permissions 😬.
- In `src/foundation/config/default` configure the sending email domain and name by setting `DEFAULT_EMAIL_SENDER_ADDRESS` and `DEFAULT_EMAIL_SENDER_NAME`.
  - Ideally these would be configured externally as env vars, or something, but I ran out of time, so for now they're hard coded.
  - The sending domain you choose will have to be [configured in SES](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html) before you can send emails from it.
  - If SES is in sandbox mode for your AWS account, you'll have to [verify the friend's email addresses](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#just-verify-email-proc) before you can send emails to them.
- Install the project dependencies: `npm install`.
- Start the development environment: `npm run dev`.
  - This will deploy a set of development stacks to AWS
- Once deployed, upload your `friends.csv` file to the S3 bucket that's created during the deployment.
  - The easiest way to do this is using the SST dev console.
  - A dummy file can be found in `/resource`.
- The trigger lambda is configured to run at 9am every day, but for testing purposes you can invoke the Lambda manually using the SST dev console.
- If the `friends.csv` file you uploaded contains any friends who's birthday is today, they should 🤞 get emails.


## Test


## Notes

- I didn't have a huge amount of time to build this out to the extent I would have liked, so to give you an idea of what I would have liked to do and my thought process, I've left to-dos and comments throughout.
- An event-driven architecture is a little over engineered for a personal app like this, but it's meant to demonstrate skills and understanding of different approaches, which is why I took the approach I did.
