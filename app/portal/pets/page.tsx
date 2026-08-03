import { PawPrint } from "lucide-react";
import { ComingSoon } from "@/components/portal/coming-soon";

export default function PetsPage() {
  return (
    <ComingSoon
      icon={PawPrint}
      title="Pet profiles"
      description="A home for every pet's records, coming in the next build phase."
      bullets={[
        "Vaccine history and upcoming due dates",
        "Weight, breed, and allergy notes",
        "Photos and vet visit history per pet",
      ]}
    />
  );
}
