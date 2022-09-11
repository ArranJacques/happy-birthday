jest.mock("../../../../src/support/util/get-date-instance", () => ({
  getDateInstance: jest.fn(),
}));

import { isBirthday } from "../../../../src/domain/friend/is-birthday";
import { getDateInstance } from "../../../../src/support/util/get-date-instance";

describe("domain > friend > isBirthday()", () => {
  test("returns true if today is the birthday for a given date of birth", () => {
    (getDateInstance as jest.Mock).mockReturnValue(new Date());
    const [, month, day] = new Date().toISOString().split("T")[0].split("-");
    expect(isBirthday(`${day}/${month}/1989`)).toEqual(true);
  });

  test("returns true if today is the 28th feb and friend's birthday is on 29th feb", () => {
    // Make the application think today is 2022-02-28.
    (getDateInstance as jest.Mock).mockReturnValue(new Date("2022-02-28"));
    expect(isBirthday("29/02/1989")).toEqual(true);
  });

  test("returns false if today is not the birthday for a given date of birth", () => {
    (getDateInstance as jest.Mock).mockReturnValue(new Date());

    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const [, month, day] = tomorrow.toISOString().split("T")[0].split("-");

    expect(isBirthday(`${day}/${month}/1989`)).toEqual(false);
  });
});
