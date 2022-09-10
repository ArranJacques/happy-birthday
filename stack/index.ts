import { App } from "@serverless-stack/resources";
import { AppStack } from "./app";

export default function main(app: App): void {
  // 👇 Set default Lambda props, regardless of stack.
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    architecture: "arm_64",
    environment: {
      STAGE: app.stage,
      REGION: app.region,
    },
  });

  // 👇 Add stacks to app.
  app.stack(AppStack, { stackName: `happy-birthday--app--${app.stage}` });
}
