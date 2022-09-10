import { S3Client } from "@aws-sdk/client-s3";
import { REGION } from "foundation/config/runtime";

export function getFileSystemClient() {
  return new S3Client({
    region: REGION,
    useAccelerateEndpoint: true,
  });
}
