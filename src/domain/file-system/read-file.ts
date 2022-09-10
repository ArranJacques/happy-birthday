import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BUCKET_NAME } from "foundation/config/runtime";
import { Readable } from "stream";

export async function readFile(
  client: S3Client,
  key: string
): Promise<Buffer | null> {
  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    if (!response.Body) {
      return null;
    }

    const stream = response.Body as Readable;

    return await new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  } catch (e) {
    if ((e as any).statusCode === 404) {
      return null;
    } else {
      throw e;
    }
  }
}
