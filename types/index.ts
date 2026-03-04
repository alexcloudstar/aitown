export interface TownData {
  username: string;
  createdAt: string;
  totalConversations: number;
  totalMessages: number;
  buildings: BuildingData[];
}

export interface BuildingData {
  index: number;
  messageCount: number;
  humanMessageCount: number;
  assistantMessageCount: number;
  firstActive: string; // "2024-01" format
  lastActive: string; // "2024-01" format
  buildingType: "small" | "medium" | "large" | "tower";
  positionX: number;
  positionY: number;
  colorSeed: number; // 0-360 hue
}

export interface LocalTownMeta {
  username: string;
  buildings: Array<{
    index: number;
    title: string;
  }>;
}

export interface ConversationMeta {
  uuid: string;
  title: string;
  messageCount: number;
  humanMessageCount: number;
  assistantMessageCount: number;
  firstMessageAt: string;
  lastMessageAt: string;
}
