import { getFileSystemClient } from "domain/file-system/get-file-system-client";
import { readFile } from "domain/file-system/read-file";
import { FRIENDS_FILE } from "foundation/config/default";
import { isFriend } from "foundation/guard";
import { Friend } from "foundation/type";
import { FileNotFoundError } from "support/error/file-not-found-error";
import { InvalidTypeError } from "support/error/invalid-type-error";

export async function getFriendsFileSystemDriver(): Promise<Friend[]> {
  const file = await readFile(getFileSystemClient(), FRIENDS_FILE);

  if (!file) {
    throw new FileNotFoundError(FRIENDS_FILE);
  }

  const [, ...rawRows] = file.toString("utf-8").trim().split(/\r?\n/);

  // ℹ️ This is some super simple logic to parse and validate the csv. For a more
  // complex application we'd want something a bit more heavy duty, but for our
  // purposes this will do.
  return rawRows.map((row) => {
    const [firstName, lastName, dateOfBirth, email, telephone, deliveryMedium] =
      row.split(",").map((col) => col.trim());

    const friend = {
      firstName,
      lastName,
      dateOfBirth,
      email,
      telephone,
      deliveryMedium,
    };

    if (!isFriend(friend)) {
      throw new InvalidTypeError();
    }

    return friend;
  });
}
