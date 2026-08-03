import { CreditCard } from "lucide-react";
import { ComingSoon } from "@/components/portal/coming-soon";

export default function SubscriptionPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="Manage your membership"
      description="Plan changes and billing history are coming in the next build phase."
      bullets={[
        "Switch between Essential, Wellness Plus, and Complete Care",
        "View billing history and update payment details",
        "Cancel anytime, no phone call required",
      ]}
    />
  );
}
