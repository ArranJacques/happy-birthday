export class UnsupportedDriverError extends Error {
  constructor(driver: string) {
    super(`driver [${driver}] is not supported`);
  }
}
