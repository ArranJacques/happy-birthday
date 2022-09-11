import { getFriendsFileSystemDriver } from "domain/friend/driver/file-system-driver";
import { getFriendsSQLLiteDriver } from "domain/friend/driver/sql-lite-driver";
import { DataDriver, Friend } from "foundation/type";
import { UnsupportedDriverError } from "support/error/unsupported-driver-error";

export async function getFriends(driver: DataDriver): Promise<Friend[]> {
  // 🧠 This is a pretty crude implementation to allow us load friends from
  // different data sources with minimum overhead. While not ideal, it's easy
  // enough to extend and add new drivers, and given the purpose of this app, it
  // seems like an appropriate solution.
  switch (driver) {
    case DataDriver.FileSystem:
      return getFriendsFileSystemDriver();
    case DataDriver.FileSystem:
      return getFriendsSQLLiteDriver();
    default:
      throw new UnsupportedDriverError(driver);
  }
}
