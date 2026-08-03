import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/portal/coming-soon";

export default function AppointmentsPage() {
  return (
    <ComingSoon
      icon={CalendarDays}
      title="Book & manage appointments"
      description="Full self-service booking is coming in the next build phase."
      bullets={[
        "Pick a category, service, and time slot in a few taps",
        "Reschedule or cancel without a phone call",
        "Automatic reminders before every visit",
      ]}
    />
  );
}
