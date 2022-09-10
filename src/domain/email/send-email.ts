import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import {
  DEFAULT_EMAIL_SENDER_ADDRESS,
  DEFAULT_EMAIL_SENDER_NAME,
} from "foundation/config/default";

type MailAddress = { name: string; email: string };

export async function sendEmail(args: {
  recipients: MailAddress[];
  sender?: MailAddress;
  subject: string;
  content: {
    text?: string;
    html?: string;
  };
}) {
  await new SESClient({}).send(
    new SendEmailCommand({
      Source: `${args.sender?.name || DEFAULT_EMAIL_SENDER_NAME} <${
        args.sender?.email || DEFAULT_EMAIL_SENDER_ADDRESS
      }>`,
      Destination: {
        ToAddresses: args.recipients.map((r) => `${r.name} <${r.email}>`),
      },
      Message: {
        Subject: {
          Data: args.subject,
        },
        Body: {
          Text: {
            Data: args.content.text || "",
          },
          Html: {
            Data: args.content.html || "",
          },
        },
      },
    })
  );
}
