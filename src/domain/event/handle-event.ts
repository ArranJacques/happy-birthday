import { EventBridgeEvent, SQSEvent } from "aws-lambda";

// ℹ️ This is a super basic event handler to handle events coming off the event
// bus. For anything more serious we'd want to verify the event, validate the
// payload, etc, but for for our purposes. this will do.
export function handleEvent<T>(
  handler: (payload: T) => Promise<void>
): (sqsEvent: SQSEvent) => Promise<void> {
  return async (sqsEvent: SQSEvent) => {
    const [record] = sqsEvent.Records;
    const { detail } = JSON.parse(record.body) as EventBridgeEvent<"event", T>;
    return await handler(detail);
  };
}
