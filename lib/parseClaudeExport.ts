import JSZip from "jszip";
import type { ConversationMeta } from "@/types";

const MAX_COMPRESSED_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_UNCOMPRESSED_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_COUNT = 100;

export async function safeParseZip(file: File): Promise<JSZip> {
  if (file.size > MAX_COMPRESSED_SIZE) {
    throw new Error(
      "File too large. Please upload your Claude export ZIP directly."
    );
  }

  const zip = await JSZip.loadAsync(file);
  const files = Object.values(zip.files);

  if (files.length > MAX_FILE_COUNT) {
    throw new Error(
      "Unexpected ZIP structure. Please upload your Claude export ZIP directly."
    );
  }

  let totalUncompressed = 0;
  for (const f of files) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    totalUncompressed += (f as any)._data?.uncompressedSize ?? 0;
    if (totalUncompressed > MAX_UNCOMPRESSED_SIZE) {
      throw new Error(
        "ZIP contents too large. This does not look like a Claude export."
      );
    }
  }

  return zip;
}

export async function parseClaudeZip(file: File): Promise<ConversationMeta[]> {
  const zip = await safeParseZip(file);

  const conversationsFile = zip.file("conversations.json");
  if (!conversationsFile) {
    throw new Error(
      "Could not find conversations.json. Are you sure this is a Claude export?"
    );
  }

  const raw = await conversationsFile.async("string");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Unexpected format in conversations.json");
  }

  return data
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) => c.uuid && Array.isArray(c.chat_messages)
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((c: any) => {
      const messages = c.chat_messages ?? [];
      return {
        uuid: c.uuid,
        title: c.name ?? "Untitled",
        messageCount: messages.length,
        humanMessageCount: messages.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (m: any) => m.sender === "human"
        ).length,
        assistantMessageCount: messages.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (m: any) => m.sender === "assistant"
        ).length,
        firstMessageAt:
          c.created_at ??
          messages[0]?.created_at ??
          new Date().toISOString(),
        lastMessageAt:
          c.updated_at ??
          messages.at(-1)?.created_at ??
          new Date().toISOString(),
      };
    })
    .filter((c: ConversationMeta) => c.messageCount > 0)
    .sort(
      (a: ConversationMeta, b: ConversationMeta) =>
        new Date(a.firstMessageAt).getTime() -
        new Date(b.firstMessageAt).getTime()
    );
}

export function toMonthString(iso: string): string {
  return iso.slice(0, 7); // "2024-01"
}

export function uuidToColorSeed(uuid: string): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = (hash << 5) - hash + uuid.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}
