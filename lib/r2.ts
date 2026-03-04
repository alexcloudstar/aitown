import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
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

export interface TownSummary {
  username: string;
  totalConversations: number;
  totalMessages: number;
  createdAt: string;
}

export async function listTowns(): Promise<TownSummary[]> {
  const res = await r2.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "towns/" })
  );

  if (!res.Contents?.length) return [];

  const towns: TownSummary[] = [];
  for (const obj of res.Contents) {
    const match = obj.Key?.match(/^towns\/([^/]+)\/town\.json$/);
    if (!match) continue;
    const username = match[1];
    const town = await getTown(username);
    if (town) {
      towns.push({
        username: town.username,
        totalConversations: town.totalConversations,
        totalMessages: town.totalMessages,
        createdAt: town.createdAt,
      });
    }
  }

  // Sort by newest first
  towns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return towns;
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
