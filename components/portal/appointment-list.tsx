import { CalendarX2 } from "lucide-react";
import type { Appointment } from "@/lib/supabase/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent-50 text-accent-700",
  confirmed: "bg-brand-50 text-brand-700",
  completed: "bg-surface-muted text-ink-muted",
  cancelled: "bg-red-50 text-red-600",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AppointmentList({
  appointments,
  onCancel,
}: {
  appointments: Appointment[];
  onCancel: (id: string) => void;
}) {
  if (appointments.length === 0) {
    return <p className="text-sm text-ink-muted">No appointments yet.</p>;
  }

  return (
    <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
      {appointments.map((a) => (
        <div key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink">
              {a.services?.name ?? "Service"} — {a.pets?.name ?? "Pet"}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">{formatDateTime(a.requested_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[a.status]}`}>
              {a.status}
            </span>
            {(a.status === "pending" || a.status === "confirmed") && (
              <button
                type="button"
                onClick={() => onCancel(a.id)}
                className="flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-red-600"
              >
                <CalendarX2 className="h-3.5 w-3.5" /> Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
