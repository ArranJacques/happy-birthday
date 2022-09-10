import { getFriends } from "domain/friend/get-friends";
import { DATA_DRIVER } from "foundation/config/default";

export async function handler() {
  const friends = await getFriends(DATA_DRIVER);

  console.log(friends);
}
