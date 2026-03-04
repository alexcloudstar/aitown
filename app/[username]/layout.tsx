import type { Metadata } from "next";
import { getTown } from "@/lib/r2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const town = await getTown(username);

  if (!town) {
    return {
      title: `${username} — AI Town`,
      description: `Visit ${username}'s AI Town.`,
    };
  }

  const description = `${username}'s AI Town: ${town.totalConversations} conversations, ${town.totalMessages.toLocaleString()} messages`;

  return {
    title: `${username} — AI Town`,
    description,
    openGraph: {
      title: `${username} — AI Town`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} — AI Town`,
      description,
    },
  };
}

export default function TownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
