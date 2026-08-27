import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";

export const metadata: Metadata = {
  title: "Execute | The Next Move Method — Yez The Realtor",
  description:
    "The third phase of The Next Move Method: direct representation through search, tours, offer strategy, negotiation, inspections, financing, appraisal, title, and closing.",
};

export default function Page() {
  return <MethodPhasePage phaseId="execute" />;
}
