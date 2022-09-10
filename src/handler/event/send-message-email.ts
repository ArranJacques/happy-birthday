import { sendEmail } from "domain/email/send-email";
import { handleEvent } from "domain/event/handle-event";
import { Friend } from "foundation/type";

export const handler = handleEvent<Friend>(async (payload) => {
  console.log("sending birthday message via email...");
  console.log(payload);

  await sendEmail({
    recipients: [
      {
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
      },
    ],
    subject: "Happy birthday!",
    // ℹ️ If the templating got any more complicated than this I'd abstract it out
    // of this handler.
    content: { html: `Happy birthday, dear ${payload.firstName}!` },
  });
});
