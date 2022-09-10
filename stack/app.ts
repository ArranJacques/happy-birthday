import { Function, StackContext } from "@serverless-stack/resources";

export function AppStack({ stack }: StackContext) {
  // 👇 Create a handler to identify friend's birthdays and publish events to send
  // happy birthday messages.
  const happyBirthdayLambda = new Function(stack, "HappyBirthday", {
    functionName: `happy-birthday--${stack.stage}`,
    handler: "src/handler/cron/happy-birthday.handler",
  });
}
