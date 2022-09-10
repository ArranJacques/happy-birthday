import { isBirthday } from "../../../../src/domain/friend/is-birthday";

describe("domain > friend > isBirthday()", () => {
  test("returns true if today is the birthday for a given date of birth", () => {
    const [, month, day] = new Date().toISOString().split("T")[0].split("-");
    expect(isBirthday(`${day}/${month}/1989`)).toEqual(true);
  });

  test("returns false if today is not the birthday for a given date of birth", () => {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const [, month, day] = tomorrow.toISOString().split("T")[0].split("-");

    expect(isBirthday(`${day}/${month}/1989`)).toEqual(false);
  });
});
