import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export type PaletteItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
};

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  actions,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: PaletteItem[];
  actions: { label: string; icon: React.ComponentType<{ className?: string }>; run: () => void }[];
}) {
  const navigate = useNavigate();
  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Sök vy, gäst eller åtgärd…" />
      <CommandList>
        <CommandEmpty>Inget hittades.</CommandEmpty>
        <CommandGroup heading="Åtgärder">
          {actions.map((a) => (
            <CommandItem
              key={a.label}
              onSelect={() => {
                onOpenChange(false);
                a.run();
              }}
            >
              <a.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              {a.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        {groups.map((g) => (
          <CommandGroup key={g} heading={g}>
            {items
              .filter((i) => i.group === g)
              .map((i) => (
                <CommandItem
                  key={i.to + i.label}
                  onSelect={() => {
                    onOpenChange(false);
                    navigate({ to: i.to });
                  }}
                >
                  <i.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {i.label}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
