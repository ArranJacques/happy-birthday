import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { EVENT_BUS_ARN, REGION } from "foundation/config/runtime";

// 🧠 This is a super basic event publisher that lets us put events onto the
// event bus. In anything more serious we'd want to create an event registry
// with event schemas, validation and contract testing, but for our purposes,
// this will do.
export async function publishEvent<T>(name: string, payload: T): Promise<void> {
  console.log("publishing event:", name);
  console.log("payload:", payload);

  new EventBridgeClient({ region: REGION }).send(
    new PutEventsCommand({
      Entries: [
        {
          Source: `happy-birthday.${name}`,
          EventBusName: EVENT_BUS_ARN,
          DetailType: "event",
          Detail: JSON.stringify(payload),
        },
      ],
    })
  );
}
