import { getDateInstance } from "support/util/get-date-instance";

export function isBirthday(dateOfBirth: string) {
  const [, currentMonth, currentDay] = getDateInstance()
    .toISOString()
    .split("T")[0]
    .split("-");

  let [dobDay, dobMonth] = dateOfBirth.split("/");

  // 🧠 Am not a super fan of this as it doesn't take into account leap years, but
  // I'm running out of time so unfortunately, if you're born on 29th Feb, you're
  // always getting your birthday message on the 28th instead.
  if (dobDay === "29" && dobMonth === "02") {
    dobDay = "28";
  }

  return currentMonth === dobMonth && currentDay === dobDay;
}
