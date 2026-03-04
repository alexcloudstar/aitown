import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import type { TownData } from "@/types";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET = process.env.R2_BUCKET_NAME!;
export const townKey = (username: string) => `towns/${username}/town.json`;

export async function townExists(username: string): Promise<boolean> {
  try {
    await r2.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: townKey(username) })
    );
    return true;
  } catch {
    return false;
  }
}

export async function getTown(username: string): Promise<TownData | null> {
  try {
    const res = await r2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: townKey(username) })
    );
    const body = await res.Body?.transformToString();
    return body ? JSON.parse(body) : null;
  } catch {
    return null;
  }
}

export async function saveTown(
  username: string,
  data: TownData
): Promise<void> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: townKey(username),
      Body: JSON.stringify(data),
      ContentType: "application/json",
    })
  );
}
