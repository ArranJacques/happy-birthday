import { DataDriver } from "foundation/type";

// 🎯 TODO: there's probably a better way to define this, but it will do for now.
export const DATA_DRIVER = DataDriver.FileSystem;

export const FRIENDS_FILE = "friends.csv";

// 🧠 The sending domain needs to be registered and verified in AWS SES,
// otherwise it won't work.
export const DEFAULT_EMAIL_SENDER_ADDRESS = "happy-birthday@example.com";
export const DEFAULT_EMAIL_SENDER_NAME = "Bob Jones";
