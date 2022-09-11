import nock from "nock";

/**
 * Intercepts a request to S3 and returns functions for getting information
 * about the request.
 */
export const interceptS3 = (
  method: "get" | "delete" | "put",
  xId: string,
  opts: {
    bucketName: string;
    key: string;
    responseStatus: number;
    responseBody?: unknown;
    times: number;
  }
) => {
  const output: { requestCountMade: number } = {
    requestCountMade: 0,
  };

  nock(`https://${opts.bucketName}.s3-accelerate.amazonaws.com`)
    [method](`/${opts.key}?x-id=${xId}`, () => {
      output.requestCountMade++;
      return true;
    })
    .times(opts.times)
    .reply(opts.responseStatus, () => opts.responseBody);

  return {
    getRequestCountMade: () => {
      return output.requestCountMade;
    },
  };
};
