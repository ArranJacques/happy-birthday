import { getDateInstance } from "support/util/get-date-instance";

export function isBirthday(dateOfBirth: string) {
  const [, currentMonth, currentDay] = getDateInstance()
    .toISOString()
    .split("T")[0]
    .split("-");

  const [dobDay, dobMonth] = dateOfBirth.split("/");

  return currentMonth === dobMonth && currentDay === dobDay;
}
