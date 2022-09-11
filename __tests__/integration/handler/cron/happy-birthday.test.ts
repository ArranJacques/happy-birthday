jest.mock("../../../../src/foundation/config/runtime", () => ({
  STAGE: "test-stage",
  REGION: "eu-west-2",
  BUCKET_NAME: "test-bucket",
  EVENT_BUS_ARN: "arn:aws:events:eu-west-2:000000000000:event-bus/test",
}));

jest.mock("../../../../src/support/util/get-date-instance", () => ({
  getDateInstance: jest.fn(),
}));

jest.mock("../../../../src/domain/event/publish-event", () => ({
  publishEvent: jest.fn(),
}));

import { readFileSync } from "fs";
import nock from "nock";
import { publishEvent } from "../../../../src/domain/event/publish-event";
import { handler } from "../../../../src/handler/cron/happy-birthday";
import { getDateInstance } from "../../../../src/support/util/get-date-instance";
import { interceptS3Get } from "../../../support/network/intercept-s3-get";

describe("handler > cron > happy-birthday", () => {
  beforeAll(async () => {
    nock.disableNetConnect();
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    nock.enableNetConnect();
    nock.cleanAll();
  });

  describe("file-system driver", () => {
    describe("success scenarios", () => {
      test("sends messages to friends who's birthday is today", async () => {
        // Intercept the request to S3 to load the the `friends.csv` file.
        const getFriendsFileIntercept = interceptS3Get({
          bucketName: "test-bucket",
          key: "friends.csv",
          times: 1,
          responseStatus: 200,
          responseBody: readFileSync(
            `${__dirname}/../../../../resource/friends.example.csv`
          ),
        });

        // Make the application think today's date is `2022-09-10`. This will match with
        // 2 of the 3 friends in the `friends.example.csv` example file.
        (getDateInstance as jest.Mock).mockReturnValue(new Date("2022-09-10"));

        await expect(handler()).resolves.not.toThrow();

        // Check we loaded the `friends.csv` from from the file-system.
        expect(getFriendsFileIntercept.getRequestCountMade()).toEqual(1);

        // Since this is an integration test I wanted to intercept the api call made to
        // EventBridge and inspect the request to make sure it was correct, but for some
        // reason I couldn't get the intercept to work 🤷‍♂️ and I ran out of time. As
        // such, I've just mocked the `publishEvent` function and am checking it's
        // called correctly using the mock.
        expect(publishEvent).toBeCalledTimes(2);
        expect(publishEvent).toHaveBeenNthCalledWith(1, "send-message.email", {
          firstName: "Joe",
          lastName: "Fraser",
          dateOfBirth: "10/09/2002",
          email: "joe@example.com",
          telephone: "07988 111111",
          deliveryMedium: "email",
        });
        expect(publishEvent).toHaveBeenNthCalledWith(2, "send-message.sms", {
          firstName: "Jane",
          lastName: "Allen",
          dateOfBirth: "10/09/1980",
          email: "jane@example.com",
          telephone: "07242 111222",
          deliveryMedium: "sms",
        });
      });
    });
  });
});
