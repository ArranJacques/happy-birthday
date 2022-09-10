export class FileNotFoundError extends Error {
  constructor(key: string) {
    super(`the file [${key}] could not be found`);
  }
}
