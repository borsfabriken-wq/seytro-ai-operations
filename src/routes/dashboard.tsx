import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Seytro" },
      {
        name: "description",
        content: "Inloggat läge för restaurang och hotell: bokningar, salsplan, gäster och analys.",
      },
      { property: "og:title", content: "Dashboard — Seytro" },
      {
        property: "og:description",
        content: "Inloggat läge för restaurang och hotell: bokningar, salsplan, gäster och analys.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  ),
});
