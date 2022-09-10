import { publishEvent } from "domain/event/publish-event";
import { getFriends } from "domain/friend/get-friends";
import { isBirthday } from "domain/friend/is-birthday";
import { DATA_DRIVER } from "foundation/config/default";

export async function handler() {
  console.log("loading friends...");

  const friends = await getFriends(DATA_DRIVER);

  console.log("finding friends who's birthday is today...");

  const birthdays = friends.filter((friend) => isBirthday(friend.dateOfBirth));

  console.log(
    "sending happy birthday messages to friends who's birthday is today..."
  );

  await Promise.all(
    birthdays.map(async (friend) =>
      publishEvent(`send-message.${friend.deliveryMedium}`, friend)
    )
  );
}
