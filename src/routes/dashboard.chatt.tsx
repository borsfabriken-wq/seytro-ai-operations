import { createFileRoute } from "@tanstack/react-router";

import { GuestChatView, useGuestChat } from "@/components/dashboard/GuestChat";

export const Route = createFileRoute("/dashboard/chatt")({
  head: () => ({
    meta: [
      { title: "Gästchatt — Seytro Dashboard" },
      {
        name: "description",
        content: "Chatta direkt med gästerna. AI:n svarar på frågor och noterar önskemål i bokningen.",
      },
      { property: "og:title", content: "Gästchatt — Seytro Dashboard" },
      {
        property: "og:description",
        content: "Chatta direkt med gästerna. AI:n svarar på frågor och noterar önskemål i bokningen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { threads, patch, unread } = useGuestChat();

  return (
    <div className="flex h-[calc(100svh-14rem)] min-h-[34rem] flex-col gap-6">
      <div>
        <h1 className="text-display text-forest">Gästchatt</h1>
        <p className="text-body text-muted-foreground">
          Gästerna skriver direkt i tjänsten istället för att mejla. AI:n svarar på frågor och
          noterar önskemål i bokningen. {unread} obesvarade just nu.
        </p>
      </div>
      <GuestChatView threads={threads} patch={patch} />
    </div>
  );
}
