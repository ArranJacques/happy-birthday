export function isBirthday(dateOfBirth: string) {
  const [, currentMonth, currentDay] = new Date()
    .toISOString()
    .split("T")[0]
    .split("-");
  const [dobDay, dobMonth] = dateOfBirth.split("/");

  return currentMonth === dobMonth && currentDay === dobDay;
}
