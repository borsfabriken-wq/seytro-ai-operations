import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DateNav({
  date,
  onChange,
  className,
}: {
  date: Date;
  onChange: (d: Date) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const shift = (days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    onChange(next);
  };

  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border bg-background p-1",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Föregående dag"
        onClick={() => shift(-1)}
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium capitalize text-forest transition-colors hover:bg-muted"
          >
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {format(date, "EEEE d MMMM", { locale: sv })}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={sv}
            selected={date}
            defaultMonth={date}
            onSelect={(d) => {
              if (d) {
                onChange(d);
                setOpen(false);
              }
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="border-t border-border p-2">
            <button
              type="button"
              onClick={() => {
                onChange(new Date());
                setOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
            >
              Gå till idag
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        aria-label="Nästa dag"
        onClick={() => shift(1)}
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {!isToday && (
        <button
          type="button"
          onClick={() => onChange(new Date())}
          className="ml-1 hidden rounded-full px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-forest sm:block"
        >
          Idag
        </button>
      )}
    </div>
  );
}
