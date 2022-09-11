import { interceptS3 } from "./intercept-s3";

/**
 * Intercepts a Get request to S3 and returns functions for getting
 * information about the request.
 */
export const interceptS3Get = (opts: {
  bucketName: string;
  key: string;
  responseStatus: number;
  responseBody?: unknown;
  times: number;
}) => {
  return interceptS3("get", "GetObject", opts);
};
