import { handleEvent } from "domain/event/handle-event";
import { Friend } from "foundation/type";

export const handler = handleEvent<Friend>(async (payload) => {
  console.log("sending birthday message via sms...");
  console.log(payload);
});
